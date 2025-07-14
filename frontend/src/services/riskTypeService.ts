import { apiService } from './api';
import { RiskType, ApiResponse } from '../types';

class RiskTypeService {
  async getRiskTypes(): Promise<RiskType[]> {
    const response = await apiService.get<ApiResponse<RiskType>>('/risk-types/');
    return response.results || [];
  }

  async getRiskType(id: number): Promise<RiskType> {
    return apiService.get<RiskType>(`/risk-types/${id}/`);
  }
}

export const riskTypeService = new RiskTypeService();