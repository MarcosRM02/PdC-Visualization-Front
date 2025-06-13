import { FaSync } from 'react-icons/fa';

const Spinner = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
      <div className="flex flex-col items-center">
        <FaSync className="animate-spin text-3xl text-gray-600" />
        <span className="text-xl text-gray-600 mt-2">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
