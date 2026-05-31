"use client";

import { useState, useEffect } from "react";

type Categoria = {
  id: number;
  nome: string;
};

type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria?: Categoria;
};

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch(() => setProdutos([]));

    fetch("http://localhost:3001/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  function handleSubmit() {
    if (!nome) {
      setErro("O nome é obrigatório.");
      return;
    }
    if (Number(preco) <= 0) {
      setErro("O preço deve ser maior que zero.");
      return;
    }
    if (Number(estoque) < 0) {
      setErro("O estoque não pode ser negativo.");
      return;
    }
    setErro("");

    fetch("http://localhost:3001/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        preco: Number(preco),
        estoque: Number(estoque),
        categoriaId: categoriaId ? Number(categoriaId) : null,
      }),
    })
      .then((res) => res.json())
      .then((novoProduto) => {
        setProdutos([...produtos, novoProduto]);
        setNome(""); setPreco(""); setEstoque(""); setCategoriaId("");
      });
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Produtos</h1>

      <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
        <h2>Cadastrar Produto</h2>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Preço (ex: 29.90)" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
        <input placeholder="Estoque" type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} />
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">Sem categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button onClick={handleSubmit}>Salvar</button>
      </div>

      <h2>Lista de Produtos</h2>
      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Categoria</th></tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.nome}</td>
                <td>R$ {p.preco}</td><td>{p.estoque}</td>
                <td>{p.categoria?.nome ?? "Sem categoria"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}