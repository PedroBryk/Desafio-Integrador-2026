"use client";

import { useState, useEffect } from "react";

type ChurnCliente = {
  id: number;
  nome: string;
  email: string;
  score: number;
  risco: "Baixo" | "Médio" | "Alto";
  ultimaCompra: string;
  totalGasto: number;
};

const MOCK_CHURN: ChurnCliente[] = [
  { id: 1, nome: "Ana Lima",       email: "ana@email.com",    score: 82, risco: "Alto",  ultimaCompra: "2025-11-10", totalGasto: 5400 },
  { id: 2, nome: "Carlos Souza",   email: "carlos@email.com", score: 45, risco: "Médio", ultimaCompra: "2026-01-22", totalGasto: 4200 },
  { id: 3, nome: "Maria Fernanda", email: "maria@email.com",  score: 17, risco: "Baixo", ultimaCompra: "2026-04-01", totalGasto: 3900 },
  { id: 4, nome: "João Pedro",     email: "joao@email.com",   score: 91, risco: "Alto",  ultimaCompra: "2025-08-30", totalGasto: 3100 },
  { id: 5, nome: "Beatriz Alves",  email: "bea@email.com",    score: 60, risco: "Médio", ultimaCompra: "2025-12-15", totalGasto: 2800 },
  { id: 6, nome: "Lucas Martins",  email: "lucas@email.com",  score: 8,  risco: "Baixo", ultimaCompra: "2026-05-20", totalGasto: 6100 },
];

function riscoColor(risco: ChurnCliente["risco"]) {
  if (risco === "Alto")  return { bg: "#3b1111", text: "#f87171", border: "#7f1d1d" };
  if (risco === "Médio") return { bg: "#2d1f00", text: "#fbbf24", border: "#78350f" };
  return                        { bg: "#0d2318", text: "#4ade80", border: "#14532d" };
}

function ScoreBar({ score, risco }: { score: number; risco: ChurnCliente["risco"] }) {
  const color = risco === "Alto" ? "#f87171" : risco === "Médio" ? "#fbbf24" : "#4ade80";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div style={{ flex: 1, height: "8px", backgroundColor: "#2c2c2c", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", backgroundColor: color, borderRadius: "99px" }} />
      </div>
      <span style={{ color, fontWeight: 700, fontSize: "0.85rem", minWidth: "30px" }}>{score}</span>
    </div>
  );
}

function ResumoCard({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div style={{ backgroundColor: "#151516", border: "1px solid #2c2c2c", borderRadius: "10px", padding: "1.2rem 1.5rem", flex: 1 }}>
      <p style={{ color: "#71717a", fontSize: "0.8rem", marginBottom: "0.4rem" }}>{label}</p>
      <p style={{ color: cor, fontSize: "2rem", fontWeight: 700 }}>{valor}</p>
    </div>
  );
}

export default function ChurnPage() {
  const [clientes, setClientes] = useState<ChurnCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"Todos" | "Alto" | "Médio" | "Baixo">("Todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/churn/scoring")
      .then((res) => res.json())
      .then((d) => { setClientes(d); setLoading(false); })
      .catch(() => { setClientes(MOCK_CHURN); setLoading(false); });
  }, []);

  const filtrados = clientes.filter((c) => {
    const matchFiltro = filtro === "Todos" || c.risco === filtro;
    const matchBusca  = c.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        c.email.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  const alto  = clientes.filter((c) => c.risco === "Alto").length;
  const medio = clientes.filter((c) => c.risco === "Médio").length;
  const baixo = clientes.filter((c) => c.risco === "Baixo").length;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ color: "#ffffff", fontSize: "1.75rem", marginBottom: "0.4rem" }}>🧠 Decisão Estratégica — Churn</h1>
      <p style={{ color: "#71717a", marginBottom: "2rem" }}>Scoring de risco de cancelamento gerado pelo modelo de Machine Learning.</p>

      {!loading && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <ResumoCard label="🔴 Risco Alto"  valor={alto}  cor="#f87171" />
          <ResumoCard label="🟡 Risco Médio" valor={medio} cor="#fbbf24" />
          <ResumoCard label="🟢 Risco Baixo" valor={baixo} cor="#4ade80" />
          <ResumoCard label="👥 Total"        valor={clientes.length} cor="#a1a1aa" />
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Buscar cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            backgroundColor: "#1e1e1f", border: "1px solid #2c2c2c", borderRadius: "8px",
            padding: "0.45rem 0.9rem", color: "#ffffff", fontSize: "0.875rem", outline: "none", minWidth: "220px",
          }}
        />
        {(["Todos", "Alto", "Médio", "Baixo"] as const).map((r) => (
          <button key={r} onClick={() => setFiltro(r)} style={{
            padding: "0.4rem 1rem", borderRadius: "6px", border: "1px solid #2c2c2c",
            backgroundColor: filtro === r ? "#6366f1" : "#1e1e1f",
            color: "#ffffff", cursor: "pointer", fontSize: "0.8rem", fontWeight: filtro === r ? 600 : 400,
          }}>
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#a1a1aa" }}>Consultando modelo de ML...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2c2c2c" }}>
                {["Cliente", "E-mail", "Score de Risco", "Nível", "Última Compra", "Total Gasto"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#71717a", fontSize: "0.8rem", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "2rem", color: "#71717a", textAlign: "center" }}>Nenhum cliente encontrado.</td></tr>
              ) : filtrados.map((c) => {
                const { bg, text, border } = riscoColor(c.risco);
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #1e1e1f" }}>
                    <td style={{ padding: "0.8rem 1rem", color: "#ffffff", fontWeight: 500 }}>{c.nome}</td>
                    <td style={{ padding: "0.8rem 1rem", color: "#a1a1aa", fontSize: "0.875rem" }}>{c.email}</td>
                    <td style={{ padding: "0.8rem 1rem", minWidth: "160px" }}><ScoreBar score={c.score} risco={c.risco} /></td>
                    <td style={{ padding: "0.8rem 1rem" }}>
                      <span style={{ backgroundColor: bg, color: text, border: `1px solid ${border}`, borderRadius: "6px", padding: "0.2rem 0.65rem", fontSize: "0.78rem", fontWeight: 600 }}>
                        {c.risco}
                      </span>
                    </td>
                    <td style={{ padding: "0.8rem 1rem", color: "#a1a1aa", fontSize: "0.875rem" }}>{new Date(c.ultimaCompra).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "0.8rem 1rem", color: "#ffffff", fontSize: "0.875rem" }}>R$ {c.totalGasto.toLocaleString("pt-BR")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}