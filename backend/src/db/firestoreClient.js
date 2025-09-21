const { Firestore } = require("@google-cloud/firestore");
const FIRESTORE_ENABLED = process.env.FIRESTORE_ENABLED === "true" || true; // Force enable for now
const PROJECT_ID = process.env.PROJECT_ID || "askai-health-wellness";
const path = require("path");

let db = null;

function getDb() {
  if (!db && FIRESTORE_ENABLED) {
    // Use the service account file we downloaded
    const keyPath = path.resolve(
      __dirname,
      "../../askai-health-wellness-firebase-adminsdk-fbsvc-223bd1f707.json"
    );

    db = new Firestore({
      projectId: PROJECT_ID,
      keyFilename: keyPath,
    });
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
