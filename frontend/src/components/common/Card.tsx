import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  neumorphism?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  hover = true,
  glass = false,
  neumorphism = false,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `
    rounded-xl border transition-all duration-200
    ${hover ? 'hover:shadow-xl' : ''}
    ${glass ? 'glass-morphism' : ''}
    ${neumorphism ? 'neumorphism' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-lg'}
    ${paddingClasses[padding]}
    ${className}
  `.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={baseClasses}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="ml-4 flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;