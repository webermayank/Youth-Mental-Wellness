import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-md chat-box">
        <h1 className="text-2xl font-bold">Welcome — check in your mood</h1>
        <p className="mt-2 text-calm-700">
          A calm place to track emotional health. Try a short check-in.
        </p>
        <div className="mt-4">
          <Link
            to="/checkin"
            className="px-4 py-2 rounded bg-calm-600 text-white"
          >
            Start Check-in
          </Link>
        </div>
      </section>
      <section className="bg-white p-6 rounded-md chat-box">
        <h2 className="font-semibold">Quick Actions</h2>
        <div className="mt-3 space-x-2">
          <Link to="/dashboard" className="px-3 py-2 rounded bg-calm-200">
            View Dashboard
          </Link>
          <Link to="/flashcards" className="px-3 py-2 rounded bg-calm-200">
            Health Flashcards
          </Link>
          <Link to="/tips" className="px-3 py-2 rounded bg-calm-200">
            Daily Tips
          </Link>
        </div>
      </section>
    </div>
  );
}
