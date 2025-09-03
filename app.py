import requests
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- IBM Credentials (hardcoded like your working script) ---
API_KEY    = "Eyu4i1SvSkTFUv4GvFv1b8QZ63tGw4I-8G32kT0_wO5A"
BASE_URL   = "https://us-south.ml.cloud.ibm.com"
PROJECT_ID = "56c1f9b0-d97d-4388-8aa1-0fbf4904b1c8"
VERSION    = "2025-02-11"
MODEL_ID   = "ibm/granite-3-3-8b-instruct"

# --- Flask setup ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# --- IBM helpers ---
def get_iam_token():
    resp = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "apikey": API_KEY,
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey"
        }
    )
    resp.raise_for_status()
    return resp.json()["access_token"]

def generate_text(prompt):
    token = get_iam_token()
    endpoint = f"{BASE_URL}/ml/v1/text/generation?version={VERSION}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    body = {
        "model_id": MODEL_ID,
        "project_id": PROJECT_ID,
        "input": prompt,
        "parameters": {
            "max_new_tokens": 500,
            "min_new_tokens": 20,
            "temperature": 0.7
        }
    }
    resp = requests.post(endpoint, headers=headers, json=body)
    resp.raise_for_status()
    return resp.json()

# --- Routes ---
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": MODEL_ID,
        "project": PROJECT_ID
    })

@app.route("/api/debug/token", methods=["GET"])
def debug_token():
    try:
        token = get_iam_token()
        return jsonify({"ok": True, "message": "IAM token retrieved (hidden)"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/debug/generate", methods=["POST"])
def debug_generate():
    try:
        data = request.get_json(force=True)
        prompt = data.get("prompt", "")
        result = generate_text(prompt)
        return jsonify({"ok": True, "ibm_response": result})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        app.logger.info(f"Received chat request from {request.remote_addr}")
        data = request.get_json(force=True)
        message = data.get("message", "")
        app.logger.info(f"Processing message: {message[:100]}...")
        
        if not message.strip():
            return jsonify({"error": "Empty message"}), 400
        
        # Add college admission context to the prompt
        enhanced_prompt = f"""You are an AI assistant helping with college admissions. Please provide helpful, accurate information about college applications, requirements, scholarships, and related topics.

User question: {message}

Response:"""
        
        result = generate_text(enhanced_prompt)
        generated = result.get("results", [{}])[0].get("generated_text", "")
        
        app.logger.info(f"Generated response length: {len(generated)}")
        return jsonify({"response": generated.strip()})
    except Exception as e:
        app.logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def index():
    return """
    <h1>IBM AI Backend Running</h1>
    <ul>
      <li><a href="/api/health">/api/health</a></li>
      <li><a href="/api/debug/token">/api/debug/token</a></li>
    </ul>
    """, 200

# --- Main ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
