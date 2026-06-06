"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

type ResumoVendas = { mes: string; total: number }[];
type TopCliente   = { nome: string; total: number };
type TopProduto   = { nome: string; quantidade: number };
type DistribuicaoLocal = { local: string; clientes: number };

type DashboardData = {
  resumoVendas: ResumoVendas;
  topClientes: TopCliente[];
  topProdutos: TopProduto[];
  distribuicaoPais: DistribuicaoLocal[];
  distribuicaoEstado: DistribuicaoLocal[];
};

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

const MOCK: DashboardData = {
  resumoVendas: [
    { mes: "Jan", total: 12400 },
    { mes: "Fev", total: 9800 },
    { mes: "Mar", total: 15200 },
    { mes: "Abr", total: 18700 },
    { mes: "Mai", total: 14300 },
    { mes: "Jun", total: 21000 },
  ],
  topClientes: [
    { nome: "Ana Lima", total: 5400 },
    { nome: "Carlos Souza", total: 4200 },
    { nome: "Maria Fernanda", total: 3900 },
    { nome: "João Pedro", total: 3100 },
    { nome: "Beatriz Alves", total: 2800 },
  ],
  topProdutos: [
    { nome: "Produto A", quantidade: 320 },
    { nome: "Produto B", quantidade: 280 },
    { nome: "Produto C", quantidade: 195 },
    { nome: "Produto D", quantidade: 150 },
    { nome: "Produto E", quantidade: 98 },
  ],
  distribuicaoPais: [
    { local: "Brasil", clientes: 142 },
    { local: "Portugal", clientes: 38 },
    { local: "Argentina", clientes: 21 },
    { local: "EUA", clientes: 15 },
  ],
  distribuicaoEstado: [
    { local: "SP", clientes: 64 },
    { local: "RJ", clientes: 31 },
    { local: "MG", clientes: 22 },
    { local: "PR", clientes: 18 },
    { local: "RS", clientes: 14 },
    { local: "Outros", clientes: 25 },
  ],
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: "#151516",
      border: "1px solid #2c2c2c",
      borderRadius: "12px",
      padding: "1.5rem",
    }}>
      <h2 style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "#1e1e1f", border: "1px solid #2c2c2c",
        borderRadius: "8px", padding: "0.6rem 1rem", color: "#fff", fontSize: "0.85rem",
      }}>
        <p style={{ marginBottom: "0.25rem", color: "#a1a1aa" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{typeof p.value === "number" && p.name?.toLowerCase().includes("total")
              ? `R$ ${p.value.toLocaleString("pt-BR")}` : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function GraficosPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [localTab, setLocalTab] = useState<"pais" | "estado">("estado");

  useEffect(() => {
    fetch("http://localhost:3001/dashboard")
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setData(MOCK); setLoading(false); });
  }, []);

  if (loading) {
    return <div style={{ padding: "3rem", color: "#a1a1aa", textAlign: "center" }}>Carregando dados...</div>;
  }

  const d = data!;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#ffffff", fontSize: "1.75rem", marginBottom: "0.4rem" }}>📊 Relatórios Visuais</h1>
      <p style={{ color: "#71717a", marginBottom: "2rem" }}>Visão geral das vendas, clientes e distribuição geográfica.</p>

      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))" }}>

        <Card title="📈 Resumo de Vendas (Mensal)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={d.resumoVendas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
              <XAxis dataKey="mes" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" name="Total" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="🏆 Top Clientes (por valor)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.topClientes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" horizontal={false} />
              <XAxis type="number" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(1)}k`} />
              <YAxis type="category" dataKey="nome" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Total" fill="#22d3ee" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="📦 Produtos Mais Vendidos">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.topProdutos}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
              <XAxis dataKey="nome" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantidade" name="Quantidade" radius={[6, 6, 0, 0]}>
                {d.topProdutos.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="🌍 Distribuição por Localização">
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {(["estado", "pais"] as const).map((tab) => (
              <button key={tab} onClick={() => setLocalTab(tab)} style={{
                padding: "0.3rem 0.9rem", borderRadius: "6px", border: "1px solid #2c2c2c",
                backgroundColor: localTab === tab ? "#6366f1" : "#1e1e1f",
                color: "#ffffff", cursor: "pointer", fontSize: "0.8rem",
                fontWeight: localTab === tab ? 600 : 400,
              }}>
                {tab === "estado" ? "Estado" : "País"}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={localTab === "estado" ? d.distribuicaoEstado : d.distribuicaoPais}
                dataKey="clientes"
                nameKey="local"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={{ stroke: "#4b4b4b" }}
                >
                {(localTab === "estado" ? d.distribuicaoEstado : d.distribuicaoPais).map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
                </Pie>
              <Tooltip formatter={(value) => [`${value} clientes`, "Clientes"]} />
              <Legend formatter={(v) => <span style={{ color: "#a1a1aa", fontSize: "0.8rem" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
}