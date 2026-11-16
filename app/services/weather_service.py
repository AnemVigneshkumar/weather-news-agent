import httpx

from app.config import settings
from app.schemas.weather import WeatherResponse


async def get_weather(city, units="metric"):
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": settings.openweather_api_key,
        "units": units,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise Exception(f"Weather API failed with status {response.status_code}")

    data = response.json()

    weather = WeatherResponse(
        city=data["name"],
        country=data["sys"]["country"],
        temperature=data["main"]["temp"],
        feels_like=data["main"]["feels_like"],
        humidity=data["main"]["humidity"],
        description=data["weather"][0]["description"],
        wind_speed=data["wind"]["speed"],
    )
    return weather