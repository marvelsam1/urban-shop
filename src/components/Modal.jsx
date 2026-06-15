import React from "react";
import { AlertCircle, CheckCircle, Info, X, Trash2 } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText,
}) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="text-green-500 w-16 h-16 mb-4 mx-auto" />,
    error: <AlertCircle className="text-red-500 w-16 h-16 mb-4 mx-auto" />,
    confirm: <Trash2 className="text-red-500 w-16 h-16 mb-4 mx-auto" />,
    info: <Info className="text-blue-500 w-16 h-16 mb-4 mx-auto" />,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mt-2">
          {icons[type] || icons.info}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

          <div className="flex justify-center gap-3">
            {type === "confirm" && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors w-full"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                else onClose();
              }}
              className={`px-6 py-3 font-bold rounded-xl transition-all transform hover:scale-[1.02] w-full shadow-sm ${
                type === "confirm" || type === "error"
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                  : type === "success"
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-green-200"
                    : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-yellow-200"
              }`}
            >
              {confirmText || (type === "confirm" ? "Confirm" : "Got it!")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
