import type {
  ICreateOrderRequest,
  ICreateOrderResponse,
  IGetOrdersResponse,
} from "../types/order";
import { HttpService } from "./http.service";

const endpoint = import.meta.env.VITE_ORDERS_URL || "http://localhost:8000";
const http = new HttpService(endpoint);

export function getOrders(): Promise<IGetOrdersResponse[]> {
  return http.get<IGetOrdersResponse[]>("/orders");
}

export function createOrder(
  body: ICreateOrderRequest,
  idempotencyKey: string,
): Promise<ICreateOrderResponse> {
  return http.post<ICreateOrderResponse>("/orders", body, {
    "Idempotency-Key": idempotencyKey,
  });
}
