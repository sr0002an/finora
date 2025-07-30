from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    amount: float
    type: str  # "income" or "expense"
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    image_url: Optional[str] = None

class TransactionCreate(SQLModel):
    title: str
    amount: float
    type: str  # "income" or "expense"
    category: str
    image_url: Optional[str] = None

class Budget(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    income: float
    needs: float
    wants: float
    savings: float