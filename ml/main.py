import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

with open("modelo.pkl", "rb") as f:
    modelo = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("colunas.pkl", "rb") as f:
    colunas = pickle.load(f)

app = FastAPI(title="ML Service - Desafio Integrador 2026")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClienteInput(BaseModel):
    Tenure: float
    OrderCount: float
    DaySinceLastOrder: float
    CashbackAmount: float
    Complain: float

@app.get("/")
def root():
    return {
        "status": "ML Service rodando",
        "modelo": "Random Forest",
        "acuracia": 0.8591,
        "features": colunas
    }

@app.post("/predict")
def predict(cliente: ClienteInput):
    dados = {
        "Tenure": cliente.Tenure,
        "OrderCount": cliente.OrderCount,
        "DaySinceLastOrder": cliente.DaySinceLastOrder,
        "CashbackAmount": cliente.CashbackAmount,
        "Complain": cliente.Complain,
    }

    df = pd.DataFrame([dados])
    df = df.reindex(columns=colunas, fill_value=0)

    X = scaler.transform(df)
    predicao = modelo.predict(X)[0]
    probabilidade = modelo.predict_proba(X)[0]

    churn_prob = round(float(probabilidade[1]) * 100, 2)
    compra_prob = round(float(probabilidade[0]) * 100, 2)

    return {
        "churn": bool(predicao),
        "churn_probabilidade": churn_prob,
        "compra_probabilidade": compra_prob,
        "risco": "Alto" if churn_prob >= 70 else "Médio" if churn_prob >= 40 else "Baixo",
        "scoring": "Alto" if compra_prob >= 70 else "Médio" if compra_prob >= 40 else "Baixo",
    }