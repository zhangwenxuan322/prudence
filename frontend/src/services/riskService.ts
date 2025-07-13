import { apiService } from './api';
import { Risk, RiskForm, ApiResponse, RiskAssessment } from '../types';

class RiskService {
  async getRisks(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    owner?: number;
    assessor?: number;
    risk_type?: number;
  }): Promise<ApiResponse<Risk>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const url = `/risks/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get<ApiResponse<Risk>>(url);
  }

  async getRisk(id: number): Promise<Risk> {
    return apiService.get<Risk>(`/risks/${id}/`);
  }

  async createRisk(riskData: RiskForm): Promise<Risk> {
    return apiService.post<Risk>('/risks/', riskData);
  }

  async updateRisk(id: number, riskData: Partial<RiskForm>): Promise<Risk> {
    return apiService.patch<Risk>(`/risks/${id}/`, riskData);
  }

  async deleteRisk(id: number): Promise<void> {
    return apiService.delete<void>(`/risks/${id}/`);
  }

  async getMyRisks(): Promise<Risk[]> {
    return apiService.get<Risk[]>('/risks/my-risks/');
  }

  async getRiskAssessments(params?: {
    page?: number;
    page_size?: number;
    status?: string;
    assessor?: number;
  }): Promise<ApiResponse<RiskAssessment>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const url = `/risk-assessments/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get<ApiResponse<RiskAssessment>>(url);
  }

  async assessRisk(assessmentId: number, data: {
    status: 'Accepted' | 'Rejected';
    assessor_comments?: string;
  }): Promise<RiskAssessment> {
    return apiService.patch<RiskAssessment>(`/risk-assessments/${assessmentId}/`, data);
  }

  async getRiskMatrix(): Promise<{
    inherent: Array<{ x: number; y: number; risk: Risk }>;
    residual: Array<{ x: number; y: number; risk: Risk }>;
  }> {
    return apiService.get('/risks/matrix/');
  }

  async getDashboardStats(): Promise<{
    total_risks: number;
    high_risks: number;
    pending_assessments: number;
    my_risks: number;
    my_controls: number;
  }> {
    return apiService.get('/dashboard/stats/');
  }
}

export const riskService = new RiskService();