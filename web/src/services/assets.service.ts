import type { IGetAssetPriceResponse } from "../types/asset";
import { HttpService } from "./http.service";

const endpoint = import.meta.env.VITE_ORDERS_URL || "http://localhost:8000";
const http = new HttpService(endpoint);

export function getAssetPrice(id: number): Promise<IGetAssetPriceResponse> {
  return http.get<IGetAssetPriceResponse>(`/assets/${id}/price`);
}
