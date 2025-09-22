const { redactPII } = require("./src/utils/redact");
const { analyzeText } = require("./src/services/mlServiceClient");
const { inferMoodAndAffirmation } = require("./src/services/vertexcClient");
const { saveCheckin } = require("./src/db/firestoreClient");

async function debugTest() {
  try {
    console.log("1. Testing redactPII...");
    const text = "I feel happy today";
    const clean = redactPII(text);
    console.log("Redacted text:", clean);

    console.log("\n2. Testing ML service...");
    const mlResponse = await analyzeText(clean);
    console.log("ML response:", mlResponse);

    console.log("\n3. Testing saveCheckin...");
    await saveCheckin("test_user", { text: clean, mood: "happy" });
    console.log("Save checkin successful");

    console.log("\n4. Testing fallback...");
    const fallbackResponse = await inferMoodAndAffirmation(clean);
    console.log("Fallback response:", fallbackResponse);

    console.log("\nAll tests passed!");
  } catch (error) {
    console.error("Error in step:", error.message);
    console.error("Stack:", error.stack);
  }
}

debugTest();
