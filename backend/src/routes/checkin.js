const express = require("express");
const router = express.Router();
const { saveCheckin, getDb } = require("../db/firestoreClient");
const { callPythonMl } = require("../services/pythonClient");
const helplines = require("../data/helplines.json");

const FIRESTORE_ENABLED = process.env.FIRESTORE_ENABLED === "true" || true; // Force enable for now

// POST /api/checkin - Create a new check-in
router.post("/api/checkin", async (req, res) => {
  try {
    const { user_id, text, quick_emojis = [] } = req.body;

    if (!text || text.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Text is required and must be at least 2 characters" });
    }

    // Use Python ML service to analyze mood and generate response
    let mlResult = {
      mood: "neutral",
      message: "Thanks for checking in!",
      playlist: [],
    };

    try {
      console.log("Calling Python ML service with text:", text);
      const pythonResponse = await callPythonMl(text);
      console.log("Python ML service returned:", pythonResponse);

      // Map Python response to expected format
      mlResult = {
        mood: pythonResponse.mood_bucket?.toLowerCase() || "neutral",
        message: pythonResponse.affirmation || "Thanks for checking in!",
        playlist: pythonResponse.playlist_url
          ? [{ id: pythonResponse.playlist_url, label: "Mood Playlist" }]
          : [],
        safety_flag: pythonResponse.safety_flag || "safe",
        helplines:
          pythonResponse.safety_flag === "flag"
            ? helplines.crisis_helplines
            : null,
      };
      console.log("Mapped ML result:", mlResult);
    } catch (error) {
      console.error("Python ML service failed with full error:", error);
      console.warn("Python ML service failed, using fallback:", error.message);
      // Simple fallback mood detection based on keywords
      const lowerText = text.toLowerCase();
      if (
        lowerText.includes("happy") ||
        lowerText.includes("great") ||
        lowerText.includes("good")
      ) {
        mlResult.mood = "happy";
        mlResult.message = "Great to hear you're feeling positive!";
      } else if (
        lowerText.includes("sad") ||
        lowerText.includes("down") ||
        lowerText.includes("depressed")
      ) {
        mlResult.mood = "sad";
        mlResult.message =
          "I'm sorry you're feeling down. Remember, it's okay to not be okay.";
      } else if (
        lowerText.includes("stressed") ||
        lowerText.includes("anxious") ||
        lowerText.includes("worried")
      ) {
        mlResult.mood = "stressed";
        mlResult.message =
          "Stress is normal. Try some deep breathing or take a short break.";
      } else if (
        lowerText.includes("tired") ||
        lowerText.includes("exhausted") ||
        lowerText.includes("sleepy")
      ) {
        mlResult.mood = "tired";
        mlResult.message =
          "Rest is important for your wellbeing. Consider getting some sleep.";
      }
    }

    const checkinData = {
      user_id,
      text,
      quick_emojis,
      mood: mlResult.mood || "neutral",
      message: mlResult.message || "Thanks for checking in!",
      playlist: mlResult.playlist || [],
      timestamp: new Date().toISOString(),
    };

    // Save to Firestore if enabled
    if (FIRESTORE_ENABLED) {
      console.log(`Saving checkin for user: ${user_id}`);
      await saveCheckin(user_id, checkinData);
      console.log(`Checkin saved successfully for user: ${user_id}`);
    } else {
      console.log("Firestore disabled - checkin not saved");
    }

    res.json({
      mood: checkinData.mood,
      message: checkinData.message,
      playlist: checkinData.playlist,
      safety_flag: checkinData.safety_flag,
      helplines: checkinData.helplines,
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
      `Fetching checkins for user: ${userId}, Firestore enabled: true`
    );

    if (!FIRESTORE_ENABLED) {
      // Return demo data when Firestore is disabled
      const demoCheckins = [
        {
          id: "1",
          mood: "happy",
          message: "Feeling great today!",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "2",
          mood: "neutral",
          message: "Just checking in",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      console.log("Returning demo data - Firestore disabled");
      return res.json(demoCheckins);
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
