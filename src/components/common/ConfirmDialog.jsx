import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut, X } from "lucide-react";

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // 'danger' or 'info'
}) => {
  const isDanger = type === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-[95%] max-w-sm bg-white rounded-3xl p-6 shadow-2xl mb-4 md:mb-0 overflow-hidden"
          >
            {/* Header Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDanger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
              {isDanger ? <AlertTriangle size={28} /> : <LogOut size={28} />}
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-[0.98] ${
                  isDanger 
                    ? "bg-[#B23A3A] hover:bg-red-800 shadow-red-100" 
                    : "bg-[#B23A3A] hover:bg-red-800 shadow-blue-100"
                }`}
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl font-black text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all active:scale-[0.98]"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
