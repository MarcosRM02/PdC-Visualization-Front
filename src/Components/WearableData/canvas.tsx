import { useRef, useEffect, useState } from 'react';

const ImagePlotCanvas = ({
  width = 350,
  height = 1040,
  //@ts-ignore
  points,
  interval = 1 / 50, // Intervalo de tiempo el ms.
}) => {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Paleta de colores personalizada para valores en rangos de 100 en 100
  const colorStops = [
    { value: 0, color: '#0000FF' }, // Azul
    { value: 100, color: '#00FFFF' }, // Cyan
    { value: 200, color: '#00FF00' }, // Verde
    { value: 300, color: '#FFFF00' }, // Amarillo
    { value: 400, color: '#FFA500' }, // Naranja
    { value: 500, color: '#FF4500' }, // Rojo Naranja
    { value: 1000, color: '#FF0000' }, // Rojo
    { value: 2000, color: '#8B0000' }, // Rojo Oscuro
    { value: 3000, color: '#800080' }, // Púrpura
    { value: 4095, color: '#FFFFFF' }, // Blanco para el valor máximo
  ];

  // Función para mapear valores a colores en base a los rangos definidos en la paleta
  function valueToColor(value: any) {
    // Normaliza el valor para que caiga dentro del rango [0, 4095]
    const normalizedValue = Math.min(Math.max(value, 0), 4095);

    // Encuentra el color correspondiente en la paleta
    for (let i = 0; i < colorStops.length - 1; i++) {
      const currentStop = colorStops[i];
      const nextStop = colorStops[i + 1];

      if (
        normalizedValue >= currentStop.value &&
        normalizedValue <= nextStop.value
      ) {
        // Interpolación lineal entre los dos colores
        const ratio =
          (normalizedValue - currentStop.value) /
          (nextStop.value - currentStop.value);
        return interpolateColor(currentStop.color, nextStop.color, ratio);
      }
    }
    return '#FFFFFF'; // Color por defecto si no entra en ningún rango
  }

  // Función para interpolar entre dos colores
  //@ts-ignore
  function interpolateColor(color1, color2, ratio) {
    const hex = (x: any) => x.toString(16).padStart(2, '0');

    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }

  // Función para crear el mapa de calor circular
  function circularHeatMap(
    xCoords: any,
    yCoords: any,
    pressures: any,
    radius = 70,
    smoothness = 2,
  ) {
    let z = Array.from({ length: height }, () => Array(width).fill(0));

    // Añadir la contribución de cada punto al mapa de calor
    for (let i = 0; i < xCoords.length; i++) {
      const x0 = xCoords[i];
      const y0 = yCoords[i];
      const p0 = pressures[i];

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dist = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
          z[y][x] += p0 * Math.exp(-smoothness * Math.pow(dist / radius, 2));
        }
      }
    }

    // Limitar los valores entre minValue y maxValue
    z = z.map((row) => row.map((value) => Math.min(Math.max(value, 0), 4095)));

    return z;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    //@ts-ignore
    const context = canvas.getContext('2d');

    if (!points || points.length === 0) return;

    // Extraer las coordenadas x, y y valores de presión de los puntos
    //@ts-ignore
    const xCoords = points.map((point) => point.x);
    //@ts-ignore
    const yCoords = points.map((point) => point.y);
    const pressures = points.map(
      //@ts-ignore
      (point) => point.values[currentFrame % point.values.length],
    );

    // Calcular el mapa de calor utilizando la función circularHeatMap
    const heatmapData = circularHeatMap(xCoords, yCoords, pressures);

    // Función para dibujar el mapa de calor en el canvas
    const plotHeatMap = () => {
      //@ts-ignore
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el mapa de calor en el canvas
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const color = valueToColor(heatmapData[y][x]);
          context.fillStyle = color;
          context.fillRect(x, y, 1, 1); // Dibuja un píxel
        }
      }

      // Ahora, dibujamos los puntos sobre el mapa de calor
      //@ts-ignore
      points.forEach((point, index) => {
        // Dibuja el punto como un círculo negro (o cualquier color que desees)
        context.fillStyle = '#000'; // Color negro
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, Math.PI * 2);
        context.fill();

        // Dibuja el valor del punto en la posición
        context.fillStyle = '#FFFFFF'; // Blanco para el texto
        context.font = '12px Arial';
        context.fillText(`${index}`, point.x + 8, point.y - 8); // Ajusta la posición del texto si es necesario
      });
    };

    plotHeatMap();
  }, [points, currentFrame]);

  // Función para iniciar la animación
  const startAnimation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      //@ts-ignore
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prevFrame) => {
          const nextFrame = prevFrame + 1;
          if (nextFrame >= points[0].values.length) {
            //@ts-ignore
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return nextFrame;
        });
      }, interval);
    }
  };

  // Función para detener la animación
  const stopAnimation = () => {
    //@ts-ignore
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  // Función para restablecer el frame al valor inicial y detener la animación
  const resetFrame = () => {
    setCurrentFrame(0);
    stopAnimation();
  };

  // Limpiar el intervalo cuando el componente se desmonte
  useEffect(() => {
    return () => {
      //@ts-ignore
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={width} height={height} />
      <div className="mt-4 space-x-4">
        {!isPlaying ? (
          <button
            onClick={startAnimation}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Play
          </button>
        ) : (
          <button
            onClick={stopAnimation}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetFrame}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Resetear
        </button>
      </div>
    </div>
  );
};

export default ImagePlotCanvas;
