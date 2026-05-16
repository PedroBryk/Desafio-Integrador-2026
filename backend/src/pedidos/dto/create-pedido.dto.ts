import { IsInt, IsNotEmpty, IsOptional, IsPositive, ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @IsInt()
  @IsPositive({ message: 'ID do produto deve ser positivo' })
  produtoId!: number;

  @IsInt()
  @IsPositive({ message: 'Quantidade deve ser maior que zero' })
  quantidade!: number;
}

export class CreatePedidoDto {
  @IsInt()
  @IsNotEmpty({ message: 'Cliente é obrigatório' })
  clienteId!: number;

  @IsOptional()
  @IsInt()
  categoriaId?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Pedido deve ter pelo menos um produto' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens!: ItemPedidoDto[];
}