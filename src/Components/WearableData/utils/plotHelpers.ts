// Lo de ponerlo antes de los import esd para importarlo a nivel de módulo y que
function calculateAccelConversion(): number {
  /**
   * (Rango completo * 9,81 (gravedad)) / 65536 (2^16)
   */
  const sensorConfig = 4;
  const range = sensorConfig - -sensorConfig; // Rango de ±4g
  const g = 9.81; // Gravedad en m/s²
  const possibleValues = 65536; // 2^16
  return (range * g) / possibleValues;
}

function calculateGyroConversion(): number {
  /**
   * Rango completo / 65536 (2^16)
   */
  const sensorConfig = 500; // ±500 °/s
  const possibleValues = 65536; // 2^16
  return sensorConfig / possibleValues;
}

// Se calculan una vez al importarse el módulo.
const ACCEL_CONVERSION = calculateAccelConversion();
const GYRO_CONVERSION = calculateGyroConversion();

import { DataFrame, concat } from 'danfojs';
import Plotly from 'plotly.js-dist-min';

export function plotWearablesData(
  leftWearables: any,
  rightWearables: any,
  refs: any,
  playTime: number,
  minLength: number,
) {
  plotLeftWearable(leftWearables, refs, playTime, minLength);
  plotRightWearable(rightWearables, refs, playTime, minLength);
}

function plotLeftWearable(
  leftWearables: any,
  refs: any,
  playTime: number,
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

function plotRightWearable(
  rightWearables: any,
  refs: any,
  playTime: number,
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
    autosize: true,
    responsive: true,
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      y: 1.05,
      xanchor: 'center',
      yanchor: 'bottom',
      xref: 'paper',
      yref: 'paper',
      bgcolor: '#dbeafe', // Azul claro (Tailwind blue-100)
      bordercolor: '#93c5fd', // Azul para el borde (Tailwind blue-300)
      borderwidth: 1,
      font: { family: 'Arial', size: 12, color: '#000' }, // Texto en negro para buen contraste
      pad: { t: 10, b: 10 },
    },

    colorway: [
      '#e6194b',
      '#3cb44b',
      '#4363d8',
      '#f58231',
      '#ffe119',
      '#bfef45',
      '#42d4f4',
      '#f032e6',
      '#a9a9a9',
      '#dcbeff',
      '#fabed4',
      '#ffd8b1',
      '#fffac8',
      '#aaffc3',
      '#808000',
      '#7cb9e8',
      '#6a5acd',
      '#b22222',
      '#800000',
      '#00ff00',
      '#00ffff',
      '#ff00ff',
      '#800080',
      '#ffa500',
      '#008000',
      '#ffc0cb',
      '#00bfff',
      '#4b0082',
      '#ff6347',
      '#ffd700',
      '#6b8e23',
    ],

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
    margin: {
      l: 60,
      r: 60,
      t: 60,
      b: 60,
    },
  };
}

export function plotData(
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

  const frames = wearable.map((w: any) => new DataFrame(w.dataframe));
  const df = concat({ dfList: frames, axis: 1 });
  // Se extraen los datos desde la fila 0 hasta minLength y solo las columnas indicadas
  // @ts-ignore
  let datos = df.iloc({ rows: [`0:${minLength}`], columns: columns });

  // Determinar el factor de conversión según el título
  let conversionFactor = 1;
  if (title.includes('Acelerómetro')) {
    conversionFactor = ACCEL_CONVERSION;
  } else if (title.includes('Giroscopio')) {
    conversionFactor = GYRO_CONVERSION;
  }

  // Convertir el rango de la gráfica si es necesario (para acelerómetro o giroscopio)
  let convertedYRange = yRange;
  if (yRange && Array.isArray(yRange) && yRange.length === 2) {
    if (title.includes('Acelerómetro')) {
      convertedYRange = [
        yRange[0] * ACCEL_CONVERSION,
        yRange[1] * ACCEL_CONVERSION,
      ];
    } else if (title.includes('Giroscopio')) {
      convertedYRange = [
        yRange[0] * GYRO_CONVERSION,
        yRange[1] * GYRO_CONVERSION,
      ];
    }
  }

  const traces = datos.columns.map((column: string) => ({
    x: Array.from(datos.index.values()).map(
      (index: any) => index / wearable[0].frequency,
    ),
    // Se aplica la conversión a los datos según corresponda
    // @ts-ignore
    y: datos[column].values.map((val: number) => val * conversionFactor),
    type: 'scattergl',
    mode: 'lines',
    name: column,
    line: {
      width: 2,
    },
  }));

  const layout = generateLayout(convertedYRange);
  if (title.includes('Acelerómetro')) {
    layout.yaxis.title = 'Valor de Aceleración (m/s²)';
  } else if (title.includes('Giroscopio')) {
    layout.yaxis.title = 'Valor de Velocidad Angular (°/s)';
  }
  // Línea roja para indicar el tiempo actual
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
    modeBarButtonsToAdd: [
      {
        name: 'Apagar Leyenda',
        icon: Plotly.Icons.eraseshape,
        click: function (gd: any) {
          //@ts-ignore
          Plotly.restyle(gd, 'visible', 'legendonly');
        },
      },
      {
        name: 'Reactivar Leyenda',
        icon: Plotly.Icons.undo,
        click: function (gd: any) {
          //@ts-ignore
          Plotly.restyle(gd, 'visible', true);
        },
      },
    ],
    toImageButtonOptions: {
      filename: title,
    },
  };
  // @ts-ignore
  Plotly.react(divId, traces, layout, config);
}

export function handleRelayout(eventData: any, triggeredBy: any, refs: any) {
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
  graphRefs.forEach((ref: any) => {
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
