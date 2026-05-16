import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  criar(@Body() dto: CreateProdutoDto) {
    return this.produtosService.criar(dto);
  }

  @Get()
  listarTodos() {
    return this.produtosService.listarTodos();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.buscarPorId(id);
  }

  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProdutoDto) {
    return this.produtosService.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.remover(id);
  }
}