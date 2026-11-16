from pydantic import BaseModel


class NewsRequest(BaseModel):
    query: str
    max_results: int = 3


class NewsArticle(BaseModel):
    title: str
    url: str
    content: str


class NewsResponse(BaseModel):
    query: str
    articles: list[NewsArticle]