import React from 'react';

// La función que convierte un valor numérico a un color según el rango [minValue, maxValue]
function valueToColor(value, minValue, maxValue) {
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const hue = (1 - normalizedValue) * 240; // Escala de azul (frío) a rojo (caliente)
  return `hsl(${hue}, 100%, 50%)`; // Retorna el color en formato HSL
}

const ColorLegend = ({ minValue, maxValue, width = 30, height = 300 }) => {
  // Calcular el color correspondiente para el valor mínimo y el valor máximo
  const minColor = valueToColor(minValue, minValue, maxValue);
  const maxColor = valueToColor(maxValue, minValue, maxValue);

  // Crear un gradiente de color vertical que va de minColor a maxColor
  const gradientStyle = {
    background: `linear-gradient(to top, ${minColor}, ${maxColor})`,
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Gradiente de color */}
      <span>{maxValue}</span>
      <div style={gradientStyle} />
      {/* Mostrar valores máximo y mínimo */}
      <span>{minValue}</span>
    </div>
  );
};

export default ColorLegend;
