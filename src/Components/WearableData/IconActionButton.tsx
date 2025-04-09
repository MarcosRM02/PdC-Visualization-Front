// IconActionButton.tsx
import React from 'react';

interface IconActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'orange';
}

const IconActionButton: React.FC<IconActionButtonProps> = ({
  onClick,
  icon,
  color = 'blue',
}) => {
  const colorClasses =
    color === 'red'
      ? 'bg-red-500 hover:bg-red-700'
      : color === 'green'
      ? 'bg-green-500 hover:bg-green-700'
      : color === 'orange'
      ? 'bg-orange-500 hover:bg-orange-700'
      : 'bg-blue-500 hover:bg-blue-700';

  return (
    <button
      onClick={onClick}
      className={`${colorClasses} text-white font-bold py-3 px-8 rounded shadow-lg hover:shadow-xl transition duration-200 text-xl flex items-center justify-center`}
    >
      {icon}
    </button>
  );
};

export default IconActionButton;
