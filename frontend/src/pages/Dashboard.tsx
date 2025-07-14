import React from 'react';
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
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total Risks',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: ShieldExclamationIcon,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      name: 'Active Controls',
      value: '18',
      change: '+5%',
      changeType: 'increase',
      icon: ShieldCheckIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      name: 'Pending Assessments',
      value: '7',
      change: '-2%',
      changeType: 'decrease',
      icon: ClipboardDocumentListIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      name: 'Team Members',
      value: '12',
      change: '+1',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
  ];

  const recentRisks = [
    {
      id: 1,
      description: 'Data breach vulnerability in customer portal',
      level: 'High',
      owner: 'John Smith',
      lastUpdated: '2 hours ago',
    },
    {
      id: 2,
      description: 'Supply chain disruption risk',
      level: 'Medium',
      owner: 'Sarah Johnson',
      lastUpdated: '1 day ago',
    },
    {
      id: 3,
      description: 'Regulatory compliance gap',
      level: 'Critical',
      owner: 'Mike Wilson',
      lastUpdated: '3 days ago',
    },
  ];

  const getRiskLevelVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

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
                      <p className={`ml-2 text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </p>
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
              {recentRisks.map((risk) => (
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
                      <Badge variant={getRiskLevelVariant(risk.level) as any} size="sm">
                        {risk.level}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{risk.owner}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{risk.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
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