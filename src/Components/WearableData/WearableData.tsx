import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { WearableDataProps } from '../../Types/Interfaces';
import { DataFrame, concat, toCSV } from 'danfojs';

import Plotly from 'plotly.js-dist-min';
import Plot from 'react-plotly.js';

const WearablesData = ({ wearables = [] }: WearableDataProps) => {
  const refs = {
    leftPressureSensor: useRef(null),
    leftAccelerometer: useRef(null),
    leftGyroscope: useRef(null),
    rightPressureSensor: useRef(null),
    rightAccelerometer: useRef(null),
    rightGyroscope: useRef(null),
  };

  // Extraer el tipo de las url, y asi ya lo tengo todo preparado para pasarselo a la funcion de plotWearablesData, pq de la nueva manera, no va como antes.
  const leftWearables = wearables.filter(
    (wearable) => wearable.wearableType === 'L',
  );

  const rightWearables = wearables.filter(
    (wearable) => wearable.wearableType === 'R',
  );

  useEffect(() => {
    plotWearablesData(leftWearables, rightWearables, refs);

    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.on('plotly_relayout', (eventData) =>
          handleRelayout(eventData, ref.current, refs),
        );
      }
    });
  }, [wearables, ...Object.values(refs)]);

  interface DataPoint {
    time: number;
    value: number;
  }

  const [data, setData] = useState<DataPoint[]>([]);
  const [playTime, setPlayTime] = useState<number>(0);
  const playerRef = useRef<ReactPlayer | null>(null);

  // Simula datos; en la práctica real, estos datos pueden venir de una API o ser calculados
  useEffect(() => {
    const simulatedData = Array.from({ length: 600 }, (_, i) => ({
      time: i,
      value: Math.random() * 100,
    }));
    setData(simulatedData);
  }, []);

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayTime(state.playedSeconds);
  };
  // Función para manejar clics en los puntos del gráfico
  const handlePointClick = (data) => {
    if (data.points && data.points.length > 0) {
      const pointTime = data.points[0].x;
      setPlayTime(pointTime); // Actualiza el tiempo de reproducción en el estado
      if (playerRef.current) {
        playerRef.current.seekTo(pointTime, 'seconds'); // Cambia el video al tiempo seleccionado
      }
    }
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

  return (
    <div className="flex justify-around">
      <div>
        <ReactPlayer
          ref={playerRef}
          url="https://youtu.be/hMS8RtYVouc?t=31"
          playing
          onProgress={handleProgress}
          width="100%"
          height="auto"
        />
        <Plot
          data={[
            {
              x: data.map((d) => d.time),
              y: data.map((d) => d.value),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'blue' },
            },
            {
              x: [playTime, playTime],
              y: [0, Math.max(...data.map((d) => d.value))],
              type: 'scatter',
              mode: 'lines',
              line: { color: 'red', width: 2 },
              name: 'Current Time',
            },
          ]}
          layout={{
            width: 720,
            height: 440,
            title: 'Data Response to Video Time',
            xaxis: {
              title: 'Time (seconds)',
              range: [0, Math.max(...data.map((d) => d.time))],
            },
            yaxis: {
              title: 'Value',
            },
            shapes: [
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
                  dash: 'dot',
                },
              },
            ],
          }}
          onClick={handlePointClick} // Añade el manejador de clics al gráfico
        />
      </div>
      <div>
        <button
          onClick={resetGraphs}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
        >
          Reset Graphs
        </button>
      </div>
      <div id="Left-Side" className="flex-1 overflow-auto p-4">
        {leftWearables.map((wearable, index) => (
          <div key={index} className="wearable-item">
            <h4>Left Wearable - {wearable.wearablesId} </h4>
            <div ref={refs.leftPressureSensor} id="leftPressureSensor"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles('leftPressureSensor', leftWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div ref={refs.leftAccelerometer} id="leftAccelerometer"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles('leftAccelerometer', leftWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div ref={refs.leftGyroscope} id="leftGyroscope"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles('leftGyroscope', leftWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      <div id="right-side" className="flex-1 overflow-auto p-4">
        {rightWearables.map((wearable, index) => (
          <div key={index} className="wearable-item">
            <h4>Right Wearable - {wearable.wearablesId}</h4>
            <div ref={refs.rightPressureSensor} id="rightPressureSensor"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles('rightPressureSensor', rightWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div ref={refs.rightAccelerometer} id="rightAccelerometer"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles('rightAccelerometer', rightWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div ref={refs.rightGyroscope} id="rightGyroscope"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles('rightGyroscope', rightWearables)
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
  );
};

function plotWearablesData(leftWearables: any, rightWearables: any, refs: any) {
  plotLeftWearable(leftWearables, refs);
  plotrightWearable(rightWearables, refs);
}

function plotLeftWearable(leftWearables: any, refs: any) {
  plotData(leftWearables, refs.leftPressureSensor.current, 'Pressure Sensor', [
    ':32',
  ]);
  plotData(
    leftWearables,
    refs.leftAccelerometer.current,
    'Accelerometer',
    [32, 33, 34],
  );
  plotData(
    leftWearables,
    refs.leftGyroscope.current,
    'Gyroscope',
    [35, 36, 37],
  );
}

function plotrightWearable(rightWearables: any, refs: any) {
  plotData(
    rightWearables,
    refs.rightPressureSensor.current,
    'Pressure Sensor',
    [':32'],
  );
  plotData(
    rightWearables,
    refs.rightAccelerometer.current,
    'Accelerometer',
    [32, 33, 34],
  );
  plotData(
    rightWearables,
    refs.rightGyroscope.current,
    'Gyroscope',
    [35, 36, 37],
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
    width: 1000,
    yaxis: {
      title: 'Value',
      fixedrange: true,
    },
    xaxis: {
      title: 'Time',
    },
  };
}

function plotData(
  wearable: any,
  divId: HTMLElement | null,
  title: string,
  columns: (number | string)[],
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

  const config = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
  };

  const traces = datos.columns.map((column: string) => ({
    x: datos.index.values,
    y: (datos as DataFrame)[column].values,
    type: 'scatter',
    mode: 'lines',
    name: column,
  }));

  Plotly.newPlot(divId, traces, generateLayout(title), config);
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
      if (ref.current) {
        try {
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

async function descargarDatosVisibles(divId: string, wearable: any) {
  var plotInstance = document.getElementById(divId);
  // @ts-ignore
  var xRange = plotInstance.layout.xaxis.range; // Rango del eje X visible actualmente

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
    link.setAttribute('download', 'selected_data.csv'); // Cambiar el nombre del archivo, al timestamp, el id de plantilla y el tipo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Limpiar después de la descarga
  } catch (error) {
    console.error('Error al cargar o procesar el archivo CSV:', error);
  }
}

export default WearablesData;
