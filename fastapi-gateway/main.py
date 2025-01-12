from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from gateway import app as gateway_app
import os
import logging

logging.basicConfig(level=logging.INFO)  # Cambia a WARNING para ocultar los GET normales

app = FastAPI(title="Book Review Hub API Gateway")

app.mount("/api", gateway_app)

frontend_path = os.path.join(os.path.dirname(__file__), "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
