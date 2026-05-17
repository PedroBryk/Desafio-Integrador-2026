import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MlService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  private calcularDiasEntre(data: Date): number {
    const hoje = new Date();
    const diff = hoje.getTime() - new Date(data).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private mapearClienteParaML(cliente: any) {
    const pedidos = cliente.pedidos ?? [];
    const totalPedidos = pedidos.length;

    // Ordena pedidos por data
    const pedidosOrdenados = [...pedidos].sort(
      (a: any, b: any) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
    );

    // Tenure: dias desde o primeiro pedido
    const tenure = pedidosOrdenados.length > 0
      ? this.calcularDiasEntre(pedidosOrdenados[0].criadoEm)
      : 0;

    // DaySinceLastOrder: dias desde o último pedido
    const daySinceLastOrder = pedidosOrdenados.length > 0
      ? this.calcularDiasEntre(pedidosOrdenados[pedidosOrdenados.length - 1].criadoEm)
      : 0;

    // CashbackAmount: valor médio dos pedidos
    const cashbackAmount = totalPedidos > 0
      ? pedidos.reduce((acc: number, p: any) => acc + Number(p.total), 0) / totalPedidos
      : 0;

    // Complain: se tem algum pedido cancelado
    const complain = pedidos.some((p: any) => p.status === 'cancelado') ? 1 : 0;

    return {
      Tenure: tenure,
      OrderCount: totalPedidos,
      DaySinceLastOrder: daySinceLastOrder,
      CashbackAmount: cashbackAmount,
      Complain: complain,
    };
  }

  async analisarCliente(clienteId: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId },
      include: { pedidos: true },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${clienteId} não encontrado`);
    }

    const dadosML = this.mapearClienteParaML(cliente);

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/predict', dadosML),
      );
      return {
        clienteId: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        cidade: cliente.cidade,
        estado: cliente.estado,
        totalPedidos: cliente.pedidos.length,
        dadosUtilizados: dadosML,
        ...response.data,
      };
    } catch {
      throw new HttpException(
        'Erro ao conectar com o serviço de ML. Verifique se ele está rodando.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async analisarTodosClientes() {
    const clientes = await this.prisma.cliente.findMany({
      include: { pedidos: true },
    });

    const resultados = await Promise.all(
      clientes.map(async (cliente) => {
        const dadosML = this.mapearClienteParaML(cliente);
        try {
          const response = await firstValueFrom(
            this.httpService.post('http://localhost:8000/predict', dadosML),
          );
          return {
            clienteId: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            cidade: cliente.cidade,
            estado: cliente.estado,
            totalPedidos: cliente.pedidos.length,
            ...response.data,
          };
        } catch {
          return {
            clienteId: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            erro: 'Não foi possível analisar este cliente',
          };
        }
      }),
    );

    return resultados;
  }
}