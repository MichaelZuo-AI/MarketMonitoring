from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found")
        self.client = genai.Client(api_key=api_key)
        # Using gemini-2.5-flash as found in available models
        self.model_name = 'gemini-2.5-flash' 

    def summarize(self, text: str) -> str:
        if not text:
            return "No content to summarize."
            
        prompt = f"""
        Please provide a concise, neutral summary of the following news article content. 
        Focus on the main facts (Who, What, Where, When, Why). 
        Keep it under 3 sentences.
        
        Content:
        {text}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name, contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Error generating summary."
