import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import VideoSection from './VideoSection';
import TimeProgressBar from './TimeProgressBar';
import ControlPanel from './ControlPanel';
import { MdOpenWith, MdPushPin } from 'react-icons/md';

interface FloatingWindowProps {
  playerRef1: React.RefObject<any>;
  videoSrc: string;
  videoError: any;
  playbackRate: number;
  handleProgress: (progress: any) => void;
  handleSeek: (time: number) => void;
  setDuration1: (duration: number) => void;
  playTime: number;
  globalDuration: number;
  playbackRates: any;
  changePlaybackRate: (rate: number) => void;
  videoAvailable: boolean;
  handlePlay: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  handleReset: () => void;
  resetGraphs: () => void;
  updateHz: number;
  handleUpdateHzChange: (value: number) => void;
  getRenderFps: any;
  descargarDatosVisibles: any;
  refs: {
    leftPressureSensor: any;
    rightPressureSensor: any;
  };
  leftWearables: any;
  rightWearables: any;
  experimentId: number;
  participantId: number;
  trialId: number;
  swId: number;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({
  playerRef1,
  videoSrc,
  videoError,
  playbackRate,
  handleProgress,
  handleSeek,
  setDuration1,
  playTime,
  globalDuration,
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
  descargarDatosVisibles,
  refs,
  leftWearables,
  rightWearables,
  experimentId,
  participantId,
  trialId,
  swId,
}) => {
  // Valores originales para la posición y tamaño
  const originalPosition = { x: 100, y: 100 };
  const originalSize = { width: 800, height: 600 };

  // Estado para alternar entre modo flotante y modo fijo
  const [isFloating, setIsFloating] = useState(false);

  // Estado para controlar la visibilidad del botón (al pasar el mouse)
  const [isHovered, setIsHovered] = useState(false);

  // Estados controlados para la posición y tamaño (para usar en Rnd)
  const [position, setPosition] = useState(originalPosition);
  const [size, setSize] = useState(originalSize);

  // Función para alternar el modo de la ventana.
  // Al cambiar a modo fijo, se "resetea" la posición y el tamaño a los originales.
  const toggleFloating = () => {
    if (isFloating) {
      setPosition(originalPosition);
      setSize(originalSize);
      setIsFloating(false);
    } else {
      setIsFloating(true);
    }
  };

  // Función para limitar el movimiento de la ventana flotante dentro de los límites de la página
  const limitPosition = (x: number, y: number) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Limitar la posición X (no dejar que se mueva más allá del borde derecho o izquierdo)
    const limitedX = Math.min(Math.max(x, 0), windowWidth - size.width);

    // Limitar la posición Y (no dejar que se mueva más allá del borde inferior o superior)
    const limitedY = Math.min(Math.max(y, 0), windowHeight - size.height);

    // Asegurarse de que la ventana no se desplace por debajo de la pantalla
    const limitedYWithBottom = Math.min(limitedY, windowHeight - size.height);

    return { x: limitedX, y: limitedYWithBottom };
  };

  // Contenido interno común (video y controles)
  const renderContent = () => (
    <>
      <VideoSection
        playerRef1={playerRef1}
        videoFile={videoSrc}
        videoError={videoError}
        playbackRate={playbackRate}
        handleProgress={handleProgress}
        handleSeek={handleSeek}
        onDuration1={(d: number) => setDuration1(d)}
      />
      {/* Barra de progreso global */}
      <TimeProgressBar
        currentTime={playTime}
        duration={globalDuration}
        onSeek={handleSeek}
      />
      <ControlPanel
        playbackRate={playbackRate}
        playbackRates={playbackRates}
        changePlaybackRate={changePlaybackRate}
        videoAvailable={videoAvailable}
        handlePlay={handlePlay}
        isPlaying={isPlaying}
        isPaused={isPaused}
        handleReset={handleReset}
        resetGraphs={resetGraphs}
        updateHz={updateHz}
        handleUpdateHzChange={handleUpdateHzChange}
        getRenderFps={getRenderFps}
        descargarDatos={() =>
          descargarDatosVisibles(
            refs.leftPressureSensor,
            refs.rightPressureSensor,
            leftWearables,
            rightWearables,
            experimentId,
            participantId,
            trialId,
            swId,
          )
        }
      />
    </>
  );

  return (
    // Se utiliza <Rnd> con posición absoluta para moverla libremente por la página.
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => {
        if (isFloating) {
          const limitedPosition = limitPosition(d.x, d.y);
          setPosition(limitedPosition);
        }
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        if (isFloating) {
          setSize({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
          });
          const limitedPosition = limitPosition(newPosition.x, newPosition.y);
          setPosition(limitedPosition);
        }
      }}
      disableDragging={!isFloating}
      enableResizing={
        isFloating
          ? {
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }
          : false
      }
      style={{
        position: 'absolute', // Permite mover la ventana libremente por la página
        zIndex: 1000,
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Cabecera fija para el botón */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 3000,
            padding: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFloating();
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.8rem',
              color: '#007bff',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            title={isFloating ? 'Fijar ventana' : 'Hacer ventana flotante'}
          >
            {isFloating ? <MdPushPin /> : <MdOpenWith />}
          </button>
        </div>
        {/* Contenedor scrollable del contenido */}
        <div style={{ flex: 1, overflow: 'auto' }}>{renderContent()}</div>
      </div>
    </Rnd>
  );
};

export default FloatingWindow;
