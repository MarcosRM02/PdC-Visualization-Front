import { useEffect } from "react";
import { WearableDataProps } from "../../Types/Interfaces";
import { DataFrame, concat, toCSV } from "danfojs";

const WearablesData = ({ wearables = [] }: WearableDataProps) => {
  const leftWearables = wearables.filter(
    (wearable) => wearable.wearable_type === "L"
  );

  const rightWearables = wearables.filter(
    (wearable) => wearable.wearable_type === "R"
  );

  useEffect(() => {
    plotWearablesData(leftWearables, rightWearables);
  }, [wearables]);

  return (
    <div className="flex justify-around">
      <div className="left-side">
        {leftWearables.map((wearable, index) => (
          <div key={index} className="wearable-item">
            <h4>Left Wearable - {wearable.WearablesId} </h4>
            <div id="leftPressureSensor"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles("leftPressureSensor", leftWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div id="leftAccelerometer"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles("leftAccelerometer", leftWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div id="leftGyroscope"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles("leftGyroscope", leftWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="right-side">
        {rightWearables.map((wearable, index) => (
          <div key={index} className="wearable-item">
            <h4>Right Wearable - {wearable.WearablesId}</h4>
            <div id="rightPressureSensor"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles("rightPressureSensor", rightWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div id="rightAccelerometer"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles("rightAccelerometer", rightWearables)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
              >
                Download CSV
              </button>
            </div>
            <div id="rightGyroscope"></div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  descargarDatosVisibles("rightGyroscope", rightWearables)
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

function plotWearablesData(leftWearables: any, rightWearables: any) {
  plotLeftWearable(leftWearables);
  plotrightWearable(rightWearables);
}

function plotLeftWearable(leftWearables: any) {
  // @ts-ignore
  plotData(leftWearables, "leftPressureSensor", "Pressure Sensor", [":32"]);
  plotData(leftWearables, "leftAccelerometer", "Accelerometer", [32, 33, 34]);
  plotData(leftWearables, "leftGyroscope", "Gyroscope", [35, 36, 37]);
}

function plotrightWearable(rightWearables: any) {
  // @ts-ignore
  plotData(rightWearables, "rightPressureSensor", "Pressure Sensor", [":32"]);
  plotData(rightWearables, "rightAccelerometer", "Accelerometer", [32, 33, 34]);
  plotData(rightWearables, "rightGyroscope", "Gyroscope", [35, 36, 37]);
}

function generateLayout(title: string) {
  return {
    showlegend: true,
    title: {
      text: title,
      x: 0,
    },
    legend: {
      bgcolor: "#fcba03",
      bordercolor: "#444",
      borderwidth: 1,
      font: { family: "Arial", size: 10, color: "#fff" },
    },
    width: 1000,
    yaxis: {
      title: "Value",
    },
    xaxis: {
      title: "Time",
    },
  };
}

function plotData(
  wearable: any,
  divId: string,
  title: string,
  columns: number[]
) {
  const frames = wearable.map(
    (wearable: any) => new DataFrame(wearable.dataframe)
  );

  const leftDf = concat({ dfList: frames, axis: 1 });

  // @ts-ignore
  let datos = leftDf.iloc({ rows: [":"], columns: columns });
  const config = {
    columns: datos.columns,
    displayModeBar: true,
    displaylogo: false,
  };

  datos.plot(divId).line({ layout: generateLayout(title), config: config });
}

async function descargarDatosVisibles(divId: string, wearable: any) {
  var plotInstance = document.getElementById(divId);
  // @ts-ignore
  var xRange = plotInstance.layout.xaxis.range; // Rango del eje X visible actualmente

  // Calcular el índice de inicio y fin basado en xRange
  var startIndex = Math.floor(xRange[0]);
  var endIndex = Math.ceil(xRange[1]);

  const frames = wearable.map(
    (wearable: any) => new DataFrame(wearable.dataframe)
  );

  const df = concat({ dfList: frames, axis: 1 });
  var csv = toCSV(df);

  try {
    // @ts-ignore
    const lines = csv.split("\n");
    const selectedData = lines.slice(startIndex, endIndex + 1).join("\n");

    var csvContent = "data:text/csv;charset=utf-8," + selectedData;

    // Crear un enlace y descargar el CSV
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Limpiar después de la descarga
  } catch (error) {
    console.error("Error al cargar o procesar el archivo CSV:", error);
  }
}

export default WearablesData;
