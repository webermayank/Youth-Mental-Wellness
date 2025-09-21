// backend/src/routes/summarize.js
const express = require("express");
const router = express.Router();
const { callPythonMl } = require("../services/pythonClient");

router.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const result = await callPythonMl(text);
    res.json(result);
  } catch (err) {
    console.error("Summarize failed:", err);
    res
      .status(500)
      .json({ error: "Summarization failed", details: err.message });
  }
});

module.exports = router;
