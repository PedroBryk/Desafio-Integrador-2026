import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pickle

# ============================================================
# 1. CARREGAMENTO DOS DADOS
# ============================================================
print("Carregando dados...")
df = pd.read_excel("ecommerce_churn.xlsx", sheet_name=1)

print(f"Shape inicial: {df.shape}")
print(f"Colunas: {df.columns.tolist()}")

# ============================================================
# 2. TRATAMENTO DOS DADOS
# ============================================================

# Remove duplicados
df = df.drop_duplicates()
print(f"Após remover duplicados: {df.shape}")

# Remove a coluna de ID pois não é útil para o modelo
if 'CustomerID' in df.columns:
    df = df.drop(columns=['CustomerID'])

# Separa colunas numéricas e categóricas
colunas_categoricas = df.select_dtypes(include=['object']).columns.tolist()
colunas_numericas = df.select_dtypes(include=[np.number]).columns.tolist()

# Remove a coluna alvo da lista de numéricas
if 'Churn' in colunas_numericas:
    colunas_numericas.remove('Churn')

print(f"Colunas categóricas: {colunas_categoricas}")
print(f"Colunas numéricas: {colunas_numericas}")

# Preenche valores ausentes numéricos com a mediana
for col in colunas_numericas:
    mediana = df[col].median()
    df[col] = df[col].fillna(mediana)

# Preenche valores ausentes categóricos com a moda
for col in colunas_categoricas:
    moda = df[col].mode()[0]
    df[col] = df[col].fillna(moda)

# Tratamento de outliers com Z-Score (remove linhas com z > 3)
from scipy import stats
z_scores = np.abs(stats.zscore(df[colunas_numericas]))
df = df[(z_scores < 3).all(axis=1)]
print(f"Após remover outliers: {df.shape}")

# Encoding das colunas categóricas
df = pd.get_dummies(df, columns=colunas_categoricas)

# ============================================================
# 3. SEPARAÇÃO DE FEATURES E ALVO
# ============================================================
X = df.drop(columns=['Churn'])
y = df['Churn']

# ============================================================
# 4. NORMALIZAÇÃO MIN-MAX
# ============================================================
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# ============================================================
# 5. DIVISÃO TREINO E TESTE
# ============================================================
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Treino: {X_train.shape} | Teste: {X_test.shape}")

# ============================================================
# 6. TREINAMENTO DO MODELO RANDOM FOREST
# ============================================================
print("Treinando modelo Random Forest...")
modelo = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    class_weight='balanced'
)
modelo.fit(X_train, y_train)

# ============================================================
# 7. AVALIAÇÃO DO MODELO
# ============================================================
y_pred = modelo.predict(X_test)

print("\n===== MÉTRICAS DO MODELO =====")
print(f"Acurácia:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precisão:  {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1-Score:  {f1_score(y_test, y_pred):.4f}")

# ============================================================
# 8. SALVA O MODELO E O SCALER
# ============================================================
with open("modelo.pkl", "wb") as f:
    pickle.dump(modelo, f)

with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

with open("colunas.pkl", "wb") as f:
    pickle.dump(X.columns.tolist(), f)

print("\nModelo salvo com sucesso!")