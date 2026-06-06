"use client";

import { useRef, useState } from "react";

type Relatorio = {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  apiPath: string;
};

const RELATORIOS: Relatorio[] = [
  { id: "vendas",    titulo: "Resumo de Vendas",          descricao: "Evolução mensal de receita e volume de pedidos.",        icone: "📈", apiPath: "/dashboard/resumo-vendas" },
  { id: "clientes",  titulo: "Top Clientes",              descricao: "Ranking dos clientes por valor total gasto.",            icone: "🏆", apiPath: "/dashboard/top-clientes" },
  { id: "produtos",  titulo: "Produtos Mais Vendidos",    descricao: "Produtos com maior volume de unidades vendidas.",        icone: "📦", apiPath: "/dashboard/top-produtos" },
  { id: "churn",     titulo: "Análise de Churn",          descricao: "Scoring de risco de cancelamento por cliente.",         icone: "🧠", apiPath: "/churn/scoring" },
  { id: "geo",       titulo: "Distribuição Geográfica",   descricao: "Clientes por estado, cidade e país.",                   icone: "🌍", apiPath: "/dashboard/distribuicao" },
];

async function exportarComoImagem(elemento: HTMLElement, nomeArquivo: string) {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(elemento, { backgroundColor: "#0a0a0b", scale: 2 });
  const link = document.createElement("a");
  link.download = `${nomeArquivo}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function exportarComoPDF(elemento: HTMLElement, nomeArquivo: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF }   = await import("jspdf");
  const canvas  = await html2canvas(elemento, { backgroundColor: "#0a0a0b", scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf     = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
  const width   = pdf.internal.pageSize.getWidth();
  const height  = (canvas.height * width) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save(`${nomeArquivo}.pdf`);
}

function btnStyle(bg: string): React.CSSProperties {
  return { backgroundColor: bg, color: "#ffffff", border: "none", borderRadius: "8px", padding: "0.5rem 1.1rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500 };
}

function RelatorioCard({ rel }: { rel: Relatorio }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [status, setStatus]         = useState<"idle" | "loading" | "ok">("idle");
  const [dados, setDados]           = useState<any[] | null>(null);
  const [exportando, setExportando] = useState(false);

  async function carregar() {
    setStatus("loading");
    try {
      const res  = await fetch(`http://localhost:3001${rel.apiPath}`);
      const json = await res.json();
      setDados(Array.isArray(json) ? json : [json]);
    } catch {
      setDados([{ info: "Dados de demonstração — API offline" }]);
    }
    setStatus("ok");
  }

  async function handleExportar(formato: "png" | "pdf") {
    if (!previewRef.current) return;
    setExportando(true);
    try {
      if (formato === "png") await exportarComoImagem(previewRef.current, rel.id);
      else                    await exportarComoPDF(previewRef.current, rel.id);
    } finally {
      setExportando(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#151516", border: "1px solid #2c2c2c", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <span style={{ fontSize: "2rem" }}>{rel.icone}</span>
        <div>
          <h3 style={{ color: "#ffffff", fontWeight: 600, marginBottom: "0.2rem" }}>{rel.titulo}</h3>
          <p style={{ color: "#71717a", fontSize: "0.85rem" }}>{rel.descricao}</p>
        </div>
      </div>

      {status === "idle"    && <button onClick={carregar} style={btnStyle("#6366f1")}>🔍 Carregar Prévia</button>}
      {status === "loading" && <p style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>Carregando...</p>}

      {status === "ok" && dados && (
        <>
          <div ref={previewRef} style={{ backgroundColor: "#0f0f10", border: "1px solid #2c2c2c", borderRadius: "8px", padding: "1rem", overflowX: "auto" }}>
            <div style={{ marginBottom: "0.75rem", borderBottom: "1px solid #2c2c2c", paddingBottom: "0.5rem" }}>
              <p style={{ color: "#6366f1", fontWeight: 700, fontSize: "1rem" }}>{rel.icone} {rel.titulo}</p>
              <p style={{ color: "#3f3f46", fontSize: "0.75rem" }}>Gerado em {new Date().toLocaleString("pt-BR")} — Sistema de Gestão</p>
            </div>
            {dados.length > 0 && typeof dados[0] === "object" ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr>{Object.keys(dados[0]).map((k) => <th key={k} style={{ padding: "0.4rem 0.75rem", textAlign: "left", color: "#71717a", borderBottom: "1px solid #2c2c2c" }}>{k}</th>)}</tr>
                </thead>
                <tbody>
                  {dados.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1e1e1f" }}>
                      {Object.values(row).map((val: any, j) => <td key={j} style={{ padding: "0.4rem 0.75rem", color: "#d4d4d8" }}>{String(val)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: "#a1a1aa" }}>{JSON.stringify(dados)}</p>}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => handleExportar("png")} disabled={exportando} style={btnStyle("#0e7490")}>🖼️ Exportar PNG</button>
            <button onClick={() => handleExportar("pdf")} disabled={exportando} style={btnStyle("#7c3aed")}>📄 Exportar PDF</button>
          </div>
          {exportando && <p style={{ color: "#a1a1aa", fontSize: "0.8rem" }}>Gerando arquivo...</p>}
        </>
      )}
    </div>
  );
}

export default function ExportacaoPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ color: "#ffffff", fontSize: "1.75rem", marginBottom: "0.4rem" }}>📤 Exportação de Relatórios</h1>
      <p style={{ color: "#71717a", marginBottom: "2rem" }}>Gere e baixe relatórios gerenciais em PNG ou PDF com um clique.</p>
      <div style={{ backgroundColor: "#1c1c0e", border: "1px solid #3d3d00", borderRadius: "8px", padding: "0.75rem 1rem", color: "#fbbf24", fontSize: "0.82rem", marginBottom: "2rem" }}>
        ⚠️ Para exportação funcionar, instale: <code style={{ backgroundColor: "#2c2c00", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>npm install html2canvas jspdf</code>
      </div>
      <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))" }}>
        {RELATORIOS.map((r) => <RelatorioCard key={r.id} rel={r} />)}
      </div>
    </div>
  );
}