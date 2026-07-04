type OrderType = 'Buy' | 'Sell';
type OrderStatus = 'Pending' | 'Processing' | 'Executed' | 'Failed';

export interface IApiGetOrderResponse {
  id: number;
  quantity: number;
  type: OrderType;
  status: OrderStatus;
  assetName: string;
}

export interface IApiCreateOrderRequest {
  accountId: number;
  assetId: number;
  quantity: number;
  type: string;
}

export interface IApiCreateOrderReponse {
  accountId: number;
  id: number;
  assetId: number;
  quantity: number;
  type: OrderType;
}
