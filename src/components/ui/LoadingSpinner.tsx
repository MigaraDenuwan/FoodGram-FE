import React from 'react';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

const sizeMap = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'text-accent-500',
}) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeMap[size]} ${color} animate-spin rounded-full border-t-2 border-b-2 border-current`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;