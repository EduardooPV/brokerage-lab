import { Injectable } from '@nestjs/common';
import { CoreHttpService } from '../../common/http/http.service';
import {
  IApiCreateOrderReponse,
  IApiCreateOrderRequest,
  IApiGetOrderResponse,
} from './orders.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class OrdersAggregator {
  constructor(
    private readonly http: CoreHttpService,
    private readonly logger: Logger,
  ) {}

  private base = process.env.CORRETORA_API_URL ?? 'http://localhost:5089';

  public async getOrders() {
    try {
      return await this.http.get<IApiGetOrderResponse[]>(`${this.base}/orders`);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error({ err }, '[getOrders]');
      throw error;
    }
  }

  public async createOrder(
    body: IApiCreateOrderRequest,
    idempotencyKey: string,
  ) {
    try {
      return await this.http.post<IApiCreateOrderReponse>(
        `${this.base}/orders`,
        body,
        { 'Idempotency-Key': idempotencyKey },
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error({ err }, '[createOrder]');
      throw error;
    }
  }
}
