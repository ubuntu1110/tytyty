import os

class Settings:
    SECRET_KEY = "supersecretkey"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 120  # теперь 2 часа
    DATABASE_URL = "sqlite:///./app.db"

    EXCHANGE_API_URL = "https://api.exchangerate.host/latest"
    WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"
    WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"
    POPULATION_API_URL = "https://yourpopulationapi.example.com/cities"


settings = Settings()
