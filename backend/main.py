from fastapi import FastAPI, File, Form, UploadFile  # type: ignore
from sqlmodel import SQLModel, create_engine, Session, select
from models import Transaction, TransactionCreate, Budget
from typing import List
from fastapi import Path, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
import random
from database import SessionLocal
import csv
import io
from fastapi.responses import StreamingResponse  # type: ignore

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database config
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
async def create_transaction(
    title: str = Form(...),
    amount: float = Form(...),
    type: str = Form(...),
    category: str = Form(...),
    image: UploadFile = File(None)
):
    import os
    image_url = None
    if image:
        os.makedirs("./static/receipts", exist_ok=True)
        image_filename = f"receipts/{image.filename}"
        with open(f"./static/{image_filename}", "wb") as buffer:
            buffer.write(await image.read())
        image_url = image_filename

    new_transaction = Transaction(
        title=title,
        amount=amount,
        type=type,
        category=category,
        image_url=image_url
    )
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
        writer.writerow(["id", "title", "amount", "type", "category", "created_at"])

        for t in transactions:
            writer.writerow([t.id, t.title, t.amount, t.type, t.category, t.created_at])

        output.seek(0)
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=transactions.csv"}
        )

@app.post("/budget")
def save_budget(budget: Budget):
    with Session(engine) as session:
        session.add(budget)
        session.commit()
        session.refresh(budget)
        return budget

@app.get("/budget", response_model=Budget)
def get_latest_budget():
    with Session(engine) as session:
        result = session.exec(select(Budget).order_by(Budget.id.desc())).first()
        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="No budget found")

@app.post("/populate")
def populate_fake_data():
    db = SessionLocal()

    # 🧼 Optional: wipe old data
    db.query(Transaction).delete()
    db.query(Budget).delete()
    db.commit()

    # ✅ Add 3 income entries spaced over 3 months
    for i in range(3):
        db.add(Transaction(
            title=f"Salary Month {i+1}",
            type='income',
            category='Salary',
            amount=3000 + i * 500,
            created_at=datetime.now() - timedelta(days=30 * i)
        ))

    # ✅ Add 30 fake expense entries
    categories = ['Food', 'Transport', 'Subscriptions', 'Shopping', 'Bills', 'Entertainment']
    for i in range(30):
        db.add(Transaction(
            title=f"Expense {i+1}",
            type='expense',
            category=random.choice(categories),
            amount=random.randint(20, 150),
            created_at=datetime.now() - timedelta(days=random.randint(1, 60))
        ))

    # ✅ Add a sample budget (with income filled in!)
    db.add(Budget(
        income=5000,
        needs=2500,
        wants=1500,
        savings=1000
    ))

    db.commit()
    db.close()

    return {"message": "Fake data populated!"}

app.mount("/static", StaticFiles(directory="static"), name="static")

