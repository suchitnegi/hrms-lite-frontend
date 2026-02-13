function Loader({ message = "Loading..." }) {
  return (
    <div className="loader">
      <div className="spinner"></div>
      {message}
    </div>
  );
}

export default Loader;
