import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersModule } from './presentation/orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { AssetsModule } from './presentation/assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    OrdersModule,
    AssetsModule,
  ],
})
export class AppModule {}
