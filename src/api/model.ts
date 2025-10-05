import { apiClient } from "./client";

export interface ModelRequest {
    year: number;
    month: number;
    depth: number;
    view?: string;
}

export interface ModelResponse {
    data: Array<[longitude: number, latitude: number, count: number, view?: string]>;
}

export async function fetchModelData(params: ModelRequest): Promise<ModelResponse> {
    return apiClient.post<ModelResponse>("/model", params);
}