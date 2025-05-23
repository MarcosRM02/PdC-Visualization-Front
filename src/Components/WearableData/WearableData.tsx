import { useRef, useEffect, useState, Fragment, useCallback } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { DataFrame } from 'danfojs';
import Plotly from 'plotly.js-dist-min';
import { throttle } from 'lodash';
import { IWearableDataProps } from '../../Interfaces/DataPanel';
import { handleRelayout, plotWearablesData } from './utils/plotHelpers';
import { descargarDatosVisibles } from './utils/dataDownload';
import { VideoCameraIcon } from '@heroicons/react/24/solid';
import FloatingWindow from './FloatingWindow';
import IconActionButton from './IconActionButton';
import { FaSync } from 'react-icons/fa';
import InfoButton from './Buttons/InfoButton';
import { HiOutlineFolderDownload } from 'react-icons/hi';
import ControlPanel from './ControlPanel';
import TimeProgressBar from './TimeProgressBar';

const WearablesData = ({
  wearables,
  trialId,
  experimentId,
  swId,
  participantId,
}: IWearableDataProps) => {
  // Refs para los videos
  const playerRef1 = useRef<ReactPlayer | null>(null);
  const playerRef2 = useRef<ReactPlayer | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);
  // Refs para gráficos
  const refs = {
    leftPressureSensor: useRef(null),
    leftAccelerometer: useRef(null),
    leftGyroscope: useRef(null),
    rightPressureSensor: useRef(null),
    rightAccelerometer: useRef(null),
    rightGyroscope: useRef(null),
  };

  // Refs para heatmaps
  const leftHeatmapRef = useRef<any>(null);
  const rightHeatmapRef = useRef<any>(null);

  const [playTime, setPlayTime] = useState<number>(0);
  const [duration1, setDuration1] = useState<number>(0);
  const [duration2, setDuration2] = useState<number>(0);
  // Duración global: máximo de ambas (si un video no está presente, su duración es 0)
  const globalDuration = Math.max(duration1, duration2);

  const previousTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [_, setFps] = useState(0);
  const [updateHz, setUpdateHz] = useState(50); // 50 Hz = velocidad normal
  const playerRefs = [playerRef1, playerRef2];
  const heatmapRefs = [leftHeatmapRef, rightHeatmapRef];
  const [hasEnded, setHasEnded] = useState(false);
  const [videoExists, setVideoExists] = useState<boolean>(false);
  const [hmVideoExists, setHmVideoExists] = useState<boolean>(false);

  const hmVideoSrc = `${
    import.meta.env.VITE_API_URL
  }/trials/retrieve-HMvideo/${trialId}`;
  const recordedVideoSrc = `${
    import.meta.env.VITE_API_URL
  }/trials/retrieve-video/${trialId}`;
  const videoDownloadUrl = `${
    import.meta.env.VITE_API_URL
  }/trials/download-recroded/${trialId}`;
  const hmDownloadUrl = `${
    import.meta.env.VITE_API_URL
  }/trials/download-HM/${trialId}`;

  const leftWearables = wearables.filter(
    (wearable) => wearable.wearableType === 'L',
  );
  const rightWearables = wearables.filter(
    (wearable) => wearable.wearableType === 'R',
  );

  const leftFrames = leftWearables.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );
  const rightFrames = rightWearables.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );
  const minLength = Math.min(
    ...leftFrames.map((frame) => frame.shape[0]),
    ...rightFrames.map((frame) => frame.shape[0]),
  );

  // Throttling para actualizar el tiempo
  const handleProgress = throttle((state: { playedSeconds: number }) => {
    setPlayTime(state.playedSeconds);
  }, 200);

  const handlePointClick = (data: any) => {
    if (data.points && data.points.length > 0) {
      const pointTime = data.points[0].x;
      setPlayTime(pointTime);
      if (playerRef1.current && playerRef2.current) {
        playerRef1.current.seekTo(pointTime, 'seconds');
        playerRef2.current.seekTo(pointTime, 'seconds');
      }
      // Para cada playerRef, si está montado hacemos seek
      playerRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.seekTo(pointTime, 'seconds');
        }
      });
    }
  };

  const updateCurrentTimeLine = (currentTime: any) => {
    if (Math.abs(currentTime - previousTimeRef.current) > 0.1) {
      Object.values(refs).forEach((ref) => {
        if (ref.current) {
          Plotly.relayout(ref.current, {
            // @ts-ignore
            'shapes[0].x0': currentTime,
            'shapes[0].x1': currentTime,
          });
        }
      });
      previousTimeRef.current = currentTime;
    }
  };

  const resetGraphs = () => {
    const graphRefs = Object.values(refs);
    graphRefs.forEach((ref) => {
      if (ref.current) {
        try {
          Plotly.relayout(ref.current, {
            'xaxis.autorange': true,
          });
        } catch (error) {
          console.error('Error al resetear el rango del gráfico:', error);
        }
      }
    });
  };

  //@ts-ignore
  const [playbackRate, setPlaybackRate] = useState(1);
  const changePlaybackRate = (rate: number) => {
    if (playerRef1.current) {
      playerRef1.current.getInternalPlayer().playbackRate = rate;
    }
    if (playerRef2.current) {
      playerRef2.current.getInternalPlayer().playbackRate = rate;
    }
    setPlaybackRate(rate);
  };

  const playbackRates = [
    { label: '2x', rate: 2 },
    { label: '1.75x', rate: 1.75 },
    { label: '1.5x', rate: 1.5 },
    { label: '1.25x', rate: 1.25 },
    { label: 'Normal', rate: 1 },
    { label: '0.75x', rate: 0.75 },
    { label: '0.5x', rate: 0.5 },
    { label: '0.25x', rate: 0.25 },
    { label: '0.12x', rate: 0.12 },
    { label: '0.02x', rate: 0.02 },
  ];

  // Pausa todos los reproductores
  const pauseAll = useCallback(() => {
    playerRefs.forEach((ref) => {
      const player = ref.current?.getInternalPlayer();
      if (player?.pause) player.pause();
    });
    heatmapRefs.forEach((hm) => hm.current?.stopAnimation());
  }, [playerRefs, heatmapRefs]);

  // Reinicia al frame 0 todos los reproductores
  const restartAll = useCallback(() => {
    playerRefs.forEach((ref) => ref.current?.seekTo(0));
    heatmapRefs.forEach((hm) => hm.current?.resetFrame());
  }, [playerRefs, heatmapRefs]);

  // Lanza play en todo
  const playAll = useCallback(() => {
    playerRefs.forEach((ref) => {
      const player = ref.current?.getInternalPlayer();
      if (player?.play) player.play();
    });
    heatmapRefs.forEach((hm) => hm.current?.startAnimation());
  }, [playerRefs, heatmapRefs]);

  // Handler Play/Pause
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      // → Pausa normal
      setIsPlaying(false);
      pauseAll();
    } else {
      // → Si antes había terminado, reiniciamos al inicio ahora
      if (hasEnded) {
        playerRef1.current?.seekTo(0);
        playerRef2.current?.seekTo(0);
        leftHeatmapRef.current?.resetFrame();
        rightHeatmapRef.current?.resetFrame();
        setHasEnded(false);
      }
      // → Y arrancamos
      setIsPlaying(true);
      playAll();
    }
  }, [isPlaying, hasEnded, pauseAll, playAll]);

  // Cuando termina cualquiera de los videos, reinicia todo
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setHasEnded(true);
    pauseAll();
  }, [restartAll]);

  const handleUpdateHzChange = (newHz: number) => {
    setUpdateHz(newHz);
    if (leftHeatmapRef.current) {
      leftHeatmapRef.current.setUpdateHz(newHz);
    }
    if (rightHeatmapRef.current) {
      rightHeatmapRef.current.setUpdateHz(newHz);
    }
    const newPlaybackRate = newHz / 50;
    changePlaybackRate(newPlaybackRate);
  };

  // Función para sincronizar el seek en ambos videos
  const handleSeek = (newTime: number) => {
    if (Math.abs(newTime - playTime) < 0.1) return;
    setPlayTime(newTime);
    if (playerRef1.current) {
      playerRef1.current.seekTo(newTime, 'seconds');
    }
    if (playerRef2.current) {
      playerRef2.current.seekTo(newTime, 'seconds');
    }
    playerRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.seekTo(newTime, 'seconds');
      }
    });
  };

  // Llamada a funciones de graficado
  useEffect(() => {
    plotWearablesData(leftWearables, rightWearables, refs, playTime, minLength);

    Object.values(refs).forEach((ref) => {
      // @ts-ignore
      if (ref.current && typeof ref.current.on === 'function') {
        // @ts-ignore
        ref.current.on('plotly_relayout', (eventData: any) =>
          handleRelayout(eventData, ref.current, refs),
        );
      }
    });
  }, [wearables, ...Object.values(refs)]);

  useEffect(() => {
    Object.values(refs).forEach((ref) => {
      // @ts-ignore
      if (ref.current && typeof ref.current.on === 'function') {
        // @ts-ignore
        ref.current.on('plotly_click', handlePointClick);
      }
    });
  }, []);

  useEffect(() => {
    updateCurrentTimeLine(playTime);
  }, [playTime]);

  // 1Comprobar existencia del vídeo principal
  useEffect(() => {
    axios
      .head(`/trials/retrieve-video/${trialId}`)
      .then(() => setVideoExists(true))
      .catch((err) => {
        if (err.response?.status === 404) {
          console.warn('Vídeo principal no disponible (404)');
          setVideoExists(false);
        } else {
          console.error('Error comprobando vídeo principal:', err);
        }
      });
  }, [trialId]);

  // 2Comprobar existencia del HM video
  useEffect(() => {
    axios
      .head(`/trials/retrieve-HMvideo/${trialId}`)
      .then(() => setHmVideoExists(true))
      .catch((err) => {
        if (err.response?.status === 404) {
          console.warn('HM video no disponible (404)');
          setHmVideoExists(false);
        } else {
          console.error('Error comprobando HM video:', err);
        }
      });
  }, [trialId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const leftFps = leftHeatmapRef.current?.fps || 0;
      const rightFps = rightHeatmapRef.current?.fps || 0;
      setFps((leftFps + rightFps) / 2);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const attachSeekListener = (
      playerRef: React.RefObject<ReactPlayer>,
      onSeeked: () => void,
    ) => {
      if (playerRef.current) {
        const internalPlayer = playerRef.current.getInternalPlayer();
        if (internalPlayer && internalPlayer.addEventListener) {
          internalPlayer.addEventListener('seeked', onSeeked);
          return () => internalPlayer.removeEventListener('seeked', onSeeked);
        }
      }
    };

    const onSeekedHandler = () => {
      const newTime =
        playerRef1.current?.getInternalPlayer().currentTime ||
        playerRef2.current?.getInternalPlayer().currentTime ||
        0;
      setPlayTime(newTime);
      if (playerRef1.current) {
        playerRef1.current.seekTo(newTime, 'seconds');
      }
      if (playerRef2.current) {
        playerRef2.current.seekTo(newTime, 'seconds');
      }
    };

    const cleanup1 = attachSeekListener(playerRef1, onSeekedHandler);
    const cleanup2 = attachSeekListener(playerRef2, onSeekedHandler);
    return () => {
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        Object.values(refs).forEach((ref: any) => {
          if (ref.current) {
            // Redimensionamos la gráfica
            Plotly.Plots.resize(ref.current);
            // Forzamos un re-layout de la leyenda, definiendo explícitamente las propiedades relativas
            Plotly.relayout(ref.current, {
              //@ts-ignore
              'legend.xref': 'paper',
              'legend.yref': 'paper',
              'legend.x': 0.5,
              'legend.y': 1.05,
            });
          }
        });
      }, 100); // Un delay de 100ms
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [refs]);

  return (
    <div
      ref={parentRef}
      className="relative overflow-visible flex flex-col bg-gray-100"
    >
      {/* Sección de gráficos detallados */}
      <div className="flex justify-center space-x-6 items-center">
        <IconActionButton
          onClick={resetGraphs}
          icon={<FaSync />}
          color="orange"
          tooltip="Reset Plots" // Aquí se define el mensaje del tooltip
        />
        <div className="flex items-center space-x-2">
          <IconActionButton
            onClick={() =>
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
            icon={<HiOutlineFolderDownload />}
            color="blue"
            tooltip="Download Visible Data"
          />
          <InfoButton />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-8">
        {/* Contenedor para las gráficas de presión */}
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner overflow-auto">
            {leftWearables.map((_wearable, index) => (
              <Fragment key={index}>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                  Left Pressure Sensors
                </h2>
                <div
                  ref={refs.leftPressureSensor}
                  id="leftPressureSensor"
                ></div>
              </Fragment>
            ))}
          </div>
          <div
            className="relative w-full max-w-md rounded-lg overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
          >
            {hmVideoExists ? (
              <ReactPlayer
                ref={playerRef2}
                url={hmVideoSrc}
                playing={isPlaying}
                onProgress={handleProgress}
                onEnded={handleEnded}
                onSeek={handleSeek}
                onDuration={(d) => setDuration2(d)}
                width="100%"
                height="auto"
                controls={false}
                className="rounded-lg"
                playbackRate={playbackRate}
                onError={() => {}}
                progressInterval={(1 / 50) * 1000}
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
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-[500px] bg-gray-800 text-white text-xl font-semibold rounded-lg">
                <VideoCameraIcon className="h-12 w-12 mb-3" />
                <span>Heatmap is being generated</span>
              </div>
            )}
            <TimeProgressBar
              currentTime={playTime}
              duration={globalDuration}
              onSeek={handleSeek}
            />
            <ControlPanel
              videoDownloadUrl={hmDownloadUrl}
              playbackRate={playbackRate}
              playbackRates={playbackRates}
              changePlaybackRate={changePlaybackRate}
              videoAvailable={hmVideoExists}
              handlePlay={handlePlayPause}
              isPlaying={isPlaying}
              handleReset={restartAll}
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
          </div>
          <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner overflow-auto">
            {rightWearables.map((_wearable, index) => (
              <Fragment key={index}>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                  Right Pressure Sensors
                </h2>
                <div
                  ref={refs.rightPressureSensor}
                  id="rightPressureSensor"
                ></div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Contenedor para las gráficas adicionales */}
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner overflow-auto">
          {leftWearables.map((_wearable, index) => (
            <Fragment key={index}>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Left Accelerometer
              </h2>
              <div
                ref={refs.leftAccelerometer}
                id="leftAccelerometer"
                className="mb-6"
              ></div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Left Gyroscope
              </h2>
              <div
                ref={refs.leftGyroscope}
                id="leftGyroscope"
                className="mb-6"
              ></div>
            </Fragment>
          ))}
        </div>
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner overflow-auto">
          {rightWearables.map((_wearable, index) => (
            <Fragment key={index}>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Right Accelerometer
              </h2>
              <div
                ref={refs.rightAccelerometer}
                id="rightAccelerometer"
                className="mb-6"
              ></div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Right Gyroscope
              </h2>
              <div
                ref={refs.rightGyroscope}
                id="rightGyroscope"
                className="mb-6"
              ></div>
            </Fragment>
          ))}
        </div>
      </div>
      {videoExists && (
        <div className="relative mt-5">
          <FloatingWindow
            playerRef1={playerRef1}
            videoSrc={recordedVideoSrc}
            videoDownloadUrl={videoDownloadUrl}
            playbackRate={playbackRate}
            handleProgress={handleProgress}
            handleSeek={handleSeek}
            setDuration1={setDuration1}
            playTime={playTime}
            globalDuration={globalDuration}
            playbackRates={playbackRates}
            changePlaybackRate={changePlaybackRate}
            videoAvailable={videoExists}
            handlePlay={handlePlayPause}
            isPlaying={isPlaying}
            handleReset={restartAll}
            resetGraphs={resetGraphs}
            updateHz={updateHz}
            handleUpdateHzChange={handleUpdateHzChange}
            descargarDatosVisibles={descargarDatosVisibles}
            refs={refs}
            leftWearables={leftWearables}
            rightWearables={rightWearables}
            experimentId={experimentId}
            participantId={participantId}
            trialId={trialId}
            swId={swId}
            parentRef={parentRef}
            onEnded={handleEnded}
          />
        </div>
      )}
    </div>
  );
};

export default WearablesData;
