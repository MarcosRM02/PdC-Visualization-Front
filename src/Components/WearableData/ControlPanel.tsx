// ControlPanel.tsx
import React from 'react';
import PlaybackRateDropdown from './PlaybackRateDropdown';
import IconActionButton from './IconActionButton';
import HeatmapControlPanel from './HZControlPannel';
import InfoButton from './Buttons/InfoButton';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import ActionButton from './Buttons/ActionButton';

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
      {/* Botón desplegable para cambiar la velocidad */}
      <div className="mt-6">
        <PlaybackRateDropdown
          playbackRate={playbackRate}
          playbackRates={playbackRates}
          changePlaybackRate={changePlaybackRate}
          videoAvailable={videoAvailable}
        />
      </div>
      <div className="flex justify-center mt-6 space-x-6 w-full">
        <HeatmapControlPanel
          updateHz={updateHz}
          onUpdateHzChange={handleUpdateHzChange}
          getRenderFps={getRenderFps}
        />
      </div>
      {/* Botones de reproducción y reseteo usando iconos */}
      <div className="flex justify-center mt-6 space-x-6 w-full">
        <IconActionButton
          onClick={handlePlay}
          // Mostrar FaPause si el video está reproduciéndose, en caso contrario FaPlay
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          color={isPlaying ? 'orange' : 'green'}
        />
        <IconActionButton onClick={handleReset} icon={<FaRedo />} color="red" />
      </div>
      <div className="flex justify-center mt-12 space-x-6 items-center">
        <IconActionButton
          onClick={resetGraphs}
          // Aquí puedes mantener el botón con icono o seguir usando el ActionButton si prefieres texto
          icon={<FaRedo />}
          color="red"
        />
        <div className="flex items-center space-x-2">
          {/* Se mantiene la versión original del botón para descargar datos */}
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
