import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersModule } from './presentation/orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { AssetsModule } from './presentation/assets/assets.module';
import { LoggerModule } from 'nestjs-pino';
import { CorrelationContext } from './common/context/correlation.context';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        mixin() {
          return { correlationId: CorrelationContext.get() };
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    OrdersModule,
    AssetsModule,
  ],
})
export class AppModule {}
