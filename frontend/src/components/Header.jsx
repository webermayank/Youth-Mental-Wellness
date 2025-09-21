import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-calm-100 to-calm-200 p-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          Youth Wellness AI
        </Link>

        {currentUser ? (
          <div className="flex items-center space-x-4">
            <nav className="space-x-4 text-calm-800">
              <Link to="/checkin" className="hover:underline">
                Check-in
              </Link>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/flashcards" className="hover:underline">
                Flashcards
              </Link>
              <Link to="/tips" className="hover:underline">
                Tips
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-calm-600">
                Welcome, {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-calm-600 text-white rounded hover:bg-calm-700"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <nav className="space-x-4 text-calm-800">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
