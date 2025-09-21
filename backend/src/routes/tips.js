const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const dataDir = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "youth-wellness-hack"
);

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
  tips = [{ id: 1, text: "Take a quick 5-minute walk." }];
}

router.get("/api/dailytip", (req, res) => {
  const { mood } = req.query;
  if (!mood) {
    const t = tips[Math.floor(Math.random() * tips.length)];
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
  res.json({ tip: found || tips[Math.floor(Math.random() * tips.length)] });
});

module.exports = router;
