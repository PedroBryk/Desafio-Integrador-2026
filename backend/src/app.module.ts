import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [PrismaModule, ClientesModule, CategoriasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}