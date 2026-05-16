import { IsOptional, IsString } from 'class-validator';

export class UpdatePedidoDto {
  @IsString()
  @IsOptional()
  status?: string;
}