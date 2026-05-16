import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  // Total de vendas e receita geral
  async resumoGeral() {
    const totalPedidos = await this.prisma.pedido.count();
    const totalClientes = await this.prisma.cliente.count();
    const totalProdutos = await this.prisma.produto.count();

    const receita = await this.prisma.pedido.aggregate({
      _sum: { total: true },
    });

    return {
      totalPedidos,
      totalClientes,
      totalProdutos,
      receitaTotal: receita._sum.total ?? 0,
    };
  }

  // Top 5 clientes que mais compraram
  async topClientes() {
    const pedidos = await this.prisma.pedido.groupBy({
      by: ['clienteId'],
      _sum: { total: true },
      _count: { id: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 5,
    });

    const clientesComNome = await Promise.all(
      pedidos.map(async (p) => {
        const cliente = await this.prisma.cliente.findUnique({
          where: { id: p.clienteId },
        });
        return {
          cliente: cliente?.nome,
          email: cliente?.email,
          totalCompras: p._count.id,
          totalGasto: p._sum.total ?? 0,
        };
      }),
    );

    return clientesComNome;
  }

  // Produtos mais vendidos
  async produtosMaisVendidos() {
    const itens = await this.prisma.itemPedido.groupBy({
      by: ['produtoId'],
      _sum: { quantidade: true },
      orderBy: { _sum: { quantidade: 'desc' } },
      take: 5,
    });

    const produtosComNome = await Promise.all(
      itens.map(async (i) => {
        const produto = await this.prisma.produto.findUnique({
          where: { id: i.produtoId },
          include: { categoria: true },
        });
        return {
          produto: produto?.nome,
          categoria: produto?.categoria?.nome ?? 'Sem categoria',
          quantidadeVendida: i._sum.quantidade ?? 0,
        };
      }),
    );

    return produtosComNome;
  }

  // Produto com maior valor em vendas
  async produtoMaiorValor() {
    const itens = await this.prisma.itemPedido.groupBy({
      by: ['produtoId'],
      _sum: { quantidade: true },
    });

    const produtosComValor = await Promise.all(
      itens.map(async (i) => {
        const produto = await this.prisma.produto.findUnique({
          where: { id: i.produtoId },
        });
        const valorTotal = Number(produto?.preco ?? 0) * (i._sum.quantidade ?? 0);
        return {
          produto: produto?.nome,
          preco: produto?.preco,
          quantidadeVendida: i._sum.quantidade ?? 0,
          valorTotalVendido: valorTotal,
        };
      }),
    );

    return produtosComValor.sort((a, b) => b.valorTotalVendido - a.valorTotalVendido).slice(0, 5);
  }

  // Vendas por estado
  async vendasPorEstado() {
    const clientes = await this.prisma.cliente.findMany({
      include: {
        pedidos: true,
      },
    });

    const porEstado: Record<string, { totalPedidos: number; totalReceita: number }> = {};

    for (const cliente of clientes) {
      if (!porEstado[cliente.estado]) {
        porEstado[cliente.estado] = { totalPedidos: 0, totalReceita: 0 };
      }
      porEstado[cliente.estado].totalPedidos += cliente.pedidos.length;
      porEstado[cliente.estado].totalReceita += cliente.pedidos.reduce(
        (acc, p) => acc + Number(p.total),
        0,
      );
    }

    return Object.entries(porEstado).map(([estado, dados]) => ({ estado, ...dados }));
  }

  // Vendas por cidade
  async vendasPorCidade() {
    const clientes = await this.prisma.cliente.findMany({
      include: { pedidos: true },
    });

    const porCidade: Record<string, { totalPedidos: number; totalReceita: number }> = {};

    for (const cliente of clientes) {
      if (!porCidade[cliente.cidade]) {
        porCidade[cliente.cidade] = { totalPedidos: 0, totalReceita: 0 };
      }
      porCidade[cliente.cidade].totalPedidos += cliente.pedidos.length;
      porCidade[cliente.cidade].totalReceita += cliente.pedidos.reduce(
        (acc, p) => acc + Number(p.total),
        0,
      );
    }

    return Object.entries(porCidade).map(([cidade, dados]) => ({ cidade, ...dados }));
  }

  // Vendas por país
  async vendasPorPais() {
    const clientes = await this.prisma.cliente.findMany({
      include: { pedidos: true },
    });

    const porPais: Record<string, { totalPedidos: number; totalReceita: number }> = {};

    for (const cliente of clientes) {
      if (!porPais[cliente.pais]) {
        porPais[cliente.pais] = { totalPedidos: 0, totalReceita: 0 };
      }
      porPais[cliente.pais].totalPedidos += cliente.pedidos.length;
      porPais[cliente.pais].totalReceita += cliente.pedidos.reduce(
        (acc, p) => acc + Number(p.total),
        0,
      );
    }

    return Object.entries(porPais).map(([pais, dados]) => ({ pais, ...dados }));
  }

  // Vendas por categoria
  async vendasPorCategoria() {
    const pedidos = await this.prisma.pedido.groupBy({
      by: ['categoriaId'],
      _sum: { total: true },
      _count: { id: true },
    });

    const comNome = await Promise.all(
      pedidos.map(async (p) => {
        const categoria = p.categoriaId
          ? await this.prisma.categoria.findUnique({ where: { id: p.categoriaId } })
          : null;
        return {
          categoria: categoria?.nome ?? 'Sem categoria',
          totalPedidos: p._count.id,
          totalReceita: p._sum.total ?? 0,
        };
      }),
    );

    return comNome;
  }
}