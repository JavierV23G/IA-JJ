from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database.connection import get_db
from database.models import Agencias, Pacientes, Terapistas, CertificationPeriods, Visitas
from schemas import PacienteCreate, AgenciaCreate, TerapeutaCreate, CertificationPeriodCreate, VisitaCreate

router = APIRouter()

@router.post("/pacientes/")
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    agencia = db.query(Agencias).filter(Agencias.id_agency == paciente.agency).first()
    if not agencia:
        raise HTTPException(status_code=404, detail="Agencia no encontrada")

    db_paciente = Pacientes(**paciente.dict())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@router.post("/agencias/")
def crear_agencia(agencia: AgenciaCreate, db: Session = Depends(get_db)):
    db_agencia = Agencias(**agencia.dict())
    db.add(db_agencia)
    db.commit()
    db.refresh(db_agencia)
    return db_agencia

@router.post("/terapistas/")
def crear_terapeuta(terapeuta: TerapeutaCreate, db: Session = Depends(get_db)):
    db_terapeuta = Terapistas(**terapeuta.dict())
    db.add(db_terapeuta)
    db.commit()
    db.refresh(db_terapeuta)
    return db_terapeuta

@router.post("/visitas/")
def crear_visita(visita: VisitaCreate, db: Session = Depends(get_db)):
    cert_period = db.query(CertificationPeriods)\
        .filter(
            CertificationPeriods.id == visita.cert_period_id,
            CertificationPeriods.paciente_id == visita.paciente_id
        ).first()
    if not cert_period:
        raise HTTPException(status_code=404, detail="Periodo de certificación no encontrado")

    valid_types = ["EVAL", "STANDARD", "DC", "RA"]
    if visita.tipo_visita not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de visita inválido. Debe ser uno de: {', '.join(valid_types)}"
        )

    nueva_visita = Visitas(
        paciente_id=visita.paciente_id,
        terapeuta_id=visita.terapeuta_id,
        fecha=datetime.now(),
        tipo_visita=visita.tipo_visita,
        cert_period_id=visita.cert_period_id,
        estado="Scheduled"
    )

    db.add(nueva_visita)
    db.commit()
    db.refresh(nueva_visita)
    return nueva_visita

@router.post("/pacientes/{paciente_id}/cert-periods")
def crear_cert_period(
    paciente_id: int,
    cert_period: CertificationPeriodCreate,
    db: Session = Depends(get_db)
):
    db.query(CertificationPeriods)\
        .filter(CertificationPeriods.paciente_id == paciente_id)\
        .update({"is_active": False})

    start_date = cert_period.start_date
    end_date = start_date + timedelta(days=60)

    nuevo_cert = CertificationPeriods(
        paciente_id=paciente_id,
        start_date=start_date,
        end_date=end_date,
        is_active=True
    )

    db.add(nuevo_cert)
    db.commit()
    db.refresh(nuevo_cert)

    return {
        "id": nuevo_cert.id,
        "start_date": nuevo_cert.start_date.strftime("%Y-%m-%d"),
        "end_date": nuevo_cert.end_date.strftime("%Y-%m-%d"),
        "is_active": nuevo_cert.is_active,
        "paciente_id": nuevo_cert.paciente_id
    }