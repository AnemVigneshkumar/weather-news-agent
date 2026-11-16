import httpx

from app.config import settings
from app.schemas.news import NewsArticle, NewsResponse


async def search_news(query, max_results=3):
    url = "https://api.tavily.com/search"
    headers = {
        "Authorization": f"Bearer {settings.tavily_api_key}",
    }
    body = {
        "query": query,
        "topic": "news",
        "max_results": max_results,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=body)

    if response.status_code != 200:
        raise Exception(f"News API failed with status {response.status_code}")

    data = response.json()

    articles = []
    for item in data["results"]:
        article = NewsArticle(
            title=item["title"],
            url=item["url"],
            content=item["content"],
        )
        articles.append(article)

    return NewsResponse(query=query, articles=articles)