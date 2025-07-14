import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { controlService } from '../../services/controlService';
import { userService } from '../../services/userService';
import { controlSchema } from '../../utils/validation';
import { ControlForm, User } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const EFFECTIVENESS_OPTIONS = [
  { value: 0.0, label: 'Not Effective', description: 'Control is not working as intended' },
  { value: 0.5, label: 'Partially Effective', description: 'Control is working but with some gaps' },
  { value: 1.0, label: 'Fully Effective', description: 'Control is working as designed' }
];

const AddControl: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ControlForm>({
    resolver: yupResolver(controlSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      effectiveness: 0.0,
      owner_id: user?.id || 0,
    }
  });

  // Load users data on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingData(true);
        const usersResponse = await userService.getAllUsers();
        setUsers(usersResponse || []);
      } catch (error) {
        console.error('Error loading users:', error);
        setError('Failed to load users. Please refresh the page.');
      } finally {
        setLoadingData(false);
      }
    };

    loadUsers();
  }, []);

  const onSubmit: SubmitHandler<ControlForm> = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      await controlService.createControl(data);
      setSuccess(true);
      
      // Reset form and show success message
      reset();
      
      // Navigate back after showing success message
      setTimeout(() => {
        navigate('/controls');
      }, 2000);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to create control. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Control Created Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your control has been created and is now available for risk management.
          </p>
          <div className="space-y-4">
            <Link to="/controls">
              <Button variant="primary" fullWidth>
                View All Controls
              </Button>
            </Link>
            <button
              onClick={() => navigate('/controls/add')}
              className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              Add Another Control
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/controls"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Controls
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Control</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a new control to help mitigate organizational risks.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Control Information */}
          <Card>
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Control Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Control Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Control Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.name
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  placeholder="Enter control name (e.g., Two-Factor Authentication)"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Control Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Control Description *
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                    errors.description
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  placeholder="Describe the control in detail, including how it works and what it mitigates..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>

              {/* Effectiveness */}
              <div>
                <label htmlFor="effectiveness" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Effectiveness *
                </label>
                <select
                  {...register('effectiveness')}
                  id="effectiveness"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.effectiveness
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select effectiveness level...</option>
                  {EFFECTIVENESS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.effectiveness && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.effectiveness.message}</p>
                )}
              </div>

              {/* Control Owner */}
              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Control Owner *
                </label>
                <select
                  {...register('owner_id')}
                  id="owner_id"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.owner_id
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select an owner...</option>
                  {users && Array.isArray(users) && users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.username})
                    </option>
                  ))}
                </select>
                {errors.owner_id && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.owner_id.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Effectiveness Guide */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Effectiveness Guide</h3>
            <div className="space-y-3">
              {EFFECTIVENESS_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mt-1 mr-3 ${
                    option.value === 1.0 ? 'bg-green-500' : 
                    option.value === 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Control Tips */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Control Best Practices</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
                <p>Be specific about what the control does and how it operates</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
                <p>Include implementation details and any prerequisites</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
                <p>Assess effectiveness based on actual performance, not intended design</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
                <p>Assign ownership to someone responsible for maintaining the control</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link to="/controls">
              <Button variant="secondary" size="lg">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              Create Control
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddControl;