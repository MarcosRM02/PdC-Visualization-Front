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
      bgcolor: '#fcba03',
      bordercolor: '#444',
      borderwidth: 1,
      font: { family: 'Arial', size: 12, color: '#fff' },
      pad: { t: 10, b: 10 },
    },
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
    toImageButtonOptions: {
      filename: title,
    },
  };
  // @ts-ignore
  Plotly.newPlot(divId, traces, layout, config);
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
