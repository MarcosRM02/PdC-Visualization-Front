import React from 'react';
import ReactPlayer from 'react-player';
import { IVideoSectionProps } from '../../Interfaces/DataPanel';

const VideoSection: React.FC<IVideoSectionProps> = ({
  playerRef1,
  videoFile,
  playbackRate,
  handleProgress,
  handleSeek,
  onDuration1,
  onEnded,
  isPlaying,
}) => {
  const frequency = 50;

  return (
    <div className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-inner relative">
      <ReactPlayer
        ref={playerRef1}
        url={videoFile}
        playing={isPlaying}
        onProgress={handleProgress}
        onSeek={handleSeek}
        onDuration={onDuration1}
        onEnded={onEnded}
        width="100%"
        height="100%"
        controls={false}
        className="rounded-lg"
        playbackRate={playbackRate}
        onError={() => {}}
        progressInterval={(1 / frequency) * 1000}
        config={{
          file: {
            attributes: {
              crossOrigin: 'use-credentials',
              preload: 'auto',
              controlsList: 'nodownload',
              disablePictureInPicture: true,
            },
          },
        }}
      />
    </div>
  );
};

export default VideoSection;
