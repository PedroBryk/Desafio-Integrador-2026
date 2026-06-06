"use client";

import { useState, useEffect } from "react";

type Analise = {
  clienteId: number;
  nome: string;
  email: string;
  cidade: string;
  estado: string;
  totalPedidos: number;
  churn: boolean;
  churn_probabilidade: number;
  compra_probabilidade: number;
  risco: string;
  scoring: string;
  erro?: string;
};

export default function DecisaoPage() {
  const [analises, setAnalises] = useState<Analise[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/ml/analisar-todos")
      .then((res) => res.json())
      .then((data) => {
        setAnalises(data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  function corRisco(risco: string) {
    if (risco === "Alto") return "#ff6b6b";
    if (risco === "Médio") return "#FF9800";
    return "#4CAF50";
  }

  function corScoring(scoring: string) {
    if (scoring === "Alto") return "#4CAF50";
    if (scoring === "Médio") return "#FF9800";
    return "#ff6b6b";
  }

  const badge = (texto: string, cor: string) => (
    <span style={{
      backgroundColor: cor + "22", color: cor, padding: "2px 10px",
      borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold"
    }}>
      {texto}
    </span>
  );

  if (carregando) return (
    <div style={{ padding: "2rem", color: "#aaa", fontFamily: "sans-serif" }}>
      Carregando análises... (certifique-se que o ML Service está rodando na porta 8000)
    </div>
  );

  const altosRisco = analises.filter(a => a.risco === "Alto").length;
  const altoScoring = analises.filter(a => a.scoring === "Alto").length;

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", color: "#ffffff" }}>Decisão Estratégica</h1>
      <p style={{ color: "#aaaaaa", marginBottom: "2rem" }}>Classificação de clientes por risco de churn e propensão à compra.</p>

      {/* Cards resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total de Clientes Analisados", valor: analises.length },
          { label: "Clientes em Alto Risco de Churn", valor: altosRisco, cor: "#ff6b6b" },
          { label: "Clientes com Alto Scoring", valor: altoScoring, cor: "#4CAF50" },
          { label: "Modelo Utilizado", valor: "Random Forest", cor: "#8B81E8" },
        ].map((card) => (
          <div key={card.label} style={{ backgroundColor: "#151516", borderRadius: "12px", padding: "1.5rem" }}>
            <p style={{ color: "#aaaaaa", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>{card.label}</p>
            <p style={{ color: card.cor ?? "#ffffff", fontSize: "1.4rem", fontWeight: "bold", margin: 0 }}>{card.valor}</p>
          </div>
        ))}
      </div>

      {/* Tabela de análises */}
      <div style={{ backgroundColor: "#151516", borderRadius: "12px", padding: "1.5rem" }}>
        <p style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Classificação de Clientes
        </p>
        {analises.length === 0 ? (
          <p style={{ color: "#888" }}>Nenhum cliente encontrado.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#1e1e1e" }}>
                  {["Cliente", "Cidade/Estado", "Pedidos", "Risco de Churn", "Churn %", "Scoring", "Compra %"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#aaaaaa", fontWeight: "500" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analises.sort((a, b) => b.churn_probabilidade - a.churn_probabilidade).map((a, i) => (
                  <tr key={a.clienteId} style={{ backgroundColor: i % 2 === 0 ? "#1a1a1a" : "#151516", borderBottom: "1px solid #222" }}>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <p style={{ color: "#ffffff", margin: 0, fontWeight: "500" }}>{a.nome}</p>
                      <p style={{ color: "#666", margin: 0, fontSize: "0.8rem" }}>{a.email}</p>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#aaa" }}>{a.cidade}/{a.estado}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{a.totalPedidos}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{badge(a.risco ?? "—", corRisco(a.risco))}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{a.churn_probabilidade}%</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{badge(a.scoring ?? "—", corScoring(a.scoring))}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{a.compra_probabilidade}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}