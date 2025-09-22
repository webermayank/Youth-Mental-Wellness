import React from "react";
export default function MoodCard({
  mood,
  message,
  playlist,
  safety_flag,
  helplines,
}) {
  return (
    <div className="p-6 mt-4 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">
          {mood === "happy" && "😊"}
          {mood === "sad" && "😢"}
          {mood === "anxious" && "😰"}
          {mood === "angry" && "😤"}
          {mood === "fearful" && "😨"}
          {mood === "urgent" && "🚨"}
          {mood === "neutral" && "😐"}
        </div>
        <div className="font-bold text-xl text-gray-800 capitalize">
          Mood: {mood}
        </div>
      </div>
      <div className="text-gray-700 text-lg leading-relaxed mb-4">
        {message}
      </div>

      {playlist && playlist.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-xl">🎵</span>
            Recommended Music
          </div>
          <div className="space-y-2">
            {playlist.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 py-3 bg-white text-green-700 rounded-lg hover:bg-green-100 hover:shadow-md transition-all duration-200 border border-green-200"
              >
                <span className="mr-3 text-lg">🎵</span>
                <span className="font-medium">
                  {url.includes("playlist")
                    ? "Spotify Playlist"
                    : "Spotify Track"}
                </span>
                <span className="ml-3 text-sm opacity-70">↗</span>
              </a>
            ))}
          </div>
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
