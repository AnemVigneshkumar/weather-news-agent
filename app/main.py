import logging

from fastapi import FastAPI

from app.api.routes import health, weather, news, agent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Weather & News Agent",
    description="An AI agent that answers weather and news questions.",
    version="0.1.0",
)

app.include_router(health.router)
app.include_router(weather.router)
app.include_router(news.router)
app.include_router(agent.router)

logger.info("Weather & News Agent app is ready")