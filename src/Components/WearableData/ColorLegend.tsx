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
  };

  return (
    <div className="flex items-center">
      {/* Contenedor de la leyenda de color con gradiente suave */}
      <div style={gradientStyle}>
        {/* Añadir las etiquetas en el punto de cambio */}
        {colorStops.map((stop, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: '100%', // Posiciona a la derecha del gradiente
              top: `${(1 - stop.value / 4095) * 100}%`, // Calcula la posición en el eje Y
              transform: 'translateX(5px) translateY(-50%)', // Ajusta la posición de la etiqueta
              fontSize: '12px',
              color: '#000', // Puedes cambiarlo a un color más visible si lo prefieres
              whiteSpace: 'nowrap', // Para que el texto no se rompa en varias líneas
            }}
          >
            {stop.value}
          </div>
        ))}
      </div>
    </div>
  );
};

// Define los color stops
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

export default () => <ColorLegend colorStops={colorStops} />;
