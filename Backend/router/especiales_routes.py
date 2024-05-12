from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from models import BookModel, UserModel



especiales_router = APIRouter(
    prefix="/especiales",
    tags=["Especiales"]
)


@especiales_router.get("/{book_user}")
async def get_book_by_user(owner: str, db=Depends(get_db)):
    search_owner= db.query(UserModel).filter(UserModel.email == owner).first()
    if not search_owner:
        raise HTTPException(status_code=404, detail="Owner not found - Select another owner")
    books = db.query(BookModel).filter(BookModel.owner_id == search_owner.id).all()
    if not books:
        raise HTTPException(status_code=404, detail="Book not found")
    return books


