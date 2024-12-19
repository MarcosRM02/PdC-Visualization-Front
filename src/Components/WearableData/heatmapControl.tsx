import { useState, useEffect } from 'react';

interface HeatmapControlPanelProps {
  updateHz: number;
  onUpdateHzChange: (newHz: number) => void;
  getRenderFps: () => { leftFps: number; rightFps: number }; // Función para obtener FPS
}

const HeatmapControlPanel = ({
  updateHz,
  onUpdateHzChange,
  getRenderFps,
}: HeatmapControlPanelProps) => {
  const [fps, setFps] = useState(0); // Estado para el FPS combinado

  // Actualizar el FPS cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const { leftFps, rightFps } = getRenderFps();
      setFps(Math.round((leftFps + rightFps) / 2)); // Promedio del FPS
    }, 1000);

    return () => clearInterval(interval);
  }, [getRenderFps]);

  return (
    <div className="mt-4">
      <div className="text-lg font-bold">Render FPS: {fps}</div>
      <div className="mt-2 flex items-center space-x-2">
        <label htmlFor="updateHz" className="text-lg font-medium">
          Update Rate (Hz):
        </label>
        <input
          id="updateHz"
          type="number"
          min="1"
          max="1000"
          value={updateHz}
          onChange={(e) =>
            onUpdateHzChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="border p-1 w-20"
        />
      </div>
    </div>
  );
};

export default HeatmapControlPanel;
