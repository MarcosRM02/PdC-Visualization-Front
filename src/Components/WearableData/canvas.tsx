import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

interface Point {
  x: number;
  y: number;
  values: number[];
}

interface ImagePlotCanvasProps {
  width?: number;
  height?: number;
  points: Point[];
  interval?: number; // Intervalo de tiempo en ms.
}

const ImagePlotCanvas: React.FC<ImagePlotCanvasProps> = ({
  width = 350,
  height = 1040,
  points,
  interval = 20, // 1/50 * 1000 = 20 ms
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Definir la cuadrícula de baja resolución
  const gridWidth = 30; // Resolución horizontal de la cuadrícula
  const gridHeight = 85; // Resolución vertical de la cuadrícula

  // Memoizar las posiciones de la cuadrícula para evitar recalculaciones
  const { xi, yi } = useMemo(() => {
    const xi = Array.from({ length: gridHeight }, (_, y) =>
      Array.from({ length: gridWidth }, (_, x) => (x / gridWidth) * width),
    );
    const yi = Array.from({ length: gridHeight }, (_, y) =>
      Array.from({ length: gridWidth }, () => (y / gridHeight) * height),
    );
    return { xi, yi };
  }, [gridWidth, gridHeight, width, height]);

  // Definir la paleta de colores
  const colorStops = useMemo(
    () => [
      { value: 0, color: '#0000FF' }, // Azul
      { value: 500, color: '#0000FF' }, // Azul profundo
      { value: 1000, color: '#00FFFF' }, // Cian
      { value: 1500, color: '#00FF00' }, // Verde
      { value: 2000, color: '#FFFF00' }, // Amarillo
      { value: 2500, color: '#FFA500' }, // Naranja
      { value: 3000, color: '#FF4500' }, // Rojo Naranja
      { value: 3500, color: '#FF0000' }, // Rojo
      { value: 4000, color: '#8B0000' }, // Rojo Oscuro
      { value: 4095, color: '#8B0000' }, // Rojo oscuro para el valor máximo
    ],
    [],
  );

  // Crear una tabla de colores precalculada
  const colorLookup = useMemo(() => {
    const lookup: string[] = [];
    for (let i = 0; i <= 4095; i++) {
      lookup[i] = valueToColor(i);
    }
    return lookup;

    // Función para mapear valores a colores
    function valueToColor(value: number): string {
      const normalizedValue = Math.min(Math.max(value, 0), 4095);

      for (let i = 0; i < colorStops.length - 1; i++) {
        const currentStop = colorStops[i];
        const nextStop = colorStops[i + 1];

        if (
          normalizedValue >= currentStop.value &&
          normalizedValue <= nextStop.value
        ) {
          const ratio =
            (normalizedValue - currentStop.value) /
            (nextStop.value - currentStop.value);
          return interpolateColor(currentStop.color, nextStop.color, ratio);
        }
      }
      return '#FFFFFF'; // Color por defecto si no entra en ningún rango
    }

    // Función para interpolar entre dos colores
    function interpolateColor(
      color1: string,
      color2: string,
      ratio: number,
    ): string {
      const hex = (x: number) => x.toString(16).padStart(2, '0');

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
  }, [colorStops]);

  // Función para crear el mapa de calor circular
  const circularHeatMap = useCallback(
    (
      xCoords: number[],
      yCoords: number[],
      pressures: number[],
      radius = 70,
      smoothness = 2,
    ): number[][] => {
      const z: number[][] = Array.from({ length: gridHeight }, () =>
        Array(gridWidth).fill(0),
      );

      for (let i = 0; i < xCoords.length; i++) {
        const x0 = xCoords[i];
        const y0 = yCoords[i];
        const p0 = pressures[i];

        for (let y = 0; y < gridHeight; y++) {
          for (let x = 0; x < gridWidth; x++) {
            const dx = xi[y][x] - x0;
            const dy = yi[y][x] - y0;
            const distSq = dx * dx + dy * dy;
            const contribution =
              p0 * Math.exp(-smoothness * (distSq / (radius * radius)));
            z[y][x] += contribution;
          }
        }
      }

      // Clampear los valores entre 0 y 4095
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          if (z[y][x] > 4095) z[y][x] = 4095;
          else if (z[y][x] < 0) z[y][x] = 0;
        }
      }

      return z;
    },
    [gridHeight, gridWidth, xi, yi],
  );

  // Función para dibujar el mapa de calor utilizando ImageData
  const plotHeatMap = useCallback(
    (heatmapData: number[][]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      const imageData = context.createImageData(width, height);
      const data = imageData.data;

      // Optimizar el acceso a heatmapData y colorLookup
      for (let y = 0; y < height; y++) {
        const scaledY = Math.floor((y / height) * gridHeight);
        for (let x = 0; x < width; x++) {
          const scaledX = Math.floor((x / width) * gridWidth);
          const value = Math.floor(heatmapData[scaledY][scaledX]);
          const color = colorLookup[value] || '#FFFFFF';

          const index = (y * width + x) * 4;
          // Convertir el color hexadecimal a RGB
          data[index] = parseInt(color.slice(1, 3), 16); // R
          data[index + 1] = parseInt(color.slice(3, 5), 16); // G
          data[index + 2] = parseInt(color.slice(5, 7), 16); // B
          data[index + 3] = 255; // A
        }
      }

      // Poner los datos de la imagen en el canvas
      context.putImageData(imageData, 0, 0);
    },
    [colorLookup, gridHeight, gridWidth, height, width],
  );

  // Función para dibujar los puntos sobre el mapa de calor
  const plotPoints = useCallback(
    (context: CanvasRenderingContext2D, points: Point[]) => {
      points.forEach((point, index) => {
        // Dibujar el punto como un círculo negro
        context.fillStyle = '#000';
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, Math.PI * 2);
        context.fill();

        // Dibujar el índice del punto en blanco
        context.fillStyle = '#FFFFFF';
        context.font = '12px Arial';
        context.fillText(`${index}`, point.x + 8, point.y - 8);
      });
    },
    [],
  );

  // Función de animación usando requestAnimationFrame
  const animate = useCallback(() => {
    setCurrentFrame((prevFrame) => {
      const nextFrame = prevFrame + 1;
      if (nextFrame >= points[0].values.length) {
        setIsPlaying(false);
        return 0;
      }
      return nextFrame;
    });
    animationRef.current = requestAnimationFrame(animate);
  }, [points]);

  // Efecto para manejar la animación
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, animate]);

  // Efecto para dibujar en el canvas cuando cambian los puntos o el frame
  useEffect(() => {
    if (!points || points.length === 0) return;

    const xCoords = points.map((point) => point.x);
    const yCoords = points.map((point) => point.y);
    const pressures = points.map(
      (point) => point.values[currentFrame % point.values.length],
    );

    const heatmapData = circularHeatMap(xCoords, yCoords, pressures);
    plotHeatMap(heatmapData);

    // Dibujar los puntos sobre el mapa de calor
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      plotPoints(context, points);
    }
  }, [points, currentFrame, circularHeatMap, plotHeatMap, plotPoints]);

  // Función para iniciar la animación
  const startAnimation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  // Función para detener la animación
  const stopAnimation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  // Función para resetear el frame y detener la animación
  const resetFrame = () => {
    setCurrentFrame(0);
    stopAnimation();
  };

  // Limpiar la animación cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
          Reset
        </button>
      </div>
    </div>
  );
};

export default ImagePlotCanvas;
