import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mb-6 shadow-lg animate-bounce-gentle">
            <span className="text-4xl">🌟</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Your Wellness Journey
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            A warm, supportive space to nurture your mental health and track
            your emotional well-being
          </p>
        </div>

        {/* Main Check-in Card */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl shadow-lg">
                <span className="text-2xl">💝</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Check in with yourself
                </h2>
                <p className="text-gray-600">
                  How are you feeling today? Let's explore together
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Take a moment to connect with your emotions. Our AI companion is
              here to listen, understand, and provide personalized support for
              your mental wellness journey.
            </p>

            <Link
              to="/checkin"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
            >
              <span className="text-xl">🎯</span>
              Start Your Check-in
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                2 min
              </span>
            </Link>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Explore Your Wellness Tools
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Dashboard Card */}
            <Link
              to="/dashboard"
              className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-blue-200/50"
            >
              <div className="absolute top-4 right-4 text-3xl opacity-70 group-hover:scale-110 transition-transform">
                📊
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Progress Dashboard
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Track your mood patterns, view insights, and celebrate your
                  wellness journey
                </p>
              </div>
              <div className="mt-4 inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                View Progress
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>

            {/* Flashcards Card */}
            <Link
              to="/flashcards"
              className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-green-200/50"
            >
              <div className="absolute top-4 right-4 text-3xl opacity-70 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">🎴</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Health Flashcards
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Learn about mental health through interactive, engaging
                  flashcard challenges
                </p>
              </div>
              <div className="mt-4 inline-flex items-center text-green-600 font-medium group-hover:text-green-700">
                Start Learning
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>

            {/* Daily Tips Card */}
            <Link
              to="/tips"
              className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-purple-200/50"
            >
              <div className="absolute top-4 right-4 text-3xl opacity-70 group-hover:scale-110 transition-transform">
                💫
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Daily Wellness Tips
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover personalized tips and strategies to boost your mental
                  wellness
                </p>
              </div>
              <div className="mt-4 inline-flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                Get Tips
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Motivational Footer */}
        <section className="text-center bg-gradient-to-r from-orange-100 to-pink-100 p-8 rounded-3xl border border-orange-200/50">
          <div className="flex justify-center gap-2 mb-4 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>
              🌈
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
              ✨
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              🦋
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            You're doing great!
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Every step you take toward understanding and caring for your mental
            health matters. Remember, it's okay to have difficult days - we're
            here to support you through it all.
          </p>
        </section>
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

        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
