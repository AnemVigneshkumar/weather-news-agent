from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    api_key=settings.gemini_api_key,
)