import React, { useState } from "react";

export default function ChatInput({ onSubmit, loading }) {
  const [text, setText] = useState("");
  return (
    <div className="p-4 chat-box">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="How are you feeling today?"
        className="w-full p-3 rounded-md border"
      />
      <div className="flex items-center justify-between mt-3">
        <div className="space-x-2">
          <button
            onClick={() => setText((prev) => prev + " 😌")}
            disabled={loading}
            className="px-3 py-1 rounded bg-calm-400 text-white disabled:opacity-50"
          >
            😌
          </button>
          <button
            onClick={() => setText((prev) => prev + " 😟")}
            disabled={loading}
            className="px-3 py-1 rounded bg-calm-300 text-white disabled:opacity-50"
          >
            😟
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (!loading) {
                onSubmit(text);
                setText("");
              }
            }}
            disabled={loading}
            className="px-4 py-2 rounded bg-calm-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "AI Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
