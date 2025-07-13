import { apiService } from './api';
import { Control, ControlForm, ApiResponse } from '../types';

class ControlService {
  async getControls(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    owner?: number;
    effectiveness?: number;
  }): Promise<ApiResponse<Control>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const url = `/controls/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get<ApiResponse<Control>>(url);
  }

  async getControl(id: number): Promise<Control> {
    return apiService.get<Control>(`/controls/${id}/`);
  }

  async createControl(controlData: ControlForm): Promise<Control> {
    return apiService.post<Control>('/controls/', controlData);
  }

  async updateControl(id: number, controlData: Partial<ControlForm>): Promise<Control> {
    return apiService.patch<Control>(`/controls/${id}/`, controlData);
  }

  async deleteControl(id: number): Promise<void> {
    return apiService.delete<void>(`/controls/${id}/`);
  }

  async getMyControls(): Promise<Control[]> {
    return apiService.get<Control[]>('/controls/my-controls/');
  }
}

export const controlService = new ControlService();