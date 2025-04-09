import React, { useState, useRef, useEffect } from 'react';
import { FaTachometerAlt } from 'react-icons/fa'; // Icono para representar la velocidad
import PlaybackButton from './Buttons/PlaybackButton';

interface PlaybackRateDropdownProps {
  playbackRate: number;
  playbackRates: { label: string; rate: number }[];
  changePlaybackRate: (rate: number) => void;
  videoAvailable: boolean;
}

const PlaybackRateDropdown: React.FC<PlaybackRateDropdownProps> = ({
  playbackRate,
  playbackRates,
  changePlaybackRate,
  videoAvailable,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Alternar la apertura del desplegable
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Cerrar el desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal: icono representativo de la velocidad */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        title="Cambiar Velocidad"
      >
        <FaTachometerAlt size={24} />
      </button>
      {/* Menú desplegable con las velocidades */}
      {isOpen && (
        <div className="absolute mt-2 right-0 bg-white border border-gray-300 rounded shadow-lg z-10">
          <div className="flex flex-col">
            {playbackRates.map(({ label, rate }) => (
              <PlaybackButton
                key={rate}
                label={label}
                onClick={() => {
                  changePlaybackRate(rate);
                  setIsOpen(false);
                }}
                active={Math.abs(playbackRate - rate) < 0.001}
                disabled={!videoAvailable}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaybackRateDropdown;
