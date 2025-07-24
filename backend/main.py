from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session
from models import Transaction
from typing import List

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

@app.post("/transactions")
def create_transaction(transaction: Transaction):
    with Session(engine) as session:
        session.add(transaction)
        session.commit()
        session.refresh(transaction)  # refresh to get auto-generated ID
        return transaction
    
@app.get("/transactions", response_model=List[Transaction])
def get_transactions():
    with Session(engine) as session:
        transactions = session.query(Transaction).all()
        return transactions