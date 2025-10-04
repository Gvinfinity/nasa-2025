import { apiClient } from "./client";

export interface ResearchDataRequest {
    year: number;
    month: number;
    depth: number;
    view?: string;
}

export interface ResearchDataResponse {
    data: Array<[longitude: number, latitude: number, count: number]>;
}

export async function fetchResearchData(params: ResearchDataRequest): Promise<ResearchDataResponse> {
    return apiClient.post<ResearchDataResponse>("/researchdata", params);
}