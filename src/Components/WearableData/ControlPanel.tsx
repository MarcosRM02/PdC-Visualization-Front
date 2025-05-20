import React from 'react';
import PlaybackRateDropdown from './PlaybackRateDropdown';
import IconActionButton from './IconActionButton';
import { FaPlay, FaPause } from 'react-icons/fa';
import { VscDebugRestart } from 'react-icons/vsc';
import { IControlPanelProps } from '../../Interfaces/DataPanel';
import { RiVideoDownloadFill } from 'react-icons/ri';
import axios from 'axios';

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
  const handleDownload = async () => {
    try {
      // 1) Petición al servidor, enviando la cookie HttpOnly
      const response = await axios.get<Blob>(videoSrc, {
        responseType: 'blob',
        withCredentials: true,
      });

      // 2) Convertir a URL de objeto
      const blobUrl = URL.createObjectURL(response.data);

      // 3) Simular <a download>
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${videoName}.mp4`);
      document.body.appendChild(link);
      link.click();

      // 4) Limpieza
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };
  return (
    <div className="w-full mb-2 flex items-center justify-center">
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
        color="blue"
        tooltip="Download Video"
      />
    </div>
  );
};

export default ControlPanel;
