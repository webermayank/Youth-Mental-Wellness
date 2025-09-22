const axios = require("axios");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ||
  "https://ml-service-358309174344.asia-south1.run.app";

/**
 * Calls the deployed ML service to analyze text and get mood, affirmation, and playlist
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} - Response from ML service
 */
async function analyzeText(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Text is required and must be a string");
    }

    const response = await axios.post(
      `${ML_SERVICE_URL}/analyze`,
      {
        text: text.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error("ML Service Error:", error.message);

    // If it's a network error or service unavailable, throw a more specific error
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      throw new Error("ML service is unavailable");
    }

    if (error.response) {
      // Service responded with error status
      throw new Error(
        `ML service error: ${error.response.status} - ${
          error.response.data?.error || "Unknown error"
        }`
      );
    }

    throw error;
  }
}

/**
 * Health check for the ML service
 * @returns {Promise<boolean>} - True if service is healthy
 */
async function checkMLServiceHealth() {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, {
      timeout: 5000, // 5 second timeout for health check
    });
    return response.status === 200 && response.data?.status === "healthy";
  } catch (error) {
    console.error("ML Service Health Check Failed:", error.message);
    return false;
  }
}

module.exports = {
  analyzeText,
  checkMLServiceHealth,
};
