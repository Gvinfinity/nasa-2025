import { apiClient } from "./client";

export interface ModelRequest {
  date: string;
  depth: number;
  view?: string;
  coords?: number[][];
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
