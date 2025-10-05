import { apiClient } from "./client";

export interface ModelRequest {
  // ISO date string accepted by Python datetime (YYYY-MM-DD)
  date: string;
  depth: number;
  view?: string;
  coords?: Array<[number, number]>;
}

export interface ModelResponse {
  data: Array<[longitude: number, latitude: number, count: number]>;
  view?: string;
}

export async function fetchModelData(
  params: ModelRequest
): Promise<ModelResponse> {
  return apiClient.post<ModelResponse>("/model", params);
}
