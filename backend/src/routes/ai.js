const express = require("express");
const router = express.Router();
const { redactPII } = require("../utils/redact");
const { inferMoodAndAffirmation } = require("../services/vertexcClient");
const {
  analyzeText,
  checkMLServiceHealth,
} = require("../services/mlServiceClient");
const { saveCheckin } = require("../db/firestoreClient");

router.post("/api/summarize", async (req, res) => {
  try {
    const { userId = "demo_user", text, mode = "affirmation" } = req.body || {};
    if (!text) return res.status(400).json({ error: "text required" });

    const clean = redactPII(text);
    let aiRes;

    try {
      // Try to use the ML service first
      console.log("Calling ML service with text:", clean);
      const mlResponse = await analyzeText(clean);
      console.log("ML service response:", mlResponse);

      // Map ML service response to our expected format
      aiRes = {
        mood: mlResponse.mood_bucket?.toLowerCase() || "neutral",
        affirmation:
          mlResponse.affirmation ||
          "Thank you for sharing. Remember to be kind to yourself today.",
        playlist: mlResponse.playlist_url ? [mlResponse.playlist_url] : [],
        safety_flag: mlResponse.safety_flag || "safe",
        confidence: 0.9,
      };
      console.log("Mapped AI response:", aiRes);
    } catch (mlError) {
      console.warn(
        "ML Service failed, falling back to local inference:",
        mlError.message
      );

      // Fallback to existing implementation
      aiRes = await inferMoodAndAffirmation(clean);
    }

    const out = {
      mood: aiRes.mood,
      affirmation: aiRes.affirmation,
      playlist: aiRes.playlist || [],
      weather_suggestion: aiRes.weather_suggestion || null,
      safety_flag: aiRes.safety_flag || "safe",
      confidence: aiRes.confidence || 0.5,
      timestamp: new Date().toISOString(),
    };

    // save checkin (no-op unless FIRESTORE_ENABLED=true)
    await saveCheckin(userId, { text: clean, ...out });

    return res.json(out);
  } catch (err) {
    console.error("Error in summarize endpoint:", err);
    console.error("Error stack:", err.stack);
    return res
      .status(500)
      .json({ error: "internal_error", details: err.message });
  }
});

// Health check endpoint for ML service
router.get("/api/ml-health", async (req, res) => {
  try {
    const isHealthy = await checkMLServiceHealth();
    return res.json({
      ml_service_healthy: isHealthy,
      ml_service_url:
        process.env.ML_SERVICE_URL ||
        "https://ml-service-358309174344.asia-south1.run.app",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      ml_service_healthy: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
