import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  pais?: string;
}