type OrderType = "Buy" | "Sell";
type OrderStatus = "Pending" | "Processing" | "Executed" | "Failed";

export interface IGetOrdersResponse {
  id: number;
  quantity: number;
  type: OrderType;
  status: OrderStatus;
  assetName: string;
}

export interface ICreateOrderRequest {
  accountId: number;
  assetId: number;
  quantity: number;
  type: string;
}

export interface ICreateOrderResponse {
  id: number;
  accountId: number;
  assetId: number;
  quantity: number;
  type: string;
}
