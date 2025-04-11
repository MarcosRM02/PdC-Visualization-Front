import React from 'react';

interface IconActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'orange';
  tooltip?: string;
}

const IconActionButton: React.FC<IconActionButtonProps> = ({
  onClick,
  icon,
  color,
  tooltip,
}) => {
  return (
    <div className="relative group inline-block">
      <button
        onClick={onClick}
        className={`font-bold py-3 px-8 rounded shadow-lg hover:shadow-xl transition duration-200 text-xl flex items-center justify-center ${
          color === 'red'
            ? 'text-red-500'
            : color === 'blue'
            ? 'text-blue-500'
            : color === 'green'
            ? 'text-green-500'
            : color === 'orange'
            ? 'text-orange-500'
            : ''
        }`}
      >
        {icon}
      </button>
      {tooltip && (
        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {tooltip}
        </span>
      )}
    </div>
  );
};

export default IconActionButton;
