const express = require("express");
const router = express.Router();
const { saveCheckin, getDb } = require("../db/firestoreClient");
const { callPythonMl } = require("../services/pythonClient");
const helplines = require("../data/helplines.json");

const FIRESTORE_ENABLED = process.env.FIRESTORE_ENABLED === "true";

// Simple in-memory storage for demo purposes
const checkinStorage = new Map();

// POST /api/checkin - Create a new check-in
router.post("/api/checkin", async (req, res) => {
  try {
    const {
      user_id,
      text,
      quick_emojis = [],
      mood,
      affirmation,
      safety_flag,
      playlist,
    } = req.body;

    if (!text || text.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Text is required and must be at least 2 characters" });
    }

    // Use the data passed from the frontend (already processed by ML service)
    const checkinData = {
      user_id,
      text,
      quick_emojis,
      mood: mood || "neutral",
      message: affirmation || "Thanks for checking in!",
      playlist: playlist || [],
      safety_flag: safety_flag || "safe",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore if enabled, otherwise use in-memory storage
    if (FIRESTORE_ENABLED) {
      console.log(`Saving checkin for user: ${user_id}`);
      await saveCheckin(user_id, checkinData);
      console.log(`Checkin saved successfully for user: ${user_id}`);
    } else {
      // Use in-memory storage for demo
      if (!checkinStorage.has(user_id)) {
        checkinStorage.set(user_id, []);
      }
      const userCheckins = checkinStorage.get(user_id);
      checkinData.id = `checkin_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      userCheckins.unshift(checkinData); // Add to beginning
      checkinStorage.set(user_id, userCheckins);
      console.log(`Checkin saved to memory for user: ${user_id}`);
    }

    res.json({
      mood: checkinData.mood,
      message: checkinData.message,
      playlist: checkinData.playlist,
      safety_flag: checkinData.safety_flag,
      timestamp: checkinData.timestamp,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: "Failed to process check-in" });
  }
});

// GET /api/checkins - Get user's check-in history
router.get("/api/checkins", async (req, res) => {
  try {
    const { userId = "demo_user", limit = 20 } = req.query;
    console.log(
      `Fetching checkins for user: ${userId}, Firestore enabled: ${FIRESTORE_ENABLED}`
    );

    if (!FIRESTORE_ENABLED) {
      // Use in-memory storage
      const userCheckins = checkinStorage.get(userId) || [];
      const limitedCheckins = userCheckins.slice(0, parseInt(limit));
      console.log(
        `Returning ${limitedCheckins.length} checkins from memory for user: ${userId}`
      );
      return res.json(limitedCheckins);
    }

    const db = getDb();
    const ref = db.collection("users").doc(userId).collection("checkins");
    const snapshot = await ref
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit))
      .get();

    const checkins = [];
    snapshot.forEach((doc) => {
      checkins.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(checkins);
  } catch (error) {
    console.error("Get check-ins error:", error);
    res.status(500).json({ error: "Failed to fetch check-ins" });
  }
});

module.exports = router;
