// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'L1' | 'L2' | 'L3';
  is_active: boolean;
  date_joined: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Risk Types
export interface Risk {
  id: number;
  description: string;
  inherent_probability: number;
  inherent_impact: number;
  inherent_rating: number;
  residual_probability: number;
  residual_impact: number;
  residual_rating: number;
  owner: User;
  assessor?: User;
  controls: Control[];
  risk_type?: RiskType;
  last_assessed?: string;
  created_at: string;
  updated_at: string;
}

export interface RiskType {
  id: number;
  name: string;
  description?: string;
}

// Control Types
export interface Control {
  id: number;
  name: string;
  description: string;
  effectiveness: number; // 0.0, 0.5, 1.0
  owner: User;
  clastassessed?: string;
  created_at: string;
  updated_at: string;
}

// Risk Assessment Types
export interface RiskAssessment {
  id: number;
  risk: Risk;
  assessor: User;
  status: 'Pending' | 'Accepted' | 'Rejected';
  assessor_comments?: string;
  assessed_date?: string;
  created_at: string;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
  role: 'L1' | 'L2' | 'L3';
}

export interface RiskForm {
  description: string;
  inherent_probability: number;
  inherent_impact: number;
  residual_probability: number;
  residual_impact: number;
  owner: number;
  assessor?: number;
  controls: number[];
  risk_type?: number;
}

export interface ControlForm {
  name: string;
  description: string;
  effectiveness: number;
  owner: number;
}

// API Response Types
export interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ApiError {
  message: string;
  details?: Record<string, string[]>;
}

// Dashboard Types
export interface DashboardStats {
  total_risks: number;
  high_risks: number;
  pending_assessments: number;
  my_risks: number;
  my_controls: number;
}

// Chart Data Types
export interface RiskMatrixData {
  x: number; // probability
  y: number; // impact
  risk: Risk;
  type: 'inherent' | 'residual';
}

// Component Props Types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Utility Types
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'L1' | 'L2' | 'L3';
export type AssessmentStatus = 'Pending' | 'Accepted' | 'Rejected';
export type ControlEffectiveness = 0.0 | 0.5 | 1.0;