from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from passlib.context import CryptContext

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class BookModel(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("user.id"))
    
    user = relationship("UserModel", back_populates="books")

    
class UserModel(Base):
    __tablename__ = "user"
 
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, index=True, unique=True)     
    password = Column(String)    
    
    books = relationship("BookModel", back_populates="user")
    
    def set_password(self, password: str):
        self.password = bcrypt_context.hash(password)
        
    def verify_password(self, password: str):
        return bcrypt_context.verify(password, self.password)


    