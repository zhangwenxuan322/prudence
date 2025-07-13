import { RiskLevel } from '../types';

export const calculateRiskRating = (probability: number, impact: number): number => {
  return probability * impact;
};

export const getRiskLevel = (rating: number): RiskLevel => {
  if (rating >= 20) return 'critical';
  if (rating >= 15) return 'high';
  if (rating >= 10) return 'medium';
  return 'low';
};

export const getRiskLevelColor = (level: RiskLevel): string => {
  const colors = {
    low: '#22c55e',      // green
    medium: '#f59e0b',   // yellow
    high: '#f97316',     // orange
    critical: '#ef4444', // red
  };
  return colors[level];
};

export const getRiskLevelText = (rating: number): string => {
  const level = getRiskLevel(rating);
  const texts = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk',
  };
  return texts[level];
};

export const getControlEffectivenessText = (effectiveness: number): string => {
  if (effectiveness === 0.0) return 'Not Effective';
  if (effectiveness === 0.5) return 'Partially Effective';
  if (effectiveness === 1.0) return 'Fully Effective';
  return 'Unknown';
};

export const getControlEffectivenessColor = (effectiveness: number): string => {
  if (effectiveness === 0.0) return '#ef4444'; // red
  if (effectiveness === 0.5) return '#f59e0b'; // yellow
  if (effectiveness === 1.0) return '#22c55e'; // green
  return '#6b7280'; // gray
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRolePermissions = (role: string) => {
  const permissions = {
    L1: {
      canAddRisk: true,
      canEditRisk: false, // only own risks
      canDeleteRisk: false,
      canAssessRisk: false,
      canAddControl: false,
      canEditControl: false,
      canDeleteControl: false,
      canViewAll: false,
    },
    L2: {
      canAddRisk: true,
      canEditRisk: true,
      canDeleteRisk: true,
      canAssessRisk: true,
      canAddControl: true,
      canEditControl: true,
      canDeleteControl: true,
      canViewAll: true,
    },
    L3: {
      canAddRisk: false,
      canEditRisk: false,
      canDeleteRisk: false,
      canAssessRisk: false,
      canAddControl: false,
      canEditControl: false,
      canDeleteControl: false,
      canViewAll: true,
    },
  };
  
  return permissions[role as keyof typeof permissions] || permissions.L1;
};

export const canUserEditRisk = (userRole: string, riskOwnerId: number, userId: number): boolean => {
  if (userRole === 'L2') return true;
  if (userRole === 'L1' && riskOwnerId === userId) return true;
  return false;
};

export const canUserDeleteRisk = (userRole: string): boolean => {
  if (userRole === 'L2') return true;
  return false;
};