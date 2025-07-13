import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Risk, TableColumn } from '../../types';
import { riskService } from '../../services/riskService';
import { useAuth } from '../../contexts/AuthContext';
import { getRiskLevel, formatDate, canUserEditRisk, canUserDeleteRisk } from '../../utils/riskUtils';
import DataTable from '../../components/common/DataTable';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const RiskList: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRisks();
  }, [searchTerm, filterOwner]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRisks = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        owner: filterOwner ? parseInt(filterOwner) : undefined,
      };
      const response = await riskService.getRisks(params);
      setRisks(response.results);
    } catch (err) {
      setError('Failed to load risks');
      console.error('Error loading risks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRisk = async (riskId: number) => {
    if (!window.confirm('Are you sure you want to delete this risk?')) {
      return;
    }

    try {
      await riskService.deleteRisk(riskId);
      setRisks(risks.filter(risk => risk.id !== riskId));
    } catch (err) {
      console.error('Error deleting risk:', err);
      alert('Failed to delete risk');
    }
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

  const columns: TableColumn<Risk>[] = [
    {
      key: 'description',
      label: 'Risk Description',
      sortable: true,
      render: (value: string, risk: Risk) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 dark:text-white truncate">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {risk.id}</p>
        </div>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      sortable: true,
      render: (value: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value.first_name} {value.last_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{value.role}</p>
        </div>
      ),
    },
    {
      key: 'inherent_rating',
      label: 'Inherent Risk',
      sortable: true,
      render: (value: number, risk: Risk) => {
        const rating = risk.inherent_probability * risk.inherent_impact;
        const level = getRiskLevel(rating);
        return (
          <div className="flex items-center space-x-2">
            <Badge variant={getRiskLevelVariant(level) as any} size="sm">
              {rating}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {risk.inherent_probability}×{risk.inherent_impact}
            </span>
          </div>
        );
      },
    },
    {
      key: 'residual_rating',
      label: 'Residual Risk',
      sortable: true,
      render: (value: number, risk: Risk) => {
        const rating = risk.residual_probability * risk.residual_impact;
        const level = getRiskLevel(rating);
        return (
          <div className="flex items-center space-x-2">
            <Badge variant={getRiskLevelVariant(level) as any} size="sm">
              {rating}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {risk.residual_probability}×{risk.residual_impact}
            </span>
          </div>
        );
      },
    },
    {
      key: 'controls',
      label: 'Controls',
      render: (value: any[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((control) => (
            <Badge key={control.id} variant="secondary" size="sm">
              {control.name}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="default" size="sm">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'last_assessed',
      label: 'Last Assessed',
      sortable: true,
      render: (value: string | null) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value ? formatDate(value) : 'Never'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, risk: Risk) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/risks/${risk.id}`);
            }}
            className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          
          {canUserEditRisk(user?.role || 'L1', risk.owner.id, user?.id || 0) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/risks/${risk.id}/edit`);
              }}
              className="text-yellow-600 hover:text-yellow-700 transition-colors duration-200"
              title="Edit Risk"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
          
          {canUserDeleteRisk(user?.role || 'L1') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRisk(risk.id);
              }}
              className="text-red-600 hover:text-red-700 transition-colors duration-200"
              title="Delete Risk"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Register</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor organizational risks
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/risks/new">
            <Button variant="primary" leftIcon={<PlusIcon className="w-5 h-5" />}>
              Add Risk
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Risks
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by description..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Owner
            </label>
            <select
              id="owner"
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Owners</option>
              {/* This would be populated with actual users */}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={loadRisks}
              className="w-full"
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Risk Table */}
      <DataTable
        data={risks}
        columns={columns}
        onRowClick={(risk) => navigate(`/risks/${risk.id}`)}
        isLoading={loading}
        emptyMessage="No risks found. Add your first risk to get started."
      />

      {/* Summary Stats */}
      <Card title="Summary Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{risks.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Risks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {risks.filter(r => getRiskLevel(r.residual_probability * r.residual_impact) === 'critical').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {risks.filter(r => getRiskLevel(r.residual_probability * r.residual_impact) === 'high').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">High</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {risks.filter(r => getRiskLevel(r.residual_probability * r.residual_impact) === 'medium').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskList;