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

  // Calculamos el tiempo restante
  const remainingTime = duration - currentTime;

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
        {/* Formateamos el tiempo restante */}
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(remainingTime)}</span>{' '}
        {/* Puedes mantener la duración si lo deseas */}
      </div>
    </div>
  );
};

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const milliseconds = time % 1000; // Milisegundos restantes

  return `${minutes}:${milliseconds.toFixed(4)}`; // Muestra el tiempo en formato MIN:MS
}

export default TimeProgressBar;
