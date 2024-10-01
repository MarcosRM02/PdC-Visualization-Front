// import React, { useRef, useEffect } from 'react';
// import backgroundImage from './plantilla_sensores_n.png';

// const ImagePlotCanvas = ({ width, height, imageUrl, points }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     const image = new Image();
//     image.src = backgroundImage;

//     image.onload = () => {
//       // Asegúrate de que el canvas se limpia antes de dibujar
//       context.clearRect(0, 0, canvas.width, canvas.height);
//       context.drawImage(image, 0, 0, width, height);
//       plotPoints();
//     };

//     const plotPoints = () => {
//       console.log('Plotting points:', points);
//       points.forEach((point) => {
//         console.log('Drawing point at:', point.x, point.y);
//         context.fillStyle = '#ff0000'; // Cambia a rojo para mayor visibilidad
//         context.beginPath();
//         context.arc(point.x, point.y, 5, 0, Math.PI * 2);
//         context.fill();
//       });
//     };

//   }, [backgroundImage, points]); // Elimina width y height de las dependencias si no cambian

//   return <canvas ref={canvasRef} width={width} height={height} />;
// };

// export default ImagePlotCanvas;
// import React, { useRef, useEffect, useState } from 'react';

// const ImagePlotCanvas = ({ width, height, points, interval = 2000 }) => {
//   const canvasRef = useRef(null);
//   const [currentFrame, setCurrentFrame] = useState(0);

//   // Función para convertir un valor numérico a un color
//   function valueToColor(value, minValue, maxValue) {
//     const normalizedValue = (value - minValue) / (maxValue - minValue); // Normaliza el valor entre 0 y 1
//     const hue = (1 - normalizedValue) * 240; // Escala de azul (frío) a rojo (caliente)
//     return `hsl(${hue}, 100%, 50%)`; // Retorna el color en formato HSL
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     if (!points || points.length === 0) return;

//     // Encuentra el valor mínimo y máximo considerando todos los valores de todos los puntos
//     const allValues = points.flatMap((point) => point.values || []);
//     if (allValues.length === 0) return;

//     const minValue = Math.min(...allValues);
//     const maxValue = Math.max(...allValues);

