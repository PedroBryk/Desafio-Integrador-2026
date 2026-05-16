import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Carrega o modelo, scaler e colunas
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
    Tenure: Optional[float] = 0
    CityTier: Optional[float] = 1
    WarehouseToHome: Optional[float] = 10
    HourSpendOnApp: Optional[float] = 3
    NumberOfDeviceRegistered: Optional[float] = 3
    SatisfactionScore: Optional[float] = 3
    NumberOfAddress: Optional[float] = 2
    Complain: Optional[float] = 0
    OrderAmountHikeFromlastYear: Optional[float] = 15
    CouponUsed: Optional[float] = 1
    OrderCount: Optional[float] = 2
    DaySinceLastOrder: Optional[float] = 5
    CashbackAmount: Optional[float] = 150
    PreferredLoginDevice: Optional[str] = "Mobile Phone"
    PreferredPaymentMode: Optional[str] = "Debit Card"
    Gender: Optional[str] = "Male"
    PreferedOrderCat: Optional[str] = "Laptop & Accessory"
    MaritalStatus: Optional[str] = "Single"

@app.get("/")
def root():
    return {"status": "ML Service rodando", "modelo": "Random Forest", "acuracia": 0.9514}

@app.post("/predict")
def predict(cliente: ClienteInput):
    # Monta o dataframe com os dados do cliente
    dados = {
        "Tenure": cliente.Tenure,
        "CityTier": cliente.CityTier,
        "WarehouseToHome": cliente.WarehouseToHome,
        "HourSpendOnApp": cliente.HourSpendOnApp,
        "NumberOfDeviceRegistered": cliente.NumberOfDeviceRegistered,
        "SatisfactionScore": cliente.SatisfactionScore,
        "NumberOfAddress": cliente.NumberOfAddress,
        "Complain": cliente.Complain,
        "OrderAmountHikeFromlastYear": cliente.OrderAmountHikeFromlastYear,
        "CouponUsed": cliente.CouponUsed,
        "OrderCount": cliente.OrderCount,
        "DaySinceLastOrder": cliente.DaySinceLastOrder,
        "CashbackAmount": cliente.CashbackAmount,
        f"PreferredLoginDevice_{cliente.PreferredLoginDevice}": 1,
        f"PreferredPaymentMode_{cliente.PreferredPaymentMode}": 1,
        f"Gender_{cliente.Gender}": 1,
        f"PreferedOrderCat_{cliente.PreferedOrderCat}": 1,
        f"MaritalStatus_{cliente.MaritalStatus}": 1,
    }

    # Cria dataframe e alinha com as colunas do treino
    df = pd.DataFrame([dados])
    df = df.reindex(columns=colunas, fill_value=0)

    # Normaliza e prediz
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