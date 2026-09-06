import json
import urllib.request
from ..cache_manager import get_cached_telemetry, set_cached_telemetry

def fetch_live_weather(lat: float, lon: float, destination_id: str = None) -> dict:
    """
    Fetches real-time precipitation, wind speed, and temperature from Open-Meteo API.
    Checks persistent database cache first. Only makes external API call if cache is missing/expired.
    Calculates an environmental hazard score (0.0 to 1.0) calibrated for Western Ghats terrain.
    """
    cache_key = f"weather:{destination_id or f'{lat:.3f},{lon:.3f}'}"
    cached = get_cached_telemetry(cache_key)
    if cached:
        return cached

    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,precipitation,rain,weather_code,wind_speed_10m"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "EcoRouteBharat/1.0"})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode("utf-8"))
            current = data.get("current", {})
            rain_mm = float(current.get("rain", 0.0))
            wind_kmh = float(current.get("wind_speed_10m", 0.0))
            temp_c = float(current.get("temperature_2m", 24.0))

            # Landslide / Ghat hazard score
            hazard_score = min(1.0, (rain_mm / 15.0) * 0.70 + (wind_kmh / 50.0) * 0.30)
            result = {
                "temperature_c": round(temp_c, 1),
                "rain_mm": round(rain_mm, 1),
                "wind_kmh": round(wind_kmh, 1),
                "hazard_score": round(max(0.05, hazard_score), 2),
                "source": "Open-Meteo Live API",
                "status": "connected"
            }
            # Cache for 30 minutes (1800s)
            set_cached_telemetry(cache_key, destination_id or "", "weather", result, ttl_seconds=1800)
            return result
    except Exception:
        # Graceful fallback telemetry (cached briefly for 3 minutes to avoid rapid retry hammering)
        fallback = {
            "temperature_c": 22.5,
            "rain_mm": 0.0,
            "wind_kmh": 12.0,
            "hazard_score": 0.08,
            "source": "Open-Meteo Simulator",
            "status": "fallback"
        }
        set_cached_telemetry(cache_key, destination_id or "", "weather", fallback, ttl_seconds=180)
        return fallback
