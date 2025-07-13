import { apiService } from './api';
import { User, RegisterForm } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  message: string;
}

class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/login/', { username, password });
  }

  async register(userData: RegisterForm): Promise<RegisterResponse> {
    return apiService.post<RegisterResponse>('/auth/register/', userData);
  }

  async logout(): Promise<void> {
    return apiService.post<void>('/auth/logout/');
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/user/');
  }

  async refreshToken(): Promise<{ token: string }> {
    return apiService.post<{ token: string }>('/auth/refresh/');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return apiService.post<void>('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    return apiService.post<void>('/auth/password-reset/', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    return apiService.post<void>('/auth/password-reset/confirm/', {
      token,
      password,
    });
  }
}

export const authService = new AuthService();