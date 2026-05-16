import { IsNotEmpty, IsString, IsNumber, IsPositive, IsInt, Min, IsOptional } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @IsNumber({}, { message: 'Preço deve ser um número' })
  @IsPositive({ message: 'Preço deve ser positivo' })
  preco!: number;

  @IsInt({ message: 'Estoque deve ser um número inteiro' })
  @Min(0, { message: 'Estoque não pode ser negativo' })
  estoque!: number;

  @IsOptional()
  @IsInt()
  categoriaId?: number;
}