from pydantic import BaseModel
from typing import List

class BookCreate(BaseModel):
    name: str
    description: str
    owner_id: int
    
class Book(BookCreate):
    id: int
    
    
    class Config:
        orm_mode = True
        
class UserCreate(BaseModel):
    name: str
    last_name: str
    email: str 
    password: str
    
class User(UserCreate):
    id: int
    
    class Config:
        orm_mode = True 
        
class UserLogin(BaseModel):
    email: str
    password: str
    
class BookResponse(BaseModel):
    id: int
    name: str
    description: str
    
    class Config: 
        orm_mode = True

class BookUpdate(BaseModel):
    name: str = None 
    description: str = None 
    owner_id: str = None 

class PaginatedBooks(BaseModel):
    books: List[BookResponse]
    totalPages: int