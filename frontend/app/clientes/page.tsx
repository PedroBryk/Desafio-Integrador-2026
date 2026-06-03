"use client";

import { useState, useEffect } from "react";

type Cliente = {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  estado: string;
  pais: string;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(() => setClientes([]));
  }, []);

  function handleSubmit() {
    if (!email.includes("@") || !email.includes(".")) {
      setErro("Por favor, insira um e-mail válido.");
      return;
    }
    if (!nome || !cidade || !estado || !pais) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }
    setErro("");
    fetch("http://localhost:3001/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, cidade, estado, pais }),
    })
      .then((res) => res.json())
      .then((novoCliente) => {
        setClientes([...clientes, novoCliente]);
        setNome(""); setEmail(""); setCidade(""); setEstado(""); setPais("");
      });
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", color: "#111" }}>Clientes</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>Cadastre e gerencie os clientes do sistema.</p>

      {/* Formulário */}
      <div style={{
        backgroundColor: "#151516",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "2rem",
        maxWidth: "480px",
      }}>
        <h2 style={{ color: "white", fontSize: "1.1rem", marginBottom: "1rem" }}>Cadastrar Cliente</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { placeholder: "Nome", value: nome, set: setNome },
            { placeholder: "E-mail", value: email, set: setEmail },
            { placeholder: "Cidade", value: cidade, set: setCidade },
            { placeholder: "Estado", value: estado, set: setEstado },
            { placeholder: "País", value: pais, set: setPais },
          ].map((field) => (
            <input
              key={field.placeholder}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              style={{
                padding: "0.6rem 0.8rem",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#2a2a2a",
                color: "white",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          ))}
          {erro && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: 0 }}>{erro}</p>}
          <button
            onClick={handleSubmit}
            style={{
              padding: "0.7rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "white",
              color: "#151516",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Lista */}
      <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#111" }}>Lista de Clientes</h2>
      {clientes.length === 0 ? (
        <p style={{ color: "#888" }}>Nenhum cliente cadastrado ainda.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#151516", color: "white" }}>
                {["ID", "Nome", "E-mail", "Cidade", "Estado", "País"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.id}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.nome}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.email}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.cidade}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.estado}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.pais}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}