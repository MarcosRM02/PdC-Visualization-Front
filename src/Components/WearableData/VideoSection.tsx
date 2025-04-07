import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Draggable from 'react-draggable';
import { VideoCameraIcon } from '@heroicons/react/24/solid';

interface VideoSectionProps {
  playerRef1: React.RefObject<ReactPlayer>;
  playerRef2: React.RefObject<ReactPlayer>;
  videoFile: string;
  videoFile2: string;
  videoError: boolean;
  playbackRate: number;
  handleProgress: (state: { playedSeconds: number }) => void;
  handleSeek: (newTime: number) => void;
  onDuration1: (duration: number) => void;
  onDuration2: (duration: number) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  playerRef1,
  playerRef2,
  videoFile,
  videoFile2,
  videoError,
  playbackRate,
  handleProgress,
  handleSeek,
  onDuration1,
  onDuration2,
}) => {
  const frequency = 50; // Valor por defecto o parametrizable

  // Estados para el video izquierdo
  const [isFloating1, setIsFloating1] = useState(false);
  const [draggablePos1, setDraggablePos1] = useState({ x: 0, y: 0 });
  const [isDragging1, setIsDragging1] = useState(false);

  // Estados para el video derecho
  const [isFloating2, setIsFloating2] = useState(false);
  const [draggablePos2, setDraggablePos2] = useState({ x: 0, y: 0 });
  const [isDragging2, setIsDragging2] = useState(false);

  // Al activar/desactivar el modo flotante, se ajusta la posición sin desmontar el reproductor
  const toggleFloating1 = () => {
    if (isFloating1) {
      // Al cerrar el flotante, se reinicia la posición a (0,0)
      setDraggablePos1({ x: 0, y: 0 });
      setIsFloating1(false);
    } else {
      setIsFloating1(true);
    }
  };

  const toggleFloating2 = () => {
    if (isFloating2) {
      setDraggablePos2({ x: 0, y: 0 });
      setIsFloating2(false);
    } else {
      setIsFloating2(true);
    }
  };

  // Estilos para el contenedor: si está en modo flotante, usamos posición fixed; de lo contrario, el contenedor se integra al layout
  const containerStyle1: React.CSSProperties = isFloating1
    ? {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '300px',
        zIndex: 1000,
        transform: `translate(${draggablePos1.x}px, ${draggablePos1.y}px)`,
        transition: 'transform 0.3s ease',
        cursor: 'move',
        boxShadow: isDragging1 ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
      }
    : {
        width: '100%',
      };

  const containerStyle2: React.CSSProperties = isFloating2
    ? {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '300px',
        zIndex: 1000,
        transform: `translate(${draggablePos2.x}px, ${draggablePos2.y}px)`,
        transition: 'transform 0.3s ease',
        cursor: 'move',
        boxShadow: isDragging2 ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
      }
    : {
        width: '100%',
      };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Video Izquierdo */}
      <Draggable
        disabled={!isFloating1}
        position={isFloating1 ? draggablePos1 : { x: 0, y: 0 }}
        onStart={() => setIsDragging1(true)}
        onStop={(_, data) => {
          setIsDragging1(false);
          setDraggablePos1({ x: data.x, y: data.y });
        }}
      >
        <div
          style={containerStyle1}
          className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-inner relative"
        >
          <button
            onClick={toggleFloating1}
            className="absolute top-2 right-2 z-10 p-1 bg-gray-700 text-white rounded"
          >
            {isFloating1 ? 'Cerrar flotante' : 'Abrir flotante'}
          </button>
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
      </Draggable>

      {/* Video Derecho */}
      {/* <Draggable
        disabled={!isFloating2}
        position={isFloating2 ? draggablePos2 : { x: 0, y: 0 }}
        onStart={() => setIsDragging2(true)}
        onStop={(_, data) => {
          setIsDragging2(false);
          setDraggablePos2({ x: data.x, y: data.y });
        }}
      >
        <div
          style={containerStyle2}
          className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-inner relative"
        >
          <button
            onClick={toggleFloating2}
            className="absolute top-2 right-2 z-10 p-1 bg-gray-700 text-white rounded"
          >
            {isFloating2 ? 'Cerrar flotante' : 'Abrir flotante'}
          </button>
          <div className="relative aspect-video">
            {videoFile2 && !videoError ? (
              <ReactPlayer
                ref={playerRef2}
                url={videoFile2}
                onProgress={handleProgress}
                onSeek={handleSeek}
                onDuration={onDuration2}
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
                <span>No hay ningún mapa de calor disponible</span>
              </div>
            )}
          </div>
        </div>
      </Draggable> */}
    </div>
  );
};

export default VideoSection;
