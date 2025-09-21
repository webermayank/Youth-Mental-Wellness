import React, { useEffect, useState } from "react";
import {
  getCheckins,
  getDailyTip,
  getNews,
  getMoodTrends,
} from "../services/api";
import { useAuth } from "../hooks/useAuth";
import Calendar from "../components/Calendar";
import dayjs from "dayjs";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  const [news, setNews] = useState([]);
  const [moodTrends, setMoodTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = currentUser?.uid || "anonymous";
        const [checkins, tip, newsData, trends] = await Promise.all([
          getCheckins(userId).catch(() => []),
          getDailyTip().catch(() => null),
          getNews().catch(() => ({ items: [] })),
          getMoodTrends(userId).catch(() => null),
        ]);

        setItems(checkins);
        setDailyTip(tip);
        setNews(newsData.items || []);
        setMoodTrends(trends);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mb-6 shadow-lg animate-spin">
            <span className="text-4xl">🌟</span>
          </div>
          <div className="text-xl text-gray-700 font-medium">
            Loading your wellness dashboard...
          </div>
          <div className="text-gray-500 mt-2">
            Gathering your progress insights
          </div>
        </div>
      </div>
    );
  }

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      excited: "🤗",
      tired: "😴",
      angry: "😠",
      peaceful: "😌",
      confused: "🤔",
      grateful: "🙏",
      hopeful: "🌟",
      stressed: "😤",
      content: "😇",
    };
    return moodEmojis[mood?.toLowerCase()] || "😊";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-6 shadow-lg animate-bounce-gentle">
            <span className="text-4xl">📈</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Wellness Progress
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Track your journey, celebrate your growth, and discover patterns in
            your mental health
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">✅</span>
              <h3 className="font-semibold text-gray-800">Total Check-ins</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {items.length}
            </div>
            <div className="text-sm text-gray-600">Keep it up!</div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl shadow-lg border border-blue-200/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔥</span>
              <h3 className="font-semibold text-gray-800">Current Streak</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.min(items.length, 7)}
            </div>
            <div className="text-sm text-gray-600">days in a row</div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl shadow-lg border border-purple-200/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📅</span>
              <h3 className="font-semibold text-gray-800">This Week</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {
                items.filter((item) =>
                  dayjs(item.timestamp || item.createdAt).isAfter(
                    dayjs().subtract(7, "day")
                  )
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">check-ins</div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl shadow-lg border border-orange-200/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-semibold text-gray-800">Wellness Score</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {items.length > 0 ? Math.min(100, items.length * 10) : 0}%
            </div>
            <div className="text-sm text-gray-600">great progress!</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📅</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Wellness Calendar
                </h2>
              </div>
              <Calendar checkins={items} />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Recent Check-ins */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">💭</span>
                <h3 className="text-xl font-bold text-gray-800">
                  Recent Check-ins
                </h3>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🌱</div>
                  <p className="text-gray-600 mb-4">
                    Your wellness journey starts here!
                  </p>
                  <button
                    onClick={() => (window.location.href = "/checkin")}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    Start First Check-in
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-200/50 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">
                          {getMoodEmoji(item.mood)}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            {dayjs(item.timestamp || item.createdAt).format(
                              "MMM D, HH:mm"
                            )}
                          </div>
                          <div className="text-sm text-orange-600 font-semibold">
                            Mood: {item.mood || "Unknown"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                        {item.message || item.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Tip */}
            {dailyTip && (
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-3xl shadow-xl border border-yellow-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">💡</span>
                  <h3 className="text-xl font-bold text-gray-800">
                    Today's Wellness Tip
                  </h3>
                </div>
                <div className="text-gray-700 leading-relaxed mb-4">
                  {dailyTip.tip?.text}
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <span>✨</span>
                  <span>Daily wisdom for your wellness journey</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health News */}
          {news.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">📰</span>
                <h3 className="text-xl font-bold text-gray-800">
                  Health & Wellness News
                </h3>
              </div>
              <div className="space-y-4">
                {news.slice(0, 3).map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 hover:shadow-lg hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg group-hover:scale-110 transition-transform">
                        📖
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <span>🔗</span>
                          <span>Read more</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Mood Trends */}
          {moodTrends && (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">📊</span>
                <h3 className="text-xl font-bold text-gray-800">Mood Trends</h3>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                  <span>📈</span>
                  {moodTrends.period === "7d"
                    ? "Last 7 days"
                    : "Recent activity"}
                </span>
              </div>

              {moodTrends.counts && moodTrends.counts.length > 0 ? (
                <div className="space-y-3">
                  {moodTrends.counts.slice(0, 5).map((count, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {getMoodEmoji(count.mood)}
                        </span>
                        <div>
                          <div className="font-medium text-gray-800 capitalize">
                            {count.mood}
                          </div>
                          <div className="text-sm text-gray-600">
                            {count.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">
                          {count.count}
                        </div>
                        <div className="text-xs text-gray-500">times</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-3">📈</div>
                  <p className="text-gray-600">
                    More data will appear as you continue checking in!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-3xl border border-green-200/50">
          <div className="flex justify-center gap-2 mb-4 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>
              🌟
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              🎉
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
              🌈
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            You're making incredible progress!
          </h3>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            Every check-in is a step forward in your wellness journey. Your
            commitment to mental health is inspiring and shows real strength.
            Keep going - you've got this! 💪
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/checkin")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <span className="mr-2">💝</span>
              New Check-in
            </button>
            <button
              onClick={() => (window.location.href = "/tips")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <span className="mr-2">💡</span>
              Get Wellness Tips
            </button>
          </div>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
