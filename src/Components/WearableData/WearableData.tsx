import { useRef, useEffect, useState, Fragment, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ReactPlayer from 'react-player';
import { WearableDataProps } from '../../Types/Interfaces';
import { DataFrame, concat, toCSV } from 'danfojs';
import Plotly from 'plotly.js-dist-min';
import axios from 'axios';
import HeatMap from './Heatmap'; // Asegúrate de que la ruta sea correcta
import ColorLegend from './ColorLegend';
import { VideoCameraIcon } from '@heroicons/react/24/solid';
import { throttle } from 'lodash'; // Importa throttle
import leftPointsData from './data/leftPoints.json';
import rightPointsData from './data/rightPoints.json';
import HeatmapControlPanel from './heatmapControl';

const WearablesData = ({
  wearables,
  trialId,
  experimentId,
  swId,
  participantId,
}: WearableDataProps) => {
  const refs = {
    leftPressureSensor: useRef(null),
    leftAccelerometer: useRef(null),
    leftGyroscope: useRef(null),
    rightPressureSensor: useRef(null),
    rightAccelerometer: useRef(null),
    rightGyroscope: useRef(null),
  };

  const [playTime, setPlayTime] = useState<number>(0);
  const playerRef = useRef<ReactPlayer | null>(null);
  const previousTimeRef = useRef(0); // Referencia para el tiempo anterior
  // Nuevos estados para manejar el botón de Play y la finalización de animaciones
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationsFinished, setAnimationsFinished] = useState({
    left: false,
    right: false,
  });
  // Crear refs para ambos ImagePlotCanvas
  const leftHeatmapRef = useRef<any>(null);
  const rightHeatmapRef = useRef<any>(null);
  const [videoSrc, setVideoSrc] = useState('');

  const [videoError, setVideoError] = useState<boolean>(false);
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

  // Implementa throttling para manejar la frecuencia de actualización
  const handleProgress = throttle((state: { playedSeconds: number }) => {
    setPlayTime(state.playedSeconds);
  }, 200); // Actualiza cada 200ms

  const handlePointClick = (data: any) => {
    if (data.points && data.points.length > 0) {
      const pointTime = data.points[0].x;
      setPlayTime(pointTime);
      if (playerRef.current) {
        playerRef.current.seekTo(pointTime, 'seconds');
      }
    }
  };

  // Efecto para detectar cuando ambas animaciones han terminado
  useEffect(() => {
    if (isPlaying && animationsFinished.left && animationsFinished.right) {
      setIsPlaying(false);
    }
  }, [isPlaying, animationsFinished]);

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
    // Solo actualiza si el cambio es mayor a 0.1 segundos
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

  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/trials/retrieve-video/${trialId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'blob',
          },
        );

        const videoBlob = response.data;
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoSrc(videoUrl);
      } catch (error) {
        console.error('Error fetching the video:', error);
        setVideoError(true); // Actualizar estado de error
      }
    };

    fetchVideo();

    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [trialId]);

  //@ts-ignore
  const [playbackRate, setPlaybackRate] = useState(1);
  const changePlaybackRate = (rate: any) => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const frames = leftWearables.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );

  const df = concat({ dfList: frames, axis: 1 });
  // @ts-ignore
  let datos = df.iloc({ rows: [`0:${minLength}`], columns: [':32'] });

  const traces = datos.columns.map((column: string) => ({
    // @ts-ignore
    y: datos[column].values,
  }));

  const frames2 = rightWearables.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );

  const df2 = concat({ dfList: frames2, axis: 1 });
  // @ts-ignore
  let datos2 = df2.iloc({ rows: [`0:${minLength}`], columns: [':32'] });

  const traces2 = datos2.columns.map((column: string) => ({
    // @ts-ignore
    y: datos2[column].values,
  }));

  const [leftPoints, setLeftPoints] = useState<
    { x: number; y: number; values: number[] }[]
  >([]);

  useEffect(() => {
    const loadedPoints = leftPointsData.map((point) => ({
      ...point,
      values: [],
    }));
    setLeftPoints(loadedPoints);
  }, []);

  const [rightPoints, setRightPoints] = useState<
    { x: number; y: number; values: number[] }[]
  >([]);

  useEffect(() => {
    const loadedPoints = rightPointsData.map((point) => ({
      ...point,
      values: [],
    }));
    setRightPoints(loadedPoints);
  }, []);

  leftPoints.forEach((point, index) => {
    if (traces[index]) {
      point.values = traces[index].y;
    }
  });

  rightPoints.forEach((point, index) => {
    if (traces2[index]) {
      point.values = traces2[index].y;
    }
  });

  const rate0 = 1 / leftWearables[0].frequency; // Calcula la velocidad
  const formattedRate0 = rate0.toFixed(2); // Formatea a dos decimales, por ejemplo, '0.15'

  // Definir las velocidades de reproducción
  const playbackRates = [
    { label: `${formattedRate0}x`, rate: rate0 },
    { label: '0.25x', rate: 0.25 },
    { label: '1x', rate: 1 },
    { label: '2x', rate: 2 },
  ];

  const videoAvailable = videoSrc && !videoError;

  // Efecto para detectar cuando ambas animaciones han terminado
  useEffect(() => {
    if (isPlaying && animationsFinished.left && animationsFinished.right) {
      setIsPlaying(false);
    }
  }, [isPlaying, animationsFinished]);


  const [_, setFps] = useState(0); // FPS compartido
  const [updateHz, setUpdateHz] = useState(50); // Hz compartido (valor actual por defecto)

  const handleUpdateHzChange = (newHz: number) => {
    setUpdateHz(newHz);

    // Sincronizar con ambos heatmaps
    if (leftHeatmapRef.current) {
      leftHeatmapRef.current.setUpdateHz(newHz);
    }
    if (rightHeatmapRef.current) {
      rightHeatmapRef.current.setUpdateHz(newHz);
    }
  };

  // Obtener el FPS de ambos heatmaps (promediar si necesario)
  useEffect(() => {
    const interval = setInterval(() => {
      const leftFps = leftHeatmapRef.current?.fps || 0;
      const rightFps = rightHeatmapRef.current?.fps || 0;
      setFps((leftFps + rightFps) / 2); // Promedio del FPS
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Función para obtener los FPS actuales de ambos heatmaps
  const getRenderFps = useCallback(() => {
    const leftFps = leftHeatmapRef.current?.fps || 0;
    const rightFps = rightHeatmapRef.current?.fps || 0;
    return { leftFps, rightFps };
  }, []);

  const handlePlay = () => {
    // Si las animaciones han terminado, reiniciar todo
    if (animationsFinished.left && animationsFinished.right) {
      setAnimationsFinished({ left: false, right: false });
      setIsPlaying(true);
      setIsPaused(false);

      if (leftHeatmapRef.current) {
        leftHeatmapRef.current.resetFrame();
        leftHeatmapRef.current.startAnimation();
      }
      if (rightHeatmapRef.current) {
        rightHeatmapRef.current.resetFrame();
        rightHeatmapRef.current.startAnimation();
      }
      return;
    }

    if (!isPlaying && !isPaused) {
      // Iniciar la animación desde el principio
      setIsPlaying(true);
      setIsPaused(false);

      if (leftHeatmapRef.current) {
        leftHeatmapRef.current.resetFrame();
        leftHeatmapRef.current.startAnimation();
      }
      if (rightHeatmapRef.current) {
        rightHeatmapRef.current.resetFrame();
        rightHeatmapRef.current.startAnimation();
      }
    } else if (isPlaying) {
      // Pausar la animación
      setIsPlaying(false);
      setIsPaused(true);

      if (leftHeatmapRef.current) {
        leftHeatmapRef.current.stopAnimation();
      }
      if (rightHeatmapRef.current) {
        rightHeatmapRef.current.stopAnimation();
      }
    } else if (isPaused) {
      // Reanudar la animación desde el estado pausado
      setIsPlaying(true);
      setIsPaused(false);

      if (leftHeatmapRef.current) {
        leftHeatmapRef.current.startAnimation();
      }
      if (rightHeatmapRef.current) {
        rightHeatmapRef.current.startAnimation();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setAnimationsFinished({ left: false, right: false });

    if (leftHeatmapRef.current) {
      leftHeatmapRef.current.resetFrame();
    }
    if (rightHeatmapRef.current) {
      rightHeatmapRef.current.resetFrame();
    }
  };

  const handleLeftAnimationEnd = () => {
    setAnimationsFinished((prev) => ({ ...prev, left: true }));
  };

  const handleRightAnimationEnd = () => {
    setAnimationsFinished((prev) => ({ ...prev, right: true }));
  };

  // Efecto para manejar el final de ambas animaciones
  useEffect(() => {
    if (isPlaying && animationsFinished.left && animationsFinished.right) {
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isPlaying, animationsFinished]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-9xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sección Izquierda: Reproductor de Video y Controles */}
          <div className="flex flex-col lg:w-2/3 w-full bg-gray-50 p-6 rounded-lg shadow-inner">
            <div className="relative aspect-video">
              {videoSrc && !videoError ? (
                <ReactPlayer
                  ref={playerRef}
                  url={videoSrc}
                  onProgress={handleProgress}
                  width="100%"
                  height="100%"
                  controls={true}
                  className="rounded-lg"
                  playbackRate={playbackRate} // Pasar playbackRate directamente
                  onError={() => setVideoError(true)} // Manejar errores de reproducción
                  progressInterval={(1 / rightWearables[0].frequency) * 1000} // Ajusta la tasa de refrresco de la linea de las gráficas
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
                  <VideoCameraIcon className="h-12 w-12 mb-3" />{' '}
                  {/* Icono de tamaño ajustado */}
                  <span>No hay ningún video disponible</span>
                </div>
              )}
            </div>

            {/* Controles de Velocidad de Reproducción */}
            <div className="mt-6 flex justify-center space-x-4">
              {playbackRates.map(({ label, rate }) => (
                <PlaybackButton
                  key={rate}
                  label={label}
                  onClick={() => changePlaybackRate(rate)}
                  active={Math.abs(playbackRate - rate) < 0.001} // Usar tolerancia para precisión
                  disabled={!videoAvailable} // Pasar la propiedad disabled
                />
              ))}
            </div>
          </div>

          {/* Sección Derecha: Mapas de Calor y Leyenda */}
          <div className="lg:w-1/3 w-full bg-gray-50 p-6 rounded-lg shadow-inner flex justify-center">
            {/* Sección Derecha: Mapas de Calor y Leyenda */}
            <div className="lg:w-1/3 w-full bg-gray-50 p-6 rounded-lg shadow-inner flex flex-col items-center">
              {/* Heatmap Control Panel Arriba */}
              <div className="w-full mb-6">
                <HeatmapControlPanel
                  updateHz={updateHz}
                  onUpdateHzChange={handleUpdateHzChange}
                  getRenderFps={getRenderFps}
                />
              </div>

              {/* Contenedor de los Mapas de Calor */}
              <div className="flex flex-row justify-center space-x-6 relative w-full">
                {/* Mapa de Calor Izquierdo */}
                <div className="flex-shrink-0">
                  <HeatMap
                    ref={leftHeatmapRef}
                    width={175}
                    height={530}
                    points={leftPoints}
                    initialUpdateHz={leftWearables[0].frequency}
                    onAnimationEnd={handleLeftAnimationEnd}
                  />
                </div>

                {/* Mapa de Calor Derecho */}
                <div className="flex-shrink-0">
                  <HeatMap
                    ref={rightHeatmapRef}
                    width={175}
                    height={530}
                    points={rightPoints}
                    initialUpdateHz={rightWearables[0].frequency}
                    onAnimationEnd={handleRightAnimationEnd}
                  />
                </div>

                {/* Leyenda de Colores a la Derecha */}
                <div className="absolute top-0 right-[-160px]">
                  <ColorLegend />
                </div>
              </div>

              {/* Botones de Control de Animación Abajo */}
              <div className="flex justify-center mt-6 space-x-6 w-full">
                <ActionButton
                  onClick={handlePlay}
                  label={isPlaying ? 'Playing' : isPaused ? 'Paused' : 'Play'}
                  color={isPlaying ? 'orange' : isPaused ? 'blue' : 'green'}
                />
                <ActionButton onClick={handleReset} label="Reset" color="red" />
              </div>
            </div>
          </div>
        </div>
        {/* Botones de Acción Unificados */}
        <div className="flex justify-center mt-12 space-x-6">
          <ActionButton
            onClick={resetGraphs}
            label="Resetear Gráficos"
            color="red"
          />
          <ActionButton
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
            label="Descargar Datos (ZIP)"
            color="blue"
          />
        </div>

        {/* Sección de Gráficos Detallados */}
        <div className="mt-16 flex flex-col lg:flex-row gap-8">
          {/* Gráficos Izquierdo */}
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

          {/* Gráficos Derecho */}
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
    </div>
  );
};

// Componente para los botones de reproducción
const PlaybackButton = ({
  label,
  onClick,
  active = false,
  disabled = false, // Nueva prop
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean; // Nueva prop
}) => (
  <button
    onClick={onClick}
    disabled={disabled} // Aplicar la prop
    className={`px-5 py-3 rounded ${
      active
        ? 'bg-green-500 text-white'
        : 'bg-blue-500 hover:bg-blue-700 text-white'
    } ${
      disabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : ''
    } transition duration-200 text-lg`}
  >
    {label}
  </button>
);

// Componente para los botones de acción
// const ActionButton = ({
//   onClick,
//   label,
//   color = 'blue',
// }: {
//   onClick: () => void;
//   label: string;
//   color?: 'blue' | 'red' | 'green';
//   disabled?: boolean; // Add disabled prop
// }) => {
//   const colorClasses =
//     color === 'red'
//       ? 'bg-red-500 hover:bg-red-700'
//       : color === 'green'
//       ? 'bg-green-500 hover:bg-green-700'
//       : 'bg-blue-500 hover:bg-blue-700';

//   return (
//     <button
//       onClick={onClick}
//       className={`${colorClasses} text-white font-bold py-3 px-8 rounded shadow-lg hover:shadow-xl transition duration-200 text-xl`}
//     >
//       {label}
//     </button>
//   );
// };

const ActionButton = ({
  onClick,
  label,
  color = 'blue',
}: {
  onClick: () => void;
  label: string;
  color?: 'blue' | 'red' | 'green' | 'orange';
}) => {
  const colorClasses =
    color === 'red'
      ? 'bg-red-500 hover:bg-red-700'
      : color === 'green'
      ? 'bg-green-500 hover:bg-green-700'
      : color === 'orange'
      ? 'bg-orange-500 hover:bg-orange-700'
      : 'bg-blue-500 hover:bg-blue-700';

  return (
    <button
      onClick={onClick}
      className={`${colorClasses} text-white font-bold py-3 px-8 rounded shadow-lg hover:shadow-xl transition duration-200 text-xl`}
    >
      {label}
    </button>
  );
};

function plotWearablesData(
  leftWearables: any,
  rightWearables: any,
  refs: any,
  playTime: any,
  minLength: number,
) {
  plotLeftWearable(leftWearables, refs, playTime, minLength);
  plotrightWearable(rightWearables, refs, playTime, minLength);
}

function plotLeftWearable(
  leftWearables: any,
  refs: any,
  playTime: any,
  minLength: number,
) {
  plotData(
    leftWearables,
    refs.leftPressureSensor.current,
    'Sensor de Presión Izquierdo',
    [':32'],
    playTime,
    minLength,
    [0, 4096],
  );
  plotData(
    leftWearables,
    refs.leftAccelerometer.current,
    'Acelerómetro Izquierdo',
    [32, 33, 34],
    playTime,
    minLength,
    [-33000, 33000],
  );
  plotData(
    leftWearables,
    refs.leftGyroscope.current,
    'Giroscopio Izquierdo',
    [35, 36, 37],
    playTime,
    minLength,
    [-33000, 33000],
  );
}

function plotrightWearable(
  rightWearables: any,
  refs: any,
  playTime: any,
  minLength: number,
) {
  plotData(
    rightWearables,
    refs.rightPressureSensor.current,
    'Sensor de Presión Derecho',
    [':32'],
    playTime,
    minLength,
    [0, 4096],
  );
  plotData(
    rightWearables,
    refs.rightAccelerometer.current,
    'Acelerómetro Derecho',
    [32, 33, 34],
    playTime,
    minLength,
    [-33000, 33000],
  );
  plotData(
    rightWearables,
    refs.rightGyroscope.current,
    'Giroscopio Derecho',
    [35, 36, 37],
    playTime,
    minLength,
    [-33000, 33000],
  );
}

function generateLayout(yRange?: [number, number]) {
  return {
    showlegend: true,
    legend: {
      orientation: 'h', // Orientación horizontal
      x: 0.5, // Centra la leyenda horizontalmente
      y: 1.05, // Posiciona la leyenda ligeramente por debajo del título
      xanchor: 'center', // Ancla la leyenda al centro en el eje x
      yanchor: 'bottom', // Ancla la leyenda desde la parte inferior
      bgcolor: '#fcba03',
      bordercolor: '#444',
      borderwidth: 1,
      font: { family: 'Arial', size: 12, color: '#fff' },
      pad: { t: 10, b: 10 }, // Padding superior e inferior de la leyenda
    },
    autosize: true,
    yaxis: {
      title: 'Valor',
      ...(yRange ? { range: yRange } : {}),
      fixedrange: true,
      titlefont: {
        size: 16,
        color: '#333',
      },
    },
    xaxis: {
      title: 'Tiempo (s)',
      titlefont: {
        size: 16,
        color: '#333',
      },
    },
    responsive: true,
    margin: {
      l: 60,
      r: 60,
      t: 60,
      b: 60,
    },
  };
}

function plotData(
  wearable: any,
  divId: HTMLElement | null,
  title: string,
  columns: (number | string)[],
  playTime: number,
  minLength: number,
  yRange?: [number, number],
) {
  if (!divId) {
    console.error('Elemento div inválido');
    return;
  }

  const frames = wearable.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );
  const df = concat({ dfList: frames, axis: 1 });

  // @ts-ignore
  let datos = df.iloc({ rows: [`0:${minLength}`], columns: columns });

  const traces = datos.columns.map((column: string) => ({
    x: Array.from(datos.index.values()).map(
      (index: any) => index / wearable[0].frequency,
    ),
    // @ts-ignore
    y: datos[column].values,
    type: 'scattergl',
    mode: 'lines',
    name: column,
    line: {
      width: 2,
    },
  }));

  const layout = generateLayout(yRange);

  // @ts-ignore
  layout.shapes = [
    {
      type: 'line',
      x0: playTime,
      x1: playTime,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: {
        color: 'red',
        width: 3,
        dash: 'dash',
      },
    },
  ];

  const config = {
    modeBarButtonsToShow: ['toImage'],
    modeBarButtonsToRemove: [
      'select2d',
      'lasso2d',
      'autoScale2d',
      'resetScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'zoomIn2d',
      //'zoomOut2d',
      'toggleSpikelines',
      'resetViews',
      'toggleHover',
      'toggleSelect',
      'drawline',
      'drawopenpath',
      'drawclosedpath',
      'drawcircle',
      'drawrect',
      'eraseshape',
      'zoom2d',
      'pan2d',
    ],
    displaylogo: false,
    displayModeBar: true,
    toImageButtonOptions: {
      filename: title,
    },
  };
  // @ts-ignore
  Plotly.newPlot(divId, traces, layout, config);
}

function handleRelayout(eventData: any, triggeredBy: any, refs: any) {
  const newRange = [
    eventData['xaxis.range[0]'] !== undefined
      ? eventData['xaxis.range[0]']
      : triggeredBy.current.layout.xaxis.range[0],
    eventData['xaxis.range[1]'] !== undefined
      ? eventData['xaxis.range[1]']
      : triggeredBy.current.layout.xaxis.range[1],
  ];

  const startIndex = Math.floor(newRange[0]);
  const endIndex = Math.ceil(newRange[1]);

  const graphRefs = Object.values(refs);

  graphRefs.forEach((ref) => {
    if (ref !== triggeredBy) {
      // @ts-ignore
      if (ref.current) {
        try {
          // @ts-ignore
          Plotly.relayout(ref.current, {
            'xaxis.range': [startIndex, endIndex],
          });
        } catch (error) {
          console.error('Error al actualizar el rango del gráfico:', error);
        }
      }
    }
  });
}

async function descargarDatosVisibles(
  leftDivId: any,
  rightDivId: any,
  leftWearable: any,
  rightWearable: any,
  experimentId: number,
  participantId: number,
  trialId: number,
  swId: number,
) {
  const zip = new JSZip();

  const generarCSVEnRango = (divId: any, wearable: any, _type: string) => {
    const plotInstance = document.getElementById(divId.current.id);
    // @ts-ignore
    let xRange = plotInstance.layout.xaxis.range.map(
      (value: any) => value * wearable[0].frequency,
    );

    if (xRange[0] < 0) {
      xRange[0] = 0;
    }

    const startIndex = Math.floor(xRange[0]);
    const endIndex = Math.ceil(xRange[1]);

    const frames = wearable.map((item: any) => new DataFrame(item.dataframe));
    const df = concat({ dfList: frames, axis: 1 });
    const csv = toCSV(df) || '';

    const lines = csv.split('\n');
    const selectedData = lines.slice(startIndex, endIndex + 1).join('\n');

    return selectedData;
  };

  const csvLeft = generarCSVEnRango(leftDivId, leftWearable, 'L');
  const csvRight = generarCSVEnRango(rightDivId, rightWearable, 'R');

  zip.file(
    `exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}_L.csv`,
    csvLeft,
  );
  zip.file(
    `exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}_R.csv`,
    csvRight,
  );

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(
      content,
      `wearables_data_exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}.zip`,
    );
  });
}

export default WearablesData;
