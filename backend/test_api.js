const axios = require("axios");

async function testAPI() {
  try {
    console.log("Testing ML Health...");
    const healthResponse = await axios.get(
      "http://localhost:8000/api/ml-health"
    );
    console.log("ML Health:", healthResponse.data);

    console.log("\nTesting Summarize...");
    const summarizeResponse = await axios.post(
      "http://localhost:8000/api/summarize",
      {
        text: "I feel happy today",
      }
    );
    console.log("Summarize Response:", summarizeResponse.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error(
        "Full response:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
  }
}

testAPI();
