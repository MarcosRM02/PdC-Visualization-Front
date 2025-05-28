const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700">Loading data...</p>
      </div>
    </div>
  );
};

export default Spinner;
