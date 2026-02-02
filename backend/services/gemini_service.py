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
        # Using gemma-3-27b-it (Proven Working / Open Model)
        self.model_name = 'gemma-3-27b-it' 

    def summarize(self, text: str, language: str = "English") -> str:
        if not text:
            return "No content to summarize."
            
        prompt = f"""
        Please provide a concise, neutral summary of the following news article content. 
        Focus on the main facts (Who, What, Where, When, Why). 
        Keep it under 3 sentences.
        
        Important: Write the summary in {language}.
        
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

    def get_model_name(self) -> str:
        return self.model_name

    def translate_batch(self, texts: list[str], target_language: str) -> list[str]:
        if not texts or target_language == "English":
            return texts
            
        prompt = f"""
        Translate the following news headlines into {target_language}.
        Return ONLY the translated titles, one per line.
        Do not output numbering or bullet points.
        
        Headlines:
        {chr(10).join(texts)}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name, contents=prompt
            )
            # Split by newline and filter empty lines
            lines = [line.strip() for line in response.text.split('\n') if line.strip()]
            return lines
        except Exception as e:
            print(f"Translation Error: {e}")
            return texts
