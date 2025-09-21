import React, { useState, useEffect } from "react";
import { getDailyTip } from "../services/api";

export default function Tips() {
  const [currentTip, setCurrentTip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");

  const loadTip = async (moodFilter = "") => {
    setLoading(true);
    try {
      const response = await getDailyTip(moodFilter);
      setCurrentTip(response);
    } catch (error) {
      console.error("Error loading tip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    loadTip(mood);
  };

  useEffect(() => {
    loadTip();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Daily Health Tips</h2>

      {/* Mood-based Tip Search */}
      <div className="bg-white p-4 rounded-md chat-box mb-4">
        <h3 className="font-medium mb-3">Get a tip for your mood</h3>
        <form onSubmit={handleMoodSubmit} className="flex space-x-2">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Enter your mood (e.g., stressed, happy, tired)"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-calm-600 text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Tip"}
          </button>
        </form>
      </div>

      {/* Current Tip Display */}
      <div className="bg-white p-6 rounded-md chat-box">
        <h3 className="font-medium mb-3">Today's Health Tip</h3>

        {loading ? (
          <div className="text-calm-600">Loading tip...</div>
        ) : currentTip ? (
          <div>
            <div className="text-calm-700 mb-4">{currentTip.tip?.text}</div>
            <button
              onClick={() => loadTip()}
              className="px-4 py-2 rounded bg-calm-200 text-calm-800"
            >
              Get Another Tip
            </button>
          </div>
        ) : (
          <div className="text-calm-600">No tips available at the moment.</div>
        )}
      </div>

      {/* Quick Mood Buttons */}
      <div className="bg-white p-4 rounded-md chat-box mt-4">
        <h3 className="font-medium mb-3">Quick mood tips</h3>
        <div className="flex flex-wrap gap-2">
          {["stressed", "tired", "anxious", "happy", "sad", "energetic"].map(
            (moodOption) => (
              <button
                key={moodOption}
                onClick={() => loadTip(moodOption)}
                disabled={loading}
                className="px-3 py-1 rounded bg-calm-100 text-calm-700 hover:bg-calm-200 disabled:opacity-50"
              >
                {moodOption}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
