import * as yup from 'yup';

// Authentication validation schemas
export const loginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(3, 'Password must be at least 3 characters'),
});

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(150, 'Username must be less than 150 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  first_name: yup
    .string()
    .required('First name is required')
    .max(30, 'First name must be less than 30 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .max(30, 'Last name must be less than 30 characters'),
  password1: yup
    .string()
    .required('Password is required')
    .min(3, 'Password must be at least 3 characters'),
  password2: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password1')], 'Passwords must match'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['L1', 'L2', 'L3'], 'Invalid role selected'),
});

// Risk validation schemas
export const riskSchema = yup.object({
  description: yup
    .string()
    .required('Risk description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  inherent_probability: yup
    .number()
    .required('Inherent probability is required')
    .min(1, 'Probability must be between 1 and 5')
    .max(5, 'Probability must be between 1 and 5')
    .integer('Probability must be a whole number'),
  inherent_impact: yup
    .number()
    .required('Inherent impact is required')
    .min(1, 'Impact must be between 1 and 5')
    .max(5, 'Impact must be between 1 and 5')
    .integer('Impact must be a whole number'),
  residual_probability: yup
    .number()
    .required('Residual probability is required')
    .min(1, 'Probability must be between 1 and 5')
    .max(5, 'Probability must be between 1 and 5')
    .integer('Probability must be a whole number'),
  residual_impact: yup
    .number()
    .required('Residual impact is required')
    .min(1, 'Impact must be between 1 and 5')
    .max(5, 'Impact must be between 1 and 5')
    .integer('Impact must be a whole number'),
  owner: yup
    .number()
    .required('Risk owner is required')
    .positive('Please select a valid owner'),
  assessor: yup
    .number()
    .nullable()
    .positive('Please select a valid assessor'),
  controls: yup
    .array()
    .of(yup.number().positive())
    .default([]),
  risk_type: yup
    .number()
    .nullable()
    .positive('Please select a valid risk type'),
});

// Control validation schemas
export const controlSchema = yup.object({
  name: yup
    .string()
    .required('Control name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: yup
    .string()
    .required('Control description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  effectiveness: yup
    .number()
    .required('Effectiveness is required')
    .oneOf([0.0, 0.5, 1.0], 'Invalid effectiveness value'),
  owner: yup
    .number()
    .required('Control owner is required')
    .positive('Please select a valid owner'),
});

// Assessment validation schemas
export const assessmentSchema = yup.object({
  status: yup
    .string()
    .required('Assessment status is required')
    .oneOf(['Accepted', 'Rejected'], 'Invalid status'),
  assessor_comments: yup
    .string()
    .when('status', {
      is: 'Rejected',
      then: (schema) => schema.required('Comments are required when rejecting a risk'),
      otherwise: (schema) => schema.nullable(),
    })
    .max(500, 'Comments must be less than 500 characters'),
});

// Password change validation
export const changePasswordSchema = yup.object({
  old_password: yup
    .string()
    .required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(3, 'Password must be at least 3 characters'),
  confirm_password: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('new_password')], 'Passwords must match'),
});

// Utility functions for validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 3) {
    errors.push('Password must be at least 3 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRiskRating = (probability: number, impact: number): boolean => {
  return (
    probability >= 1 && probability <= 5 &&
    impact >= 1 && impact <= 5 &&
    Number.isInteger(probability) &&
    Number.isInteger(impact)
  );
};