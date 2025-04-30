import { useState, useEffect } from 'react';
import { IHeatmapControlPanelProps } from '../../Interfaces/DataPanel';

const HeatmapControlPanel = ({
  updateHz,
  onUpdateHzChange,
  getRenderFps,
}: IHeatmapControlPanelProps) => {
  const [_, setFps] = useState(0); // Estado para el FPS combinado

  // Valor normal (50) y límite superior (x2 normal, es decir 100)
  const normalHz = 50;
  const maxHz = normalHz * 2;

  // Actualizar el FPS cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const { leftFps, rightFps } = getRenderFps();
      setFps(Math.round((leftFps + rightFps) / 2)); // Promedio del FPS
    }, 1000);

    return () => clearInterval(interval);
  }, [getRenderFps]);

  // Calcula el multiplicador
  const multiplier = (updateHz / normalHz).toFixed(2);

  return (
    <div className="mt-4">
      <div className="mt-2 flex items-center space-x-2">
        <input
          id="updateHz"
          type="range"
          min="1"
          max={maxHz}
          value={updateHz}
          onChange={(e) =>
            onUpdateHzChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-40"
        />
        <span>{`x${multiplier}`}</span>
      </div>
    </div>
  );
};

export default HeatmapControlPanel;
