import React, { useState, useRef, useEffect } from 'react';
import PlaybackButton from './Buttons/PlaybackButton';
import { MdOutlineShutterSpeed } from 'react-icons/md';
import HzControlPanel from './HZControlPannel';
import { IPlaybackRateDropdownProps } from '../../Interfaces/DataPanel';
import IconActionButton from './IconActionButton';

const PlaybackRateDropdown: React.FC<IPlaybackRateDropdownProps> = ({
  playbackRate,
  playbackRates,
  changePlaybackRate,
  videoAvailable,
  updateHz,
  onUpdateHzChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Alterna la apertura/cierre del dropdown
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Cierra el dropdown si se hace clic fuera de éste
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Botón principal con estilo similar al de IconActionButton */}

      <IconActionButton
        onClick={toggleDropdown}
        icon={<MdOutlineShutterSpeed />}
        color="violet"
        tooltip="Playback Speed"
        tooltipPosition="top"
      />
      {/* <button
        onClick={toggleDropdown}
        className="ffont-bold py-3 px-8 rounded shadow-lg hover:shadow-xl transition duration-200 text-xl flex items-center justify-center  h-[40px] "
        title="Playback Speed"
      >
        <MdOutlineShutterSpeed size={24} color="blueviolet" />
      </button> */}
      {/* Menú desplegable con scroll vertical en caso de exceso de elementos */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 p-2 max-h-60 overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {/* Componente del panel de control de Hz */}
            <HzControlPanel
              updateHz={updateHz}
              onUpdateHzChange={onUpdateHzChange}
            />
            {/* Lista de botones para cambiar la velocidad */}
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
