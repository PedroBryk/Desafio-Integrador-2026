import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateCategoriaDto) {
    const nomeExiste = await this.prisma.categoria.findUnique({
      where: { nome: dto.nome },
    });

    if (nomeExiste) {
      throw new ConflictException('Já existe uma categoria com esse nome');
    }

    return this.prisma.categoria.create({ data: dto });
  }

  async listarTodos() {
    return this.prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { produtos: true },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    return categoria;
  }

  async atualizar(id: number, dto: UpdateCategoriaDto) {
    await this.buscarPorId(id);

    return this.prisma.categoria.update({
      where: { id },
      data: dto,
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
