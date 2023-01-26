const ErrorMessage = ({ error, clearError }) => {

  const processError = () => {
    if (error) {
      setTimeout(() => clearError(null), 5000);
      return JSON.parse(error).reason || "Error: ";
    }
  };

  if(!error) return null
  return (
    <article className="absolute bottom-5 right-5 border-2 border-red-800 bg-red-50 px-4 py-4 text-red-800 shadow-solid shadow-red-800 z-10">
      <h1 className="text-lg font-bold ">{processError()}</h1>
      {/* <div className="bg-red-800 px-1 py-1 text-white cursor-pointer inline-block" onClick={() => clearError(null)}>Close</div> */}
    </article>
  );
};

export default ErrorMessage;
