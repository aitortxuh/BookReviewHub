
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import Review
from models import ReviewCreate
from database import get_db
from typing import List
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReviewCreate(BaseModel):
    book_id: Optional[int] = None
    book_title: Optional[str] = None
    author: Optional[str] = None
    review_content: Optional[str] = None
    rating: Optional[float] = None
    username: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    book_id: int
    book_title: str
    author: str
    review_content: str
    rating: float
    username: str
    created_at: datetime

    class Config:
        from_attributes = True   
        orm_mode = True

router = APIRouter()

 
@router.get("/", response_model=List[ReviewResponse])
def get_all_reviews(db: Session = Depends(get_db)):
    return db.query(Review).all()

@router.post("/", response_model=ReviewResponse, status_code=201)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
 
    if not review.book_title or not review.author or not review.review_content:
        raise HTTPException(status_code=400, detail="Todos los campos son obligatorios")
    
    if not review.username:
        review.username = "Anónimo"
    
    db_review = Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review




@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    return db_review

@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(review_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    for key, value in review.dict().items():
        setattr(db_review, key, value)
    
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(db_review)
    db.commit()
    return {"message": "Review deleted successfully"}


@router.get("/user/{username}", response_model=List[ReviewResponse])
def get_reviews_by_user(username: str, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.username == username).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this user")
    return reviews

