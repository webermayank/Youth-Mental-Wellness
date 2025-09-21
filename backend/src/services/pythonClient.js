// backend/src/services/pythonClient.js
const { spawn } = require("child_process");
const path = require("path");

function callPythonMl(userText) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "../../../Gen-AI-powered-/ml_logic.py"
    );

    console.log("Python script path:", scriptPath);
    console.log("Current working directory:", process.cwd());

    const py = spawn("python", [scriptPath, userText], {
      cwd: path.join(__dirname, "../../../Gen-AI-powered-"),
    });

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (chunk) => (error += chunk.toString()));

    py.on("close", (code) => {
      console.log("Python process exited with code:", code);
      console.log("Python stdout:", data);
      console.log("Python stderr:", error);

      if (code !== 0) {
        return reject(new Error(error || `Python exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(data.trim());
        console.log("Parsed Python response:", parsed);
        resolve(parsed);
      } catch (e) {
        console.error("Failed to parse Python JSON:", e);
        console.error("Raw data:", data);
        reject(new Error("Invalid JSON from Python: " + data));
      }
    });
  });
}

module.exports = { callPythonMl };
