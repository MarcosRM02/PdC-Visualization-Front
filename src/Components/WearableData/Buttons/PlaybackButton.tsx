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
  active = false,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-5 py-3 rounded ${
      active
        ? 'bg-green-500 text-white'
        : 'bg-blue-500 hover:bg-blue-700 text-white'
    } ${
      disabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : ''
    } transition duration-200 text-lg`}
  >
    {label}
  </button>
);

export default PlaybackButton;
