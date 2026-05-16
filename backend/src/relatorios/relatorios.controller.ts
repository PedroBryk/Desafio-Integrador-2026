import { Controller, Get } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('resumo-geral')
  resumoGeral() {
    return this.relatoriosService.resumoGeral();
  }

  @Get('top-clientes')
  topClientes() {
    return this.relatoriosService.topClientes();
  }

  @Get('produtos-mais-vendidos')
  produtosMaisVendidos() {
    return this.relatoriosService.produtosMaisVendidos();
  }

  @Get('produto-maior-valor')
  produtoMaiorValor() {
    return this.relatoriosService.produtoMaiorValor();
  }

  @Get('vendas-por-estado')
  vendasPorEstado() {
    return this.relatoriosService.vendasPorEstado();
  }

  @Get('vendas-por-cidade')
  vendasPorCidade() {
    return this.relatoriosService.vendasPorCidade();
  }

  @Get('vendas-por-pais')
  vendasPorPais() {
    return this.relatoriosService.vendasPorPais();
  }

  @Get('vendas-por-categoria')
  vendasPorCategoria() {
    return this.relatoriosService.vendasPorCategoria();
  }
}