//     // Función para dibujar los puntos basados en el frame actual
//     const plotPoints = () => {
//       // Limpia el canvas antes de dibujar
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       points.forEach((point) => {
//         if (
//           !point.values ||
//           !Array.isArray(point.values) ||
//           point.values.length === 0
//         )
//           return;

//         // Obtener el valor correspondiente al frame actual
//         const value = point.values[currentFrame % point.values.length];
//         const color = valueToColor(value, minValue, maxValue);

//         // Dibuja el punto con el color calculado
//         context.fillStyle = color;
//         context.beginPath();
//         context.arc(point.x, point.y, 5, 0, Math.PI * 2);
//         context.fill();
//       });
//     };

//     plotPoints();
//   }, [points, currentFrame, interval]);

//   return <canvas ref={canvasRef} width={width} height={height} />;
// };

// export default ImagePlotCanvas;

//Version con botones para avanzar y retroceder

// import React, { useRef, useEffect, useState } from 'react';

// const ImagePlotCanvas = ({ width, height, points }) => {
//   const canvasRef = useRef(null);
//   const [currentFrame, setCurrentFrame] = useState(0);

//   // Función para convertir un valor numérico a un color
//   function valueToColor(value, minValue, maxValue) {
//     const normalizedValue = (value - minValue) / (maxValue - minValue); // Normaliza el valor entre 0 y 1
//     const hue = (1 - normalizedValue) * 240; // Escala de azul (frío) a rojo (caliente)
//     return `hsl(${hue}, 100%, 50%)`; // Retorna el color en formato HSL
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     if (!points || points.length === 0) return;

//     // Encuentra el valor mínimo y máximo considerando todos los valores de todos los puntos
//     const allValues = points.flatMap((point) => point.values || []);
//     if (allValues.length === 0) return;

//     const minValue = Math.min(...allValues);
//     const maxValue = Math.max(...allValues);

//     // Función para dibujar los puntos basados en el frame actual
//     const plotPoints = () => {
//       // Limpia el canvas antes de dibujar
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       points.forEach((point) => {
//         if (
//           !point.values ||
//           !Array.isArray(point.values) ||
//           point.values.length === 0
//         )
//           return;

//         // Obtener el valor correspondiente al frame actual
//         const value = point.values[currentFrame % point.values.length];
//         const color = valueToColor(value, minValue, maxValue);

//         // Dibuja el punto con el color calculado
//         context.fillStyle = color;
//         context.beginPath();
//         context.arc(point.x, point.y, 5, 0, Math.PI * 2);
//         context.fill();
//       });
//     };

//     plotPoints();
//   }, [points, currentFrame]); // Dependencias incluyen puntos y el frame actual

//   // Función para avanzar al siguiente frame
//   const goToNextFrame = () => {
//     setCurrentFrame((prevFrame) => (prevFrame + 1) % points[0].values.length);
//   };

//   // Función para restablecer el frame al valor inicial
//   const resetFrame = () => {
//     setCurrentFrame(0);
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <canvas ref={canvasRef} width={width} height={height} />
//       <div className="mt-4 space-x-4">
//         <button
//           onClick={goToNextFrame}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Siguiente Dato
//         </button>
//         <button
//           onClick={resetFrame}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Resetear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ImagePlotCanvas;

// Funcione pero quiero probar mas cosas
// import React, { useRef, useEffect, useState } from 'react';

// const ImagePlotCanvas = ({ width, height, points, interval = 2000 }) => {
//   const canvasRef = useRef(null);
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const intervalRef = useRef(null);

//   // Función para convertir un valor numérico a un color
//   function valueToColor(value, minValue, maxValue) {
//     const normalizedValue = (value - minValue) / (maxValue - minValue); // Normaliza el valor entre 0 y 1
//     const hue = (1 - normalizedValue) * 240; // Escala de azul (frío) a rojo (caliente)
//     return `hsl(${hue}, 100%, 50%)`; // Retorna el color en formato HSL
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     if (!points || points.length === 0) return;

//     // Encuentra el valor mínimo y máximo considerando todos los valores de todos los puntos
//     const allValues = points.flatMap((point) => point.values || []);
//     if (allValues.length === 0) return;

//     const minValue = Math.min(...allValues);
//     const maxValue = Math.max(...allValues);

//     // Función para dibujar los puntos basados en el frame actual
//     const plotPoints = () => {
//       // Limpia el canvas antes de dibujar
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       points.forEach((point) => {
//         if (
//           !point.values ||
//           !Array.isArray(point.values) ||
//           point.values.length === 0
//         )
//           return;

//         // Obtener el valor correspondiente al frame actual
//         const value = point.values[currentFrame % point.values.length];
//         const color = valueToColor(value, minValue, maxValue);

//         // Dibuja el punto con el color calculado
//         context.fillStyle = color;
//         context.beginPath();
//         context.arc(point.x, point.y, 5, 0, Math.PI * 2);
//         context.fill();
//       });
//     };

//     plotPoints();
//   }, [points, currentFrame]); // Dependencias incluyen puntos y el frame actual

//   // Iniciar la animación
//   useEffect(() => {
//     // Configura un intervalo para actualizar el frame cada 'interval' milisegundos
//     intervalRef.current = setInterval(() => {
//       setCurrentFrame((prevFrame) => (prevFrame + 1) % points[0].values.length);
//     }, interval);

//     // Limpia el intervalo cuando el componente se desmonte
//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, [points, interval]); // Solo se ejecuta cuando el componente se monta o cuando 'interval' cambia

//   // Función para restablecer el frame al valor inicial y detener la animación
//   const resetFrame = () => {
//     setCurrentFrame(0);
//     clearInterval(intervalRef.current); // Detener el intervalo actual
//     // Reiniciar la animación
//     intervalRef.current = setInterval(() => {
//       setCurrentFrame((prevFrame) => (prevFrame + 1) % points[0].values.length);
//     }, interval);
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <canvas ref={canvasRef} width={width} height={height} />
//       <div className="mt-4 space-x-4">
//         <button
//           onClick={resetFrame}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Resetear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ImagePlotCanvas;

//Funcione, pero quiero seguir añadiedno cosas para probar
// import React, { useRef, useEffect, useState } from 'react';

// const ImagePlotCanvas = ({ width, height, points, interval = 1000 }) => {
//   const canvasRef = useRef(null);
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar si la animación está activa
//   const intervalRef = useRef(null);

//   // Función para convertir un valor numérico a un color
//   function valueToColor(value, minValue, maxValue) {
//     const normalizedValue = (value - minValue) / (maxValue - minValue); // Normaliza el valor entre 0 y 1
//     const hue = (1 - normalizedValue) * 240; // Escala de azul (frío) a rojo (caliente)
//     return `hsl(${hue}, 100%, 50%)`; // Retorna el color en formato HSL
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     if (!points || points.length === 0) return;

//     // Encuentra el valor mínimo y máximo considerando todos los valores de todos los puntos
//     const allValues = points.flatMap((point) => point.values || []);
//     if (allValues.length === 0) return;

//     const minValue = Math.min(...allValues);
//     const maxValue = Math.max(...allValues);

//     // Función para dibujar los puntos basados en el frame actual
//     const plotPoints = () => {
//       // Limpia el canvas antes de dibujar
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       points.forEach((point) => {
//         if (
//           !point.values ||
//           !Array.isArray(point.values) ||
//           point.values.length === 0
//         )
//           return;

//         // Obtener el valor correspondiente al frame actual
//         const value = point.values[currentFrame % point.values.length];
//         const color = valueToColor(value, minValue, maxValue);

//         // Dibuja el punto con el color calculado
//         context.fillStyle = color;
//         context.beginPath();
//         context.arc(point.x, point.y, 5, 0, Math.PI * 2);
//         context.fill();
//       });
//     };

//     plotPoints();
//   }, [points, currentFrame]); // Dependencias incluyen puntos y el frame actual

//   // Función para iniciar la animación
//   const startAnimation = () => {
//     if (!isPlaying) {
//       setIsPlaying(true);
//       intervalRef.current = setInterval(() => {
//         setCurrentFrame((prevFrame) => {
//           const nextFrame = prevFrame + 1;
//           // Si llegamos al final de los datos, detenemos la animación
//           if (nextFrame >= points[0].values.length) {
//             clearInterval(intervalRef.current);
//             setIsPlaying(false); // Cambia el estado a no reproduciendo (pausado)
//             return 0; // Vuelve al primer dato
//           }
//           return nextFrame;
//         });
//       }, interval);
//     }
//   };

//   // Función para detener la animación
//   const stopAnimation = () => {
//     clearInterval(intervalRef.current);
//     setIsPlaying(false);
//   };

//   // Función para restablecer el frame al valor inicial y detener la animación
//   const resetFrame = () => {
//     setCurrentFrame(0);
//     stopAnimation(); // Detiene la animación si estaba activa
//   };

//   // Limpiar el intervalo cuando el componente se desmonte
//   useEffect(() => {
//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center">
//       <canvas ref={canvasRef} width={width} height={height} />
//       <div className="mt-4 space-x-4">
//         {!isPlaying ? (
//           <button
//             onClick={startAnimation}
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Play
//           </button>
//         ) : (
//           <button
//             onClick={stopAnimation}
//             className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Pause
//           </button>
//         )}
//         <button
//           onClick={resetFrame}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Resetear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ImagePlotCanvas;

// Funciona, pero quiero meterla las extra e interpolaciones

// import React, { useRef, useEffect, useState } from 'react';

// const ImagePlotCanvas = ({
//   width,
//   height,
//   points,
//   interval = 1000,
//   minValue,
//   maxValue,
// }) => {
//   const canvasRef = useRef(null);
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const intervalRef = useRef(null);

//   // Función para convertir un valor numérico a un color
//   function valueToColor(value, minValue, maxValue) {
//     const normalizedValue = (value - minValue) / (maxValue - minValue);
//     const hue = (1 - normalizedValue) * 240;
//     return `hsl(${hue}, 100%, 50%)`;
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     if (!points || points.length === 0) return;

//     // Función para dibujar los puntos basados en el frame actual
//     const plotPoints = () => {
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       points.forEach((point) => {
//         if (
//           !point.values ||
//           !Array.isArray(point.values) ||
//           point.values.length === 0
//         )
//           return;

//         const value = point.values[currentFrame % point.values.length];
//         const color = valueToColor(value, minValue, maxValue);

//         context.fillStyle = color;
//         context.beginPath();
//         context.arc(point.x, point.y, 5, 0, Math.PI * 2);
//         context.fill();
//       });
//     };

//     plotPoints();
//   }, [points, currentFrame, minValue, maxValue]);

//   const startAnimation = () => {
//     if (!isPlaying) {
//       setIsPlaying(true);
//       intervalRef.current = setInterval(() => {
//         setCurrentFrame((prevFrame) => {
//           const nextFrame = prevFrame + 1;
//           if (nextFrame >= points[0].values.length) {
//             clearInterval(intervalRef.current);
//             setIsPlaying(false);
//             return 0;
//           }
//           return nextFrame;
//         });
//       }, interval);
//     }
//   };

//   const stopAnimation = () => {
//     clearInterval(intervalRef.current);
//     setIsPlaying(false);
//   };

//   const resetFrame = () => {
//     setCurrentFrame(0);
//     stopAnimation();
//   };

//   useEffect(() => {
//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center">
//       <canvas ref={canvasRef} width={width} height={height} />
//       <div className="mt-4 space-x-4">
//         {!isPlaying ? (
//           <button
//             onClick={startAnimation}
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Play
//           </button>
//         ) : (
//           <button
//             onClick={stopAnimation}
//             className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Pause
//           </button>
//         )}
//         <button
//           onClick={resetFrame}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Resetear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ImagePlotCanvas;

//Funcionan lo de las interolaciones, pero quiero probar a meterlo dentro de una imagen
// import React, { useRef, useEffect, useState } from 'react';

// const ImagePlotCanvas = ({
//   width,
//   height,
//   points,
//   interval = 1000,
//   minValue,
//   maxValue,
// }) => {
//   const canvasRef = useRef(null);
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const intervalRef = useRef(null);

//   // Función para convertir un valor numérico a un color
//   function valueToColor(value, minValue, maxValue) {
//     const normalizedValue = (value - minValue) / (maxValue - minValue);
//     const hue = (1 - normalizedValue) * 240;
//     return `hsl(${hue}, 100%, 50%)`;
//   }

//   // Función para crear el mapa de calor circular
//   function circularHeatMap(
//     xCoords,
//     yCoords,
//     pressures,
//     radius = 70,
//     smoothness = 2,
//   ) {
//     // Crear las cuadrículas de la imagen
//     const xi = new Array(height)
//       .fill(0)
//       .map((_, y) => new Array(width).fill(0).map((_, x) => x));
//     const yi = new Array(height)
//       .fill(0)
//       .map((_, y) => new Array(width).fill(y));

//     let z = Array.from({ length: height }, () => Array(width).fill(0));

//     // Añadir la contribución de cada punto al mapa de calor
//     for (let i = 0; i < xCoords.length; i++) {
//       const x0 = xCoords[i];
//       const y0 = yCoords[i];
//       const p0 = pressures[i];

//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const dist = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
//           z[y][x] += p0 * Math.exp(-smoothness * Math.pow(dist / radius, 2));
//         }
//       }
//     }

//     // Limitar los valores entre 0 y maxValue
//     z = z.map((row) =>
//       row.map((value) => Math.min(Math.max(value, minValue), maxValue)),
//     );

//     return z;
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     if (!points || points.length === 0) return;

//     // Extraer las coordenadas x, y y valores de presión de los puntos
//     const xCoords = points.map((point) => point.x);
//     const yCoords = points.map((point) => point.y);
//     const pressures = points.map(
//       (point) => point.values[currentFrame % point.values.length],
//     );

//     // Calcular el mapa de calor utilizando la función circularHeatMap
//     const heatmapData = circularHeatMap(xCoords, yCoords, pressures);

//     // Función para dibujar el mapa de calor en el canvas
//     const plotHeatMap = () => {
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       // Dibujar el mapa de calor en el canvas
//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const color = valueToColor(heatmapData[y][x], minValue, maxValue);
//           context.fillStyle = color;
//           context.fillRect(x, y, 1, 1); // Dibuja un píxel
//         }
//       }
//     };

//     plotHeatMap();
//   }, [points, currentFrame, minValue, maxValue]);

//   // Función para iniciar la animación
//   const startAnimation = () => {
//     if (!isPlaying) {
//       setIsPlaying(true);
//       intervalRef.current = setInterval(() => {
//         setCurrentFrame((prevFrame) => {
//           const nextFrame = prevFrame + 1;
//           if (nextFrame >= points[0].values.length) {
//             clearInterval(intervalRef.current);
//             setIsPlaying(false);
//             return 0;
//           }
//           return nextFrame;
//         });
//       }, interval);
//     }
//   };

//   // Función para detener la animación
//   const stopAnimation = () => {
//     clearInterval(intervalRef.current);
//     setIsPlaying(false);
//   };

//   // Función para restablecer el frame al valor inicial y detener la animación
//   const resetFrame = () => {
//     setCurrentFrame(0);
//     stopAnimation();
//   };

//   // Limpiar el intervalo cuando el componente se desmonte
//   useEffect(() => {
//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center">
//       <canvas ref={canvasRef} width={width} height={height} />
//       <div className="mt-4 space-x-4">
//         {!isPlaying ? (
//           <button
//             onClick={startAnimation}
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Play
//           </button>
//         ) : (
//           <button
//             onClick={stopAnimation}
//             className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Pause
//           </button>
//         )}
//         <button
//           onClick={resetFrame}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Resetear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ImagePlotCanvas;

import React, { useRef, useEffect, useState } from 'react';

const ImagePlotCanvas = ({
  width,
  height,
  points,
  interval = 500,
  minValue,
  maxValue,
}) => {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Función para convertir un valor numérico a un color
  function valueToColor(value, minValue, maxValue) {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const hue = (1 - normalizedValue) * 240;
    return `hsl(${hue}, 100%, 50%)`;
  }

  // Función para crear el mapa de calor circular
  function circularHeatMap(
    xCoords,
    yCoords,
    pressures,
    radius = 70,
    smoothness = 2,
  ) {
    // Crear las cuadrículas de la imagen
    const xi = new Array(height)
      .fill(0)
      .map((_, y) => new Array(width).fill(0).map((_, x) => x));
    const yi = new Array(height)
      .fill(0)
      .map((_, y) => new Array(width).fill(y));

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

    // Limitar los valores entre 0 y maxValue
    z = z.map((row) =>
      row.map((value) => Math.min(Math.max(value, minValue), maxValue)),
    );

    return z;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!points || points.length === 0) return;

    // Extraer las coordenadas x, y y valores de presión de los puntos
    const xCoords = points.map((point) => point.x);
    const yCoords = points.map((point) => point.y);
    const pressures = points.map(
      (point) => point.values[currentFrame % point.values.length],
    );

    // Calcular el mapa de calor utilizando la función circularHeatMap
    const heatmapData = circularHeatMap(xCoords, yCoords, pressures);

    // Función para dibujar el mapa de calor en el canvas
    const plotHeatMap = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el mapa de calor en el canvas
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const color = valueToColor(heatmapData[y][x], minValue, maxValue);
          context.fillStyle = color;
          context.fillRect(x, y, 1, 1); // Dibuja un píxel
        }
      }

      // Ahora, dibujamos los puntos sobre el mapa de calor
      points.forEach((point, index) => {
        const value = point.values[currentFrame % point.values.length];

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
  }, [points, currentFrame, minValue, maxValue]);

  // Función para iniciar la animación
  const startAnimation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prevFrame) => {
          const nextFrame = prevFrame + 1;
          if (nextFrame >= points[0].values.length) {
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
