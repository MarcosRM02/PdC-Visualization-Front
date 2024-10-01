import { Fragment, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { WearableDataProps } from '../../Types/Interfaces';
import { DataFrame, Series, concat, toCSV } from 'danfojs';
import Plotly from 'plotly.js-dist-min';
import axios from 'axios';
import ImagePlotCanvas from './canvas';
import ColorLegend from './ColorLegend';

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
    leftHeatmap: useRef(null),
    rightHeatmap: useRef(null),
  };

  // Extraer el tipo de las url, y asi ya lo tengo todo preparado para pasarselo a la funcion de plotWearablesData, pq de la nueva manera, no va como antes.
  const leftWearables = wearables.filter(
    (wearable) => wearable.wearableType === 'L',
  );
  const rightWearables = wearables.filter(
    (wearable) => wearable.wearableType === 'R',
  );
  const [playTime, setPlayTime] = useState<number>(0);
  const playerRef = useRef<ReactPlayer | null>(null);
  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayTime(state.playedSeconds);
    //updateAllGraphs(state.playedSeconds);
  };
  // Función para manejar clics en los puntos del gráfico
  const handlePointClick = (data: any) => {
    if (data.points && data.points.length > 0) {
      const pointTime = data.points[0].x;
      setPlayTime(pointTime); // Actualiza el tiempo de reproducción en el estado
      if (playerRef.current) {
        console.log('Seeking to:', pointTime);
        playerRef.current.seekTo(pointTime, 'seconds'); // Cambia el video al tiempo seleccionado
      }
    }
  };
  useEffect(() => {
    plotWearablesData(leftWearables, rightWearables, refs, playTime);

    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        (ref.current as any).on('plotly_relayout', (eventData: any) =>
          handleRelayout(eventData, ref.current, refs),
        );
      }
    });
  }, [wearables, ...Object.values(refs)]);

  // const updateAllGraphs = (currentTime: number) => {
  //   Object.values(refs).forEach((ref) => {
  //     if (ref.current) {
  //       Plotly.relayout(ref.current, {
  //         'xaxis.range': [currentTime - 10, currentTime + 10], // para que se vea el rango de datos dentro del tiempo
  //       });
  //     }
  //   });
  // };
  useEffect(() => {
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        (ref.current as any).on('plotly_click', handlePointClick);
      }
    });
  }, []);

  useEffect(() => {
    updateCurrentTimeLine(playTime);
  }, [playTime]);

  const updateCurrentTimeLine = (currentTime: any) => {
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        Plotly.relayout(ref.current, {
          // @ts-ignore
          'shapes[0].x0': currentTime,
          'shapes[0].x1': currentTime,
        });
      }
    });
  };
  const resetGraphs = () => {
    const graphRefs = Object.values(refs);
    graphRefs.forEach((ref) => {
      if (ref.current) {
        try {
          // Usar autorange para que Plotly ajuste automáticamente el rango
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

  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/trials/retrieve-video/${trialId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'blob', // Importante: obtiene la respuesta como un blob
          },
        );

        const videoBlob = response.data;
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoSrc(videoUrl);
      } catch (error) {
        console.error('Error fetching the video:', error);
      }
    };

    fetchVideo();

    // Limpieza: liberar la memoria asociada con la URL del blob
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

  const imageUrl = 'src/Components/WearableData/plantilla_sensores_n.png';
  // const points = [
  //   { x: 210, y: 40 },
  //   { x: 95, y: 145 },
  //   { x: 155, y: 185 },
  //   { x: 140, y: 75 },
  //   { x: 138, y: 263 },
  //   { x: 120, y: 340 },
  //   { x: 201, y: 352 },
  //   { x: 66, y: 228 },
  //   { x: 40, y: 395 },
  //   { x: 44, y: 310 },
  //   { x: 150, y: 410 },
  //   { x: 73, y: 475 },
  //   { x: 93, y: 725 },
  //   { x: 98, y: 811 },
  //   { x: 88, y: 552 },
  //   { x: 85, y: 636 },
  //   { x: 275, y: 81 },
  //   { x: 297, y: 159 },
  //   { x: 231, y: 197 },
  //   { x: 203, y: 114 },
  //   { x: 223, y: 280 },
  //   { x: 290, y: 332 },
  //   { x: 270, y: 410 },
  //   { x: 305, y: 250 },
  //   { x: 228, y: 982 },
  //   { x: 245, y: 895 },
  //   { x: 235, y: 808 },
  //   { x: 172, y: 923 },
  //   { x: 172, y: 763 },
  //   { x: 172, y: 847 },
  //   { x: 120, y: 982 },
  //   { x: 100, y: 900 },
  // ];

  // const maxWidth = 350; // Lo que tenia puesto david
  // const mirroredPoints = points.map((point) => ({
  //   x: maxWidth - point.x,
  //   y: point.y,
  // }));

  const points = [
    {
      x: 210,
      y: 40,
      values: [
        50, 100, 500, 1000, 2000, 3000, 4000, 4500, 5000, 5500, 6000, 6500,
        7000, 7500, 8000, 8500, 9000, 9500, 10000, 10500,
      ],
    },
    {
      x: 95,
      y: 145,
      values: [
        10, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 7000, 7500, 8000,
        8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000,
      ],
    },
    {
      x: 155,
      y: 185,
      values: [
        500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000,
        6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000,
      ],
    },
    {
      x: 140,
      y: 75,
      values: [
        300, 600, 1200, 1800, 2400, 3000, 3600, 4200, 4800, 5400, 6000, 6600,
        7200, 7800, 8400, 9000, 9600, 10200, 10800, 11400,
      ],
    },
    {
      x: 138,
      y: 263,
      values: [
        500, 1500, 2000, 2500, 3500, 4000, 4500, 5000, 6000, 6500, 7000, 7500,
        8000, 8500, 9000, 9500, 10000, 10500, 11000, 11500,
      ],
    },
    {
      x: 120,
      y: 340,
      values: [
        1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
        12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000,
      ],
    },
    {
      x: 201,
      y: 352,
      values: [
        2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000,
        10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500,
      ],
    },
    {
      x: 66,
      y: 228,
      values: [
        5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000,
        10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500,
      ],
    },
    {
      x: 40,
      y: 395,
      values: [
        10, 100, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
        5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000,
      ],
    },
    {
      x: 44,
      y: 310,
      values: [
        800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000, 8800, 9600,
        10400, 11200, 12000, 12800, 13600, 14400, 15200, 16000,
      ],
    },
    {
      x: 150,
      y: 410,
      values: [
        1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
        12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000,
      ],
    },
    {
      x: 73,
      y: 475,
      values: [
        1500, 3000, 4500, 6000, 7500, 9000, 10500, 12000, 13500, 15000, 16500,
        18000, 19500, 21000, 22500, 24000, 25500, 27000, 28500, 30000,
      ],
    },
    {
      x: 93,
      y: 725,
      values: [
        2500, 5000, 7500, 10000, 12500, 15000, 17500, 20000, 22500, 25000,
        27500, 30000, 32500, 35000, 37500, 40000, 42500, 45000, 47500, 50000,
      ],
    },
    {
      x: 98,
      y: 811,
      values: [
        50, 150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150, 1250, 1350,
        1450, 1550, 1650, 1750, 1850, 1950,
      ],
    },
    {
      x: 88,
      y: 552,
      values: [
        800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000, 8800, 9600,
        10400, 11200, 12000, 12800, 13600, 14400, 15200, 16000,
      ],
    },
    {
      x: 85,
      y: 636,
      values: [
        100, 500, 1500, 2500, 3500, 4500, 5500, 6500, 7500, 8500, 9500, 10500,
        11500, 12500, 13500, 14500, 15500, 16500, 17500, 18500,
      ],
    },
    {
      x: 275,
      y: 81,
      values: [
        500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000,
        6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000,
      ],
    },
    {
      x: 297,
      y: 159,
      values: [
        800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000, 8800, 9600,
        10400, 11200, 12000, 12800, 13600, 14400, 15200, 16000,
      ],
    },
    {
      x: 231,
      y: 197,
      values: [
        100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
        800, 850, 900, 950, 1000, 1050,
      ],
    },
    {
      x: 203,
      y: 114,
      values: [
        500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
        12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000,
      ],
    },

    {
      x: 223,
      y: 280,
      values: [
        310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440,
        450, 460, 470, 480, 490, 500,
      ],
    },
    {
      x: 290,
      y: 332,
      values: [
        400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530,
        540, 550, 560, 570, 580, 590,
      ],
    },
    {
      x: 270,
      y: 410,
      values: [
        360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490,
        500, 510, 520, 530, 540, 550,
      ],
    },
    {
      x: 305,
      y: 250,
      values: [
        390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520,
        530, 540, 550, 560, 570, 580,
      ],
    },
    {
      x: 228,
      y: 982,
      values: [
        410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540,
        550, 560, 570, 580, 590, 600,
      ],
    },
    {
      x: 245,
      y: 895,
      values: [
        430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560,
        570, 580, 590, 600, 610, 620,
      ],
    },
    {
      x: 235,
      y: 808,
      values: [
        310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440,
        450, 460, 470, 480, 490, 500,
      ],
    },
    {
      x: 172,
      y: 923,
      values: [
        420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550,
        560, 570, 580, 590, 600, 610,
      ],
    },
    {
      x: 172,
      y: 763,
      values: [
        150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280,
        290, 300, 310, 320, 330, 340,
      ],
    },
    {
      x: 172,
      y: 847,
      values: [
        390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520,
        530, 540, 550, 560, 570, 580,
      ],
    },
    {
      x: 120,
      y: 982,
      values: [
        370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500,
        510, 520, 530, 540, 550, 560,
      ],
    },
    {
      x: 100,
      y: 900,
      values: [
        -999, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450,
        460, 470, 480, 490, 500, 510,
      ],
    },
  ];

  const maxWidth = 350;

  const mirroredPoints = points.map((point) => ({
    x: maxWidth - point.x, // Refleja el punto en el eje X
    y: point.y, // Mantén la coordenada Y igual
    values: [...point.values], // Mantén los mismos valores
  }));

  // Unir ambos arrays
  const combinedPoints = [...points, ...mirroredPoints];

  // Extraer todos los valores de 'values' en un solo array
  const allValues = combinedPoints.flatMap((point) => point.values);

  // Calcular el valor mínimo y máximo
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex-grow w-full max-w-6xl">
        <ReactPlayer
          ref={playerRef}
          url={videoSrc}
          //playing
          onProgress={handleProgress}
          width="100%"
          height="100%"
          controls={true}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload', // Intenta evitar que el video sea descargable
                disablePictureInPicture: true, // Deshabilita Picture in Picture
              },
            },
          }}
        />
        <button
          onClick={() => changePlaybackRate(1 / 50)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          0.15x
        </button>
        <button
          onClick={() => changePlaybackRate(0.25)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          0.25x
        </button>
        <button
          onClick={() => changePlaybackRate(1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          1x
        </button>
        <button
          onClick={() => changePlaybackRate(2)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          2x
        </button>
      </div>
      <div>
        <button
          onClick={resetGraphs}
          className="mt-40 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
        >
          Reset Graphs
        </button>
      </div>
      <div className="border-2 border-gray-300 p-6 shadow-md mt-12 flex justify-center">
        {/* Contenedor expandido para incluir ambos gráficos y la leyenda */}
        <div className="flex justify-between items-start gap-8 w-full max-w-7xl">
          {/* Contenedor de las dos plantillas */}
          <div className="flex flex-1 justify-between items-center gap-8">
            <div className="flex-1 pr-4 border-r-2 border-gray-400">
              {/* Añade padding a la derecha del primer canvas para separarlo de la línea */}
              <ImagePlotCanvas
                width={350}
                height={1040}
                points={points}
                interval={500}
                minValue={minValue}
                maxValue={maxValue}
                
              />
            </div>
            <div className="flex-1 pl-4 border-r-2 border-gray-400">
              {/* Añade padding a la izquierda del segundo canvas para separarlo de la línea */}
              <ImagePlotCanvas
                width={350}
                height={1040}
                points={mirroredPoints}
                interval={500}
                minValue={minValue}
                maxValue={maxValue}
                
              />
            </div>
          </div>
          {/* Leyenda de color a la derecha */}
          <div className="ml-8 pl-4  flex flex-col justify-center">
            <ColorLegend minValue={minValue} maxValue={maxValue} />
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-row justify-between w-full">
        <div id="Left-Side" className="flex-1 overflow-auto p-4">
          <>
            {leftWearables.map((wearable, index) => (
              <Fragment key={index}>
                <h4>Left Wearable - {wearable.wearablesId} </h4>
                <div ref={refs.leftHeatmap} id="leftHeatmap"></div>
                <div
                  ref={refs.leftPressureSensor}
                  id="leftPressureSensor"
                ></div>
                {/*<div className="flex justify-end">
                  <button
                    onClick={() =>
                      descargarDatosVisibles(
                        'leftPressureSensor',
                        leftWearables,
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                  >
                    Download CSV
                  </button>
                </div>*/}
                <div ref={refs.leftAccelerometer} id="leftAccelerometer"></div>
                {/* <div className="flex justify-end">
                  <button
                    onClick={() =>
                      descargarDatosVisibles('leftAccelerometer', leftWearables)
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                  >
                    Download CSV
                  </button> 
                </div> */}
                <div ref={refs.leftGyroscope} id="leftGyroscope"></div>
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      descargarDatosVisibles(
                        refs.leftGyroscope,
                        leftWearables,
                        experimentId,
                        participantId,
                        trialId,
                        swId,
                        'L',
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                  >
                    Download CSV
                  </button>
                </div>
              </Fragment>
            ))}
          </>
        </div>

        <div id="right-side" className="flex-1 overflow-auto p-4">
          {rightWearables.map((wearable, index) => (
            <div key={index} className="wearable-item">
              <h4>Right Wearable - {wearable.wearablesId}</h4>
              <div ref={refs.rightHeatmap} id="rightHeatmap"></div>
              <div
                ref={refs.rightPressureSensor}
                id="rightPressureSensor"
              ></div>
              {/* <div className="flex justify-end">
                 <button
                  onClick={() =>
                    descargarDatosVisibles(
                      'rightPressureSensor',
                      rightWearables,
                    )
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                >
                  Download CSV
                </button> 
              </div> */}
              <div ref={refs.rightAccelerometer} id="rightAccelerometer"></div>
              {/* <div className="flex justify-end">
                 <button
                  onClick={() =>
                    descargarDatosVisibles('rightAccelerometer', rightWearables)
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                >
                  Download CSV
                </button> 
              </div> */}
              <div ref={refs.rightGyroscope} id="rightGyroscope"></div>
              <div className="flex justify-end">
                <button
                  onClick={() =>
                    descargarDatosVisibles(
                      refs.rightGyroscope,
                      rightWearables,
                      experimentId,
                      participantId,
                      trialId,
                      swId,
                      'R',
                    )
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                >
                  Download CSV
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function plotWearablesData(
  leftWearables: any,
  rightWearables: any,
  refs: any,
  playTime: any,
) {
  plotLeftWearable(leftWearables, refs, playTime);
  plotrightWearable(rightWearables, refs, playTime);
}

function plotLeftWearable(leftWearables: any, refs: any, playTime: any) {
  plotHeatmap(
    leftWearables,
    refs.leftHeatmap.current,
    'Left Pressure Sensor Heatmap',
    [':32'], // Asumiendo que estos son los datos relevantes para el mapa de calor
    playTime,
  );
  plotData(
    leftWearables,
    refs.leftPressureSensor.current,
    'Pressure Sensor',
    [':32'],
    playTime,
  );
  plotData(
    leftWearables,
    refs.leftAccelerometer.current,
    'Accelerometer',
    [32, 33, 34],
    playTime,
  );
  plotData(
    leftWearables,
    refs.leftGyroscope.current,
    'Gyroscope',
    [35, 36, 37],
    playTime,
  );
}

function plotrightWearable(rightWearables: any, refs: any, playTime: any) {
  plotHeatmap(
    rightWearables,
    refs.rightHeatmap.current,
    'Right Pressure Sensor Heatmap',
    [':32'], // Asumiendo que estos son los datos relevantes para el mapa de calor
    playTime,
  );
  plotData(
    rightWearables,
    refs.rightPressureSensor.current,
    'Pressure Sensor',
    [':32'],
    playTime,
  );
  plotData(
    rightWearables,
    refs.rightAccelerometer.current,
    'Accelerometer',
    [32, 33, 34],
    playTime,
  );
  plotData(
    rightWearables,
    refs.rightGyroscope.current,
    'Gyroscope',
    [35, 36, 37],
    playTime,
  );
}

function generateLayout(title: string) {
  return {
    showlegend: true,
    title: {
      text: title,
      x: 0,
    },
    legend: {
      bgcolor: '#fcba03',
      bordercolor: '#444',
      borderwidth: 1,
      font: { family: 'Arial', size: 10, color: '#fff' },
    },
    autosize: true, // Asegura que se ajuste automáticamente
    yaxis: {
      title: 'Value',
      fixedrange: true,
    },
    xaxis: {
      title: 'Time',
    },
    responsive: true,
  };
}

function plotData(
  wearable: any,
  divId: HTMLElement | null,
  title: string,
  columns: (number | string)[],
  playTime: number,
) {
  if (!divId) {
    console.error('Invalid div element');
    return;
  }
  const frames = wearable.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );

  const df = concat({ dfList: frames, axis: 1 });

  // @ts-ignore
  let datos = df.iloc({ rows: [':'], columns: columns });

  const traces = datos.columns.map((column: string) => ({
    x: Array.from(datos.index.values()).map(
      (index: any) => index / wearable[0].frequency,
    ),
    // @ts-ignore
    y: datos[column].values,
    type: 'scattergl',
    mode: 'lines',
    name: column,
  }));

  const layout = generateLayout(title);
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
        dash: 'line',
      },
    },
  ];
  // @ts-ignore
  Plotly.newPlot(divId, traces, layout);
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

  var startIndex = Math.floor(newRange[0]);
  var endIndex = Math.ceil(newRange[1]);

  const graphRefs = Object.values(refs);

  // Actualiza todos los gráficos excepto el que inició el evento
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
  divId: any,
  wearable: any,
  experimentId: number,
  participantId: number,
  trialId: number,
  swId: number,
  type: string,
) {
  var plotInstance = document.getElementById(divId.current.id);
  // @ts-ignore
  var xRange = plotInstance.layout.xaxis.range.map(
    (value: any) => value * wearable[0].frequency,
  );

  if (xRange[0] < 0) {
    xRange[0] = 0;
  }

  // Calcular el índice de inicio y fin basado en xRange
  var startIndex = Math.floor(xRange[0]);
  var endIndex = Math.ceil(xRange[1]);

  const frames = wearable.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );

  const df = concat({ dfList: frames, axis: 1 });
  var csv = toCSV(df);

  try {
    // @ts-ignore
    const lines = csv.split('\n');
    const selectedData = lines.slice(startIndex, endIndex + 1).join('\n');

    var csvContent = 'data:text/csv;charset=utf-8,' + selectedData;

    // Crear un enlace y descargar el CSV
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    if (type === 'L') {
      link.setAttribute(
        'download',
        'exp_' +
          experimentId +
          '_part_' +
          participantId +
          '_trial_' +
          trialId +
          '_sw_' +
          swId +
          '_L' +
          '.csv',
      );
    } else {
      link.setAttribute(
        'download',
        'exp_' +
          experimentId +
          '_part_' +
          participantId +
          '_trial_' +
          trialId +
          '_sw_' +
          swId +
          '_R' +
          '.csv',
      );
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Limpiar después de la descarga
  } catch (error) {
    console.error('Error al cargar o procesar el archivo CSV:', error);
  }
}

function plotHeatmap(
  wearableData: any,
  divId: HTMLElement | null,
  // @ts-ignore
  title: string,
  columns: (number | string)[],
  // @ts-ignore
  playTime: number,
) {
  if (!divId) {
    console.error('Invalid div element');
    return;
  }

  // Crear DataFrames desde los datos del wearable y concatenarlos en un solo DataFrame
  const frames = wearableData.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );

  const df = concat({ dfList: frames, axis: 1 });
  // @ts-ignore
  let datos = df.iloc({ rows: [':'], columns: columns });

  // @ts-ignore
  let zData;
  if (datos instanceof DataFrame) {
    // Intenta convertir DataFrame directamente a una matriz
    zData = datos.values;
  } else if (datos instanceof Series) {
    // Convierte Series a DataFrame y luego a una matriz
    zData = new DataFrame([datos]).values;
  } //else {
  //   console.error('Invalid data type');
  //   return;
  // }

  // Configurar los datos del mapa de calor
  const data = [
    {
      z: datos.values,
      type: 'heatmapgl',
      colorscale: 'Viridis',
    },
  ];

  const layout = {
    title: title,
    xaxis: { title: 'Índice de Tiempo' },
    yaxis: { title: 'Índice de Sensor' },
    autosize: true,
    images: [
      {
        source: 'src/Components/WearableData/plantilla_sensores_n.png', // Asegúrate de cambiar esto por la URL o ruta de tu imagen
        xref: 'x',
        yref: 'y',
        x: 0,
        y: 0,
        sizex: df.shape[1], // Ajusta el tamaño de la imagen al tamaño del eje x del gráfico
        sizey: df.shape[0], // Ajusta el tamaño de la imagen al tamaño del eje y del gráfico
        sizing: 'stretch',
        opacity: 0.5,
        layer: 'below',
      },
    ],
  };
  // Usar Plotly.newPlot para renderizar el mapa de calor en el div especificado
  // @ts-ignore
  Plotly.newPlot(divId, data, layout);
}

export default WearablesData;
