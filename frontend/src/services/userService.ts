import { apiService } from './api';
import { User, ApiResponse } from '../types';

class UserService {
  async getUsers(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
  }): Promise<ApiResponse<User>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const url = `/users/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get<ApiResponse<User>>(url);
  }

  async getUser(id: number): Promise<User> {
    return apiService.get<User>(`/users/${id}/`);
  }

  async getL2Users(): Promise<User[]> {
    const response = await this.getUsers({ role: 'L2' });
    return response.results || [];
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.getUsers({ page_size: 1000 });
    return response.results || [];
  }
}

export const userService = new UserService();