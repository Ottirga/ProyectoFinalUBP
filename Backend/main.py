from fastapi import FastAPI
from database import Base, engine, get_db
from router.books_routes import books_router
from router.user_routes import user_router 
from router.especiales_routes import especiales_router 
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(especiales_router)
app.include_router(books_router)
app.include_router(user_router)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)