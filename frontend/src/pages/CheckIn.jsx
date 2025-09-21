import React, { useState } from "react";
import ChatInput from "../components/ChatInput";
import MoodCard from "../components/MoodCard";
import { postCheckin } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function CheckIn() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { currentUser } = useAuth();

  const onSubmit = async (text) => {
    if (!text || text.trim().length < 2) {
      return alert(
        "Please share what's on your mind - even a few words help! 💭"
      );
    }
    setLoading(true);
    try {
      const payload = {
        user_id: currentUser?.uid || "anonymous",
        text,
        quick_emojis: [],
      };
      const res = await postCheckin(payload);
      setResponse(res);
    } catch (e) {
      console.error(e);
      alert("Oops! Something went wrong. Let's try that again 🔄");
    } finally {
      setLoading(false);
    }
  };

  const quickMoodEmojis = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😴", label: "Tired" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😤", label: "Frustrated" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "😢", label: "Sad" },
    { emoji: "🔥", label: "Energetic" },
    { emoji: "🤔", label: "Thoughtful" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mb-6 shadow-lg animate-pulse">
            <span className="text-4xl">🌸</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Daily Check-in
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Welcome back,{" "}
            <span className="font-semibold text-orange-600">
              {currentUser?.email || "friend"}
            </span>
            !
            <br />
            Take a moment to connect with yourself. How are you feeling today?
          </p>
        </div>

        {!response && (
          <>
            {/* Quick Mood Selection */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                Quick mood check
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {quickMoodEmojis.map((mood, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      onSubmit(`I'm feeling ${mood.label.toLowerCase()} today`)
                    }
                    disabled={loading}
                    className="group p-3 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg hover:shadow-xl border border-orange-200/50 hover:border-orange-300 transition-all duration-200 hover:transform hover:scale-105 disabled:opacity-50"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {mood.emoji}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Input Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-pink-400 to-orange-400 rounded-2xl shadow-lg">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Share what's on your mind
                    </h2>
                    <p className="text-gray-600">
                      Express your thoughts and feelings - I'm here to listen
                    </p>
                  </div>
                </div>

                <ChatInput onSubmit={onSubmit} loading={loading} />

                {loading && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-pink-400 border-t-transparent"></div>
                      <span className="text-gray-700 font-medium">
                        Understanding your feelings...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Encouragement Section */}
            <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl border border-purple-200/50">
              <div className="flex justify-center gap-2 mb-3 text-xl">
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0s" }}
                >
                  🌟
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  💖
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                >
                  🌟
                </span>
              </div>
              <p className="text-gray-700 font-medium">
                Remember: There's no right or wrong way to feel. Every emotion
                is valid and worthy of attention.
              </p>
            </div>
          </>
        )}

        {/* Response Section */}
        {response && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-3xl border border-green-200/50">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Thank you for sharing!
              </h2>
              <p className="text-gray-700">
                I've analyzed your feelings and prepared some personalized
                support for you.
              </p>
            </div>

            {/* Mood Card Response */}
            <div className="transform transition-all duration-500 animate-fade-in">
              <MoodCard
                mood={response.mood}
                message={response.message}
                playlist={response.playlist}
                safety_flag={response.safety_flag}
                helplines={response.helplines}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setResponse(null);
                  setLoading(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <span className="mr-2">🔄</span>
                Check In Again
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <span className="mr-2">📊</span>
                View Progress
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
