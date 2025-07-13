import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  ChartPieIcon,
  BellAlertIcon,
  KeyIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  roles: string[];
  badge?: string;
  comingSoon?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: HomeIcon,
          description: 'Executive overview & KPIs',
          roles: ['L1', 'L2', 'L3'],
        },
        {
          name: 'My Workspace',
          href: '/my-items',
          icon: ClipboardDocumentListIcon,
          description: 'My tasks & assignments',
          roles: ['L1', 'L2', 'L3'],
        },
      ],
    },
    {
      title: 'Risk Management',
      items: [
        {
          name: 'Risk Register',
          href: '/risks',
          icon: ShieldExclamationIcon,
          description: 'Identify & assess risks',
          roles: ['L1', 'L2', 'L3'],
        },
        {
          name: 'Risk Matrix',
          href: '/risk-matrix',
          icon: ChartBarIcon,
          description: 'Visual risk assessment',
          roles: ['L1', 'L2', 'L3'],
        },
        {
          name: 'Risk Appetite',
          href: '/risk-appetite',
          icon: ArrowTrendingUpIcon,
          description: 'Risk tolerance settings',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'Incident Management',
          href: '/incidents',
          icon: BellAlertIcon,
          description: 'Track & resolve incidents',
          roles: ['L1', 'L2', 'L3'],
          comingSoon: true,
        },
      ],
    },
    {
      title: 'Controls & Compliance',
      items: [
        {
          name: 'Controls Library',
          href: '/controls',
          icon: ShieldCheckIcon,
          description: 'Manage risk controls',
          roles: ['L1', 'L2', 'L3'],
        },
        {
          name: 'Control Testing',
          href: '/control-testing',
          icon: DocumentCheckIcon,
          description: 'Test control effectiveness',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'Compliance Framework',
          href: '/compliance',
          icon: DocumentTextIcon,
          description: 'Regulatory compliance',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'Audit Management',
          href: '/audits',
          icon: DocumentMagnifyingGlassIcon,
          description: 'Internal & external audits',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
      ],
    },
    {
      title: 'Governance',
      items: [
        {
          name: 'Risk Assessments',
          href: '/assessments',
          icon: DocumentTextIcon,
          description: 'Approve risk submissions',
          roles: ['L2'],
          badge: 'new',
        },
        {
          name: 'Policies & Procedures',
          href: '/policies',
          icon: DocumentCheckIcon,
          description: 'Governance documentation',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'Strategic Planning',
          href: '/strategic',
          icon: SparklesIcon,
          description: 'Strategic risk alignment',
          roles: ['L3'],
          comingSoon: true,
        },
      ],
    },
    {
      title: 'Third Party & Cyber',
      items: [
        {
          name: 'Vendor Management',
          href: '/vendors',
          icon: BuildingOfficeIcon,
          description: 'Third-party risk assessment',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'Cyber Security',
          href: '/cybersecurity',
          icon: KeyIcon,
          description: 'Cybersecurity risk management',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'Business Continuity',
          href: '/continuity',
          icon: GlobeAltIcon,
          description: 'BCM & disaster recovery',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
      ],
    },
    {
      title: 'Reports & Analytics',
      items: [
        {
          name: 'Executive Reports',
          href: '/reports',
          icon: ChartPieIcon,
          description: 'Management dashboards',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'Key Risk Indicators',
          href: '/kris',
          icon: ExclamationTriangleIcon,
          description: 'Monitor risk trends',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          name: 'User Management',
          href: '/users',
          icon: UserGroupIcon,
          description: 'Manage system users',
          roles: ['L2'],
          comingSoon: true,
        },
        {
          name: 'Training & Awareness',
          href: '/training',
          icon: AcademicCapIcon,
          description: 'GRC training programs',
          roles: ['L2', 'L3'],
          comingSoon: true,
        },
        {
          name: 'System Settings',
          href: '/settings',
          icon: Cog6ToothIcon,
          description: 'Application configuration',
          roles: ['L1', 'L2', 'L3'],
        },
      ],
    },
  ];

  const filteredSections = navigationSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.roles.includes(user?.role || 'L1')
    ),
  })).filter(section => section.items.length > 0);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const sidebarClasses = `
    fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:inset-0
    ${isOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {filteredSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.comingSoon ? '#' : item.href}
                        onClick={onClose}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          active
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-500'
                            : item.comingSoon
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                            active
                              ? 'text-primary-500 dark:text-primary-400'
                              : item.comingSoon
                              ? 'text-gray-300 dark:text-gray-600'
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{item.name}</span>
                            <div className="flex items-center space-x-1">
                              {item.badge && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              {item.comingSoon && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                  Soon
                                </span>
                              )}
                              {active && (
                                <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </nav>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;