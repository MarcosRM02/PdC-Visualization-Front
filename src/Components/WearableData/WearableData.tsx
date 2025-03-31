import { useRef, useEffect, useState, Fragment, useCallback } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { DataFrame } from 'danfojs'; //concat tb estaba
import Plotly from 'plotly.js-dist-min';
import { throttle } from 'lodash';
import { WearableDataProps } from '../../Types/Interfaces';
import VideoSection from './VideoSection';
import ControlPanel from './ControlPanel';
import { handleRelayout, plotWearablesData } from './utils/plotHelpers';
import { descargarDatosVisibles } from './utils/dataDownload';
import TimeProgressBar from './TimeProgressBar';
//import CustomLegendPlot from './loDeLaLeyenda_UsarloMasTarde';

const WearablesData = ({
  wearables,
  trialId,
  experimentId,
  swId,
  participantId,
}: WearableDataProps) => {
  // Refs para los videos
  const playerRef1 = useRef<ReactPlayer | null>(null);
  const playerRef2 = useRef<ReactPlayer | null>(null);

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
  const [animationsFinished, setAnimationsFinished] = useState({
    left: false,
    right: false,
  });
  const [videoSrc, setVideoSrc] = useState('');
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoSrc2, setVideoSrc2] = useState('');
  const [hmVideoError, setHmVideoError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
    }
  };

  useEffect(() => {
    if (isPlaying && animationsFinished.left && animationsFinished.right) {
      setIsPlaying(false);
    }
  }, [isPlaying, animationsFinished]);

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

  // Obtención del video desde la API
  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/trials/retrieve-video/${trialId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            responseType: 'blob',
          },
        );
        const videoBlob = response.data;
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoSrc(videoUrl);
      } catch (error: any) {
        // Si es un 404, simplemente dejamos videoSrc vacío y no seteamos el error
        if (error.response && error.response.status === 404) {
          console.warn('Video principal no disponible (404)');
          setVideoSrc('');
        } else {
          console.error('Error fetching the video:', error);
          setVideoError(true);
        }
      }
    };

    fetchVideo();

    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [trialId]);

  // Obtención del HM desde la API

  useEffect(() => {
    const fetchHMVideo = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/trials/retrieve-HMvideo/${trialId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            responseType: 'blob',
          },
        );
        const videoBlob = response.data;
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoSrc2(videoUrl);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.warn('Video HM no disponible (404)');
          setVideoSrc2('');
        } else {
          console.error('Error fetching the HM video:', error);
          setHmVideoError(true);
        }
      }
    };

    fetchHMVideo();

    return () => {
      if (videoSrc2) {
        URL.revokeObjectURL(videoSrc2);
      }
    };
  }, [trialId]);

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
    {
      label: `${(1 / leftWearables[0].frequency).toFixed(2)}x`,
      rate: 1 / leftWearables[0].frequency,
    },
    { label: '0.25x', rate: 0.25 },
    { label: '1x', rate: 1 },
    { label: '2x', rate: 2 },
  ];

  const videoAvailable =
    (!!videoSrc || !!videoSrc2) && !videoError && !hmVideoError;

  // Efecto duplicado para animaciones finalizadas
  useEffect(() => {
    if (isPlaying && animationsFinished.left && animationsFinished.right) {
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isPlaying, animationsFinished]);

  const [_, setFps] = useState(0);
  const [updateHz, setUpdateHz] = useState(50); // 50 Hz = velocidad normal

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

  useEffect(() => {
    const interval = setInterval(() => {
      const leftFps = leftHeatmapRef.current?.fps || 0;
      const rightFps = rightHeatmapRef.current?.fps || 0;
      setFps((leftFps + rightFps) / 2);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRenderFps = useCallback(() => {
    const leftFps = leftHeatmapRef.current?.fps || 0;
    const rightFps = rightHeatmapRef.current?.fps || 0;
    return { leftFps, rightFps };
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      // Si está reproduciendo, lo pausamos
      setIsPlaying(false);
      setIsPaused(true);
      if (playerRef1.current) {
        playerRef1.current.getInternalPlayer().pause();
      }
      if (playerRef2.current) {
        playerRef2.current.getInternalPlayer().pause();
      }
      if (leftHeatmapRef.current) {
        leftHeatmapRef.current.stopAnimation();
      }
      if (rightHeatmapRef.current) {
        rightHeatmapRef.current.stopAnimation();
      }
    } else {
      let shouldRestart = false;

      if (playerRef1.current) {
        const duration1 = playerRef1.current.getDuration();
        const currentTime1 = playerRef1.current.getCurrentTime();
        if (currentTime1 >= duration1 - 0.1) {
          // Consideramos margen de error
          shouldRestart = true;
        }
      }

      if (playerRef2.current) {
        const duration2 = playerRef2.current.getDuration();
        const currentTime2 = playerRef2.current.getCurrentTime();
        if (currentTime2 >= duration2 - 0.1) {
          shouldRestart = true;
        }
      }

      // Si el video está al final, reiniciamos la reproducción desde el inicio como si fuera Play, no Resume
      if (shouldRestart) {
        setIsPlaying(false); // Cambia el estado a "no está reproduciendo" para forzar el estado de Play
        setTimeout(() => {
          setIsPlaying(true); // Luego lo vuelve a activar como un nuevo Play
        }, 100); // Pequeño delay para asegurar que React actualice correctamente el estado
      } else {
        setIsPlaying(true);
        setIsPaused(false);
      }

      if (playerRef1.current) {
        if (shouldRestart) {
          playerRef1.current.seekTo(0);
        }
        playerRef1.current.getInternalPlayer().play();
      }

      if (playerRef2.current) {
        if (shouldRestart) {
          playerRef2.current.seekTo(0);
        }
        playerRef2.current.getInternalPlayer().play();
      }

      if (leftHeatmapRef.current) {
        if (shouldRestart) {
          leftHeatmapRef.current.resetFrame();
        }
        leftHeatmapRef.current.startAnimation();
      }

      if (rightHeatmapRef.current) {
        if (shouldRestart) {
          rightHeatmapRef.current.resetFrame();
        }
        rightHeatmapRef.current.startAnimation();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setAnimationsFinished({ left: false, right: false });
    if (playerRef1.current) {
      playerRef1.current.seekTo(0);
      playerRef1.current.getInternalPlayer().pause();
    }
    if (playerRef2.current) {
      playerRef2.current.seekTo(0);
      playerRef2.current.getInternalPlayer().pause();
    }
    if (leftHeatmapRef.current) {
      leftHeatmapRef.current.resetFrame();
    }
    if (rightHeatmapRef.current) {
      rightHeatmapRef.current.resetFrame();
    }
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
  };

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
      Object.values(refs).forEach((ref: any) => {
        if (ref.current) {
          Plotly.Plots.resize(ref.current);
        }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [refs]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <VideoSection
        playerRef1={playerRef1}
        playerRef2={playerRef2}
        videoFile={videoSrc}
        videoFile2={videoSrc2}
        videoError={videoError}
        playbackRate={playbackRate}
        handleProgress={handleProgress}
        handleSeek={handleSeek}
        onDuration1={(d) => setDuration1(d)}
        onDuration2={(d) => setDuration2(d)}
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
      {/* <CustomLegendPlot /> */}
      {/* Sección de gráficos detallados */}
      <div className="mt-16 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner overflow-auto">
          {leftWearables.map((_wearable, index) => (
            <Fragment key={index}>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Sensor de Presión Izquierdo
              </h2>
              <div
                ref={refs.leftPressureSensor}
                id="leftPressureSensor"
                className="mb-6"
              ></div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Acelerómetro Izquierdo
              </h2>
              <div
                ref={refs.leftAccelerometer}
                id="leftAccelerometer"
                className="mb-6"
              ></div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Giroscopio Izquierdo
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
                Sensor de Presión Derecho
              </h2>
              <div
                ref={refs.rightPressureSensor}
                id="rightPressureSensor"
              ></div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4 mt-6">
                Acelerómetro Derecho
              </h2>
              <div
                ref={refs.rightAccelerometer}
                id="rightAccelerometer"
                className="mb-6"
              ></div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Giroscopio Derecho
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
    </div>
  );
};

export default WearablesData;
