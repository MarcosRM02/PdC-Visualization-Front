import React, { useRef, useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';

const CustomLegendPlot = () => {
  const plotRef = useRef(null);
  // Estado para la visibilidad de cada traza (true = visible, false = oculto)
  const [traceVisibility, setTraceVisibility] = useState([true, true]);

  // Datos de ejemplo: dos trazas
  const data = [
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Trazado 1',
    },
    {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Trazado 2',
    },
  ];

  // Configuración del layout: se oculta la leyenda nativa
  const layout = {
    title: 'Ejemplo de leyenda personalizada',
    showlegend: false,
  };

  useEffect(() => {
    if (plotRef.current) {
      Plotly.newPlot(plotRef.current, data, layout);
    }
  }, []);

  // Función para cambiar la visibilidad de la traza
  const toggleTrace = (traceIndex) => {
    const newVisibility = [...traceVisibility];
    // Alterna la visibilidad: si es visible, se oculta y viceversa
    newVisibility[traceIndex] = !newVisibility[traceIndex];
    setTraceVisibility(newVisibility);

    // En Plotly, para ocultar una traza se usa el valor "legendonly"
    const updateVisibility = newVisibility[traceIndex] ? true : 'legendonly';
    Plotly.restyle(plotRef.current, { visible: updateVisibility }, [
      traceIndex,
    ]);
  };

  return (
    <div>
      <div ref={plotRef} />
      <div style={{ display: 'flex', marginTop: '20px' }}>
        {/* Leyenda personalizada para Trazado 1 */}
        <div
          onClick={() => toggleTrace(0)}
          style={{
            cursor: 'pointer',
            marginRight: '20px',
            opacity: traceVisibility[0] ? 1 : 0.5, // se atenúa si la traza está oculta
          }}
        >
          <img
            src="ruta/a/imagen-traza1.png"
            alt="Trazado 1"
            style={{ width: '50px', height: '50px' }}
          />
          <span>Trazado 1</span>
        </div>
        {/* Leyenda personalizada para Trazado 2 */}
        <div
          onClick={() => toggleTrace(1)}
          style={{
            cursor: 'pointer',
            opacity: traceVisibility[1] ? 1 : 0.5,
          }}
        >
          <img
            src="ruta/a/imagen-traza2.png"
            alt="Trazado 2"
            style={{ width: '50px', height: '50px' }}
          />
          <span>Trazado 2</span>
        </div>
      </div>
    </div>
  );
};

export default CustomLegendPlot;
