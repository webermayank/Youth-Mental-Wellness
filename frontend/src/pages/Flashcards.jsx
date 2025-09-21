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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-6 shadow-lg animate-spin">
            <span className="text-4xl">🎴</span>
          </div>
          <div className="text-xl text-gray-700 font-medium">
            Loading your flashcard...
          </div>
          <div className="text-gray-500 mt-2">
            Preparing knowledge challenge
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-block p-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-6 shadow-lg animate-bounce-gentle">
            <span className="text-4xl">💡</span>
          </div>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Health Flashcards
          </h2>
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              No flashcards available at the moment. Let's try to load some
              knowledge cards for you!
            </p>
            <button
              onClick={loadNewCard}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              <span className="mr-2">🔄</span>
              Try Loading Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-6 shadow-lg animate-bounce-gentle">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Mental Health Flashcards
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Test and expand your mental health knowledge through interactive
            learning cards
          </p>
        </div>

        {/* Enhanced Score Display */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Correct Answers */}
            <div className="text-center p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border border-green-200/50">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {score.correct}
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                <span>✅</span>
                Correct
              </div>
            </div>

            {/* Total Questions */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border border-blue-200/50">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {score.total}
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                <span>📊</span>
                Total
              </div>
            </div>

            {/* Accuracy */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border border-purple-200/50">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {score.total > 0
                  ? Math.round((score.correct / score.total) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                <span>🎯</span>
                Accuracy
              </div>
            </div>

            {/* Current Streak */}
            <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl border border-orange-200/50">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {result?.correct ? score.correct : 0}
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                <span>🔥</span>
                Streak
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {score.total > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Learning Progress
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {score.correct}/{score.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(score.correct / score.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Animated Flashcard Section */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-3xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
                <AnimatedFlashcard
                  card={currentCard}
                  selectedAnswer={selectedAnswer}
                  onAnswerSelect={setSelectedAnswer}
                  result={result}
                  isFlipping={isFlipping}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <div className="flex flex-col sm:flex-row gap-4">
            {result === null ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || loading}
                className={`
                  px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform text-lg
                  ${
                    selectedAnswer === null || loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 shadow-xl"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Checking Answer...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>Submit Answer</span>
                  </div>
                )}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Result Feedback */}
                <div
                  className={`px-6 py-3 rounded-2xl font-semibold text-white shadow-lg ${
                    result.correct
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-red-500 to-pink-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{result.correct ? "🎉" : "📚"}</span>
                    <span>
                      {result.correct ? "Correct!" : "Keep Learning!"}
                    </span>
                  </div>
                </div>

                {/* Next Card Button */}
                <button
                  onClick={loadNewCard}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span>➡️</span>
                    <span>Next Challenge</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Encouraging Footer */}
        <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-3xl border border-green-200/50">
          <div className="flex justify-center gap-2 mb-4 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>
              🌟
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              🧠
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
              💪
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Knowledge is Power!
          </h3>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Every question you answer is building your understanding of mental
            health. Whether you get it right or wrong, you're learning something
            valuable. Keep going - your brain is growing stronger! 🌱
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
