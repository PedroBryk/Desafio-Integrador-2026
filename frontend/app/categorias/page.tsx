"use client";

import { useState, useEffect } from "react";

type Categoria = {
  id: number;
  nome: string;
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  function handleSubmit() {
    if (!nome) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }
    setErro("");

    fetch("http://localhost:3001/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    })
      .then((res) => res.json())
      .then((novaCategoria) => {
        setCategorias([...categorias, novaCategoria]);
        setNome("");
      });
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Categorias</h1>

      <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
        <h2>Cadastrar Categoria</h2>
        <input placeholder="Nome da categoria" value={nome} onChange={(e) => setNome(e.target.value)} />
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button onClick={handleSubmit}>Salvar</button>
      </div>

      <h2>Lista de Categorias</h2>
      {categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr><th>ID</th><th>Nome</th></tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}