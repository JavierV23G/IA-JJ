from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, timedelta
from database.connection import get_db
from database.models import Agencias, Terapistas, CertificationPeriods, Visitas

router = APIRouter()

# Define your update endpoints here