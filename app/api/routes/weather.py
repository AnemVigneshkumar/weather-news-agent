from fastapi import APIRouter, HTTPException

from app.schemas.weather import WeatherRequest, WeatherResponse
from app.services.weather_service import get_weather

router = APIRouter(tags=["Weather"])


@router.post("/weather", response_model=WeatherResponse)
async def weather(request: WeatherRequest):
    try:
        result = await get_weather(request.city, request.units)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))
    return result