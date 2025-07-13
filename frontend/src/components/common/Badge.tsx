import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-semibold uppercase tracking-wider';
  
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${roundedClasses}
    ${className}
  `.trim();

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
};

export default Badge;