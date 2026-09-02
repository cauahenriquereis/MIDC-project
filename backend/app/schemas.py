from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import Optional

class RegistroCreate(BaseModel):
    nome: str
    departamento: str
    data_referencia: date
    quantidade_entregas: int
    observacao: Optional[str] = None

    @field_validator("quantidade_entregas")
    @classmethod
    def nao_negativo(cls, v):
        if v < 0:
            raise ValueError("quantidade_entregas não pode ser negativa")
        return v

class RegistroOut(BaseModel):
    id: int
    nome: str
    departamento: str
    data_referencia: date
    quantidade_entregas: int
    observacao: Optional[str]
    criado_em: datetime

    class Config:
        from_attributes = True

class SummaryOut(BaseModel):
    total_registros: int
    total_entregas: int        