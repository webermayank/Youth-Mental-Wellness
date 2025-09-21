import React, { useState, useEffect } from "react";
import { getDailyTip } from "../services/api";

export default function Tips() {
  const [currentTip, setCurrentTip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  // Helper function to parse CSV-like tip data
  const parseTipData = (tipData) => {
    if (!tipData) return null;

    // If tip is already an object with the right structure
    if (tipData.tip && typeof tipData.tip === "object" && tipData.tip.text) {
      return tipData;
    }

    // If tip.text is a CSV string, parse it
    if (tipData.tip && typeof tipData.tip.text === "string") {
      const csvLine = tipData.tip.text;

      // Split by comma but handle quoted content
      const parts = csvLine.split(",");

      if (parts.length >= 4) {
        return {
          tip: {
            id: parts[0],
            category: parts[1],
            title: parts[2],
            text: parts[3], // This is the actual tip content
            duration: parts[4] ? `${parts[4]} min` : "",
            language: parts[5] || "English",
          },
        };
      }
    }

    // Fallback: return as is
    return tipData;
  };

  const loadTip = async (moodFilter = "") => {
    setLoading(true);
    try {
      const response = await getDailyTip(moodFilter);
      const parsedTip = parseTipData(response);
      setCurrentTip(parsedTip);
      setSelectedMood(moodFilter);
    } catch (error) {
      console.error("Error loading tip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) {
      loadTip(mood.trim());
      setMood("");
    }
  };

  useEffect(() => {
    loadTip();
  }, []);

  const moodOptions = [
    {
      name: "stressed",
      emoji: "😤",
      color: "from-red-400 to-orange-400",
      bg: "from-red-50 to-orange-50",
    },
    {
      name: "tired",
      emoji: "😴",
      color: "from-blue-400 to-indigo-400",
      bg: "from-blue-50 to-indigo-50",
    },
    {
      name: "anxious",
      emoji: "😰",
      color: "from-yellow-400 to-amber-400",
      bg: "from-yellow-50 to-amber-50",
    },
    {
      name: "happy",
      emoji: "😊",
      color: "from-green-400 to-emerald-400",
      bg: "from-green-50 to-emerald-50",
    },
    {
      name: "sad",
      emoji: "😢",
      color: "from-purple-400 to-pink-400",
      bg: "from-purple-50 to-pink-50",
    },
    {
      name: "energetic",
      emoji: "⚡",
      color: "from-orange-400 to-red-400",
      bg: "from-orange-50 to-red-50",
    },
    {
      name: "overwhelmed",
      emoji: "🤯",
      color: "from-gray-400 to-slate-400",
      bg: "from-gray-50 to-slate-50",
    },
    {
      name: "peaceful",
      emoji: "😌",
      color: "from-teal-400 to-cyan-400",
      bg: "from-teal-50 to-cyan-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-6 shadow-lg animate-bounce-gentle">
            <span className="text-4xl">💡</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Daily Wellness Tips
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover personalized strategies and insights to boost your mental
            wellness, tailored to how you're feeling today
          </p>
        </div>

        {/* Custom Mood Search */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔍</span>
            <h2 className="text-2xl font-bold text-gray-800">
              Find Tips for Your Specific Mood
            </h2>
          </div>
          <form onSubmit={handleMoodSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="How are you feeling? (e.g., overwhelmed, excited, lonely)"
                className="w-full p-4 pr-12 border-2 border-orange-200 rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all bg-white/80"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl">
                💭
              </span>
            </div>
            <button
              type="submit"
              disabled={loading || !mood.trim()}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Finding...</span>
                </div>
              ) : (
                <span>Get Personalized Tip</span>
              )}
            </button>
          </form>
        </div>

        {/* Quick Mood Buttons */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎭</span>
            <h2 className="text-2xl font-bold text-gray-800">
              Quick Mood Selections
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moodOptions.map((moodOption) => (
              <button
                key={moodOption.name}
                onClick={() => loadTip(moodOption.name)}
                disabled={loading}
                className={`group relative overflow-hidden p-6 bg-gradient-to-br ${
                  moodOption.bg
                } rounded-2xl shadow-lg hover:shadow-xl border-2 ${
                  selectedMood === moodOption.name
                    ? "border-orange-400 ring-4 ring-orange-100"
                    : "border-transparent hover:border-gray-200"
                } transition-all duration-200 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {moodOption.emoji}
                  </div>
                  <div className="font-semibold text-gray-800 capitalize mb-1">
                    {moodOption.name}
                  </div>
                  <div className="text-xs text-gray-600">Tap for tips</div>
                </div>
                {selectedMood === moodOption.name && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current Tip Display */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">✨</span>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedMood
                ? `Tips for feeling ${selectedMood}`
                : "Today's Wellness Tip"}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-4 animate-spin">
                <span className="text-2xl">💫</span>
              </div>
              <div className="text-lg text-gray-700 font-medium">
                Crafting the perfect tip for you...
              </div>
              <div className="text-gray-500 mt-2">This may take a moment</div>
            </div>
          ) : currentTip ? (
            <div className="space-y-6">
              {/* Tip Title (if available) */}
              {currentTip.tip?.title && (
                <div className="border-l-4 border-purple-400 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {currentTip.tip.title}
                  </h3>
                </div>
              )}

              {/* Main Tip Content */}
              <div className="relative">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                <div className="pl-6">
                  <div className="text-lg text-gray-700 leading-relaxed mb-4 font-medium">
                    {currentTip.tip?.text ||
                      currentTip.tip ||
                      "No tip content available"}
                  </div>

                  {/* Duration and Category (if available) */}
                  <div className="flex gap-4 text-sm text-gray-500">
                    {currentTip.tip?.duration && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        <span>⏱️</span>
                        {currentTip.tip.duration}
                      </span>
                    )}
                    {currentTip.tip?.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        <span>🏷️</span>
                        {currentTip.tip.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => loadTip()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  <span className="mr-2">🔄</span>
                  Get Another Random Tip
                </button>
                <button
                  onClick={() => {
                    if (selectedMood) {
                      loadTip(selectedMood);
                    }
                  }}
                  disabled={!selectedMood}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="mr-2">🎯</span>
                  {selectedMood
                    ? `More ${selectedMood} tips`
                    : "Select a mood first"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🌱</div>
              <div className="text-lg text-gray-600 mb-4">
                No tips available at the moment.
              </div>
              <p className="text-gray-500 mb-6">
                Try selecting a mood above or search for specific feelings to
                get personalized advice.
              </p>
              <button
                onClick={() => loadTip()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <span className="mr-2">🔄</span>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-3xl border border-indigo-200/50">
          <div className="flex justify-center gap-2 mb-4 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>
              🌟
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              💖
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
              🦋
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Self-care is not selfish
          </h3>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Taking time to nurture your mental health is one of the most
            important investments you can make. These tips are here to support
            you on your journey to wellness. Remember, small steps lead to big
            changes! 🌈
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
