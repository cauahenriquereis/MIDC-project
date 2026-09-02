from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Funcionario(Base):
    __tablename__ = "funcionarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    departamento = Column(String, nullable=False)
    registros = relationship("Registro", back_populates="funcionario")

class Registro(Base):
    __tablename__ = "registros"
    id = Column(Integer, primary_key=True, index=True)
    funcionario_id = Column(Integer, ForeignKey("funcionarios.id"), nullable=False)
    data_referencia = Column(Date, nullable=False)
    quantidade_entregas = Column(Integer, nullable=False)
    observacao = Column(String, nullable=True)
    criado_em = Column(DateTime, server_default=func.now())
    funcionario = relationship("Funcionario", back_populates="registros")