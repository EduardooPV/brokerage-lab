import { Injectable } from '@nestjs/common';
import { CoreHttpService } from '../../common/http/http.service';
import {
  IApiCreateOrderReponse,
  IApiCreateOrderRequest,
  IApiGetOrderResponse,
} from './orders.dto';

@Injectable()
export class OrdersAggregator {
  constructor(private readonly http: CoreHttpService) {}

  private base = process.env.CORRETORA_API_URL ?? 'http://localhost:5089';

  public async getOrders() {
    try {
      return await this.http.get<IApiGetOrderResponse[]>(`${this.base}/orders`);
    } catch (error) {
      console.error(error, '[getOrders]');
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
      console.error(error, '[createOrder]');
      throw error;
    }
  }
}
