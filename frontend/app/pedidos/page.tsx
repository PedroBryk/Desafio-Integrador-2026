"use client";

import { useState, useEffect } from "react";

type Cliente = { id: number; nome: string; };
type Produto = { id: number; nome: string; preco: number; };
type Pedido = { id: number; cliente: Cliente; total: number; status: string; itens: any[]; };

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [atualizando, setAtualizando] = useState<number | null>(null);

  useEffect(() => {
    carregarPedidos();
    fetch("http://localhost:3001/clientes").then((res) => res.json()).then((data) => setClientes(data)).catch(() => setClientes([]));
    fetch("http://localhost:3001/produtos").then((res) => res.json()).then((data) => setProdutos(data)).catch(() => setProdutos([]));
  }, []);

  function carregarPedidos() {
    fetch("http://localhost:3001/pedidos").then((res) => res.json()).then((data) => setPedidos(data)).catch(() => setPedidos([]));
  }

  function handleSubmit() {
  if (!clienteId || !produtoId) { setErro("Selecione um cliente e um produto."); return; }
  if (Number(quantidade) <= 0) { setErro("A quantidade deve ser maior que zero."); return; }
  setErro("");
  setSalvando(true);
  fetch("http://localhost:3001/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clienteId: Number(clienteId),
      itens: [{ produtoId: Number(produtoId), quantidade: Number(quantidade) }]
    }),
  })
    .then((res) => res.json())
    .then(() => {
      setTimeout(() => carregarPedidos(), 500);
      setClienteId(""); setProdutoId(""); setQuantidade("");
      setSucesso("Pedido criado com sucesso!");
      setTimeout(() => setSucesso(""), 3000);
    })
    .finally(() => setSalvando(false));
}

  function handleAlterarStatus(pedidoId: number, novoStatus: string) {
    setAtualizando(pedidoId);
    fetch(`http://localhost:3001/pedidos/${pedidoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    })
      .then((res) => res.json())
      .then(() => carregarPedidos())
      .finally(() => setAtualizando(null));
  }

  function corStatus(status: string) {
    if (status === "cancelado") return "#ff6b6b";
    if (status === "concluido") return "#4CAF50";
    return "#FF9800";
  }

  const inputStyle = {
    padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #333",
    backgroundColor: "#2a2a2a", color: "white", fontSize: "0.95rem", outline: "none",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", color: "#ffffff" }}>Pedidos</h1>
      <p style={{ color: "#aaaaaa", marginBottom: "2rem" }}>Crie e gerencie os pedidos do sistema.</p>

      <div style={{ backgroundColor: "#151516", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", maxWidth: "480px" }}>
        <h2 style={{ color: "white", fontSize: "1.1rem", marginBottom: "1rem" }}>Criar Pedido</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={inputStyle}>
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} style={inputStyle}>
            <option value="">Selecione um produto</option>
            {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} — R$ {p.preco}</option>)}
          </select>
          <input placeholder="Quantidade" type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={inputStyle} />
          {erro && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: 0 }}>{erro}</p>}
          {sucesso && <p style={{ color: "#4caf50", fontSize: "0.85rem", margin: 0 }}>{sucesso}</p>}
          <button onClick={handleSubmit} disabled={salvando} style={{ padding: "0.7rem", borderRadius: "8px", border: "none", backgroundColor: salvando ? "#555" : "white", color: salvando ? "#aaa" : "#151516", fontWeight: "bold", cursor: salvando ? "not-allowed" : "pointer", fontSize: "0.95rem" }}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#ffffff" }}>Lista de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p style={{ color: "#888" }}>Nenhum pedido criado ainda.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#151516", color: "white" }}>
                {["ID", "Cliente", "Total", "Status", "Itens", "Alterar Status"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p, i) => (
                <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? "#1e1e1e" : "#2a2a2a" }}>
                  <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{p.id}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{p.cliente?.nome}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>R$ {Number(p.total).toFixed(2)}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{
                      backgroundColor: corStatus(p.status) + "22",
                      color: corStatus(p.status),
                      padding: "2px 10px", borderRadius: "20px",
                      fontSize: "0.8rem", fontWeight: "bold"
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{p.itens?.length} item(s)</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <select
                      value={p.status}
                      disabled={atualizando === p.id}
                      onChange={(e) => handleAlterarStatus(p.id, e.target.value)}
                      style={{ ...inputStyle, fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}