import requests
from app.config import settings
from app.models import City
from sqlalchemy.orm import Session

def get_all_cities(db: Session):
    cities = db.query(City).all()
    # Обновим данные о погоде и населении для каждого города
    for c in cities:
        # Получаем погоду
        weather = fetch_weather(c.name)
        if weather:
            c.weather = weather
        # Получаем население
        population = fetch_population(c.name)
        if population:
            c.population = population
        db.commit()
    return cities

def fetch_weather(city_name: str) -> str:
    # Запрос к OpenWeatherMap
    params = {
        "q": city_name,
        "appid": settings.WEATHER_API_KEY,
        "units": "metric",
        "lang": "ru"
    }
    r = requests.get(settings.WEATHER_API_URL, params=params)
    if r.status_code == 200:
        data = r.json()
        # Предположим, data["weather"][0]["description"] - описание погоды
        return data["weather"][0]["description"]
    return None

def fetch_population(city_name: str) -> int:
    # Запрос к фиктивному API населения
    # Предположим, что API возвращает { "city": ..., "population": ... }
    r = requests.get(f"{settings.POPULATION_API_URL}?city={city_name}")
    if r.status_code == 200:
        data = r.json()
        return data.get("population", 0)
    return None
