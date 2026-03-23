import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AlertModal from "./AlertModal";
import ConfirmModal from "./ConfirmModal";

const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "Notice",
    message: "",
    actionLabel: "OK",
    resolver: null,
  });
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "Please Confirm",
    message: "",
    confirmLabel: "OK",
    cancelLabel: "Cancel",
    resolver: null,
  });

  useEffect(() => {
    const hasOpenDialog = alertState.isOpen || confirmState.isOpen;
    if (!hasOpenDialog) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [alertState.isOpen, confirmState.isOpen]);

  const showAlert = useCallback((options) => {
    const config =
      typeof options === "string" ? { message: options } : options || {};

    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        title: config.title || "Notice",
        message: config.message || "",
        actionLabel: config.actionLabel || "OK",
        resolver: resolve,
      });
    });
  }, []);

  const showConfirm = useCallback((options) => {
    const config =
      typeof options === "string" ? { message: options } : options || {};

    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: config.title || "Please Confirm",
        message: config.message || "",
        confirmLabel: config.confirmLabel || "OK",
        cancelLabel: config.cancelLabel || "Cancel",
        resolver: resolve,
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => {
      prev.resolver?.();
      return {
        isOpen: false,
        title: "Notice",
        message: "",
        actionLabel: "OK",
        resolver: null,
      };
    });
  }, []);

  const cancelConfirm = useCallback(() => {
    setConfirmState((prev) => {
      prev.resolver?.(false);
      return {
        isOpen: false,
        title: "Please Confirm",
        message: "",
        confirmLabel: "OK",
        cancelLabel: "Cancel",
        resolver: null,
      };
    });
  }, []);

  const acceptConfirm = useCallback(() => {
    setConfirmState((prev) => {
      prev.resolver?.(true);
      return {
        isOpen: false,
        title: "Please Confirm",
        message: "",
        confirmLabel: "OK",
        cancelLabel: "Cancel",
        resolver: null,
      };
    });
  }, []);

  const value = useMemo(
    () => ({ showAlert, showConfirm }),
    [showAlert, showConfirm],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        actionLabel={alertState.actionLabel}
        onClose={closeAlert}
      />
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        onConfirm={acceptConfirm}
        onCancel={cancelConfirm}
      />
    </DialogContext.Provider>
  );
}

export function useDialogs() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogs must be used within DialogProvider");
  }
  return context;
}
