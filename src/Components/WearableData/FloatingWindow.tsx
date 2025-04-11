// FloatingWindow.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Rnd } from 'react-rnd';
import VideoSection from './VideoSection';
import TimeProgressBar from './TimeProgressBar';
import ControlPanel from './ControlPanel';
import { MdOpenWith, MdPushPin } from 'react-icons/md';
import { CSSProperties } from 'react';

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
  const originalSize = { width: 1200, height: 900 };

  // Estado para alternar entre modo flotante y modo fijo
  // isFloating === true → se puede mover/reescalar (modo flotante)
  // isFloating === false → se integra en el flujo normal (modo fijo)
  const [isFloating, setIsFloating] = useState(false);

  // Estado para controlar la visibilidad del botón (al pasar el mouse)
  const [isHovered, setIsHovered] = useState(false);

  // Estados controlados para la posición y tamaño (para usar en Rnd)
  const [position, setPosition] = useState(originalPosition);
  const [size, setSize] = useState(originalSize);

  // Función para alternar el modo de la ventana.
  // Al cambiar a modo fijo se recalcula la posición según el padre.
  const toggleFloating = () => {
    if (isFloating) {
      // Modo flotante → Modo fijo: Se restablecen posición y tamaño originales
      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const initialX = (parentRect.width - originalSize.width) / 2;
        const initialY = 20; // A 20px desde el tope
        setPosition({ x: initialX, y: initialY });
      } else {
        setPosition(originalPosition);
      }
      setSize(originalSize);
      setIsFloating(false);
    } else {
      // Modo fijo → Modo flotante: Se reduce el tamaño a la mitad
      setSize({
        width: originalSize.width / 2,
        height: originalSize.height / 2,
      });
      setIsFloating(true);
    }
  };

  // Al montar se posiciona la ventana fija centrada en el contenedor padre
  useEffect(() => {
    if (parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const initialX = (parentRect.width - originalSize.width) / 2;
      const initialY = 20;
      setPosition({ x: initialX, y: initialY });
    }
  }, [parentRef, originalSize.width, originalSize.height]);

  const containerStyle: CSSProperties = isFloating
    ? { position: 'absolute', zIndex: 1000 }
    : {
        position: 'relative',
        width: '100%',
        marginBottom: '20px',
        zIndex: 1000,
      };

  // Contenido interno (video y controles)
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

  // Propiedades para react-rnd
  const rndProps = {
    position: position,
    size: size,
    // Solo en modo flotante se habilitan drag y resize
    onDragStop: isFloating
      ? (_: any, d: { x: number; y: number }) => {
          setPosition({ x: d.x, y: d.y });
        }
      : undefined,
    onResizeStop: isFloating
      ? (
          _: any,
          __: any,
          ref: HTMLElement,
          ___: any,
          newPos: { x: number; y: number },
        ) => {
          setSize({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
          });
          setPosition({ x: newPos.x, y: newPos.y });
        }
      : undefined,
    disableDragging: !isFloating,
    enableResizing: isFloating,
    // Evitamos que se reduzca demasiado
    minWidth: 300,
    minHeight: 200,
    // Constrainamos el movimiento:
    // Si está flotante usamos los límites de la ventana,
    // de lo contrario, se integra en el layout del padre.
    bounds: isFloating ? 'window' : undefined,
    style: containerStyle,
  };

  // Renderizado condicional: si está flotante, usamos un portal
  const rndComponent = (
    <Rnd {...rndProps}>
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

  if (isFloating) {
    // Cuando la ventana es flotante, la renderizamos en un portal que la saca del flujo del layout
    return ReactDOM.createPortal(rndComponent, document.body);
  }

  return rndComponent;
};

export default FloatingWindow;
