import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [PrismaModule, ClientesModule, CategoriasModule, ProdutosModule, PedidosModule, RelatoriosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}