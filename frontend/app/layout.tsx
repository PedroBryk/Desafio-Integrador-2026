"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav style={{
          backgroundColor: "#151516",
          padding: "1rem 2rem",
          borderBottom: "1px solid #2c2c2c",
          position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.1rem" }}>Gestão</span>

            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }} className="nav-links">
              <Link href="/"           style={{ color: "#ffffff", textDecoration: "none" }}>Início</Link>
              <Link href="/clientes"   style={{ color: "#ffffff", textDecoration: "none" }}>Clientes</Link>
              <Link href="/categorias" style={{ color: "#ffffff", textDecoration: "none" }}>Categorias</Link>
              <Link href="/produtos"   style={{ color: "#ffffff", textDecoration: "none" }}>Produtos</Link>
              <Link href="/pedidos"    style={{ color: "#ffffff", textDecoration: "none" }}>Pedidos</Link>
              <span style={{ color: "#3f3f46" }}>|</span>
              <Link href="/graficos"   style={{ color: "#818cf8", textDecoration: "none" }}>📊 Gráficos</Link>
              <Link href="/churn"      style={{ color: "#818cf8", textDecoration: "none" }}>🧠 Churn</Link>
              <Link href="/exportacao" style={{ color: "#818cf8", textDecoration: "none" }}>📤 Exportar</Link>
            </div>

            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="hamburger"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #3f3f46",
                borderRadius: "6px",
                padding: "0.4rem 0.6rem",
                cursor: "pointer",
                display: "none",
                flexDirection: "column",
                gap: "5px",
              }}
              aria-label="Menu"
            >
              <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: menuAberto ? "#818cf8" : "#ffffff", borderRadius: "2px", transition: "0.3s", transform: menuAberto ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: menuAberto ? "#818cf8" : "#ffffff", borderRadius: "2px", transition: "0.3s", opacity: menuAberto ? 0 : 1 }} />
              <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: menuAberto ? "#818cf8" : "#ffffff", borderRadius: "2px", transition: "0.3s", transform: menuAberto ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>

          {menuAberto && (
            <div className="mobile-menu" style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              paddingTop: "1rem",
              marginTop: "1rem",
              borderTop: "1px solid #2c2c2c",
            }}>
              <Link href="/"           onClick={() => setMenuAberto(false)} style={{ color: "#ffffff", textDecoration: "none" }}>Início</Link>
              <Link href="/clientes"   onClick={() => setMenuAberto(false)} style={{ color: "#ffffff", textDecoration: "none" }}>Clientes</Link>
              <Link href="/categorias" onClick={() => setMenuAberto(false)} style={{ color: "#ffffff", textDecoration: "none" }}>Categorias</Link>
              <Link href="/produtos"   onClick={() => setMenuAberto(false)} style={{ color: "#ffffff", textDecoration: "none" }}>Produtos</Link>
              <Link href="/pedidos"    onClick={() => setMenuAberto(false)} style={{ color: "#ffffff", textDecoration: "none" }}>Pedidos</Link>
              <hr style={{ border: "none", borderTop: "1px solid #2c2c2c" }} />
              <Link href="/graficos"   onClick={() => setMenuAberto(false)} style={{ color: "#818cf8", textDecoration: "none" }}>📊 Gráficos</Link>
              <Link href="/churn"      onClick={() => setMenuAberto(false)} style={{ color: "#818cf8", textDecoration: "none" }}>🧠 Churn</Link>
              <Link href="/exportacao" onClick={() => setMenuAberto(false)} style={{ color: "#818cf8", textDecoration: "none" }}>📤 Exportar</Link>
            </div>
          )}
        </nav>

        <style>{`
          @media (max-width: 768px) {
            .nav-links { display: none !important; }
            .hamburger { display: flex !important; }
          }
        `}</style>

        <main style={{ padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}
