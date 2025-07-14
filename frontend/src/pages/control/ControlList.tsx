import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Control, TableColumn } from '../../types';
import { controlService } from '../../services/controlService';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../../components/common/DataTable';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const ControlList: React.FC = () => {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadControls();
  }, [searchTerm, filterOwner]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadControls = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        owner: filterOwner ? parseInt(filterOwner) : undefined,
      };
      const response = await controlService.getControls(params);
      setControls(response.results);
    } catch (err) {
      setError('Failed to load controls');
      console.error('Error loading controls:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteControl = async (controlId: number) => {
    if (!window.confirm('Are you sure you want to delete this control?')) {
      return;
    }

    try {
      await controlService.deleteControl(controlId);
      await loadControls(); // Reload the list
    } catch (err) {
      setError('Failed to delete control');
      console.error('Error deleting control:', err);
    }
  };

  const getEffectivenessLabel = (effectiveness: number): string => {
    if (effectiveness === 1.0) return 'Fully Effective';
    if (effectiveness === 0.5) return 'Partially Effective';
    return 'Not Effective';
  };

  const getEffectivenessColor = (effectiveness: number): 'success' | 'warning' | 'danger' => {
    if (effectiveness === 1.0) return 'success';
    if (effectiveness === 0.5) return 'warning';
    return 'danger';
  };

  const canUserEditControl = (control: Control): boolean => {
    if (!user) return false;
    // Users can edit their own controls or if they're L2/L3
    return control.owner.id === user.id || ['L2', 'L3'].includes(user.role);
  };

  const canUserDeleteControl = (control: Control): boolean => {
    if (!user) return false;
    // Only control owners or L2/L3 can delete
    return control.owner.id === user.id || ['L2', 'L3'].includes(user.role);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: TableColumn<Control>[] = [
    {
      key: 'name',
      label: 'Control Name',
      sortable: true,
      render: (value: string, control: Control) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
            {control.description}
          </div>
        </div>
      ),
    },
    {
      key: 'effectiveness',
      label: 'Effectiveness',
      sortable: true,
      render: (value: number) => (
        <Badge variant={getEffectivenessColor(value)}>
          {getEffectivenessLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      sortable: true,
      render: (value: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {value.first_name} {value.last_name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {value.username}
          </div>
        </div>
      ),
    },
    {
      key: 'clastassessed',
      label: 'Last Assessed',
      sortable: true,
      render: (value: string) => value ? formatDate(value) : 'Never',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, control: Control) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/controls/${control.id}`)}
            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Control"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          {canUserEditControl(control) && (
            <button
              onClick={() => navigate(`/controls/${control.id}/edit`)}
              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              title="Edit Control"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
          {canUserDeleteControl(control) && (
            <button
              onClick={() => handleDeleteControl(control.id)}
              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Control"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Controls</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and monitor control effectiveness across your organization
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/controls/new">
              <Button variant="primary" leftIcon={<PlusIcon className="w-5 h-5" />}>
                Add Control
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Controls
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Owners</option>
                {/* You can populate this with actual owners */}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterOwner('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Controls Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : controls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No controls found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                Get started by creating your first control
              </p>
              <Link to="/controls/new">
                <Button variant="primary" leftIcon={<PlusIcon className="w-5 h-5" />}>
                  Add Control
                </Button>
              </Link>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={controls}
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ControlList;