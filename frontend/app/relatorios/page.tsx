"use client";

import { useState, useEffect } from "react";

export default function RelatoriosPage() {
  const [resumo, setResumo] = useState<any>(null);
  const [topClientes, setTopClientes] = useState<any[]>([]);
  const [produtoMaiorValor, setProdutoMaiorValor] = useState<any[]>([]);
  const [vendasPorPais, setVendasPorPais] = useState<any[]>([]);
  const [vendasPorCidade, setVendasPorCidade] = useState<any[]>([]);
  const [analises, setAnalises] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const base = "http://localhost:3001";
    Promise.all([
      fetch(`${base}/relatorios/resumo-geral`).then(r => r.json()),
      fetch(`${base}/relatorios/top-clientes`).then(r => r.json()),
      fetch(`${base}/relatorios/produto-maior-valor`).then(r => r.json()),
      fetch(`${base}/relatorios/vendas-por-pais`).then(r => r.json()),
      fetch(`${base}/relatorios/vendas-por-cidade`).then(r => r.json()),
      fetch(`${base}/ml/analisar-todos`).then(r => r.json()),
    ]).then(([res, top, prod, pais, cidade, ml]) => {
      setResumo(res);
      setTopClientes(top);
      setProdutoMaiorValor(prod);
      setVendasPorPais(pais);
      setVendasPorCidade(cidade);
      setAnalises(ml);
      setCarregando(false);
    }).catch(() => setCarregando(false));
  }, []);

  function corRisco(risco: string) {
    if (risco === "Alto") return "#ff6b6b";
    if (risco === "Médio") return "#FF9800";
    return "#4CAF50";
  }

  const cardStyle = { backgroundColor: "#151516", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" };
  const thStyle = { padding: "0.75rem 1rem", textAlign: "left" as const, color: "#aaaaaa", fontWeight: "500" as const, borderBottom: "1px solid #222" };
  const tdStyle = { padding: "0.75rem 1rem", color: "#ffffff", borderBottom: "1px solid #1a1a1a" };

  if (carregando) return (
    <div style={{ padding: "2rem", color: "#aaa", fontFamily: "sans-serif" }}>Carregando relatórios...</div>
  );

  const clientesAltoRisco = analises.filter(a => a.risco === "Alto");
  const clientesAltoScoring = analises.filter(a => a.scoring === "Alto").sort((a, b) => b.compra_probabilidade - a.compra_probabilidade);

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", color: "#ffffff" }}>Relatórios</h1>
      <p style={{ color: "#aaaaaa", marginBottom: "2rem" }}>Relatórios gerenciais e de tomada de decisão estratégica.</p>

      {/* ======================== RELATÓRIOS GERENCIAIS ======================== */}
      <h2 style={{ fontSize: "1.2rem", color: "#8B81E8", marginBottom: "1rem", borderBottom: "1px solid #222", paddingBottom: "0.5rem" }}>
        📊 Relatórios Gerenciais
      </h2>

      {/* Relatório 1 — Top Clientes */}
      <div style={cardStyle}>
        <p style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Relatório 1 — Ranking de Clientes por Receita Gerada</p>
        <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "1rem" }}>Lista os clientes que mais geraram receita para o negócio, ordenados pelo valor total gasto.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#1e1e1e" }}>
              <th style={thStyle}>Posição</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>E-mail</th>
              <th style={thStyle}>Total de Compras</th>
              <th style={thStyle}>Receita Gerada</th>
            </tr>
          </thead>
          <tbody>
            {topClientes.map((c, i) => (
              <tr key={i}>
                <td style={tdStyle}>
                  <span style={{ backgroundColor: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#333", color: i < 3 ? "#000" : "#fff", padding: "2px 8px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                    #{i + 1}
                  </span>
                </td>
                <td style={tdStyle}>{c.cliente}</td>
                <td style={{ ...tdStyle, color: "#aaa" }}>{c.email}</td>
                <td style={tdStyle}>{c.totalCompras} pedido(s)</td>
                <td style={{ ...tdStyle, color: "#4CAF50", fontWeight: "bold" }}>R$ {Number(c.totalGasto).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Relatório 2 — Produtos por Valor de Vendas */}
      <div style={cardStyle}>
        <p style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Relatório 2 — Produtos por Valor Total de Vendas</p>
        <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "1rem" }}>Identifica quais produtos geraram maior receita, combinando preço e quantidade vendida.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#1e1e1e" }}>
              <th style={thStyle}>Produto</th>
              <th style={thStyle}>Preço Unitário</th>
              <th style={thStyle}>Qtd. Vendida</th>
              <th style={thStyle}>Receita Total</th>
            </tr>
          </thead>
          <tbody>
            {produtoMaiorValor.map((p, i) => (
              <tr key={i}>
                <td style={tdStyle}>{p.produto}</td>
                <td style={tdStyle}>R$ {Number(p.preco).toFixed(2)}</td>
                <td style={tdStyle}>{p.quantidadeVendida} un.</td>
                <td style={{ ...tdStyle, color: "#4CAF50", fontWeight: "bold" }}>R$ {Number(p.valorTotalVendido).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Relatório 3 — Vendas por País */}
      <div style={cardStyle}>
        <p style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Relatório 3 — Vendas por País</p>
        <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "1rem" }}>Distribuição geográfica das vendas por país, permitindo identificar os mercados mais relevantes.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#1e1e1e" }}>
              <th style={thStyle}>País</th>
              <th style={thStyle}>Total de Pedidos</th>
              <th style={thStyle}>Receita Total</th>
            </tr>
          </thead>
          <tbody>
            {vendasPorPais.sort((a, b) => b.totalReceita - a.totalReceita).map((p, i) => (
              <tr key={i}>
                <td style={tdStyle}>{p.pais}</td>
                <td style={tdStyle}>{p.totalPedidos} pedido(s)</td>
                <td style={{ ...tdStyle, color: "#4CAF50", fontWeight: "bold" }}>R$ {Number(p.totalReceita).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Relatório 4 — Vendas por Cidade */}
      <div style={cardStyle}>
        <p style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Relatório 4 — Vendas por Cidade</p>
        <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "1rem" }}>Identifica as cidades com maior volume de vendas para orientar estratégias de expansão regional.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#1e1e1e" }}>
              <th style={thStyle}>Cidade</th>
              <th style={thStyle}>Total de Pedidos</th>
              <th style={thStyle}>Receita Total</th>
            </tr>
          </thead>
          <tbody>
            {vendasPorCidade.sort((a, b) => b.totalReceita - a.totalReceita).map((c, i) => (
              <tr key={i}>
                <td style={tdStyle}>{c.cidade}</td>
                <td style={tdStyle}>{c.totalPedidos} pedido(s)</td>
                <td style={{ ...tdStyle, color: "#4CAF50", fontWeight: "bold" }}>R$ {Number(c.totalReceita).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======================== RELATÓRIOS ESTRATÉGICOS ======================== */}
      <h2 style={{ fontSize: "1.2rem", color: "#8B81E8", marginBottom: "1rem", borderBottom: "1px solid #222", paddingBottom: "0.5rem", marginTop: "2rem" }}>
        🎯 Relatórios de Tomada de Decisão Estratégica
      </h2>

      {/* Relatório Estratégico 1 — Clientes em Alto Risco */}
      <div style={cardStyle}>
        <p style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Relatório Estratégico 1 — Clientes em Alto Risco de Churn</p>
        <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Identifica clientes com alta probabilidade de cancelamento ou inatividade, permitindo ações preventivas de retenção.
          Modelo: Random Forest | Acurácia: 85,91%
        </p>
        {clientesAltoRisco.length === 0 ? (
          <p style={{ color: "#4CAF50", fontSize: "0.9rem" }}>✔ Nenhum cliente em alto risco no momento.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#1e1e1e" }}>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Cidade/Estado</th>
                <th style={thStyle}>Pedidos</th>
                <th style={thStyle}>Risco</th>
                <th style={thStyle}>Probabilidade de Churn</th>
              </tr>
            </thead>
            <tbody>
              {clientesAltoRisco.sort((a, b) => b.churn_probabilidade - a.churn_probabilidade).map((c, i) => (
                <tr key={i}>
                  <td style={tdStyle}>
                    <p style={{ margin: 0, fontWeight: "500" }}>{c.nome}</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>{c.email}</p>
                  </td>
                  <td style={{ ...tdStyle, color: "#aaa" }}>{c.cidade}/{c.estado}</td>
                  <td style={tdStyle}>{c.totalPedidos}</td>
                  <td style={tdStyle}>
                    <span style={{ backgroundColor: corRisco(c.risco) + "22", color: corRisco(c.risco), padding: "2px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                      {c.risco}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: "#ff6b6b", fontWeight: "bold" }}>{c.churn_probabilidade}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Relatório Estratégico 2 — Clientes com Alto Scoring */}
      <div style={cardStyle}>
        <p style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Relatório Estratégico 2 — Clientes com Alta Propensão à Compra</p>
        <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Ranking de clientes com maior probabilidade de realizar novas compras, ideal para direcionar campanhas e ofertas personalizadas.
          Modelo: Random Forest | Acurácia: 85,91%
        </p>
        {clientesAltoScoring.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Nenhum cliente com alto scoring no momento.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#1e1e1e" }}>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Cidade/Estado</th>
                <th style={thStyle}>Pedidos</th>
                <th style={thStyle}>Scoring</th>
                <th style={thStyle}>Probabilidade de Compra</th>
              </tr>
            </thead>
            <tbody>
              {clientesAltoScoring.map((c, i) => (
                <tr key={i}>
                  <td style={tdStyle}>
                    <p style={{ margin: 0, fontWeight: "500" }}>{c.nome}</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>{c.email}</p>
                  </td>
                  <td style={{ ...tdStyle, color: "#aaa" }}>{c.cidade}/{c.estado}</td>
                  <td style={tdStyle}>{c.totalPedidos}</td>
                  <td style={tdStyle}>
                    <span style={{ backgroundColor: "#4CAF5022", color: "#4CAF50", padding: "2px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                      {c.scoring}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: "#4CAF50", fontWeight: "bold" }}>{c.compra_probabilidade}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}