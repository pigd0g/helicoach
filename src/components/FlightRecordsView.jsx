import React from "react";

export default function FlightRecordsView({
  helicopters,
  onAddNew,
  onSelectHelicopter,
  onDeleteHelicopter,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold">Flight Records</h2>
        <p className="text-blue-100 text-sm mt-2">
          Track your helicopters, log flights, and maintain preflight records.
        </p>
      </div>

      <button
        onClick={onAddNew}
        className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-colors shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
        Add New Helicopter
      </button>

      {helicopters.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-slate-300 mb-4"
          >
            <path d="M22,21a1,1,0,0,1-1,1H12a1,1,0,0,1,0-2h9A1,1,0,0,1,22,21Zm1-8a6,6,0,0,1-6,6c-4.531,0-6.208-2.09-7.345-4.349A2.981,2.981,0,0,0,6.983,13H4a1,1,0,0,1-.894-.553l-2-4A1,1,0,0,1,1,8V4a1,1,0,0,1,1.707-.707L6.413,7H13V4H10a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2H15V7h1.786a6.163,6.163,0,0,1,6.187,5.414C22.985,12.54,23,12.762,23,13Zm-2.142,1H16a1,1,0,0,1-1-1V9H6a1,1,0,0,1-.707-.293L3,6.414v1.35L4.617,11H6.983a4.972,4.972,0,0,1,4.46,2.752C12.337,15.529,13.373,17,17,17a4.009,4.009,0,0,0,2.96-1.311A3.928,3.928,0,0,0,20.857,14Zm0-2A4.177,4.177,0,0,0,17,9.02V12Z" />
          </svg>
          <p className="text-slate-500 text-lg mb-2">No helicopters yet</p>
          <p className="text-slate-400 text-sm">
            Add your first helicopter to start tracking flights and maintenance.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {helicopters.map((helicopter) => (
            <div
              key={helicopter.id}
              onClick={() => onSelectHelicopter(helicopter)}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer active:scale-[0.98] duration-200 group"
            >
              {helicopter.photo ? (
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={helicopter.photo}
                    alt={helicopter.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-slate-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-300"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                  {helicopter.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                    <span>{helicopter.flights || 0} flights</span>
                  </div>
                  {helicopter.lastPreflightDate && (
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-green-600">Checked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
