const fetch = require("node-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

async function getNews() {
  const API_KEY = process.env.NEWSAPI_KEY;

  // 1. Try NewsAPI if key is present
  if (API_KEY) {
    const url = `https://newsapi.org/v2/everything?q=mental+health&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) {
        return data.articles.map((a) => ({
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

  // 2. Fallback to PIB RSS
  try {
    const feed = await parser.parseURL(
      "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1"
    );
    return feed.items.slice(0, 5).map((item) => ({
      title: item.title,
      summary: item.contentSnippet,
      source: "PIB",
      url: item.link,
      date: item.pubDate,
    }));
  } catch (e) {
    console.error("PIB RSS fetch failed:", e);
  }

  // 3. Final fallback mock
  return [
    {
      title: "Local mental wellness program launches",
      summary: "Community program for youth mindfulness.",
      source: "MockNews",
      url: "https://example.com",
      date: new Date().toISOString(),
    },
  ];
}

module.exports = { getNews };
