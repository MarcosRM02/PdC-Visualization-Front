import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DataFrame, concat, toCSV } from 'danfojs';
import leftCoords from '../../../assets/leftPoints.json';
import rightCoords from '../../../assets/rightPoints.json';

type Coord = { x: number; y: number };

export async function descargarDatosVisibles(
  leftDivId: any,
  rightDivId: any,
  leftWearable: any[],
  rightWearable: any[],
  experimentId: number,
  participantId: number,
  trialId: number,
  swId: number,
) {
  const zip = new JSZip();

  const generarCSVEnRango = (
    divId: any,
    wearable: any[],
    coords: Coord[],
  ): string => {
    const plotInstance = document.getElementById(divId.current.id);
    if (!plotInstance) {
      console.error('Div no Found:', divId.current.id);
      return '';
    }
    // @ts-ignore Plotly layout
    let xRange = plotInstance.layout.xaxis.range.map(
      (v: number) => v * wearable[0].frequency,
    );
    if (xRange[0] < 0) xRange[0] = 0;
    const startIndex = Math.floor(xRange[0]);
    const endIndex = Math.ceil(xRange[1]);

    // 1) Concatenamos todas las series en un solo DataFrame
    const frames = wearable.map((item) => new DataFrame(item.dataframe));
    const df = concat({ dfList: frames, axis: 1 });

    // Guardamos cuántas columnas originales hay (p.ej. 38)
    const originalCount = df.columns.length;

    // 2) Extraemos los valores y hacemos slice por rango de filas
    const allValues = (df.values as number[][]).slice(startIndex, endIndex + 1);

    // 3) Para cada fila: calculamos COP únicamente sobre las primeras 32
    //    columnas (coords.length), pero mantenemos todas las columnas
    //    originales en la salida.
    const dataWithCop = allValues.map((row) => {
      let sumP = 0,
        xSum = 0,
        ySum = 0;
      for (let i = 0; i < coords.length; i++) {
        const p = row[i] || 0;
        sumP += p;
        xSum += p * coords[i].x;
        ySum += p * coords[i].y;
      }
      const copX = sumP > 0 ? xSum / sumP : 0;
      const copY = sumP > 0 ? ySum / sumP : 0;
      return [...row, copX, copY, sumP];
    });

    // 4) Preparamos las cabeceras personalizadas
    const headers = [];
    for (let i = 0; i < originalCount; i++) {
      if (i < 32) {
        headers.push(`PressureSensor ${i}`);
      } else if (i === 32) {
        headers.push('AccelerometerX');
      } else if (i === 33) {
        headers.push('AccelerometerY');
      } else if (i === 34) {
        headers.push('AccelerometerZ');
      } else if (i === 35) {
        headers.push('GyroscopeX');
      } else if (i === 36) {
        headers.push('GyroscopeY');
      } else if (i === 37) {
        headers.push('GyroscopeZ');
      } else {
        // en caso de haber más columnas
        headers.push(`sensor ${i}`);
      }
    }
    headers.push('copX', 'copY', 'sumP');

    // 5) Creamos y exportamos el DataFrame final con cabeceras
    const dfFinal = new DataFrame(dataWithCop, { columns: headers });
    return toCSV(dfFinal, { header: true }) || '';
  };

  // Generamos los CSVs usando todas las columnas + COP calculado sobre las 32 primeras
  const csvLeft = generarCSVEnRango(
    leftDivId,
    leftWearable,
    leftCoords as Coord[],
  );
  const csvRight = generarCSVEnRango(
    rightDivId,
    rightWearable,
    rightCoords as Coord[],
  );

  // Los añadimos al ZIP
  zip.file(
    `exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}_L.csv`,
    csvLeft,
  );
  zip.file(
    `exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}_R.csv`,
    csvRight,
  );

  // Disparamos la descarga
  zip
    .generateAsync({ type: 'blob' })
    .then((blob) => {
      saveAs(
        blob,
        `wearables_data_exp_${experimentId}_part_${participantId}_trial_${trialId}_sw_${swId}.zip`,
      );
    })
    .catch((err) => console.error('Error generando ZIP:', err));
}
