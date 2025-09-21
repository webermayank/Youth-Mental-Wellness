const fetch = require("node-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

async function getNews() {
  const API_KEY = process.env.NEWSAPI_KEY;

  // 1. Try NewsAPI if key is present - focus on health and wellness
  if (API_KEY) {
    const healthQueries = [
      "health wellness",
      "mental health",
      "fitness nutrition",
      "wellness tips",
      "healthcare news",
    ];

    const randomQuery =
      healthQueries[Math.floor(Math.random() * healthQueries.length)];
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      randomQuery
    )}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) {
        return data.articles.slice(0, 5).map((a) => ({
          title: a.title,
          summary: a.description,
          source: a.source?.name || "Unknown",
          url: a.url,
          date: a.publishedAt,
        }));
      } else {
        console.error("NewsAPI error:", data);
      }
    } catch (e) {
      console.error("NewsAPI fetch failed:", e);
    }
  }

  // 2. Fallback to health-focused RSS feeds
  const healthRSSFeeds = [
    "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1", // PIB Health
    "https://www.who.int/rss-feeds/news-english.xml", // WHO News
    "https://www.nih.gov/rss/news.xml", // NIH News
  ];

  for (const feedUrl of healthRSSFeeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const healthItems = feed.items
        .filter(
          (item) =>
            item.title.toLowerCase().includes("health") ||
            item.title.toLowerCase().includes("wellness") ||
            item.title.toLowerCase().includes("medical") ||
            item.title.toLowerCase().includes("fitness") ||
            item.title.toLowerCase().includes("mental") ||
            item.title.toLowerCase().includes("nutrition")
        )
        .slice(0, 5);

      if (healthItems.length > 0) {
        return healthItems.map((item) => ({
          title: item.title,
          summary: item.contentSnippet || item.content,
          source: "Health News",
          url: item.link,
          date: item.pubDate,
        }));
      }
    } catch (e) {
      console.error(`RSS feed ${feedUrl} failed:`, e);
    }
  }

  // 3. Final fallback - health-focused mock news
  return [
    {
      title: "New Study Shows Benefits of Daily Meditation for Mental Health",
      summary:
        "Research reveals 10 minutes of daily meditation can significantly reduce stress and improve overall wellness.",
      source: "Health Research",
      url: "https://example.com/meditation-study",
      date: new Date().toISOString(),
    },
    {
      title: "WHO Releases New Guidelines for Youth Mental Health Support",
      summary:
        "Updated recommendations focus on early intervention and community-based care for young people.",
      source: "WHO",
      url: "https://example.com/who-guidelines",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      title:
        "Nutrition Experts Recommend Plant-Based Diet for Better Mental Health",
      summary:
        "Study shows connection between gut health and mood regulation through proper nutrition.",
      source: "Nutrition Today",
      url: "https://example.com/nutrition-mental-health",
      date: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      title: "Digital Wellness Apps Show Promise in Reducing Anxiety",
      summary:
        "New research highlights the effectiveness of mindfulness apps in managing daily stress.",
      source: "Tech Health",
      url: "https://example.com/digital-wellness",
      date: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      title: "Community Health Programs Improve Youth Wellbeing",
      summary:
        "Local initiatives focusing on peer support and mental health awareness show positive results.",
      source: "Community Health",
      url: "https://example.com/community-programs",
      date: new Date(Date.now() - 345600000).toISOString(),
    },
  ];
}

module.exports = { getNews };
