import json
import urllib.request

def fetch_live_weather(lat: float, lon: float) -> dict:
    """
    Fetches real-time precipitation, wind speed, and temperature from Open-Meteo API.
    Calculates an environmental hazard score (0.0 to 1.0) calibrated for Western Ghats terrain.
    """
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
            return {
                "temperature_c": round(temp_c, 1),
                "rain_mm": round(rain_mm, 1),
                "wind_kmh": round(wind_kmh, 1),
                "hazard_score": round(max(0.05, hazard_score), 2),
                "source": "Open-Meteo Live API",
                "status": "connected"
            }
    except Exception:
        # Graceful fallback telemetry
        return {
            "temperature_c": 22.5,
            "rain_mm": 0.0,
            "wind_kmh": 12.0,
            "hazard_score": 0.08,
            "source": "Open-Meteo Simulator",
            "status": "fallback"
        }
