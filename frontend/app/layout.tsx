import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Gestão",
  description: "Desafio Integrador 2026",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav style={{
          backgroundColor: "#151516",
          padding: "1rem 2rem",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <span style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem", marginRight: "1rem" }}>
            Gestão
          </span>
          {[
            { href: "/", label: "Início" },
            { href: "/clientes", label: "Clientes" },
            { href: "/categorias", label: "Categorias" },
            { href: "/produtos", label: "Produtos" },
            { href: "/pedidos", label: "Pedidos" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/decisao", label: "Decisão Estratégica" },
          ].map((item, index, arr) => (
            <span key={item.href} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <Link href={item.href} style={{ color: "#aaaaaa", textDecoration: "none", fontSize: "0.95rem" }}>
                {item.label}
              </Link>
              {index < arr.length - 1 && (
                <span style={{ color: "#444", fontSize: "0.8rem" }}>|</span>
              )}
            </span>
          ))}
        </nav>

        <main style={{ padding: "1rem" }}>
          {children}
        </main>

        <footer style={{
          borderTop: "1px solid #222222",
          padding: "1.5rem 2rem",
          textAlign: "center",
          color: "#444444",
          fontSize: "0.8rem",
          marginTop: "8rem",
        }}>
          Sistema de Gestão © 2026
        </footer>
      </body>
    </html>
  ); 
}