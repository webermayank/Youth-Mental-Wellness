import React, { useState } from "react";
import ChatInput from "../components/ChatInput";
import MoodCard from "../components/MoodCard";
import { postCheckin } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function CheckIn() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { currentUser } = useAuth();

  const onSubmit = async (text) => {
    if (!text || text.trim().length < 2) return alert("Please type something");
    setLoading(true);
    try {
      const payload = {
        user_id: currentUser?.uid || "anonymous",
        text,
        quick_emojis: [],
      };
      const res = await postCheckin(payload);
      setResponse(res);
    } catch (e) {
      console.error(e);
      alert("Error sending check-in");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Daily Check-in</h2>
      <p className="text-sm text-calm-600 mb-4">
        Welcome back, {currentUser?.email}! How are you feeling today?
      </p>
      <ChatInput onSubmit={onSubmit} loading={loading} />
      {response && (
        <MoodCard
          mood={response.mood}
          message={response.message}
          playlist={response.playlist}
          safety_flag={response.safety_flag}
          helplines={response.helplines}
        />
      )}
    </div>
  );
}
