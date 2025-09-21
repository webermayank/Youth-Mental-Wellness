import React from "react";
export default function MoodCard({
  mood,
  message,
  playlist,
  safety_flag,
  helplines,
}) {
  return (
    <div className="p-4 mt-4 bg-white rounded-md shadow-sm">
      <div className="font-semibold">Mood: {mood}</div>
      <div className="mt-2">{message}</div>

      {playlist && playlist.length > 0 && (
        <div className="mt-3 text-sm text-calm-700">
          Playlist:{" "}
          <a
            href={playlist[0].id}
            target="_blank"
            rel="noreferrer"
            className="underline text-calm-600 hover:text-calm-800"
          >
            {playlist[0].label}
          </a>
        </div>
      )}

      {safety_flag === "flag" && helplines && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="font-semibold text-red-800 mb-2">
            🚨 Crisis Support Available
          </div>
          <div className="text-sm text-red-700">
            <p className="mb-2">
              If you're having thoughts of self-harm, please reach out for help:
            </p>
            <ul className="space-y-1">
              {helplines.slice(0, 3).map((helpline, index) => (
                <li key={index} className="flex items-center">
                  <span className="font-medium w-32">{helpline.name}:</span>
                  <span className="text-red-600 font-mono">
                    {helpline.number}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs">
              Remember: You are not alone. Help is available 24/7.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
