import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoriaDto {
  @IsString()
  @IsOptional()
  nome?: string;
}