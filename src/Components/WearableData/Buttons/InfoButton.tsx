import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';

const InfoButton: React.FC = () => {
  const message =
    'Los datos que contienen los CSV son los del rango visible actual de las gráficas';
  return (
    <div>
      <button
        data-tooltip-id="info-tooltip"
        data-tooltip-content={message}
        className="p-2 text-gray-500 hover:text-gray-700"
      >
        <AiOutlineInfoCircle className="w-5 h-5" />
      </button>
      <Tooltip id="info-tooltip" style={{ zIndex: 9999 }} place="top" />
    </div>
  );
};

export default InfoButton;
