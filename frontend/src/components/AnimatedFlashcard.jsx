import React, { useState, useEffect } from "react";

export default function AnimatedFlashcard({
  card,
  selectedAnswer,
  onAnswerSelect,
  result,
  isFlipping = false,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (result) {
      setIsFlipped(true);
      // Show explanation after a short delay
      setTimeout(() => setShowExplanation(true), 500);
    }
  }, [result]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "anxiety":
        return "🧘";
      case "stress":
        return "😰";
      case "depression":
        return "☀️";
      case "crisis":
        return "🚨";
      case "happiness":
        return "😊";
      case "anger":
        return "😤";
      case "loneliness":
        return "🤗";
      case "mood":
        return "🎵";
      default:
        return "💡";
    }
  };

  if (!card) return null;

  return (
    <div className="perspective-1000">
      <div
        className={`
          relative w-full h-[500px] transition-transform duration-700 transform-style-preserve-3d
          ${isFlipped ? "rotate-y-180" : ""}
          ${isFlipping ? "animate-pulse" : ""}
        `}
      >
        {/* Front of card */}
        <div
          className={`
          absolute inset-0 w-full h-full backface-hidden
          ${isFlipped ? "opacity-0" : "opacity-100"}
          transition-opacity duration-300
        `}
        >
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-calm-50 to-calm-100 px-6 py-4 border-b border-calm-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getCategoryIcon(card.category)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-calm-700 capitalize">
                      {card.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        card.difficulty
                      )}`}
                    >
                      {card.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center px-6 py-8">
              <h3 className="text-xl font-semibold text-calm-800 text-center leading-relaxed max-w-lg">
                {card.question}
              </h3>
            </div>

            {/* Options */}
            <div className="px-6 pb-6 space-y-3">
              {card.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  disabled={result !== null}
                  className={`
                    w-full p-4 text-left rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.01]
                    ${
                      selectedAnswer === index
                        ? "bg-calm-100 border-calm-400 shadow-md"
                        : "bg-white border-calm-200 hover:border-calm-300 hover:shadow-sm"
                    }
                    ${result !== null ? "cursor-not-allowed" : "cursor-pointer"}
                    ${
                      result !== null && index === result.correctIndex
                        ? "bg-green-50 border-green-400 shadow-lg"
                        : ""
                    }
                    ${
                      result !== null &&
                      selectedAnswer === index &&
                      !result.correct
                        ? "bg-red-50 border-red-400 shadow-lg"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5
                      ${
                        selectedAnswer === index
                          ? "bg-calm-500 border-calm-500 text-white"
                          : "border-calm-300 text-calm-600"
                      }
                      ${
                        result !== null && index === result.correctIndex
                          ? "bg-green-500 border-green-500 text-white"
                          : ""
                      }
                      ${
                        result !== null &&
                        selectedAnswer === index &&
                        !result.correct
                          ? "bg-red-500 border-red-500 text-white"
                          : ""
                      }
                    `}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-calm-700 leading-relaxed">
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back of card (result) */}
        <div
          className={`
          absolute inset-0 w-full h-full backface-hidden rotate-y-180
          ${isFlipped ? "opacity-100" : "opacity-0"}
          transition-opacity duration-300
        `}
        >
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
            {/* Result Header */}
            <div className="bg-gradient-to-r from-calm-50 to-calm-100 px-6 py-6 text-center border-b border-calm-200">
              <div
                className={`
                w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4
                ${
                  result?.correct
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }
              `}
              >
                {result?.correct ? "✓" : "✗"}
              </div>
              <h3
                className={`
                text-2xl font-bold
                ${result?.correct ? "text-green-700" : "text-red-700"}
              `}
              >
                {result?.correct ? "Correct!" : "Incorrect"}
              </h3>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-6 space-y-4">
              {/* Explanation */}
              {showExplanation && card.explanation && (
                <div className="bg-calm-50 rounded-lg p-4">
                  <h4 className="font-semibold text-calm-800 mb-3 text-lg">
                    Explanation:
                  </h4>
                  <p className="text-calm-700 leading-relaxed">
                    {card.explanation}
                  </p>
                </div>
              )}

              {/* Correct Answer Highlight */}
              {!result?.correct && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-calm-800">
                    <span className="font-semibold text-green-800">
                      Correct answer:
                    </span>
                    <br />
                    <span className="text-green-700 mt-1 block">
                      {card.options[result?.correctIndex]}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
