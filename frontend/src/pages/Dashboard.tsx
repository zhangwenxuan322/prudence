import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldExclamationIcon, 
  ShieldCheckIcon, 
  ClipboardDocumentListIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { riskService } from '../services/riskService';
import { DashboardStats, Risk } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentRisks, setRecentRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats and recent risks in parallel
        const [stats, risksResponse] = await Promise.all([
          riskService.getDashboardStats(),
          riskService.getRisks({ page_size: 3 }), // Get 3 most recent risks
        ]);

        setDashboardStats(stats);
        setRecentRisks((risksResponse.results || []).slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Create stats array from API data
  const stats = dashboardStats ? [
    {
      name: 'Total Risks',
      value: dashboardStats.total_risks.toString(),
      change: dashboardStats.total_risks > 0 ? '+' : '',
      changeType: 'neutral' as const,
      icon: ShieldExclamationIcon,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      name: 'My Controls',
      value: dashboardStats.my_controls.toString(),
      change: dashboardStats.my_controls > 0 ? '+' : '',
      changeType: 'neutral' as const,
      icon: ShieldCheckIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      name: 'Pending Assessments',
      value: dashboardStats.pending_assessments.toString(),
      change: dashboardStats.pending_assessments > 0 ? '' : 'None',
      changeType: 'neutral' as const,
      icon: ClipboardDocumentListIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      name: 'High Risk Items',
      value: dashboardStats.high_risks.toString(),
      change: dashboardStats.high_risks > 0 ? 'Attention needed' : 'Good',
      changeType: dashboardStats.high_risks > 0 ? 'warning' as const : 'success' as const,
      icon: UserGroupIcon,
      color: dashboardStats.high_risks > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
      bgColor: dashboardStats.high_risks > 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20',
    },
  ] : [];

  // Helper function to calculate risk level from probability and impact
  const getRiskLevel = (probability: number, impact: number): 'low' | 'medium' | 'high' | 'critical' => {
    const rating = probability * impact;
    if (rating >= 20) return 'critical';
    if (rating >= 15) return 'high';
    if (rating >= 10) return 'medium';
    return 'low';
  };

  const getRiskLevelVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.first_name}! Here's your risk management overview.
            </p>
          </div>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading dashboard</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.first_name}! Here's your risk management overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="relative overflow-hidden">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                      {stat.change && (
                        <p className={`ml-2 text-sm font-medium ${
                          stat.changeType === 'success' ? 'text-green-600 dark:text-green-400' : 
                          stat.changeType === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {stat.change}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Risks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card 
            title="Recent Risks" 
            subtitle="Latest risk entries requiring attention"
            headerAction={
              <button 
                onClick={() => navigate('/risks')}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                View All
              </button>
            }
          >
            <div className="space-y-4">
              {recentRisks.length > 0 ? (
                recentRisks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.residual_probability || risk.inherent_probability, risk.residual_impact || risk.inherent_impact);
                  return (
                    <div 
                      key={risk.id} 
                      onClick={() => navigate(`/risks/${risk.id}`)}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {risk.description}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant={getRiskLevelVariant(riskLevel) as any} size="sm">
                            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {risk.owner.first_name} {risk.owner.last_name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(risk.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No recent risks found.</p>
                  <button 
                    onClick={() => navigate('/risks/add')}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add your first risk
                  </button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card title="Quick Actions" subtitle="Common tasks and shortcuts">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/risks/add')}
                className="p-4 bg-red-50 dark:bg-red-800 hover:bg-red-100 dark:hover:bg-red-700 rounded-lg text-left transition-colors duration-200 group"
              >
                <ShieldExclamationIcon className="w-8 h-8 text-red-600 dark:text-red-400 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="font-medium text-gray-900 dark:text-white">Add Risk</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create new risk entry</p>
              </button>
              
              <button 
                onClick={() => navigate('/controls/add')}
                className="p-4 bg-green-50 dark:bg-green-800 hover:bg-green-100 dark:hover:bg-green-700 rounded-lg text-left transition-colors duration-200 group"
              >
                <ShieldCheckIcon className="w-8 h-8 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="font-medium text-gray-900 dark:text-white">Add Control</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create new control</p>
              </button>
              
              <button 
                onClick={() => navigate('/risk-matrix')}
                className="p-4 bg-yellow-50 dark:bg-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-700 rounded-lg text-left transition-colors duration-200 group"
              >
                <ClipboardDocumentListIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="font-medium text-gray-900 dark:text-white">View Matrix</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Risk assessment matrix</p>
              </button>
              
              <button 
                onClick={() => navigate('/my-items')}
                className="p-4 bg-purple-50 dark:bg-purple-800 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-lg text-left transition-colors duration-200 group"
              >
                <UserGroupIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="font-medium text-gray-900 dark:text-white">My Items</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Assigned risks & controls</p>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;