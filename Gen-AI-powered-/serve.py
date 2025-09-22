from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_logic import init_vertex, analyze_and_respond
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend calls

# Health check endpoint for Cloud Run
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field"}), 400
        
        text = data.get("text", "")
        result = analyze_and_respond(text)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error in analyze endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    init_vertex()
    app.run(host="0.0.0.0", port=8080)