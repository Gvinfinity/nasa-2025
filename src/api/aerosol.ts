import { apiClient } from "./client";

export interface AerosolRequest {
    year: number;
    month: number;
    depth: number;
}

export interface AerosolResponse {
    data: Array<[longitude: number, latitude: number, count: number]>;
}

export async function fetchAerosolData(params: AerosolRequest): Promise<AerosolResponse> {
    return apiClient.post<AerosolResponse>("/aerosol", params);
}