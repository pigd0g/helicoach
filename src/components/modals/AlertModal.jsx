import React from "react";

export default function AlertModal({
  isOpen,
  title = "Notice",
  message,
  actionLabel = "OK",
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-[1px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-slate-50">
          <h3
            id="alert-modal-title"
            className="text-base sm:text-lg font-bold text-slate-900"
          >
            {title}
          </h3>
        </div>

        <div className="px-5 py-5 sm:px-6 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {message}
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-w-24 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
