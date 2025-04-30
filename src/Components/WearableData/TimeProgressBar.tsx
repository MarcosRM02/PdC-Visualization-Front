import React from 'react';
import { ITimeProgressBarProps } from '../../Interfaces/DataPanel';

const TimeProgressBar: React.FC<ITimeProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className="w-full ">
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        step="0.1"
        onChange={handleChange}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

export default TimeProgressBar;
