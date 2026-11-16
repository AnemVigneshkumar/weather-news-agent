from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str
    openweather_api_key: str
    tavily_api_key: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()