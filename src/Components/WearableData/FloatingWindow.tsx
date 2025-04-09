import React, { useEffect, useState } from 'react';
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
  parentRef: React.RefObject<HTMLDivElement>;
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
  parentRef,
}) => {
  // Valores originales para la posición y tamaño
  const originalPosition = { x: 100, y: 100 };
  const originalSize = { width: 1000, height: 1100 };

  // Estado para alternar entre modo flotante y modo fijo
  // isFloating === true → se puede mover/reescalar (sobrepuesto)
  // isFloating === false → se fija y se integra en el flujo normal
  const [isFloating, setIsFloating] = useState(false);

  // Estado para controlar la visibilidad del botón (al pasar el mouse)
  const [isHovered, setIsHovered] = useState(false);

  // Estados controlados para la posición y tamaño (para usar en Rnd)
  const [position, setPosition] = useState(originalPosition);
  const [size, setSize] = useState(originalSize);

  // Función para alternar el modo de la ventana.
  // Al cambiar a modo fijo, se reinicia la posición (se recalcule para estar más arriba)
  const toggleFloating = () => {
    if (isFloating) {
      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        // Reposicionar la ventana fija en la parte superior central (con un offset vertical)
        const initialX = (parentRect.width - originalSize.width) / 2;
        const initialY = 20; // Queda a 20px desde el tope
        setPosition({ x: initialX, y: initialY });
      } else {
        setPosition(originalPosition);
      }
      setSize(originalSize);
      setIsFloating(false);
    } else {
      setIsFloating(true);
    }
  };

  useEffect(() => {
    if (parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const initialX = (parentRect.width - originalSize.width) / 2;
      const initialY = 20;
      setPosition({ x: initialX, y: initialY });
    }
  }, [parentRef, originalSize.width, originalSize.height]);

  // Función para limitar el movimiento dentro del contenedor padre
  const limitPosition = (x: number, y: number) => {
    const parentEl = parentRef.current;
    if (parentEl) {
      const containerWidth = parentEl.clientWidth;
      const containerHeight = parentEl.clientHeight;
      const maxX =
        containerWidth > size.width ? containerWidth - size.width : 0;
      const maxY =
        containerHeight > size.height ? containerHeight - size.height : 0;
      const limitedX = Math.min(Math.max(x, 0), maxX);
      const limitedY = Math.min(Math.max(y, 0), maxY);
      return { x: limitedX, y: limitedY };
    }
    return { x, y };
  };

  // Definimos el estilo del contenedor según el modo:
  // Modo flotante: se posiciona de forma absoluta (sobrepuesto)
  // Modo fijo: se integra en el flujo normal (posición relativa) para que empuje el contenido siguiente
  const containerStyle = isFloating
    ? { position: 'absolute', zIndex: 1000 }
    : {
        position: 'relative',
        width: '100%',
        zIndex: 1000,
        marginBottom: '20px',
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
    <Rnd
      // Al usar Rnd en modo fijo (no flotante) eliminamos el posicionamiento absoluto para integrarlo en el layout
      position={position}
      size={size}
      onDragStop={(_, d) => {
        if (isFloating) {
          const limitedPosition = limitPosition(d.x, d.y);
          setPosition(limitedPosition);
        }
      }}
      onResizeStop={(_, __, ref, ___, newPosition) => {
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
      enableResizing={isFloating}
      //@ts-ignore
      style={containerStyle}
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
        <div style={{ flex: 1, overflow: 'auto' }}>{renderContent()}</div>
      </div>
    </Rnd>
  );
};

export default FloatingWindow;
