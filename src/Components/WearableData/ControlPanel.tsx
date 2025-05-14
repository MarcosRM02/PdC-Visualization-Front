import React from 'react';
import PlaybackRateDropdown from './PlaybackRateDropdown';
import IconActionButton from './IconActionButton';
import { FaPlay, FaPause } from 'react-icons/fa';
import { VscDebugRestart } from 'react-icons/vsc';
import { IControlPanelProps } from '../../Interfaces/DataPanel';
import { RiVideoDownloadFill } from 'react-icons/ri';

const ControlPanel: React.FC<IControlPanelProps> = ({
  videoSrc,
  videoName,
  playbackRate,
  playbackRates,
  changePlaybackRate,
  videoAvailable,
  handlePlay,
  isPlaying,
  handleReset,
  updateHz,
  handleUpdateHzChange,
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoSrc;
    link.setAttribute('download', videoName); // Dejar vacio si interesa que el nombre del archivo sea aleatorio
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      />
      <IconActionButton
        onClick={handleDownload}
        icon={<RiVideoDownloadFill />}
        color="blue"
        tooltip="Download Video"
      />
    </div>
  );
};

export default ControlPanel;
