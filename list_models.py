from google import genai
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    # try loading from current dir if above failed
    load_dotenv(dotenv_path=".env")
    api_key = os.getenv("GOOGLE_API_KEY")

print(f"Key loaded: {api_key[:5]}...")

try:
    client = genai.Client(api_key=api_key)
    # The new SDK list_models returns an iterator/pager
    print("Listing models...")
    for model in client.models.list(config={'page_size': 20}):
        print(f"Model: {model.name}")

except Exception as e:
    print(f"Error: {e}")
