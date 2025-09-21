const fetch = require("node-fetch");

async function getWeather(cityOrZip) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Debug: Check if API key exists
  console.log("API Key exists:", !!apiKey);
  console.log("API Key length:", apiKey ? apiKey.length : 0);
  console.log(
    "First 8 chars of API key:",
    apiKey ? apiKey.substring(0, 8) + "..." : "undefined"
  );

  try {
    let query;
    if (/^\d+$/.test(cityOrZip)) {
      query = `zip=${cityOrZip},IN`; // Changed to uppercase IN
    } else {
      query = `q=${encodeURIComponent(cityOrZip || "Delhi")},IN`; // Changed to uppercase IN
    }

    // Use HTTPS instead of HTTP
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${apiKey}`;

    console.log(
      "Full URL (with API key hidden):",
      url.replace(apiKey, "***API_KEY***")
    );

    const resp = await fetch(url);
    const data = await resp.json();

    console.log("API Response status:", resp.status);
    console.log("API Response:", data);

    if (!resp.ok || !data.main || !data.weather) {
      console.error("OpenWeather API error:", data);
      return {
        temp_c: 22,
        desc: "light rain",
        suggestion: "Try indoor breathing + warm tea",
      };
    }

    const temp_c = data.main.temp;
    const desc = data.weather[0].description;

    let suggestion;
    if (desc.includes("rain")) suggestion = "Try indoor breathing + warm tea";
    else if (temp_c > 32)
      suggestion = "Stay hydrated, maybe meditation indoors";
    else if (temp_c < 15)
      suggestion = "Bundle up and do light stretching indoors";
    else suggestion = "Try a 10-minute mindful walk outside";

    return { temp_c, desc, suggestion };
  } catch (e) {
    console.error("Weather fetch failed:", e);
    return {
      temp_c: 22,
      desc: "light rain",
      suggestion: "Try indoor breathing + warm tea",
    };
  }
}

module.exports = { getWeather };
