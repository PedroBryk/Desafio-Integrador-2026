import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreatePedidoDto) {
    // Verifica se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: dto.clienteId },
    });
    if (!cliente) throw new NotFoundException(`Cliente com ID ${dto.clienteId} não encontrado`);

    // Busca todos os produtos e valida estoque
    let total = 0;
    const itensComPreco: { produtoId: number; quantidade: number; precoUnit: any }[] = [];

    for (const item of dto.itens) {
      const produto = await this.prisma.produto.findUnique({
        where: { id: item.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(`Produto com ID ${item.produtoId} não encontrado`);
      }

      if (produto.estoque < item.quantidade) {
        throw new BadRequestException(
          `Produto "${produto.nome}" possui apenas ${produto.estoque} unidades em estoque`
        );
      }

      total += Number(produto.preco) * item.quantidade;
      itensComPreco.push({ ...item, precoUnit: produto.preco });
    }

    // Cria o pedido e atualiza o estoque dos produtos
    const pedido = await this.prisma.$transaction(async (tx) => {
      const novoPedido = await tx.pedido.create({
        data: {
          clienteId: dto.clienteId,
          categoriaId: dto.categoriaId,
          total,
          itens: {
            create: itensComPreco,
          },
        },
        include: {
          cliente: true,
          categoria: true,
          itens: { include: { produto: true } },
        },
      });

      // Atualiza o estoque de cada produto
      for (const item of dto.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { decrement: item.quantidade } },
        });
      }

      return novoPedido;
    });

    return pedido;
  }

  async listarTodos() {
    return this.prisma.pedido.findMany({
      include: {
        cliente: true,
        categoria: true,
        itens: { include: { produto: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async buscarPorId(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        categoria: true,
        itens: { include: { produto: true } },
      },
    });

    if (!pedido) throw new NotFoundException(`Pedido com ID ${id} não encontrado`);

    return pedido;
  }

  async atualizar(id: number, dto: UpdatePedidoDto) {
    await this.buscarPorId(id);

    return this.prisma.pedido.update({
      where: { id },
      data: dto,
      include: {
        cliente: true,
        categoria: true,
        itens: { include: { produto: true } },
      },
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.pedido.delete({
      where: { id },
    });
  }
}