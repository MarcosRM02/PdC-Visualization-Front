import React from 'react';
import PlaybackRateDropdown from './PlaybackRateDropdown';
import IconActionButton from './IconActionButton';
import { FaPlay, FaPause } from 'react-icons/fa';
import { VscDebugRestart } from 'react-icons/vsc';

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
  handleReset,
  updateHz,
  handleUpdateHzChange,
  getRenderFps,
}) => {
  return (
    <div className="w-full mb-12 flex items-center justify-center">
      <IconActionButton
        onClick={handlePlay}
        icon={isPlaying ? <FaPause /> : <FaPlay />}
        color={isPlaying ? 'orange' : 'green'}
        tooltip={isPlaying ? 'Pausar Vídeo' : 'Reproducir Vídeo'}
      />
      <IconActionButton
        onClick={handleReset}
        icon={<VscDebugRestart />}
        color="red"
        tooltip="Reiniciar Vídeo"
      />
      <PlaybackRateDropdown
        playbackRate={playbackRate}
        playbackRates={playbackRates}
        changePlaybackRate={changePlaybackRate}
        videoAvailable={videoAvailable}
        updateHz={updateHz}
        onUpdateHzChange={handleUpdateHzChange}
        getRenderFps={getRenderFps}
      />
    </div>
  );
};

export default ControlPanel;
