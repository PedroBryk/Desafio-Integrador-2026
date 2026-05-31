import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestão",
  description: "Desafio Integrador 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav style={{
          backgroundColor: "#151516",
          padding: "1rem 2rem",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
        }}>
          <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.1rem" }}>
            Gestão
          </span>
          <Link href="/" style={{ color: "#ffffff", textDecoration: "none" }}>Início</Link>
          <Link href="/clientes" style={{ color: "#ffffff", textDecoration: "none" }}>Clientes</Link>
          <Link href="/categorias" style={{ color: "#ffffff", textDecoration: "none" }}>Categorias</Link>
          <Link href="/produtos" style={{ color: "#ffffff", textDecoration: "none" }}>Produtos</Link>
          <Link href="/pedidos" style={{ color: "#ffffff", textDecoration: "none" }}>Pedidos</Link>
        </nav>
        <main style={{ padding: "1rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
