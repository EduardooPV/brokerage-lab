type OrderType = 'Buy' | 'Sell';
type OrderStatus = 'Pending' | 'Processing' | 'Executed' | 'Failed';

export interface IOrderResponse {
  id: number;
  quantity: number;
  type: OrderType;
  status: OrderStatus;
  assetName: string;
}

export interface ICreateOrderReponse {
  accountId: number;
  id: number;
  assetId: number;
  quantity: number;
  type: OrderType;
}

export interface ICreateOrderRequest {
  accountId: number;
  assetId: number;
  quantity: number;
  type: OrderType;
}
