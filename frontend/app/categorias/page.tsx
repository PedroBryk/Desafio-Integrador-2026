"use client";

import { useState, useEffect } from "react";

type Categoria = { id: number; nome: string; };

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  function handleSubmit() {
    if (!nome) { setErro("O nome da categoria é obrigatório."); return; }
    setErro("");
    setSalvando(true);
    fetch("http://localhost:3001/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    })
      .then((res) => res.json())
      .then((nova) => {
        setCategorias([...categorias, nova]);
        setNome("");
        setSucesso("Categoria cadastrada com sucesso!");
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
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", color: "#ffffff" }}>Categorias</h1>
      <p style={{ color: "#aaaaaa", marginBottom: "2rem" }}>Cadastre e gerencie as categorias dos produtos.</p>

      <div style={{ backgroundColor: "#151516", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", maxWidth: "480px" }}>
        <h2 style={{ color: "white", fontSize: "1.1rem", marginBottom: "1rem" }}>Cadastrar Categoria</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input placeholder="Nome da categoria" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
          {erro && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: 0 }}>{erro}</p>}
          {sucesso && <p style={{ color: "#4caf50", fontSize: "0.85rem", margin: 0 }}>{sucesso}</p>}
          <button onClick={handleSubmit} disabled={salvando} style={{ padding: "0.7rem", borderRadius: "8px", border: "none", backgroundColor: salvando ? "#555" : "white", color: salvando ? "#aaa" : "#151516", fontWeight: "bold", cursor: salvando ? "not-allowed" : "pointer", fontSize: "0.95rem" }}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#ffffff" }}>Lista de Categorias</h2>
      {categorias.length === 0 ? (
        <p style={{ color: "#888" }}>Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#151516", color: "white" }}>
                {["ID", "Nome"].map((h) => <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {categorias.map((c, i) => (
                <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "#1e1e1e" : "#2a2a2a" }}>
                  <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{c.id}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#ffffff" }}>{c.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}