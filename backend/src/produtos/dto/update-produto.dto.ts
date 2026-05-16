import { IsString, IsNumber, IsPositive, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateProdutoDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsNumber({}, { message: 'Preço deve ser um número' })
  @IsPositive({ message: 'Preço deve ser positivo' })
  @IsOptional()
  preco?: number;

  @IsInt({ message: 'Estoque deve ser um número inteiro' })
  @Min(0, { message: 'Estoque não pode ser negativo' })
  @IsOptional()
  estoque?: number;

  @IsInt()
  @IsOptional()
  categoriaId?: number;
}