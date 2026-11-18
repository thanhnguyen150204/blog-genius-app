"""
Quick script to verify that your Gemini API key works.
Supports both new google-genai SDK (AQ. keys) and legacy google.generativeai (AIza keys).
"""

import os
import sys

api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEYS", "").split(",")[0].strip()
if not api_key:
    print("[ERROR] GEMINI_API_KEY is not set.")
    sys.exit(1)

print(f"[INFO] Testing key: {api_key[:12]}...{api_key[-4:]}")

# Try new google-genai SDK first (supports AQ. format keys)
try:
    from google import genai
    client = genai.Client(api_key=api_key)
    resp = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents="Say OK",
    )
    print(f"[SUCCESS] Response: {resp.text.strip()}")
    print("[SUCCESS] Key is valid! Using google-genai SDK (new format).")
    sys.exit(0)
except ImportError:
    print("[INFO] google-genai SDK not found. Trying legacy google.generativeai...")
except Exception as e:
    print(f"[ERROR] google-genai SDK failed: {e}")
    sys.exit(1)

# Fallback: legacy google.generativeai SDK (AIza keys)
try:
    import google.generativeai as genai_legacy
    genai_legacy.configure(api_key=api_key, transport="rest")
    model = genai_legacy.GenerativeModel(model_name="models/gemini-1.5-flash")
    res = model.generate_content("Say OK", request_options={"timeout": 15})
    print(f"[SUCCESS] Response: {res.text.strip()}")
    print("[SUCCESS] Key is valid! Using legacy google.generativeai SDK.")
except Exception as e:
    print(f"[ERROR] {e}")
    sys.exit(1)
