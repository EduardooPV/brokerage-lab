import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));

  const port = Number(process.env.PORT) || 3000;
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  app.use((req: Request, res: Response, next: NextFunction) =>
    new CorrelationIdMiddleware().use(req, res, next),
  );

  await app.listen(port);
  console.log(`Aplicação rodando em http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
