import React from 'react';
import PlaybackButton from './Buttons/PlaybackButton';
import ActionButton from './Buttons/ActionButton';
import HeatmapControlPanel from './HZControlPannel';
import InfoButton from './Buttons/InfoButton';

interface ControlPanelProps {
  playbackRate: number;
  playbackRates: { label: string; rate: number }[];
  changePlaybackRate: (rate: number) => void;
  videoAvailable: boolean;
  handlePlay: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  handleReset: () => void;
  resetGraphs: () => void;
  updateHz: number;
  handleUpdateHzChange: (newHz: number) => void;
  getRenderFps: () => { leftFps: number; rightFps: number };
  descargarDatos: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  playbackRate,
  playbackRates,
  changePlaybackRate,
  videoAvailable,
  handlePlay,
  isPlaying,
  isPaused,
  handleReset,
  resetGraphs,
  updateHz,
  handleUpdateHzChange,
  getRenderFps,
  descargarDatos,
}) => {
  return (
    <div className="w-full mt-6 flex flex-col items-center">
      {/* Botones para cambiar la velocidad */}
      <div className="mt-6 flex justify-center space-x-4">
        {playbackRates.map(({ label, rate }) => (
          <PlaybackButton
            key={rate}
            label={label}
            onClick={() => changePlaybackRate(rate)}
            active={Math.abs(playbackRate - rate) < 0.001} // Usar tolerancia para precisión
            disabled={!videoAvailable} // Pasar la propiedad disabled
          />
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-6 w-full">
        <HeatmapControlPanel
          updateHz={updateHz}
          onUpdateHzChange={handleUpdateHzChange}
          getRenderFps={getRenderFps}
        />
      </div>
      {/* Botones de reproducción y reseteo */}
      <div className="flex justify-center mt-6 space-x-6 w-full">
        <ActionButton
          onClick={handlePlay}
          label={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
          color={isPlaying ? 'orange' : 'green'}
        />
        <ActionButton onClick={handleReset} label="Reset" color="red" />
      </div>
      <div className="flex justify-center mt-12 space-x-6 items-center">
        <ActionButton
          onClick={resetGraphs}
          label="Resetear Gráficos"
          color="red"
        />
        <div className="flex items-center space-x-2">
          <ActionButton
            onClick={descargarDatos}
            label="Descargar Datos (ZIP)"
            color="blue"
          />
          <InfoButton />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
