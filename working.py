import requests
import json
import sys

API_KEY    = "MRyqj1YJntOPFiDrGs7OlxS01CchTlph8ZP2Q9AFbTPP"
BASE_URL   = "https://us-south.ml.cloud.ibm.com"
PROJECT_ID = "56c1f9b0-d97d-4388-8aa1-0fbf4904b1c8"
VERSION    = "2025-02-11"
MODEL_ID   = "ibm/granite-3-3-8b-instruct"

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

def generate_text(token, prompt):
    endpoint = f"{BASE_URL}/ml/v1/text/generation?version={VERSION}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    body = {
        "model_id":   MODEL_ID,
        "project_id": PROJECT_ID,
        "input":      prompt,
        "parameters": {
            "max_new_tokens": 500,   # ← increased
            "min_new_tokens": 20,
            "temperature":    0.7    # ← optional, smoother output
        }
    }

    print("\n▶ Request to:", endpoint)
    print("✉️ Request body:", json.dumps(body, indent=2))

    resp = requests.post(endpoint, headers=headers, json=body)
    if not resp.ok:
        print(f"\n🚨 HTTP {resp.status_code} ERROR")
        try:
            print("🧾 Response body:", json.dumps(resp.json(), indent=2))
        except ValueError:
            print("🧾 Response text:", resp.text)
        sys.exit(1)

    return resp.json()

def main():
    print("1) fetching IAM token…")
    token = get_iam_token()

    while True:
        prompt = input("\n💬 Question (or 'quit'): ").strip()
        if prompt.lower() in ("quit", "exit"):
            print("👋 Goodbye!")
            break

        print("2) sending…")
        data = generate_text(token, prompt)

        generated = data.get("results", [{}])[0].get("generated_text", "")
        print("\n✅ Generated:\n")
        print(generated)

if __name__ == "__main__":
    main()
