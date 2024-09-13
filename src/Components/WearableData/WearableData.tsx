import { Fragment, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { WearableDataProps } from '../../Types/Interfaces';
import { DataFrame, Series, concat, toCSV } from 'danfojs';
import Plotly from 'plotly.js-dist-min';
import axios from 'axios';

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
      <div className="mt-12 flex flex-row justify-between w-full">
        <div id="Left-Side" className="flex-1 overflow-auto p-4">
          <>
            {leftWearables.map((wearable, index) => (
              <Fragment key={index}>
                <h4>Left Wearable - {wearable.wearablesId} </h4>
                {/* <div ref={refs.leftHeatmap} id="leftHeatmap"></div> */}
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
              {/* <div ref={refs.rightHeatmap} id="rightHeatmap"></div> */}
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
    [':37'], // Asumiendo que estos son los datos relevantes para el mapa de calor
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
    [':37'], // Asumiendo que estos son los datos relevantes para el mapa de calor
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
    title: 'Mapa de Calor de Datos de Sensores',
    xaxis: { title: 'Índice de Tiempo' },
    yaxis: { title: 'Índice de Sensor' },
    autosize: true,
  };

  // Usar Plotly.newPlot para renderizar el mapa de calor en el div especificado
  // @ts-ignore
  Plotly.newPlot(divId, data, layout);
}
export default WearablesData;
