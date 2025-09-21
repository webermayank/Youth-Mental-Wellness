const express = require("express");
const router = express.Router();
const { getDb } = require("../db/firestoreClient");
const FIRESTORE_ENABLED = process.env.FIRESTORE_ENABLED === "true" || true; // Force enable for now

router.get("/api/mood_trends", async (req, res) => {
  const userId = req.query.userId || "demo_user";
  console.log(
    `Fetching mood trends for user: ${userId}, Firestore enabled: ${FIRESTORE_ENABLED}`
  );

  if (!FIRESTORE_ENABLED) {
    // return sample demo data
    const demo = {
      period: "7d",
      counts: [
        { date: "2025-09-09", mood: "stressed", count: 2 },
        { date: "2025-09-10", mood: "neutral", count: 1 },
        { date: "2025-09-11", mood: "happy", count: 3 },
        { date: "2025-09-12", mood: "stressed", count: 1 },
        { date: "2025-09-13", mood: "neutral", count: 2 },
        { date: "2025-09-14", mood: "happy", count: 1 },
        { date: "2025-09-15", mood: "stressed", count: 0 },
      ],
    };
    console.log("Returning demo mood trends - Firestore disabled");
    return res.json(demo);
  }
  try {
    const db = getDb();
    const ref = db.collection("users").doc(userId).collection("checkins");
    const snaps = await ref.orderBy("createdAt", "desc").limit(100).get();
    const rows = [];
    snaps.forEach((s) => rows.push(s.data()));
    // simple aggregation per day
    const map = {};
    rows.forEach((r) => {
      const d = (r.createdAt || new Date().toISOString()).slice(0, 10);
      map[d] = map[d] || {};
      const m = r.mood || "neutral";
      map[d][m] = (map[d][m] || 0) + 1;
    });
    const counts = Object.keys(map)
      .sort()
      .map((d) => ({ date: d, moods: map[d] }));
    res.json({ period: "last100", counts });
  } catch (e) {
    res.status(500).json({ error: "query_error" });
  }
});

module.exports = router;
