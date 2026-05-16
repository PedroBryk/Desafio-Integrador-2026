import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  cidade!: string;

  @IsString()
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  estado!: string;

  @IsString()
  @IsNotEmpty({ message: 'País é obrigatório' })
  pais!: string;
}