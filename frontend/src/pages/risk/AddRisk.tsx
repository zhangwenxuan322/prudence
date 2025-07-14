import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { riskService } from '../../services/riskService';
import { controlService } from '../../services/controlService';
import { userService } from '../../services/userService';
import { riskTypeService } from '../../services/riskTypeService';
import { riskSchema } from '../../utils/validation';
import { RiskForm, User, Control, RiskType } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const PROBABILITY_OPTIONS = [
  { value: 1, label: '1 - Very Low' },
  { value: 2, label: '2 - Low' },
  { value: 3, label: '3 - Medium' },
  { value: 4, label: '4 - High' },
  { value: 5, label: '5 - Very High' }
];

const IMPACT_OPTIONS = [
  { value: 1, label: '1 - Very Low' },
  { value: 2, label: '2 - Low' },
  { value: 3, label: '3 - Medium' },
  { value: 4, label: '4 - High' },
  { value: 5, label: '5 - Very High' }
];

const AddRisk: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [l2Users, setL2Users] = useState<User[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [riskTypes, setRiskTypes] = useState<RiskType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<RiskForm>({
    resolver: yupResolver(riskSchema) as any,
    defaultValues: {
      description: '',
      inherent_probability: 1,
      inherent_impact: 1,
      residual_probability: 1,
      residual_impact: 1,
      owner_id: user?.id || 0,
      assessor_id: undefined,
      control_ids: [],
      risk_type_id: undefined,
    }
  });

  const watchedProbability = watch('inherent_probability');
  const watchedImpact = watch('inherent_impact');
  const watchedResidualProbability = watch('residual_probability');
  const watchedResidualImpact = watch('residual_impact');

  // Calculate risk ratings
  const calculateRiskRating = (probability: number, impact: number): number => {
    return probability * impact;
  };

  const getRiskLevel = (rating: number): string => {
    if (rating <= 4) return 'Low';
    if (rating <= 9) return 'Medium';
    if (rating <= 16) return 'High';
    return 'Critical';
  };

  const getRiskColor = (rating: number): string => {
    if (rating <= 4) return 'text-green-600 dark:text-green-400';
    if (rating <= 9) return 'text-yellow-600 dark:text-yellow-400';
    if (rating <= 16) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const inherentRating = calculateRiskRating(watchedProbability || 0, watchedImpact || 0);
  const residualRating = calculateRiskRating(watchedResidualProbability || 0, watchedResidualImpact || 0);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [usersResponse, l2UsersResponse, controlsResponse, riskTypesResponse] = await Promise.all([
          userService.getAllUsers(),
          userService.getL2Users(),
          controlService.getControls({ page_size: 1000 }),
          riskTypeService.getRiskTypes()
        ]);

        setUsers(usersResponse || []);
        setL2Users(l2UsersResponse || []);
        setControls(controlsResponse?.results || []);
        setRiskTypes(riskTypesResponse || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load form data. Please refresh the page.');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const onSubmit: SubmitHandler<RiskForm> = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      await riskService.createRisk(data);
      setSuccess(true);
      
      // Reset form and show success message
      reset();
      
      // Navigate back after showing success message
      setTimeout(() => {
        navigate('/risks');
      }, 2000);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to create risk. Please try again.');
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Risk Created Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your risk has been submitted for review.
          </p>
          <div className="space-y-4">
            <Link to="/risks">
              <Button variant="primary" fullWidth>
                View All Risks
              </Button>
            </Link>
            <button
              onClick={() => navigate('/risks/add')}
              className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              Add Another Risk
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/risks"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Risks
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Risk</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a new risk entry for assessment and management.
          </p>
        </div>

        {/* Role Info */}
        {user?.role === 'L1' && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">L1 User Notice</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  As an L1 user, your risk submissions will require approval from an L2 user before being finalized.
                </p>
              </div>
            </div>
          </div>
        )}

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

          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Description *
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
                  placeholder="Describe the risk in detail..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>

              {/* Risk Type */}
              <div>
                <label htmlFor="risk_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Type
                </label>
                <select
                  {...register('risk_type_id')}
                  id="risk_type_id"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.risk_type_id
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select a risk type...</option>
                  {riskTypes && Array.isArray(riskTypes) && riskTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.risk_type_id && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.risk_type_id.message}</p>
                )}
              </div>

              {/* Risk Owner */}
              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Owner *
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

              {/* Assessor */}
              <div className="md:col-span-2">
                <label htmlFor="assessor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessor (L2 User)
                </label>
                <select
                  {...register('assessor_id')}
                  id="assessor_id"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.assessor_id
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select an assessor...</option>
                  {l2Users && Array.isArray(l2Users) && l2Users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.username})
                    </option>
                  ))}
                </select>
                {errors.assessor_id && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assessor_id.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Inherent Risk Assessment */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Inherent Risk Assessment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inherent Probability */}
              <div>
                <label htmlFor="inherent_probability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inherent Probability *
                </label>
                <select
                  {...register('inherent_probability')}
                  id="inherent_probability"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.inherent_probability
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select probability...</option>
                  {PROBABILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.inherent_probability && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.inherent_probability.message}</p>
                )}
              </div>

              {/* Inherent Impact */}
              <div>
                <label htmlFor="inherent_impact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inherent Impact *
                </label>
                <select
                  {...register('inherent_impact')}
                  id="inherent_impact"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.inherent_impact
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select impact...</option>
                  {IMPACT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.inherent_impact && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.inherent_impact.message}</p>
                )}
              </div>

              {/* Inherent Rating Display */}
              {watchedProbability && watchedImpact && (
                <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inherent Risk Rating</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{inherentRating}</span>
                    <span className={`text-lg font-semibold ${getRiskColor(inherentRating)}`}>
                      {getRiskLevel(inherentRating)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Residual Risk Assessment */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Residual Risk Assessment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Residual Probability */}
              <div>
                <label htmlFor="residual_probability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Residual Probability *
                </label>
                <select
                  {...register('residual_probability')}
                  id="residual_probability"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.residual_probability
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select probability...</option>
                  {PROBABILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.residual_probability && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.residual_probability.message}</p>
                )}
              </div>

              {/* Residual Impact */}
              <div>
                <label htmlFor="residual_impact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Residual Impact *
                </label>
                <select
                  {...register('residual_impact')}
                  id="residual_impact"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.residual_impact
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value="">Select impact...</option>
                  {IMPACT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.residual_impact && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.residual_impact.message}</p>
                )}
              </div>

              {/* Residual Rating Display */}
              {watchedResidualProbability && watchedResidualImpact && (
                <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Residual Risk Rating</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{residualRating}</span>
                    <span className={`text-lg font-semibold ${getRiskColor(residualRating)}`}>
                      {getRiskLevel(residualRating)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Controls */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Associated Controls</h2>
            
            <div>
              <label htmlFor="controls" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Controls
              </label>
              <select
                {...register('control_ids')}
                id="control_ids"
                multiple
                className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32 ${
                  errors.control_ids
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                {controls && Array.isArray(controls) && controls.map((control) => (
                  <option key={control.id} value={control.id}>
                    {control.name} (Effectiveness: {control.effectiveness === 1 ? 'Fully Effective' : control.effectiveness === 0.5 ? 'Partially Effective' : 'Not Effective'})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Hold Ctrl/Cmd to select multiple controls
              </p>
              {errors.control_ids && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.control_ids.message}</p>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link to="/risks">
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
              Create Risk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRisk;