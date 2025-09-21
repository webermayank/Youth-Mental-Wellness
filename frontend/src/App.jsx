import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import Tips from "./pages/Tips";
import Login from "./components/Login";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-calm-50 text-calm-800">
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/checkin"
              element={
                <ProtectedRoute>
                  <CheckIn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <Flashcards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tips"
              element={
                <ProtectedRoute>
                  <Tips />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="text-center text-sm text-calm-600 p-4">
          © Youth Wellness AI
        </footer>
      </div>
    </AuthProvider>
  );
}
