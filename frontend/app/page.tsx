"use client";

import Link from "next/link";
import { Users, Tag, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";

const cards = [
  { href: "/clientes", icon: Users, label: "Clientes", desc: "Cadastrar e listar clientes" },
  { href: "/categorias", icon: Tag, label: "Categorias", desc: "Gerenciar categorias" },
  { href: "/produtos", icon: Package, label: "Produtos", desc: "Cadastrar e listar produtos" },
  { href: "/pedidos", icon: ShoppingCart, label: "Pedidos", desc: "Criar e visualizar pedidos" },
];

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ padding: "3rem 2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#ffffff", fontSize: "2rem", marginBottom: "0.5rem" }}>
  Sistema de Gestão
</h1>
      <p style={{ color: "#aaaaaa", marginBottom: "2.5rem" }}>
  Bem-vindo ao painel de controle. Escolha uma seção para começar.
</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {cards.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            onMouseEnter={() => setHovered(href)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #2c2c2c",
              textDecoration: "none",
              color: "white",
              backgroundColor: hovered === href ? "#2a2a2a" : "#151516",
              transform: hovered === href ? "translateY(-3px)" : "translateY(0)",
              transition: "background 0.2s, transform 0.2s",
            }}
          >
            <Icon size={32} color="white" />
            <strong>{label}</strong>
            <span style={{ color: "#aaa", fontSize: "0.85rem" }}>{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}