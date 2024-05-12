from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from models import UserModel
from schemas import User, UserCreate, UserLogin
from passlib.context import CryptContext


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

user_router = APIRouter(
    prefix="/user",
    tags=["User"]
)

def get_password_hash(password):
    return bcrypt_context.hash(password)


@user_router.get("/")
async def get_users(db=Depends(get_db)):
    users = db.query(UserModel).all()
    return users


@user_router.post("/", status_code=201, response_model=User)
async def create_user(new_user: UserCreate, db=Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == new_user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = UserModel(
        name=new_user.name,
        last_name=new_user.last_name,
        email=new_user.email,
        password=get_password_hash(new_user.password), 
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@user_router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, update_user: UserCreate, db=Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.name = update_user.name
    user.last_name = update_user.last_name
    user.email = update_user.email
    if update_user.password:
        user.password = get_password_hash(update_user.password)
    if user.email != update_user.email:
        email_in_use = db.query(UserModel).filter(UserModel.email == update_user.email).first()
        if email_in_use:
            raise HTTPException(status_code=400, detail="Email already in use")
    db.commit()
    db.refresh(user)
    return user


@user_router.delete("/{user_id}")
async def delete_user(user_id: int, db=Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@user_router.post("/login")
async def login_user(user_login: UserLogin, db=Depends(get_db)):
    user= db.query(UserModel).filter(UserModel.email == user_login.email).first()
    if not user or not bcrypt_context.verify(user_login.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message":"Login successful"}