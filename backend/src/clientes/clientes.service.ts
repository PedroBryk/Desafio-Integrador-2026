import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateClienteDto) {
    const emailExiste = await this.prisma.cliente.findUnique({
      where: { email: dto.email },
    });

    if (emailExiste) {
      throw new ConflictException('Já existe um cliente com esse e-mail');
    }

    return this.prisma.cliente.create({ data: dto });
  }

  async listarTodos() {
    return this.prisma.cliente.findMany({
      orderBy: { criadoEm: 'desc' },
    });
  }

  async buscarPorId(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { pedidos: true },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return cliente;
  }

  async atualizar(id: number, dto: UpdateClienteDto) {
    await this.buscarPorId(id);

    return this.prisma.cliente.update({
      where: { id },
      data: dto,
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.cliente.delete({
      where: { id },
    });
  }
}