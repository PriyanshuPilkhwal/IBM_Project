from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import requests
import json
import sys
import os

app = Flask(__name__)
CORS(app)

# IBM Watson Configuration (from your working.py)
API_KEY    = "MRyqj1YJntOPFiDrGs7OlxS01CchTlph8ZP2Q9AFbTPP"
BASE_URL   = "https://us-south.ml.cloud.ibm.com"
PROJECT_ID = "56c1f9b0-d97d-4388-8aa1-0fbf4904b1c8"
VERSION    = "2025-02-11"
MODEL_ID   = "ibm/granite-3-3-8b-instruct"

def get_iam_token():
    """Get IBM Cloud IAM token"""
    try:
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
    except Exception as e:
        print(f"Error getting IAM token: {e}")
        return None

def generate_text(token, prompt):
    """Generate text using IBM Granite model"""
    endpoint = f"{BASE_URL}/ml/v1/text/generation?version={VERSION}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # Enhanced prompt for college admission context
    admission_context = """You are a helpful College Admission Agent AI assistant powered by IBM Granite. 
    You help prospective students with admission-related queries including:
    - Admission requirements and eligibility criteria
    - Application processes and deadlines
    - Fee structures and financial aid
    - Course information and program details
    - Campus facilities and student life
    - Scholarship opportunities
    - Document requirements
    
    Provide accurate, helpful, and friendly responses. If you don't have specific information, 
    guide the student to contact the admissions office directly.
    
    Student Question: """
    
    full_prompt = admission_context + prompt
    
    body = {
        "model_id":   MODEL_ID,
        "project_id": PROJECT_ID,
        "input":      full_prompt,
        "parameters": {
            "max_new_tokens": 500,
            "min_new_tokens": 20,
            "temperature":    0.7,
            "repetition_penalty": 1.1
        }
    }

    try:
        resp = requests.post(endpoint, headers=headers, json=body)
        if not resp.ok:
            print(f"HTTP {resp.status_code} ERROR")
            print("Response:", resp.text)
            return None
        
        return resp.json()
    except Exception as e:
        print(f"Error generating text: {e}")
        return None

@app.route('/')
def index():
    """Serve the frontend HTML"""
    try:
        with open('college_admission_frontend.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        return html_content
    except FileNotFoundError:
        return '''
        <h1>College Admission Agent</h1>
        <p>Frontend file not found. Please make sure college_admission_frontend.html exists in the project directory.</p>
        <p>You can use the API endpoint at /api/chat to test the backend functionality.</p>
        '''

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages from frontend"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get IAM token
        token = get_iam_token()
        if not token:
            return jsonify({'error': 'Failed to authenticate with IBM Cloud'}), 500
        
        # Generate response using IBM Granite
        response_data = generate_text(token, user_message)
        if not response_data:
            return jsonify({'error': 'Failed to generate response'}), 500
        
        # Extract generated text
        generated_text = response_data.get("results", [{}])[0].get("generated_text", "")
        
        if not generated_text:
            generated_text = "I'm sorry, I couldn't generate a response at the moment. Please try again or contact our admissions office directly."
        
        return jsonify({
            'response': generated_text,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'College Admission Agent',
        'model': MODEL_ID
    })

if __name__ == '__main__':
    print("🚀 Starting College Admission Agent...")
    print("🤖 Powered by IBM Granite")
    print("📚 Ready to help with admission queries!")
    app.run(debug=True, host='0.0.0.0', port=5000)
