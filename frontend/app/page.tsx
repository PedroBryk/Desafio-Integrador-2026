import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      padding: "3rem 2rem",
      fontFamily: "sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
    }}>
      <h1 style={{ color: "#000000",fontSize: "2rem", marginBottom: "0.5rem" }}>
       Sistema de Gestão
      </h1>
      <p style={{ color: "#151516", marginBottom: "2.5rem" }}>
        Bem-vindo ao painel de controle. Escolha uma seção para começar.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
      }}>
        <Link href="/clientes" style={cardStyle}>
          <span style={{ fontSize: "2rem" }}>👥</span>
          <strong>Clientes</strong>
          <span style={{ color: "#ffffff", fontSize: "0.85rem" }}>Cadastrar e listar clientes</span>
        </Link>

        <Link href="/categorias" style={cardStyle}>
          <span style={{ fontSize: "2rem" }}>🏷️</span>
          <strong>Categorias</strong>
          <span style={{ color: "#ffffff", fontSize: "0.85rem" }}>Gerenciar categorias</span>
        </Link>

        <Link href="/produtos" style={cardStyle}>
          <span style={{ fontSize: "2rem" }}>📦</span>
          <strong>Produtos</strong>
          <span style={{ color: "#ffffff", fontSize: "0.85rem" }}>Cadastrar e listar produtos</span>
        </Link>

        <Link href="/pedidos" style={cardStyle}>
          <span style={{ fontSize: "2rem" }}>🛒</span>
          <strong>Pedidos</strong>
          <span style={{ color: "#ffffff", fontSize: "0.85rem" }}>Criar e visualizar pedidos</span>
        </Link>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid #2c2c2c",
  textDecoration: "none",
  color: "white",
  backgroundColor: "#151516",
  transition: "background 0.2s",
};