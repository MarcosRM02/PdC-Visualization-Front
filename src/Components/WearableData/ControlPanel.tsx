import React, { useState } from 'react';
import PlaybackRateDropdown from './PlaybackRateDropdown';
import IconActionButton from './IconActionButton';
import { FaPlay, FaPause } from 'react-icons/fa';
import { VscDebugRestart } from 'react-icons/vsc';
import { RiVideoDownloadFill } from 'react-icons/ri';
import { IControlPanelProps } from '../../Interfaces/DataPanel';
import VideoFrameStepper from './VideoFrameStpper';

const ControlPanel: React.FC<IControlPanelProps> = ({
  videoDownloadUrl,
  playbackRate,
  playbackRates,
  changePlaybackRate,
  videoAvailable,
  handlePlay,
  isPlaying,
  handleReset,
  updateHz,
  handleUpdateHzChange,
  playerRef1,
  playerRef2,
  fps = 64, // Fps por defecto
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Crea un <a> que apunte al nuevo endpoint de descarga
    const link = document.createElement('a');
    link.href = videoDownloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  };

  return (
    <div className="w-full mb-2 flex flex-col items-center mb-4 space-y-4">
      <div className="flex items-center space-x-2">
        <IconActionButton
          onClick={handlePlay}
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          color={isPlaying ? 'orange' : 'green'}
          tooltip={isPlaying ? 'Pause' : 'Play'}
        />
        <IconActionButton
          onClick={handleReset}
          icon={<VscDebugRestart />}
          color="red"
          tooltip="Reset"
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
          color={'blue'}
          tooltip="Download Video"
          disabled={downloading}
        />
      </div>
      <VideoFrameStepper
        playerRef1={playerRef1} // Referencia del primer reproductor
        playerRef2={playerRef2} // Referencia del segundo reproductor
        fps={fps} // Fps de las plantillas
      />
    </div>
  );
};

export default ControlPanel;
