const Loading = ({ label = "Loading..." }) => (
  <div className="flex flex-col justify-center items-center min-h-[40vh] gap-3">
    <span className="loading loading-spinner loading-lg text-primary" />
    <p className="text-base-content/60 text-sm">{label}</p>
  </div>
);

export default Loading;
