"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend
} from "recharts";
import { Cell } from "recharts";

const CORES = ["#534AB7", "#8B81E8", "#4CAF50", "#FF9800", "#E91E63", "#00BCD4", "#FF5722"];

export default function DashboardPage() {
  const [resumo, setResumo] = useState<any>(null);
  const [topClientes, setTopClientes] = useState<any[]>([]);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<any[]>([]);
  const [vendasPorEstado, setVendasPorEstado] = useState<any[]>([]);
  const [vendasPorCategoria, setVendasPorCategoria] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const base = "http://localhost:3001/relatorios";
    Promise.all([
      fetch(`${base}/resumo-geral`).then(r => r.json()),
      fetch(`${base}/top-clientes`).then(r => r.json()),
      fetch(`${base}/produtos-mais-vendidos`).then(r => r.json()),
      fetch(`${base}/vendas-por-estado`).then(r => r.json()),
      fetch(`${base}/vendas-por-categoria`).then(r => r.json()),
    ]).then(([res, top, prod, estado, cat]) => {
      setResumo(res);
      setTopClientes(top);
      setProdutosMaisVendidos(prod);
      setVendasPorEstado(estado);
      setVendasPorCategoria(cat);
      setCarregando(false);
    }).catch(() => setCarregando(false));
  }, []);

  const cardStyle = {
    backgroundColor: "#151516", borderRadius: "12px", padding: "1.5rem",
    display: "flex", flexDirection: "column" as const, gap: "0.5rem"
  };

  const tituloGrafico = { color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" };

  if (carregando) return (
    <div style={{ padding: "2rem", color: "#aaa", fontFamily: "sans-serif" }}>Carregando dashboard...</div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", color: "#ffffff" }}>Dashboard</h1>
      <p style={{ color: "#aaaaaa", marginBottom: "2rem" }}>Visão geral das vendas e desempenho do sistema.</p>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total de Pedidos", valor: resumo?.totalPedidos ?? 0 },
          { label: "Total de Clientes", valor: resumo?.totalClientes ?? 0 },
          { label: "Total de Produtos", valor: resumo?.totalProdutos ?? 0 },
          { label: "Receita Total", valor: `R$ ${Number(resumo?.receitaTotal ?? 0).toFixed(2)}` },
        ].map((card) => (
          <div key={card.label} style={cardStyle}>
            <p style={{ color: "#aaaaaa", fontSize: "0.85rem", margin: 0 }}>{card.label}</p>
            <p style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>{card.valor}</p>
          </div>
        ))}
      </div>

      {/* Top Clientes */}
      <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
        <p style={tituloGrafico}>Top 5 Clientes por Valor Gasto</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topClientes} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="cliente" tick={{ fill: "#aaa", fontSize: 12 }} />
            <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "none", color: "#fff" }} formatter={(v: any) => [`R$ ${Number(v).toFixed(2)}`, "Total Gasto"]} />
            <Bar dataKey="totalGasto" fill="#534AB7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Produtos mais vendidos */}
      <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
        <p style={tituloGrafico}>Produtos Mais Vendidos</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={produtosMaisVendidos} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="produto" tick={{ fill: "#aaa", fontSize: 12 }} />
            <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "none", color: "#fff" }} formatter={(v: any) => [v, "Unidades Vendidas"]} />
            <Bar dataKey="quantidadeVendida" fill="#8B81E8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Vendas por Estado */}
        <div style={cardStyle}>
          <p style={tituloGrafico}>Vendas por Estado</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vendasPorEstado} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="estado" tick={{ fill: "#aaa", fontSize: 12 }} />
              <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "none", color: "#fff" }} formatter={(v: any) => [v, "Pedidos"]} />
              <Bar dataKey="totalPedidos" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendas por Categoria */}
<div style={cardStyle}>
  <p style={tituloGrafico}>Vendas por Categoria</p>
  {vendasPorCategoria.length === 0 ? (
    <p style={{ color: "#888", fontSize: "0.85rem" }}>Nenhum dado disponível.</p>
  ) : (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={vendasPorCategoria}
          dataKey="totalReceita"
          nameKey="categoria"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ categoria }: any) => categoria}
        >
          {vendasPorCategoria.map((_, i) => (
            <Cell key={i} fill={CORES[i % CORES.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#1e1e1e", border: "none", color: "#fff" }}
          formatter={(v: any) => [`R$ ${Number(v).toFixed(2)}`, "Receita"]}
        />
      </PieChart>
    </ResponsiveContainer>
  )}
</div>
      </div>
    </div>
  );
}