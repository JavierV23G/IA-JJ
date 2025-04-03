from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from database.connection import get_db
from database.models import Agencias, Pacientes, Terapistas, Visitas

router = APIRouter()

# Define your search endpoints here