"use client";

import { useState, useEffect } from "react";

// Aqui dizemos ao TypeScript como é um Cliente
type Cliente = {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  estado: string;
  pais: string;
};

export default function ClientesPage() {
  // Lista de clientes que vem do backend
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Dados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");

  // Mensagem de erro de validação
  const [erro, setErro] = useState("");

  // Busca os clientes do backend quando a página abre
  useEffect(() => {
    fetch("http://localhost:3001/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(() => setClientes([]));
  }, []);

  // Valida e envia o formulário
  function handleSubmit() {
    // Validação de e-mail
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
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Clientes</h1>

      {/* Formulário de cadastro */}
      <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
        <h2>Cadastrar Cliente</h2>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        <input placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
        <input placeholder="País" value={pais} onChange={(e) => setPais(e.target.value)} />
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button onClick={handleSubmit}>Salvar</button>
      </div>

      {/* Lista de clientes */}
      <h2>Lista de Clientes</h2>
      {clientes.length === 0 ? (
        <p>Nenhum cliente cadastrado ainda.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Cidade</th><th>Estado</th><th>País</th></tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.nome}</td><td>{c.email}</td>
                <td>{c.cidade}</td><td>{c.estado}</td><td>{c.pais}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}