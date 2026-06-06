"use client";

import { useState, useEffect } from "react";

type Categoria = { id: number; nome: string; };
type Produto = { id: number; nome: string; preco: number; estoque: number; categoria?: Categoria; };

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/produtos").then((res) => res.json()).then((data) => setProdutos(data)).catch(() => setProdutos([]));
    fetch("http://localhost:3001/categorias").then((res) => res.json()).then((data) => setCategorias(data)).catch(() => setCategorias([]));
  }, []);

  function handleSubmit() {
    if (!nome) { setErro("O nome é obrigatório."); return; }
    if (Number(preco) <= 0) { setErro("O preço deve ser maior que zero."); return; }
    if (Number(estoque) < 0) { setErro("O estoque não pode ser negativo."); return; }
    setErro("");
    setSalvando(true);
    fetch("http://localhost:3001/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco: Number(preco), estoque: Number(estoque), categoriaId: categoriaId ? Number(categoriaId) : null }),
    })
      .then((res) => res.json())
      .then((novo) => {
        setProdutos([...produtos, novo]);
        setNome(""); setPreco(""); setEstoque(""); setCategoriaId("");
        setSucesso("Produto cadastrado com sucesso!");
        setTimeout(() => setSucesso(""), 3000);
      })
      .finally(() => setSalvando(false));
  }

  const inputStyle = {
    padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #333",
    backgroundColor: "#2a2a2a", color: "white", fontSize: "0.95rem", outline: "none",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", color: "#ffffff" }}>Produtos</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>Cadastre e gerencie os produtos do sistema.</p>

      <div style={{ backgroundColor: "#151516", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", maxWidth: "480px" }}>
        <h2 style={{ color: "white", fontSize: "1.1rem", marginBottom: "1rem" }}>Cadastrar Produto</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
          <input placeholder="Preço (ex: 29.90)" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} />
          <input placeholder="Estoque" type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} style={inputStyle} />
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} style={inputStyle}>
            <option value="">Sem categoria</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {erro && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: 0 }}>{erro}</p>}
          {sucesso && <p style={{ color: "#4caf50", fontSize: "0.85rem", margin: 0 }}>{sucesso}</p>}
          <button onClick={handleSubmit} disabled={salvando} style={{ padding: "0.7rem", borderRadius: "8px", border: "none", backgroundColor: salvando ? "#555" : "white", color: salvando ? "#aaa" : "#151516", fontWeight: "bold", cursor: salvando ? "not-allowed" : "pointer", fontSize: "0.95rem" }}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#ffffff" }}>Lista de Produtos</h2>
      {produtos.length === 0 ? (
        <p style={{ color: "#888" }}>Nenhum produto cadastrado ainda.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#151516", color: "white" }}>
                {["ID", "Nome", "Preço", "Estoque", "Categoria"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.map((p, i) => (
                <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.id}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.nome}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>R$ {p.preco}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.estoque}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.categoria?.nome ?? "Sem categoria"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}