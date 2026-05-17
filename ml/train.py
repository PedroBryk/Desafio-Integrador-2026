import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from scipy import stats
import pickle

# ============================================================
# 1. CARREGAMENTO DOS DADOS
# ============================================================
print("Carregando dados...")
df = pd.read_excel("ecommerce_churn.xlsx", sheet_name=1)
print(f"Shape inicial: {df.shape}")

# ============================================================
# 2. SELEÇÃO DAS COLUNAS RELEVANTES
# ============================================================
colunas_usadas = ['Tenure', 'OrderCount', 'DaySinceLastOrder', 'CashbackAmount', 'Complain', 'Churn']
df = df[colunas_usadas]
print(f"Colunas selecionadas: {colunas_usadas}")

# ============================================================
# 3. TRATAMENTO DOS DADOS
# ============================================================

# Remove duplicados
df = df.drop_duplicates()
print(f"Após remover duplicados: {df.shape}")

# Preenche valores ausentes com a mediana
for col in df.columns:
    mediana = df[col].median()
    df[col] = df[col].fillna(mediana)

# Tratamento de outliers com Z-Score
z_scores = np.abs(stats.zscore(df.drop(columns=['Churn'])))
df = df[(z_scores < 3).all(axis=1)]
print(f"Após remover outliers: {df.shape}")

# ============================================================
# 4. SEPARAÇÃO DE FEATURES E ALVO
# ============================================================
X = df.drop(columns=['Churn'])
y = df['Churn']

print(f"\nDistribuição do Churn:")
print(y.value_counts())

# ============================================================
# 5. NORMALIZAÇÃO MIN-MAX
# ============================================================
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# ============================================================
# 6. DIVISÃO TREINO E TESTE
# ============================================================
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTreino: {X_train.shape} | Teste: {X_test.shape}")

# ============================================================
# 7. TREINAMENTO DO MODELO RANDOM FOREST
# ============================================================
print("\nTreinando modelo Random Forest...")
modelo = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    class_weight='balanced'
)
modelo.fit(X_train, y_train)

# ============================================================
# 8. AVALIAÇÃO DO MODELO
# ============================================================
y_pred = modelo.predict(X_test)

print("\n===== MÉTRICAS DO MODELO =====")
print(f"Acurácia:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precisão:  {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1-Score:  {f1_score(y_test, y_pred):.4f}")

# ============================================================
# 9. IMPORTÂNCIA DAS FEATURES
# ============================================================
print("\n===== IMPORTÂNCIA DAS FEATURES =====")
for feature, importance in zip(X.columns, modelo.feature_importances_):
    print(f"{feature}: {importance:.4f}")

# ============================================================
# 10. SALVA O MODELO, SCALER E COLUNAS
# ============================================================
with open("modelo.pkl", "wb") as f:
    pickle.dump(modelo, f)

with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

with open("colunas.pkl", "wb") as f:
    pickle.dump(X.columns.tolist(), f)

print("\nModelo salvo com sucesso!")
print(f"Colunas do modelo: {X.columns.tolist()}")