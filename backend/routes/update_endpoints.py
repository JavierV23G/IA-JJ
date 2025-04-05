from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, timedelta
from database.connection import get_db
from database.models import Agencias, Terapistas, CertificationPeriods, Visitas, Pacientes
from schemas import Paciente, Agencia, Terapeuta, CertificationPeriodResponse, Visita

router = APIRouter()

@router.put("/pacientes/{paciente_id}", response_model=Paciente)
def editar_paciente_info(
    paciente_id: int,
    patient_name: str | None = None,
    address: str | None = None,
    birthday: str | None = None,
    gender: str | None = None,
    contact_info: str | None = None,
    discipline: str | None = None,
    payor_type: str | None = None,
    cert_period: str | None = None,
    agency: int | None = None,
    physician: str | None = None,
    db: Session = Depends(get_db)
):
    paciente = db.query(Pacientes).filter(Pacientes.id_paciente == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    update_data = {}
    if patient_name: update_data["patient_name"] = patient_name
    if address: update_data["address"] = address
    if birthday: update_data["birthday"] = birthday
    if gender: update_data["gender"] = gender
    if contact_info: update_data["contact_info"] = contact_info
    if discipline: update_data["discipline"] = discipline
    if payor_type: update_data["payor_type"] = payor_type
    if cert_period: update_data["cert_period"] = cert_period
    if agency: update_data["agency"] = agency
    if physician: update_data["physician"] = physician

    for key, value in update_data.items():
        setattr(paciente, key, value)

    db.commit()
    db.refresh(paciente)
    return Paciente.from_orm(paciente)

@router.put("/agencias/{agency_name}", response_model=Agencia)
def editar_agencia_info(
    agency_name: str,
    new_agency_name: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    username: str | None = None,
    password: str | None = None,
    db: Session = Depends(get_db)
):
    agencia = db.query(Agencias).filter(Agencias.agency_name.ilike(f"%{agency_name}%")).first()
    if not agencia:
        raise HTTPException(status_code=404, detail="Agencia no encontrada")

    update_data = {}
    if new_agency_name: update_data["agency_name"] = new_agency_name
    if email: update_data["email"] = email
    if phone: update_data["phone"] = phone
    if username: update_data["username"] = username
    if password: update_data["password"] = password

    for key, value in update_data.items():
        setattr(agencia, key, value)

    db.commit()
    db.refresh(agencia)
    return Agencia.from_orm(agencia)

@router.put("/terapistas/{therapist_name}", response_model=Terapeuta)
def editar_terapeuta_info(
    therapist_name: str,
    Therapist_name: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    birthday: str | None = None,
    gender: str | None = None,
    zip_codes: str | None = None,
    username: str | None = None,
    password: str | None = None,
    rol: str | None = None,
    db: Session = Depends(get_db)
):
    terapeuta = db.query(Terapistas).filter(Terapistas.therapist_name.ilike(f"%{therapist_name}%")).first()
    if not terapeuta:
        raise HTTPException(status_code=404, detail="Terapeuta no encontrado")

    update_data = {}
    if Therapist_name: update_data["therapist_name"] = Therapist_name
    if email: update_data["email"] = email
    if phone: update_data["phone"] = phone
    if birthday: update_data["birthday"] = birthday
    if gender: update_data["gender"] = gender
    if zip_codes: update_data["zip_codes"] = zip_codes
    if username: update_data["username"] = username
    if password: update_data["password"] = password
    if rol: update_data["rol"] = rol

    for key, value in update_data.items():
        setattr(terapeuta, key, value)

    db.commit()
    db.refresh(terapeuta)
    return Terapeuta.from_orm(terapeuta)

@router.put("/pacientes/{paciente_id}/cert-periods/{cert_period_id}", response_model=CertificationPeriodResponse)
def editar_cert_period(
    paciente_id: int,
    cert_period_id: int,
    start_date: Optional[date] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    cert_period = db.query(CertificationPeriods)\
        .filter(
            CertificationPeriods.id == cert_period_id,
            CertificationPeriods.paciente_id == paciente_id
        ).first()

    if not cert_period:
        raise HTTPException(status_code=404, detail="Periodo de certificación no encontrado")

    update_data = {}
    if start_date:
        update_data["start_date"] = start_date
        update_data["end_date"] = start_date + timedelta(days=60)

    if is_active is not None:
        if is_active:
            db.query(CertificationPeriods)\
                .filter(
                    CertificationPeriods.paciente_id == paciente_id,
                    CertificationPeriods.id != cert_period_id
                )\
                .update({"is_active": False})
        update_data["is_active"] = is_active

    for key, value in update_data.items():
        setattr(cert_period, key, value)

    db.commit()
    db.refresh(cert_period)

    return CertificationPeriodResponse.from_orm(cert_period)

@router.put("/visitas/{visita_id}", response_model=Visita)
def actualizar_visita(
    visita_id: int,
    tipo_visita: Optional[str] = None,
    notas: Optional[str] = None,
    firma_terapeuta: Optional[bool] = None,
    firma_paciente: Optional[bool] = None,
    reopen: Optional[bool] = False,
    db: Session = Depends(get_db)
):
    visita = db.query(Visitas).filter(Visitas.id == visita_id).first()
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")

    # Check if visit is completed and not reopening
    if visita.estado == "Completed" and not reopen:
        raise HTTPException(
            status_code=400, 
            detail="No se puede modificar una visita completada. Use reopen=true para reabrir"
        )

    update_data = {}

    # Handle reopening
    if reopen and visita.estado == "Completed":
        update_data = {
            "firma_terapeuta": False,
            "firma_paciente": False,
            "estado": "Partial"
        }
    else:
        # Normal update flow
        if tipo_visita is not None:
            valid_types = ["EVAL", "STANDARD", "DC", "RA"]
            if tipo_visita not in valid_types:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Tipo de visita inválido. Debe ser uno de: {', '.join(valid_types)}"
                )
            update_data["tipo_visita"] = tipo_visita
        
        if notas is not None:
            update_data["notas"] = notas
        if firma_terapeuta is not None:
            update_data["firma_terapeuta"] = firma_terapeuta
        if firma_paciente is not None:
            update_data["firma_paciente"] = firma_paciente

        # Update visit status based on current state
        notas_empty = not visita.notas or visita.notas.strip() == ""
        if notas is not None:
            notas_empty = not notas or notas.strip() == ""

        firma_t = visita.firma_terapeuta if firma_terapeuta is None else firma_terapeuta
        firma_p = visita.firma_paciente if firma_paciente is None else firma_paciente

        if notas_empty and not firma_t and not firma_p:
            update_data["estado"] = "No Info"
        elif not notas_empty and firma_t and firma_p:
            update_data["estado"] = "Completed"
        else:
            update_data["estado"] = "Partial"

    # Apply updates
    for key, value in update_data.items():
        setattr(visita, key, value)

    db.commit()
    db.refresh(visita)
    return Visita.from_orm(visita)