from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from database.connection import get_db
from database.models import Agencias, Pacientes, Terapistas, Visitas, CertificationPeriods
from schemas import Paciente, Agencia, Terapeuta, Visita, CertificationPeriodResponse

router = APIRouter()

@router.get("/pacientes/buscar/{nombre}", response_model=list[Paciente])
def buscar_paciente(nombre: str, db: Session = Depends(get_db)):
    pacientes = db.query(Pacientes).filter(Pacientes.patient_name.ilike(f"%{nombre}%")).all()
    if not pacientes:
        raise HTTPException(status_code=404, detail="No se encontraron pacientes")
    return [Paciente.from_orm(paciente) for paciente in pacientes]

@router.get("/agencias/buscar/{nombre}", response_model=list[Agencia])
def buscar_agencia(nombre: str, db: Session = Depends(get_db)):
    agencias = db.query(Agencias).filter(Agencias.agency_name.ilike(f"%{nombre}%")).all()
    if not agencias:
        raise HTTPException(status_code=404, detail="No se encontraron agencias")
    return [Agencia.from_orm(agencia) for agencia in agencias]

@router.get("/terapistas/buscar/{nombre}", response_model=list[Terapeuta])
def buscar_terapeuta(nombre: str, db: Session = Depends(get_db)):
    terapistas = db.query(Terapistas).filter(Terapistas.therapist_name.ilike(f"%{nombre}%")).all()
    if not terapistas:
        raise HTTPException(status_code=404, detail="No se encontraron terapistas")
    return [Terapeuta.from_orm(terapeuta) for terapeuta in terapistas]

@router.get("/pacientes/", response_model=dict)
def obtener_lista_pacientes(skip: int = 0, limit: int = 100, activos: Optional[bool] = None, db: Session = Depends(get_db)):

    if skip < 0:
        raise HTTPException(status_code=400, detail="Limit debe ser mayor a 0")
    if limit < 1:
        raise HTTPException(status_code=400, detail="Limit debe ser mayor a 0")
    if limit > 100:
        limit = 100

    query = db.query(Pacientes)
    if activos is not None:
        query = query.filter(Pacientes.activo == activos)
    total = query.count()
    pacientes = query.offset(skip).limit(limit).all()
    return {
        "total": total,
        "pacientes": [Paciente.from_orm(paciente) for paciente in pacientes]
    }

@router.get("/agencias/{agency_id}/pacientes", response_model=list[Paciente])
def obtener_pacientes_agencia(agency_id: int, activos: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(Pacientes).filter(Pacientes.agency == agency_id)
    if activos is not None:
        query = query.filter(Pacientes.activo == activos)
    return [Paciente.from_orm(paciente) for paciente in query.all()]

@router.get("/pacientes/perfil/{nombre}", response_model=dict)
def obtener_perfil_paciente(nombre: str, db: Session = Depends(get_db)):
    paciente = db.query(Pacientes).filter(Pacientes.patient_name.ilike(f"%{nombre}%")).first()

    if not paciente:
        paciente = db.query(Pacientes).filter(Pacientes.patient_name.ilike(f"%{nombre}%")).first()
        
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    current_date = datetime.utcnow()
    cert_period = db.query(CertificationPeriods)\
        .filter(
            CertificationPeriods.paciente_id == paciente.id_paciente,
            CertificationPeriods.start_date <= current_date,
            CertificationPeriods.end_date >= current_date
        ).first() or db.query(CertificationPeriods)\
        .filter(CertificationPeriods.paciente_id == paciente.id_paciente)\
        .order_by(CertificationPeriods.start_date.desc())\
        .first()

    cert_periods = []

    if cert_period:
        db.query(CertificationPeriods)\
            .filter(CertificationPeriods.id == cert_period.id)\
            .update({"is_active": True})
        db.commit()

    cert_periods = [CertificationPeriodResponse.from_orm(cp) for cp in sorted(paciente.certification_periods, key=lambda x: x.start_date, reverse=True)]

    return {
        "paciente": Paciente.from_orm(paciente),
        "agencia": Agencia.from_orm(paciente.agencia) if paciente.agencia else None,
        "terapeutas": [Terapeuta.from_orm(pt.terapeuta) for pt in paciente.terapistas],
        "cert_period_actual": next((cp for cp in cert_periods if cp.is_active), None),
        "cert_periods": cert_periods
    }

@router.get("/visitas/{visita_id}", response_model=Visita)
def obtener_visita_detalle(visita_id: int, db: Session = Depends(get_db)):
    visita = db.query(Visitas).filter(Visitas.id == visita_id).first()
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")

    return Visita.from_orm(visita)