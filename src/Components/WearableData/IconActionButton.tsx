import React from 'react';
import { IIconActionButtonProps } from '../../Interfaces/DataPanel';

const IconActionButton: React.FC<IIconActionButtonProps> = ({
  onClick,
  icon,
  color,
  tooltip,
  disabled = false,
}) => {
  return (
    <div className="relative group inline-block">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          font-bold py-3 px-8 rounded shadow-lg transition duration-200 text-xl flex items-center justify-center h-[40px]
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed shadow-none hover:shadow-lg hover:shadow-none'
              : 'hover:shadow-xl'
          }
          ${
            color === 'red'
              ? 'text-red-500'
              : color === 'blue'
              ? 'text-blue-500'
              : color === 'green'
              ? 'text-green-500'
              : color === 'orange'
              ? 'text-orange-500'
              : color === 'gray'
              ? 'text-gray-500'
              : ''
          }
        `}
      >
        {icon}
      </button>

      {tooltip && !disabled && (
        <span
          style={{ zIndex: 9999 }}
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-50"
        >
          {tooltip}
        </span>
      )}
    </div>
  );
};

export default IconActionButton;
