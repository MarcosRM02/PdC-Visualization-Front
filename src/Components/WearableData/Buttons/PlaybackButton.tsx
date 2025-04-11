import React from 'react';

interface PlaybackButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const PlaybackButton: React.FC<PlaybackButtonProps> = ({
  label,
  onClick,
  active,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center px-4 py-2 
        ${active ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} 
        hover:bg-gray-100`}
    >
      {label}
    </button>
  );
};

export default PlaybackButton;
