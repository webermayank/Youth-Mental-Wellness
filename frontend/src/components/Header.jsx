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
    <header className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 shadow-2xl">
      {/* Animated Ocean Wave Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-wave-pattern animate-wave"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-20 w-2 h-2 bg-white/30 rounded-full animate-float-1"></div>
        <div className="absolute top-8 right-32 w-1 h-1 bg-cyan-200/40 rounded-full animate-float-2"></div>
        <div className="absolute top-6 left-1/3 w-1.5 h-1.5 bg-blue-200/30 rounded-full animate-float-3"></div>
        <div className="absolute top-10 right-20 w-1 h-1 bg-indigo-200/40 rounded-full animate-float-4"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="group flex items-center space-x-3 transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-lg"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-white drop-shadow-lg">
                Felion
              </h1>
              <p className="text-xs text-cyan-100 opacity-90">
                Your mental health companion
              </p>
            </div>
          </Link>

          {currentUser ? (
            <div className="flex items-center space-x-6">
              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-1">
                {[
                  { to: "/checkin", label: "Check-in", icon: "" },
                  { to: "/dashboard", label: "Dashboard", icon: "" },
                  { to: "/flashcards", label: "Learn", icon: "" },
                  { to: "/tips", label: "Tips", icon: "" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group relative px-4 py-2 text-white/90 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-sm group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </span>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-blue-300 group-hover:w-8 transition-all duration-300"></div>
                  </Link>
                ))}
              </nav>

              {/* User Section */}
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium text-white">
                    Welcome back!
                  </p>
                  <p className="text-xs text-cyan-100 opacity-90 truncate max-w-32">
                    {currentUser.email}
                  </p>
                </div>

                {/* User Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/30">
                    {currentUser.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="group relative overflow-hidden px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-sm group-hover:rotate-12 transition-transform duration-300"></span>
                    <span>Logout</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors duration-300">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <nav className="flex items-center space-x-4">
              <Link
                to="/login"
                className="group px-6 py-2 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-sm group-hover:scale-110 transition-transform duration-300"></span>
                  <span>Login</span>
                </span>
              </Link>
            </nav>
          )}
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"></div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(5px) translateY(-5px) rotate(1deg);
          }
          50% {
            transform: translateX(-2px) translateY(3px) rotate(-0.5deg);
          }
          75% {
            transform: translateX(-5px) translateY(-2px) rotate(0.5deg);
          }
        }

        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(-15px) translateX(3px);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-8px) translateX(-3px);
          }
          66% {
            transform: translateY(-12px) translateX(4px);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          20% {
            transform: translateY(-6px) translateX(2px);
          }
          40% {
            transform: translateY(-10px) translateX(-4px);
          }
          60% {
            transform: translateY(-4px) translateX(3px);
          }
          80% {
            transform: translateY(-8px) translateX(-1px);
          }
        }

        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-12px) translateX(-6px);
          }
        }

        .bg-wave-pattern {
          background-image: radial-gradient(
              circle at 20% 50%,
              rgba(255, 255, 255, 0.1) 2px,
              transparent 3px
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 2px
            ),
            radial-gradient(
              circle at 40% 80%,
              rgba(255, 255, 255, 0.08) 2px,
              transparent 3px
            );
        }

        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 10s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 7s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}
