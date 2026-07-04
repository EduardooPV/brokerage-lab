import { Injectable } from '@nestjs/common';
import { OrdersAggregator } from '../../aggregators/orders/orders.service';
import {
  ICreateOrderReponse,
  ICreateOrderRequest,
  IOrderResponse,
} from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersAggregators: OrdersAggregator) {}

  public async getOrders(): Promise<IOrderResponse[] | null> {
    return await this.ordersAggregators.getOrders();
  }

  public async createOrder(
    body: ICreateOrderRequest,
    idempotencyKey: string,
  ): Promise<ICreateOrderReponse> {
    return await this.ordersAggregators.createOrder(body, idempotencyKey);
  }
}
