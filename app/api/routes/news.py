from fastapi import APIRouter, HTTPException

from app.schemas.news import NewsRequest, NewsResponse
from app.services.news_service import search_news

router = APIRouter(tags=["News"])


@router.post("/news", response_model=NewsResponse)
async def news(request: NewsRequest):
    try:
        result = await search_news(request.query, request.max_results)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))
    return result