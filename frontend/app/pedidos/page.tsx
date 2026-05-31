"use client";

import { useState, useEffect } from "react";

type Cliente = { id: number; nome: string; };
type Produto = { id: number; nome: string; preco: number; };
type Pedido = { id: number; cliente: Cliente; produto: Produto; quantidade: number; };

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/pedidos")
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch(() => setPedidos([]));

    fetch("http://localhost:3001/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(() => setClientes([]));

    fetch("http://localhost:3001/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch(() => setProdutos([]));
  }, []);

  function handleSubmit() {
    if (!clienteId || !produtoId) {
      setErro("Selecione um cliente e um produto.");
      return;
    }
    if (Number(quantidade) <= 0) {
      setErro("A quantidade deve ser maior que zero.");
      return;
    }
    setErro("");

    fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId: Number(clienteId),
        produtoId: Number(produtoId),
        quantidade: Number(quantidade),
      }),
    })
      .then((res) => res.json())
      .then((novoPedido) => {
        setPedidos([...pedidos, novoPedido]);
        setClienteId(""); setProdutoId(""); setQuantidade("");
      });
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Pedidos</h1>

      <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
        <h2>Criar Pedido</h2>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Selecione um cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
          <option value="">Selecione um produto</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome} — R$ {p.preco}</option>
          ))}
        </select>
        <input placeholder="Quantidade" type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button onClick={handleSubmit}>Salvar</button>
      </div>

      <h2>Lista de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido criado ainda.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr><th>ID</th><th>Cliente</th><th>Produto</th><th>Quantidade</th></tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente?.nome}</td>
                <td>{p.produto?.nome}</td>
                <td>{p.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}