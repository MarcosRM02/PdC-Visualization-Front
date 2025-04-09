import React from 'react';
import ReactPlayer from 'react-player';
import { VideoCameraIcon } from '@heroicons/react/24/solid';

interface VideoSectionProps {
  playerRef1: React.RefObject<ReactPlayer>;
  videoFile: string;
  videoError: boolean;
  playbackRate: number;
  handleProgress: (state: { playedSeconds: number }) => void;
  handleSeek: (newTime: number) => void;
  onDuration1: (duration: number) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  playerRef1,
  videoFile,
  videoError,
  playbackRate,
  handleProgress,
  handleSeek,
  onDuration1,
}) => {
  const frequency = 50; // Valor por defecto o parametrizable

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-inner relative">
        <div className="relative aspect-video">
          {videoFile && !videoError ? (
            <ReactPlayer
              ref={playerRef1}
              url={videoFile}
              onProgress={handleProgress}
              onSeek={handleSeek}
              onDuration={onDuration1}
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
                    controlsList: 'nodownload',
                    disablePictureInPicture: true,
                  },
                },
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800 text-white text-xl font-semibold rounded-lg">
              <VideoCameraIcon className="h-12 w-12 mb-3" />
              <span>No hay ningún video disponible</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
