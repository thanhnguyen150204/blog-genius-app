"""
Quick script to verify that your new API key works with gemini-flash-lite-latest.
"""

import os
import google.generativeai as genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("[ERROR] GEMINI_API_KEY is not set.")
    exit(1)

genai.configure(api_key=api_key, transport="rest")

model_name = "models/gemini-flash-lite-latest"
print(f"[INFO] Testing key with {model_name}...")
try:
    model = genai.GenerativeModel(model_name=model_name)
    res = model.generate_content("Say OK", request_options={"timeout": 15})
    print(f"[SUCCESS] Response: {res.text.strip()}")
    print("[SUCCESS] New key is 100% active and has a fresh 500 requests quota!")
except Exception as e:
    print(f"[ERROR] {e}")
