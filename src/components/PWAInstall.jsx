import React, { useState, useEffect } from "react";

// Detect iOS outside of component
const detectIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Check if already installed
const checkInstalled = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
};

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const isIOS = detectIOS();
  const [isInstalled, setIsInstalled] = useState(() => checkInstalled());

  useEffect(() => {
    if (isInstalled) {
      return;
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, Samsung Internet)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show iOS instructions if on iOS
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the deferredPrompt for later use
    setDeferredPrompt(null);
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if not iOS and no install prompt available
  if (!isIOS && !deferredPrompt) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-3">
        Install Helicoach
      </h3>
      <p className="text-slate-700 mb-4">
        Add to Home Screen - Quick access and offline support
      </p>

      {!showIOSInstructions && (
        <button
          onClick={handleInstallClick}
          className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Install Helicoach
        </button>
      )}

      {showIOSInstructions && isIOS && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-3">
              Installation Instructions for iOS:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>
                <strong>Tap the Share Icon:</strong> Tap the share button (the
                square with an arrow pointing up) in the toolbar at the bottom
                of Safari.
              </li>
              <li>
                <strong>Select "Add to Home Screen":</strong> Scroll down and
                choose "Add to Home Screen" from the share sheet menu.
              </li>
              <li>
                <strong>Confirm:</strong> Tap "Add" in the top right corner to
                install HeliCoach to your home screen.
              </li>
            </ol>
          </div>
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            Close Instructions
          </button>
        </div>
      )}
    </div>
  );
}
