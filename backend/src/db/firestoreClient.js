const { Firestore } = require("@google-cloud/firestore");
const FIRESTORE_ENABLED = process.env.FIRESTORE_ENABLED === "true" || true; // Force enable for now
const PROJECT_ID = process.env.PROJECT_ID || "askai-health-wellness";

let db = null;

function getDb() {
  if (!db && FIRESTORE_ENABLED) {
    // Use environment variables for Google Cloud authentication
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (credentials) {
      // Parse the JSON credentials from environment variable
      const serviceAccount = JSON.parse(credentials);
      db = new Firestore({
        projectId: PROJECT_ID,
        credentials: serviceAccount,
      });
    } else {
      // Fallback to default credentials (for local development)
      db = new Firestore({
        projectId: PROJECT_ID,
      });
    }
  }
  return db;
}

async function saveCheckin(userId, payload) {
  if (!FIRESTORE_ENABLED) {
    console.info("Firestore disabled - skipping save");
    return true;
  }
  const client = getDb();
  const ref = client.collection("users").doc(userId).collection("checkins");
  await ref.add({ ...payload, createdAt: new Date().toISOString() });
  return true;
}

module.exports = { saveCheckin, getDb };
