from langchain.tools import tool
from app.services.weather_service import get_weather

@tool
async def get_current_weather(city:str):
    """get the current weather for a city. use this when the user asks about temperature, humidity, wind or weather conditions."""
    try:
        weather = await get_weather(city)
    except Exception as error:
        return f"Could not get weather for {city}: {error}"
    
    return (
        f"Weather in {weather.city}, {weather.country}: "
        f"{weather.description}, temperature {weather.temperature} C, "
        f"feels like {weather.feels_like} C, humidity {weather.humidity}%, "
        f"wind speed {weather.wind_speed} m/s."
    )
