import React, { useState, useEffect } from "react";
import { getRandomFlashcard, submitFlashcard } from "../services/api";
import AnimatedFlashcard from "../components/AnimatedFlashcard";

export default function Flashcards() {
  const [currentCard, setCurrentCard] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isFlipping, setIsFlipping] = useState(false);

  const loadNewCard = async () => {
    setLoading(true);
    setResult(null);
    setSelectedAnswer(null);
    setIsFlipping(false);
    try {
      const response = await getRandomFlashcard();
      setCurrentCard(response.item);
    } catch (error) {
      console.error("Error loading flashcard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentCard) return;

    setLoading(true);
    setIsFlipping(true);
    try {
      const response = await submitFlashcard(currentCard.id, selectedAnswer);
      setResult(response);

      // Update score
      setScore((prev) => ({
        correct: prev.correct + (response.correct ? 1 : 0),
        total: prev.total + 1,
      }));
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewCard();
  }, []);

  if (loading && !currentCard) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calm-600 mx-auto mb-4"></div>
          <div className="text-calm-600">Loading flashcard...</div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-calm-800">
          Health Flashcards
        </h2>
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <div className="text-6xl mb-4">💡</div>
          <p className="text-calm-600 mb-6">
            No flashcards available at the moment.
          </p>
          <button
            onClick={loadNewCard}
            className="px-6 py-3 rounded-lg bg-calm-600 text-white hover:bg-calm-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-calm-800 mb-2">
          Health Flashcards
        </h2>
        <p className="text-calm-600 text-lg">
          Test your mental health knowledge with interactive cards
        </p>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-calm-50 to-calm-100 p-6 rounded-xl shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {score.correct}
              </div>
              <div className="text-sm text-calm-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-calm-800">
                {score.total}
              </div>
              <div className="text-sm text-calm-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-calm-600">
                {score.total > 0
                  ? Math.round((score.correct / score.total) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-calm-600">Accuracy</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-calm-600">Current Streak</div>
            <div className="text-xl font-bold text-calm-800">
              {result?.correct ? score.correct : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Flashcard */}
      <div className="flex justify-center mb-8 px-4">
        <div className="w-full max-w-2xl">
          <AnimatedFlashcard
            card={currentCard}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
            result={result}
            isFlipping={isFlipping}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {result === null ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || loading}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform
              ${
                selectedAnswer === null || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-calm-600 text-white hover:bg-calm-700 hover:scale-105 shadow-lg"
              }
            `}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </div>
            ) : (
              "Submit Answer"
            )}
          </button>
        ) : (
          <button
            onClick={loadNewCard}
            className="px-8 py-3 rounded-lg bg-calm-600 text-white hover:bg-calm-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
          >
            Next Card →
          </button>
        )}
      </div>
    </div>
  );
}
