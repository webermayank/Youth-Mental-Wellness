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
      <div className="flex items-center justify-center h-64">
        <div className="text-calm-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Progress Dashboard</h2>

      {/* Calendar View */}
      <Calendar checkins={items} />

      {/* Recent Check-ins */}
      <div className="bg-white p-4 rounded-md chat-box">
        <h3 className="font-medium mb-3">Recent Check-ins</h3>
        <ul className="space-y-2">
          {items.length === 0 && (
            <li className="text-sm text-calm-600">No check-ins yet</li>
          )}
          {items.map((it) => (
            <li key={it.id} className="p-2 border rounded">
              <div className="text-sm">
                {dayjs(it.timestamp || it.createdAt).format("MMM D, HH:mm")}
              </div>
              <div className="text-sm">Mood: {it.mood}</div>
              <div className="text-sm text-calm-700">
                {it.message || it.text}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Daily Tip */}
      {dailyTip && (
        <div className="bg-white p-4 rounded-md chat-box">
          <h3 className="font-medium mb-3">Daily Health Tip</h3>
          <div className="text-calm-700">{dailyTip.tip?.text}</div>
        </div>
      )}

      {/* News */}
      {news.length > 0 && (
        <div className="bg-white p-4 rounded-md chat-box">
          <h3 className="font-medium mb-3">Health News</h3>
          <ul className="space-y-2">
            {news.slice(0, 3).map((item, index) => (
              <li key={index} className="text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-calm-600 hover:text-calm-800 underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mood Trends */}
      {moodTrends && (
        <div className="bg-white p-4 rounded-md chat-box">
          <h3 className="font-medium mb-3">Mood Trends</h3>
          <div className="text-sm text-calm-600">
            {moodTrends.period === "7d" ? "Last 7 days" : "Recent activity"}
          </div>
          {moodTrends.counts && moodTrends.counts.length > 0 && (
            <div className="mt-2 space-y-1">
              {moodTrends.counts.slice(0, 5).map((count, index) => (
                <div key={index} className="text-sm">
                  {count.date}: {count.mood} ({count.count} times)
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
