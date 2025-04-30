import React from 'react';
import PlaybackRateDropdown from './PlaybackRateDropdown';
import IconActionButton from './IconActionButton';
import { FaPlay, FaPause } from 'react-icons/fa';
import { VscDebugRestart } from 'react-icons/vsc';
import { IControlPanelProps } from '../../Interfaces/DataPanel';

const ControlPanel: React.FC<IControlPanelProps> = ({
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
    <div className="w-full mb-2 flex items-center justify-center">
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
