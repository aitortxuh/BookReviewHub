from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import httpx
import os
import jwt

app = FastAPI()

# Configuración de los microservicios
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-microservice:3000/api/user")
REVIEW_SERVICE_URL = os.getenv("REVIEW_SERVICE_URL")

@app.post("/login")
async def login_user(data: dict):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AUTH_SERVICE_URL}/login", json=data)
            
            if response.status_code != 200:
                return {"message": response.json().get("message", "Error de autenticación")}, response.status_code
            
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/register")
async def register_user(data: dict):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AUTH_SERVICE_URL}/register", json=data)
            
            if response.status_code != 201:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("message", "Error al registrar usuario"))
            
            return {"message": "Usuario registrado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reviews")
async def get_reviews():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{REVIEW_SERVICE_URL}/reviews/")
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error al obtener reseñas")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reviews")
async def create_review(data: dict):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{REVIEW_SERVICE_URL}/reviews/", json=data)
            if response.status_code != 201:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/reviews/{review_id}")
async def delete_review(review_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{REVIEW_SERVICE_URL}/reviews/{review_id}")
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("detail", "Error al eliminar reseña"))
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/reviews/")
async def create_review_proxy(request: Request):
    response = await httpx.post("http://reviews-microservice:8000/reviews/", json=await request.json())
    return JSONResponse(content=response.json(), status_code=response.status_code)

