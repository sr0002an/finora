from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session, select
from models import Transaction, TransactionCreate
from typing import List
from fastapi import Path, HTTPException, Body

import csv
import io
from fastapi.responses import StreamingResponse

app = FastAPI()


#  Database config
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)

# Create DB and table on app startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to Finora backend 🚀"}

@app.post("/transactions", response_model=Transaction)
def create_transaction(transaction_data: TransactionCreate):
    new_transaction = Transaction(**transaction_data.model_dump())  #converts to full model
    with Session(engine) as session:
        session.add(new_transaction)
        session.commit()
        session.refresh(new_transaction)
        return new_transaction
    
@app.get("/transactions", response_model=List[Transaction])
def get_transactions():
    with Session(engine) as session:
        transactions = session.query(Transaction).all()
        return transactions
    
@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int = Path(..., gt=0)):
    with Session(engine) as session:
        transaction = session.get(Transaction, transaction_id)
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        session.delete(transaction)
        session.commit()
        return {"message": f"Transaction {transaction_id} deleted successfully"}
    
@app.put("/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(transaction_id: int, updated_data: TransactionCreate):
    with Session(engine) as session:
        db_transaction = session.get(Transaction, transaction_id)
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")

        db_transaction.title = updated_data.title
        db_transaction.amount = updated_data.amount
        db_transaction.type = updated_data.type
        db_transaction.category = updated_data.category

        session.commit()
        session.refresh(db_transaction)
        return db_transaction
    
@app.get("/export")
def export_transactions():
    with Session(engine) as session:
        transactions = session.exec(select(Transaction)).all()

        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header row
        writer.writerow(["id", "title", "amount", "type", "category", "created_at"])

        # Write each transaction as a row
        for t in transactions:
            writer.writerow([t.id, t.title, t.amount, t.type, t.category, t.created_at])

        output.seek(0)  # Go back to the start of the in-memory file

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=transactions.csv"}
        )