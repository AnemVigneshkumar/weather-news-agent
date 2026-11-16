from langchain.tools import tool
from app.services.news_service import search_news

@tool
async def search_latest_news(query:str):
    """Search for the latest news articles about a topic, place or event. Use this when the user asks about news, headlines or recent events."""

    try:
        result = await search_news(query)
    except Exception as error:
        return f"Could not get news for {query}: {error}"
    
    lines = []
    for article in result.articles:
        lines.append(f"- {article.title}: {article.content[:300]} ({article.url})")
    
    if not lines:
        return f"No news found for {query}."
    
    return "\n".join(lines)