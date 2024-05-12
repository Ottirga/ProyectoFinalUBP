from fastapi import APIRouter, Depends, HTTPException, Query 
from sqlalchemy.orm import Session
from database import get_db
from models import BookModel
from schemas import Book, BookCreate, BookUpdate, PaginatedBooks



books_router = APIRouter(
    prefix="/books",
    tags=["Books"]
)


@books_router.get("/", response_model=PaginatedBooks)
async def get_books(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    total_books = db.query(BookModel).count()
    total_pages = (total_books // limit) + (1 if total_books % limit > 0 else 0)
    books = db.query(BookModel).offset(skip).limit(limit).all()

    return {
        "books": books,
        "totalPages": total_pages
    }


@books_router.post("/", status_code=201, response_model=Book)
async def create_book(new_book: BookCreate, db=Depends(get_db)):
    book = BookModel(**new_book.dict())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@books_router.put("/{book_id}", response_model=Book)
async def update_book(book_id: int, update_book: BookUpdate, db=Depends(get_db)):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if update_book.name:
        book.name = update_book.name
    if update_book.description:
        book.description = update_book.description
    if update_book.owner_id:
        book.owner_id = update_book.owner_id
    
    db.commit()
    db.refresh(book)
    return book 


@books_router.delete("/{book_id}")
async def delete_book(book_id: int, db=Depends(get_db)):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}