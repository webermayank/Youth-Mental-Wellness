const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const dataDir = path.resolve(__dirname, "..", "data");
let flashcards = [];

try {
  const f = path.join(dataDir, "flashcards.json");
  if (fs.existsSync(f)) {
    flashcards = JSON.parse(fs.readFileSync(f, "utf8"));
    console.log(`Loaded ${flashcards.length} health flashcards`);
  }
} catch (e) {
  console.error("Error loading flashcards:", e);
  flashcards = [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "HotText Markup Lang"],
      answer: 0,
      difficulty: "easy",
    },
    {
      id: 2,
      question: "What is a for loop used for?",
      options: ["Repeat actions", "Store data"],
      answer: 0,
      difficulty: "easy",
    },
  ];
}

router.get("/api/flashcard/random", (req, res) => {
  if (flashcards.length === 0) return res.json({ item: null });
  const item = flashcards[Math.floor(Math.random() * flashcards.length)];
  const copy = { ...item };
  delete copy.answer; // don't send answer
  res.json({ item: copy });
});

router.post("/api/flashcard/submit", (req, res) => {
  const { id, selected } = req.body || {};
  const item = flashcards.find((f) => f.id === id);
  if (!item) return res.status(404).json({ error: "not_found" });
  const correct = item.answer === selected;
  res.json({ correct, correctIndex: item.answer });
});

module.exports = router;
