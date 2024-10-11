import React from 'react';

interface ColorStop {
  value: number;
  color: string;
}

const ColorLegend = ({
  width = 30,
  height = 820,
  colorStops,
}: {
  width?: number;
  height?: number;
  colorStops: ColorStop[];
}) => {
  // Crear el gradiente de color
  const gradientColors = colorStops
    .map((stop) => `${stop.color} ${(stop.value / 4095) * 100}%`)
    .join(', ');

  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(to top, ${gradientColors})`,
    width: `${width}px`,
    height: `${height}px`,
    border: '2px solid black',
    position: 'relative',
    borderRadius: '4px', // Bordes suavizados
  };

  return (
    <div className="flex items-center">
      {/* Contenedor de la leyenda de color con gradiente suave */}
      <div style={gradientStyle}>
        {/* Añadir las etiquetas en el punto de cambio excepto para 4095 */}
        {colorStops
          .filter((stop) => stop.value !== 4095) // Eliminar etiqueta de 4095
          .map((stop, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '100%', // Posiciona a la derecha del gradiente
                top: `${(1 - stop.value / 4095) * 100}%`, // Calcula la posición en el eje Y
                transform: 'translateX(10px) translateY(-50%)', // Ajusta la posición de la etiqueta
                fontSize: '14px',
                color: '#000', // Color del texto
                whiteSpace: 'nowrap', // Para que el texto no se rompa en varias líneas
              }}
            >
              {stop.value}
            </div>
          ))}
        {/* Etiqueta de presión a la derecha */}
        <div
          style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateX(40px) translateY(-50%) rotate(90deg)', // Girar la etiqueta
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          Preassure
        </div>
      </div>
    </div>
  );
};

// Define los color stops ajustados para que coincidan con los colores y rangos de la imagen
const colorStops = [
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
];

export default () => <ColorLegend colorStops={colorStops} />;
