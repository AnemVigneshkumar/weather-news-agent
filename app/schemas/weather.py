from pydantic import BaseModel


class WeatherRequest(BaseModel):
    city: str
    units: str = "metric"


class WeatherResponse(BaseModel):
    city: str
    country: str
    temperature: float
    feels_like: float
    humidity: int
    description: str
    wind_speed: float