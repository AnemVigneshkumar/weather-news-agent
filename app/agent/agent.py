from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from app.agent.prompts import SYSTEM_PROMPT
from app.services.llm_service import llm
from app.tools.news_tool import search_latest_news
from app.tools.weather_tool import get_current_weather

agent = create_agent(
    model=llm,
    tools=[get_current_weather, search_latest_news],
    system_prompt=SYSTEM_PROMPT,
    checkpointer=InMemorySaver(),
)

