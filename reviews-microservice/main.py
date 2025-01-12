from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import reviews
from database import create_tables


create_tables()
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(reviews.router, prefix="/reviews", tags=["reviews"])


@app.get("/")
async def root():
    return {"message": "Microservicio de reseñas activo"}
