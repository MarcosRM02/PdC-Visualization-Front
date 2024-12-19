import colors from './data/colors.json';

interface ColorStop {
  value: number;
  color: string;
}

const ColorLegend = ({
  width = 30,
  height = 410,
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
const colorStops = colors;

export default () => <ColorLegend colorStops={colorStops} />;
