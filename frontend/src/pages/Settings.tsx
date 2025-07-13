import React from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/common/Card';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light',
      description: 'Use light theme',
      icon: SunIcon,
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      description: 'Use dark theme',
      icon: MoonIcon,
    },
    {
      value: 'system' as const,
      label: 'System',
      description: 'Follow system preference',
      icon: ComputerDesktopIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Theme Settings */}
      <Card title="Appearance" subtitle="Customize the look and feel of the application">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Theme Preference
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`relative p-4 border rounded-lg transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Icon 
                        className={`w-6 h-6 mb-2 ${
                          isSelected 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} 
                      />
                      <span className={`text-sm font-medium ${
                        isSelected 
                          ? 'text-primary-900 dark:text-primary-100' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {option.label}
                      </span>
                      <span className={`text-xs mt-1 ${
                        isSelected 
                          ? 'text-primary-700 dark:text-primary-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Other Settings Sections */}
      <Card title="Account" subtitle="Manage your account information">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Account settings coming soon...
        </div>
      </Card>

      <Card title="Notifications" subtitle="Configure your notification preferences">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Notification settings coming soon...
        </div>
      </Card>
    </div>
  );
};

export default Settings;
