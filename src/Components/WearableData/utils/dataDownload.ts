import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DataFrame, concat, toCSV } from 'danfojs';

export async function descargarDatosVisibles(
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

  const generarCSVEnRango = (divId: any, wearable: any) => {
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
    const csv = toCSV(df, { header: false }) || '';
    const lines = csv.split('\n');
    const selectedData = lines.slice(startIndex, endIndex + 1).join('\n');
    return selectedData;
  };

  const csvLeft = generarCSVEnRango(leftDivId, leftWearable);
  const csvRight = generarCSVEnRango(rightDivId, rightWearable);

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
