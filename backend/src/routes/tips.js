const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const dataDir = path.resolve(__dirname, "..", "..");

let tips = [];
try {
  const p = path.join(dataDir, "health_tips.json");
  if (fs.existsSync(p)) tips = JSON.parse(fs.readFileSync(p, "utf8"));
  else {
    // fallback to CSV
    const csvp = path.join(dataDir, "health_tips.csv");
    if (fs.existsSync(csvp)) {
      const txt = fs.readFileSync(csvp, "utf8").split(/\r?\n/).filter(Boolean);
      tips = txt
        .map((line, i) => {
          // Skip header row
          if (i === 0) return null;

          // Parse CSV line properly
          const parts = [];
          let current = "";
          let inQuotes = false;

          for (let j = 0; j < line.length; j++) {
            const char = line[j];

            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              parts.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          parts.push(current.trim()); // Add the last part

          if (parts.length >= 4) {
            return {
              id: parts[0],
              category: parts[1],
              title: parts[2],
              text: parts[3], // This is the actual tip content
              duration: parts[4] ? `${parts[4]} min` : "",
              language: parts[5] || "English",
            };
          }
          return null;
        })
        .filter(Boolean); // Remove null entries
    }
  }
} catch (e) {
  console.error("Error loading tips:", e);
  console.log("Tips array length:", tips.length);
  console.log("First few tips:", tips.slice(0, 3));
  tips = [
    {
      id: 1,
      text: "Take a quick 5-minute walk to refresh your mind.",
      category: "exercise",
      title: "Quick Walk",
      duration: "5 min",
    },
    {
      id: 2,
      text: "Practice deep breathing for 3 minutes to reduce stress.",
      category: "mindfulness",
      title: "Deep Breathing",
      duration: "3 min",
    },
    {
      id: 3,
      text: "Write down three things you're grateful for today.",
      category: "gratitude",
      title: "Gratitude Journal",
      duration: "2 min",
    },
    {
      id: 4,
      text: "Take a break from screens and look at something green.",
      category: "wellness",
      title: "Screen Break",
      duration: "1 min",
    },
    {
      id: 5,
      text: "Listen to your favorite song and sing along.",
      category: "music",
      title: "Music Therapy",
      duration: "4 min",
    },
  ];
}

router.get("/api/dailytip", (req, res) => {
  const { mood } = req.query;
  console.log(
    "Daily tip request - mood:",
    mood,
    "tips available:",
    tips.length
  );

  if (!mood) {
    const t = tips[Math.floor(Math.random() * tips.length)];
    console.log("Random tip selected:", t);
    return res.json({ tip: t });
  }
  // Filter tips by mood - check both category and text content
  const moodLower = mood.toLowerCase();
  const found = tips.find(
    (t) =>
      (t.category && t.category.toLowerCase().includes(moodLower)) ||
      (t.text && t.text.toLowerCase().includes(moodLower)) ||
      (t.title && t.title.toLowerCase().includes(moodLower))
  );
  console.log("Mood-specific tip found:", found);
  res.json({ tip: found || tips[Math.floor(Math.random() * tips.length)] });
});

module.exports = router;
