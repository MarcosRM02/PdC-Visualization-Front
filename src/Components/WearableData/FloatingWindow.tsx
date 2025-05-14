import React, { useEffect, useState, CSSProperties } from 'react';
import { Rnd } from 'react-rnd';
import VideoSection from './VideoSection';
import TimeProgressBar from './TimeProgressBar';
import ControlPanel from './ControlPanel';
import { MdOpenWith, MdPushPin } from 'react-icons/md';
import { IFloatingWindowProps } from '../../Interfaces/DataPanel';

const FloatingWindow: React.FC<IFloatingWindowProps> = ({
  playerRef1,
  videoSrc,
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
  handleReset,
  resetGraphs,
  updateHz,
  handleUpdateHzChange,
  descargarDatosVisibles,
  refs,
  leftWearables,
  rightWearables,
  experimentId,
  participantId,
  trialId,
  swId,
  parentRef,
  onEnded,
}) => {
  // TAMAÑO ORIGINAL deseado para la ventana fija.
  const originalSize = { width: 1200, height: 900 };
  // Valor por defecto si no se puede calcular la posición del contenedor
  const defaultPosition = { x: 100, y: 100 };

  // Al montar, se calcula la posición fija inicial (por ejemplo, centrada y 20px del tope)
  const [initialFixed, setInitialFixed] = useState(defaultPosition);
  // La posición y tamaño actuales del componente
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(originalSize);
  // Estado que indica el modo: false = fijo, true = flotante
  const [isFloating, setIsFloating] = useState(false);
  // Estado para controlar el hover del botón
  const [isHovered, setIsHovered] = useState(false);

  // Al montar, calculamos la posición fija inicial utilizando el contenedor padre
  useEffect(() => {
    if (parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const fixedPos = {
        x: (parentRect.width - originalSize.width) / 2,
        y: 20,
      };
      setInitialFixed(fixedPos);
      setPosition(fixedPos);
      setSize(originalSize);
    }
  }, [parentRef, originalSize.width, originalSize.height]);

  // Función para alternar entre modo fijo y flotante
  const toggleFloating = () => {
    if (isFloating) {
      // Al fijar la ventana, siempre se vuelve a la configuración fija original
      setPosition(initialFixed);
      setSize(originalSize);
      setIsFloating(false);
    } else {
      // Al pasar a modo flotante, se reduce el tamaño a la mitad para facilitar la manipulación.
      // Se conserva la posición actual (la fija) hasta que el usuario la mueva manualmente.
      setSize({
        width: originalSize.width / 2,
        height: originalSize.height / 2,
      });
      setIsFloating(true);
    }
  };

  // Position absolute para evitar que el componente modifique el layout de la página.
  const containerStyle: CSSProperties = {
    position: isFloating ? 'absolute' : 'static',
    zIndex: 1000,
  };
  // Propiedades para react-rnd
  const rndProps = {
    position,
    size,
    onDragStop: isFloating
      ? (_: any, data: { x: number; y: number }) => {
          setPosition({ x: data.x, y: data.y });
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
    minWidth: 300,
    minHeight: 200,
    bounds: isFloating && parentRef.current ? parentRef.current : undefined,
    style: containerStyle,
  };

  // Contenido interno: video y controles
  const renderContent = () => (
    <>
      <VideoSection
        playerRef1={playerRef1}
        videoFile={videoSrc}
        isPlaying={isPlaying}
        playbackRate={playbackRate}
        handleProgress={handleProgress}
        handleSeek={handleSeek}
        onDuration1={(d: number) => setDuration1(d)}
        onEnded={onEnded}
      />
      <TimeProgressBar
        currentTime={playTime}
        duration={globalDuration}
        onSeek={handleSeek}
      />
      <ControlPanel
        videoSrc={videoSrc}
        videoName="RecordedVideo"
        playbackRate={playbackRate}
        playbackRates={playbackRates}
        changePlaybackRate={changePlaybackRate}
        videoAvailable={videoAvailable}
        handlePlay={handlePlay}
        isPlaying={isPlaying}
        handleReset={handleReset}
        resetGraphs={resetGraphs}
        updateHz={updateHz}
        handleUpdateHzChange={handleUpdateHzChange}
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

  // Se retorna el mismo componente para conservar la instancia del video.
  return rndComponent;
};

export default FloatingWindow;
