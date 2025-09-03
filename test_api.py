#!/usr/bin/env python3
import requests
import json

def test_health():
    try:
        response = requests.get("http://localhost:5000/api/health")
        print(f"Health check status: {response.status_code}")
        print(f"Health check response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_chat():
    try:
        payload = {"message": "What are the admission requirements?"}
        response = requests.post(
            "http://localhost:5000/api/chat", 
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Chat API status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Chat response: {data.get('response', 'No response field')[:200]}...")
        else:
            print(f"Chat error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Chat test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Flask API...")
    print("\n1. Testing health endpoint...")
    health_ok = test_health()
    
    print("\n2. Testing chat endpoint...")
    chat_ok = test_chat()
    
    print(f"\nResults:")
    print(f"Health API: {'✅' if health_ok else '❌'}")
    print(f"Chat API: {'✅' if chat_ok else '❌'}")
    
    if health_ok and chat_ok:
        print("\n✅ All tests passed! The API is working correctly.")
    else:
        print("\n❌ Some tests failed. Check the Flask server logs.")
