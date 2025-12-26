const Notification = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const base =
    "fixed top-5 right-5 z-50 rounded-lg px-4 py-3 shadow-lg text-white";

  const styles =
    type === "error"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-green-600";

  return (
    <div className={`${base} ${styles}`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="font-bold opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
