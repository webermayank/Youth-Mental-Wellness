const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Check-in related APIs
async function postCheckin(payload) {
  const res = await fetch(`${API_BASE}/api/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to send check-in");
  return res.json();
}

async function getCheckins(userId) {
  const res = await fetch(`${API_BASE}/api/checkins?userId=${userId}&limit=20`);
  if (!res.ok) throw new Error("Failed to load check-ins");
  return res.json();
}

// Weather API
async function getWeather(zip) {
  const res = await fetch(`${API_BASE}/api/weather?zip=${zip}`);
  if (!res.ok) return null;
  return res.json();
}

// News API
async function getNews() {
  const res = await fetch(`${API_BASE}/api/news`);
  if (!res.ok) throw new Error("Failed to load news");
  return res.json();
}

// Flashcard APIs
async function getRandomFlashcard() {
  const res = await fetch(`${API_BASE}/api/flashcard/random`);
  if (!res.ok) throw new Error("Failed to load flashcard");
  return res.json();
}

async function submitFlashcard(id, selected) {
  const res = await fetch(`${API_BASE}/api/flashcard/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, selected }),
  });
  if (!res.ok) throw new Error("Failed to submit flashcard");
  return res.json();
}

// Health tips API
async function getDailyTip(mood) {
  const url = mood
    ? `${API_BASE}/api/dailytip?mood=${mood}`
    : `${API_BASE}/api/dailytip`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load tip");
  return res.json();
}

// Feedback API
async function submitFeedback(userId, rating, notes) {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, rating, notes }),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}

// Mood trends API
async function getMoodTrends(userId) {
  const res = await fetch(`${API_BASE}/api/mood_trends?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to load mood trends");
  return res.json();
}

// Text summarization API
async function summarizeText(text) {
  const res = await fetch(`${API_BASE}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to summarize text");
  return res.json();
}

export {
  postCheckin,
  getCheckins,
  getWeather,
  getNews,
  getRandomFlashcard,
  submitFlashcard,
  getDailyTip,
  submitFeedback,
  getMoodTrends,
  summarizeText,
};
