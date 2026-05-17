import { Controller, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MlService } from './ml.service';

@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Get('analisar/:id')
  analisarCliente(@Param('id', ParseIntPipe) id: number) {
    return this.mlService.analisarCliente(id);
  }

  @Get('analisar-todos')
  analisarTodosClientes() {
    return this.mlService.analisarTodosClientes();
  }
}