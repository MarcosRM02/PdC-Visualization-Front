import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Fragment, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { WearableDataProps } from '../../Types/Interfaces';
import { DataFrame, concat, toCSV } from 'danfojs';
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

  // Convertir los datos a DataFrames
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
    plotWearablesData(leftWearables, rightWearables, refs, playTime, minLength);

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

  const frames = leftWearables.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );

  const df = concat({ dfList: frames, axis: 1 });
  // @ts-ignore
  //let datos = df.iloc({ rows: [':'], columns: [':32'] });
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

  // Inicializar el array points con values como un array vací

  const points = [
    { x: 105, y: 20, values: [] },
    { x: 47.5, y: 72.5, values: [] },
    { x: 77.5, y: 92.5, values: [] },
    { x: 70, y: 37.5, values: [] },
    { x: 69, y: 131.5, values: [] },
    { x: 60, y: 170, values: [] },
    { x: 100.5, y: 176, values: [] },
    { x: 33, y: 114, values: [] },
    { x: 20, y: 197.5, values: [] },
    { x: 22, y: 155, values: [] },
    { x: 75, y: 205, values: [] },
    { x: 36.5, y: 237.5, values: [] },
    { x: 46.5, y: 362.5, values: [] },
    { x: 49, y: 405.5, values: [] },
    { x: 44, y: 276, values: [] },
    { x: 42.5, y: 318, values: [] },
    { x: 137.5, y: 40.5, values: [] },
    { x: 148.5, y: 79.5, values: [] },
    { x: 115.5, y: 98.5, values: [] },
    { x: 101.5, y: 57, values: [] },
    { x: 111.5, y: 140, values: [] },
    { x: 145, y: 166, values: [] },
    { x: 135, y: 205, values: [] },
    { x: 152.5, y: 125, values: [] },
    { x: 114, y: 491, values: [] },
    { x: 122.5, y: 447.5, values: [] },
    { x: 117.5, y: 404, values: [] },
    { x: 86, y: 461.5, values: [] },
    { x: 86, y: 381.5, values: [] },
    { x: 86, y: 423.5, values: [] },
    { x: 60, y: 491, values: [] },
    { x: 50, y: 450, values: [] },
  ];

  const maxWidth = 175; // antes era 350

  const mirroredPoints = points.map((point) => ({
    x: maxWidth - point.x, // Refleja el punto en el eje X
    y: point.y, // Mantén la coordenada Y igual
    values: [...point.values], // Mantén los mismos valores (al ppio vacios)
  }));

  points.forEach((point, index) => {
    if (traces[index]) {
      point.values = traces[index].y; // Asigna los valores desde traces a cada punto
    }
  });

  mirroredPoints.forEach((point, index) => {
    if (traces2[index]) {
      point.values = traces2[index].y; // Asigna los valores desde traces a cada punto
    }
  });

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full max-w-6xl p-4 mx-auto">
        {/* Sección Izquierda: Reproductor de Video y Botones */}
        <div className="flex flex-col md:w-2/3 w-full md:mr-6 h-[530px]">
          {/* Contenedor del Reproductor */}
          <div className="flex-grow relative">
            <ReactPlayer
              ref={playerRef}
              url={videoSrc}
              onProgress={handleProgress}
              width="100%"
              height="100%"
              controls={true}
              className="object-cover" // Asegura que el video cubra todo el espacio disponible
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload', // Intenta evitar que el video sea descargable
                    disablePictureInPicture: true, // Deshabilita Picture in Picture
                  },
                },
              }}
            />

            {/* Overlay para mensaje de video no disponible */}
            {!videoSrc && (
              <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center text-white text-2xl font-bold">
                No hay ningún video disponible
              </div>
            )}
          </div>

          {/* Botones de velocidad de reproducción */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => changePlaybackRate(1 / leftWearables[0].frequency)}
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
        </div>

        {/* Sección Derecha: Mapas de Calor y Leyenda */}
        <div className="flex flex-col md:w-1/3 w-full h-[530px] mt-6 md:mt-0">
          {/* Contenedor de Mapas de Calor y Leyenda */}
          <div className="flex flex-row flex-grow">
            {/* Contenedor de los Mapas de Calor */}
            <div className="flex flex-col flex-grow">
              <div className="flex space-x-4 flex-grow">
                {/* Primer Mapa de Calor */}
                <div className="flex-shrink-0">
                  <ImagePlotCanvas
                    width={175}
                    height={530}
                    points={points}
                    interval={(1 / leftWearables[0].frequency) * 1000}
                  />
                </div>

                {/* Segundo Mapa de Calor */}
                <div className="flex-shrink-0">
                  <ImagePlotCanvas
                    width={175}
                    height={530}
                    points={mirroredPoints}
                    interval={(1 / rightWearables[0].frequency) * 1000}
                  />
                </div>
              </div>
            </div>

            {/* Leyenda de Colores */}
            <div className="ml-4 flex-shrink-0">
              <ColorLegend />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-40">
        {/* Botón de Reset */}
        <button
          onClick={resetGraphs}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
        >
          Reset Graphs
        </button>

        {/* Botón para Descargar Datos en ZIP */}
        <button
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
        >
          Descargar Datos (ZIP)
        </button>
      </div>

      <div className="mt-12 flex flex-row justify-between w-full">
        <div id="Left-Side" className="flex-1 overflow-auto p-4">
          <>
            {leftWearables.map((wearable, index) => (
              <Fragment key={index}>
                <div
                  ref={refs.leftPressureSensor}
                  id="leftPressureSensor"
                ></div>
                <div ref={refs.leftAccelerometer} id="leftAccelerometer"></div>
                <div ref={refs.leftGyroscope} id="leftGyroscope"></div>
                <div className="flex justify-end">
                  {/* <button
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
                  </button> */}
                  {/* <button
                    onClick={() =>
                      descargarDatosVisibles(
                        leftWearables,
                        rightWearables,
                        experimentId,
                        participantId,
                        trialId,
                        swId,
                      )
                    }
                    className="mt-40 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                  >
                    Descargar Datos (ZIP)
                  </button> */}
                </div>
              </Fragment>
            ))}
          </>
        </div>

        <div id="right-side" className="flex-1 overflow-auto p-4">
          {rightWearables.map((wearable, index) => (
            <div key={index} className="wearable-item">
              <div
                ref={refs.rightPressureSensor}
                id="rightPressureSensor"
              ></div>
              <div ref={refs.rightAccelerometer} id="rightAccelerometer"></div>
              <div ref={refs.rightGyroscope} id="rightGyroscope"></div>
              <div className="flex justify-end">
                {/* <button
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
                </button> */}
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
    'Pressure Sensor',
    [':32'],
    playTime,
    minLength,
  );
  plotData(
    leftWearables,
    refs.leftAccelerometer.current,
    'Accelerometer',
    [32, 33, 34],
    playTime,
    minLength,
  );
  plotData(
    leftWearables,
    refs.leftGyroscope.current,
    'Gyroscope',
    [35, 36, 37],
    playTime,
    minLength,
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
    'Pressure Sensor',
    [':32'],
    playTime,
    minLength,
  );
  plotData(
    rightWearables,
    refs.rightAccelerometer.current,
    'Accelerometer',
    [32, 33, 34],
    playTime,
    minLength,
  );
  plotData(
    rightWearables,
    refs.rightGyroscope.current,
    'Gyroscope',
    [35, 36, 37],
    playTime,
    minLength,
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
      // range: [0, 4096], // Esto es lo que tengo que modificar para fijar los rangos de el eje y en los graficos.
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
  minLength: number,
) {
  if (!divId) {
    console.error('Invalid div element');
    return;
  }
  const frames = wearable.map(
    (wearable: any) => new DataFrame(wearable.dataframe),
  );
  console.log('Frames:', frames);

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

  const config = {
    modeBarButtonsToShow: ['toImage'], // Solo mostrar botones específicos
    modeBarButtonsToRemove: [
      'select2d',
      'lasso2d',
      'autoScale2d',
      'resetScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'zoomIn2d',
      'zoomOut2d',
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
    displaylogo: false, // Ocultar el logotipo de Plotly
    displayModeBar: true, // Asegura que la modebar siempre esté visible
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

// async function descargarDatosVisibles(
//   divId: any,
//   wearable: any,
//   experimentId: number,
//   participantId: number,
//   trialId: number,
//   swId: number,
//   type: string,
// ) {
//   var plotInstance = document.getElementById(divId.current.id);
//   // @ts-ignore
//   var xRange = plotInstance.layout.xaxis.range.map(
//     (value: any) => value * wearable[0].frequency,
//   );

//   if (xRange[0] < 0) {
//     xRange[0] = 0;
//   }

//   // Calcular el índice de inicio y fin basado en xRange
//   var startIndex = Math.floor(xRange[0]);
//   console.log('Start Index:', startIndex);
//   var endIndex = Math.ceil(xRange[1]);
//   console.log('End Index:', endIndex);

//   const frames = wearable.map(
//     (wearable: any) => new DataFrame(wearable.dataframe),
//   );

//   const df = concat({ dfList: frames, axis: 1 });
//   var csv = toCSV(df);

//   try {
//     // @ts-ignore
//     const lines = csv.split('\n');
//     const selectedData = lines.slice(startIndex, endIndex + 1).join('\n');

//     var csvContent = 'data:text/csv;charset=utf-8,' + selectedData;

//     // Crear un enlace y descargar el CSV
//     var encodedUri = encodeURI(csvContent);
//     var link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     if (type === 'L') {
//       link.setAttribute(
//         'download',
//         'exp_' +
//           experimentId +
//           '_part_' +
//           participantId +
//           '_trial_' +
//           trialId +
//           '_sw_' +
//           swId +
//           '_L' +
//           '.csv',
//       );
//     } else {
//       link.setAttribute(
//         'download',
//         'exp_' +
//           experimentId +
//           '_part_' +
//           participantId +
//           '_trial_' +
//           trialId +
//           '_sw_' +
//           swId +
//           '_R' +
//           '.csv',
//       );
//     }
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link); // Limpiar después de la descarga
//   } catch (error) {
//     console.error('Error al cargar o procesar el archivo CSV:', error);
//   }
// }

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

  // Función auxiliar para generar CSV en un rango específico
  const generarCSVEnRango = (divId: any, wearable: any, type: string) => {
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

    // Recortar el CSV a las filas especificadas por startIndex y endIndex
    const lines = csv.split('\n');
    const selectedData = lines.slice(startIndex, endIndex + 1).join('\n');

    return selectedData;
  };

  // Generar los CSV para cada wearable usando el rango
  const csvLeft = generarCSVEnRango(leftDivId, leftWearable, 'L');
  const csvRight = generarCSVEnRango(rightDivId, rightWearable, 'R');

  // Agregar los CSV al archivo ZIP
  zip.file(
    `exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}_L.csv`,
    csvLeft,
  );
  zip.file(
    `exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}_R.csv`,
    csvRight,
  );

  // Generar el archivo ZIP y descargarlo
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `wearables_data_exp_${experimentId}_trial_${trialId}.zip`);
  });
}

export default WearablesData;
