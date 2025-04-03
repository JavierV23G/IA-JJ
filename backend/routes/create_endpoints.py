from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta, date
from database.connection import get_db
from database.models import Agencias, Pacientes, Terapistas, CertificationPeriods, Visitas

router = APIRouter()

# Define your creation endpoints here