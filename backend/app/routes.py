from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from database import get_db

router = APIRouter()

@router.post("/records", response_model=schemas.RegistroOut, status_code=status.HTTP_201_CREATED)
def criar_registro(payload: schemas.RegistroCreate, db: Session = Depends(get_db)):
    funcionario = db.query(models.Funcionario).filter_by(
        nome=payload.nome, departamento=payload.departamento
    ).first()
    
    if not funcionario:
        funcionario = models.Funcionario(nome=payload.nome, departamento=payload.departamento)
        db.add(funcionario)
        db.commit()
        db.refresh(funcionario)

    registro = models.Registro(
        funcionario_id=funcionario.id,
        data_referencia=payload.data_referencia,
        quantidade_entregas=payload.quantidade_entregas,
        observacao=payload.observacao,
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    
    return {**registro.__dict__, "nome": funcionario.nome, "departamento": funcionario.departamento}

@router.get("/records", response_model=list[schemas.RegistroOut])
def listar_registros(db: Session = Depends(get_db)):
    registros = db.query(models.Registro).join(models.Funcionario).order_by(models.Registro.data_referencia.desc()).all()
    return [{**r.__dict__, "nome": r.funcionario.nome, "departamento": r.funcionario.departamento} for r in registros]

@router.get("/summary", response_model=schemas.SummaryOut)
def resumo(db: Session = Depends(get_db)):
    total_registros = db.query(func.count(models.Registro.id)).scalar() or 0
    total_entregas = db.query(func.sum(models.Registro.quantidade_entregas)).scalar() or 0
    return {"total_registros": total_registros, "total_entregas": total_entregas}