import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: dto,
      include: { categoria: true },
    });
  }

  async listarTodos() {
    return this.prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { categoria: true },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async atualizar(id: number, dto: UpdateProdutoDto) {
    await this.buscarPorId(id);

    return this.prisma.produto.update({
      where: { id },
      data: dto,
      include: { categoria: true },
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.produto.delete({
      where: { id },
    });
  }
}