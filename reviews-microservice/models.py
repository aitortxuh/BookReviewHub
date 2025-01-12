from datetime import datetime
from database import Base  # Importa Base desde database.py
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, func
from typing import Optional
from pydantic import BaseModel

class ReviewCreate(BaseModel):
    book_id: int
    book_title: str
    author: str
    review_content: str
    rating: float
    username: Optional[str] = None


class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, nullable=False)
    book_title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    review_content = Column(Text, nullable=False)
    rating = Column(Float, nullable=False)
    username = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())  # Agregar campo creado automáticamente

