import React, { useState, useRef } from "react";
import Resizer from "react-image-file-resizer";
import { slugify, trackEvent } from "../analytics";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      600,
      600,
      "JPEG",
      100,
      0,
      (uri) => resolve(uri),
      "base64",
    );
  });

export default function FlightRecordNew({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const resizedImage = await resizeFile(file);
      setPhoto(resizedImage);
      setPhotoPreview(resizedImage);
    } catch (error) {
      console.error("Error resizing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a helicopter title.");
      return;
    }

    const helicopterData = {
      title: title.trim(),
      photo: photo,
    };

    trackEvent(`helicopter_added_${slugify(helicopterData.title)}`, {
      type: "helicopter",
      title: helicopterData.title,
      hasPhoto: !!photo,
    });

    onSave(helicopterData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold">Add New Helicopter</h2>
        <p className="text-blue-100 text-sm mt-2">
          Enter a name and capture a photo of your helicopter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              Helicopter Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Blade 360 CFX"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              Helicopter Photo
            </label>

            {photoPreview ? (
              <div className="space-y-3">
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={photoPreview}
                    alt="Helicopter preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview(null);
                  }}
                  className="w-full py-2 px-4 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isProcessing}
                    className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center hover:bg-slate-100 hover:border-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin h-8 w-8 text-slate-400 mb-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-slate-500 text-xs">Processing...</p>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-slate-400 mb-2"
                        >
                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                        <p className="text-slate-600 font-medium text-sm mb-1">
                          Take Photo
                        </p>
                        <p className="text-slate-400 text-xs px-2 text-center">
                          Use camera
                        </p>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isProcessing}
                    className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center hover:bg-slate-100 hover:border-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin h-8 w-8 text-slate-400 mb-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-slate-500 text-xs">Processing...</p>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-slate-400 mb-2"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                        <p className="text-slate-600 font-medium text-sm mb-1">
                          Choose Photo
                        </p>
                        <p className="text-slate-400 text-xs px-2 text-center">
                          From gallery
                        </p>
                      </>
                    )}
                  </button>
                </div>

                {/* Camera input */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                  disabled={isProcessing}
                />

                {/* Gallery input */}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoCapture}
                  className="hidden"
                  disabled={isProcessing}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
          >
            Save Helicopter
          </button>
        </div>
      </form>
    </div>
  );
}
