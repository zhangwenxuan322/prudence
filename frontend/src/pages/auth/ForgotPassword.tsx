import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import * as yup from 'yup';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
});

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setError('');
      // TODO: Implement password reset API call
      // await authService.requestPasswordReset(data.email);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reset Email Sent!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a password reset link to{' '}
            <span className="font-medium text-gray-900 dark:text-white">{getValues('email')}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Check your email and follow the instructions to reset your password.
            If you don't see the email, check your spam folder.
          </p>
          
          <div className="space-y-4">
            <Link to="/login">
              <Button variant="primary" fullWidth>
                Back to Login
              </Button>
            </Link>
            
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              Try a different email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Login */}
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <span className="text-white font-bold text-2xl">P</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Reset Form */}
        <Card className="backdrop-blur-lg bg-white/90 border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400 focus:border-primary-500'
                  }`}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              Send Reset Link
            </Button>

            {/* Additional Help */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
              
              <p className="text-xs text-gray-500">
                Need help? Contact your system administrator.
              </p>
            </div>
          </form>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
              <p className="text-xs text-blue-600 mt-1">
                For security reasons, we don't reveal whether an email address is registered with us.
                You'll receive an email only if the address is in our system.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2024 Prudence Risk Management. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;