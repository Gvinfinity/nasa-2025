import { apiClient } from "./client";

export interface DeltaGroup {
  deltaTemp: number;
  deltaClouds: number;
  deltaOceanDepth: number;
  deltaPhytoplankton: number;
}

export interface ClassifierDataRequest {
  coords: number[][];
  date: string;
  deltas?: DeltaGroup;
  view?: string;
  depth?: number;
}

export interface ModelResponse {
  data: Array<{ longitude: number, latitude: number, count: number }>;
  view?: string;
}

export async function fetchModelData(
  params: ClassifierDataRequest
): Promise<ModelResponse> {
  return apiClient.post<ModelResponse>("/", params);
}
