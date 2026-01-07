const Notification = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const base =
    "w-full rounded-lg px-4 py-3 shadow-md text-white flex items-center justify-between";

  const styles =
    type === "error"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500 text-black"
      : "bg-green-600";

  return (
    <div className={`${base} ${styles}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 font-bold opacity-80 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification;
