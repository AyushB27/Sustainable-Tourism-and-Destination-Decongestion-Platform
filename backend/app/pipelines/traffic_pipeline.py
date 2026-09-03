import json
import urllib.request
from datetime import datetime
from ..config import TOMTOM_API_KEY

def fetch_live_traffic_delay(lat: float, lon: float, api_key: str = None) -> dict:
    """
    Fetches real-time vehicular speed reduction multiplier from TomTom Traffic Flow API.
    Returns congestion delay multiplier (1.0 = Free flow, 2.0+ = Heavy choke).
    """
    key = api_key or TOMTOM_API_KEY
    if not key or key == "your_tomtom_api_key_here":
        # Heuristic diurnal weekend model
        now = datetime.now()
        is_rush_hour = (17 <= now.hour <= 21) or (9 <= now.hour <= 12)
        is_weekend = now.weekday() >= 5
        multiplier = 2.1 if (is_weekend and is_rush_hour) else (1.4 if is_weekend else 1.05)
        return {
            "delay_factor": multiplier,
            "current_speed_kmh": round(60 / multiplier, 1),
            "free_flow_speed_kmh": 60.0,
            "source": "TomTom Heuristic Diurnal Model",
            "status": "simulated"
        }

    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point={lat},{lon}&key={key}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "EcoRouteBharat/1.0"})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode("utf-8"))
            flow = data.get("flowSegmentData", {})
            current_speed = float(flow.get("currentSpeed", 40))
            free_flow_speed = float(flow.get("freeFlowSpeed", 60))
            delay_factor = max(1.0, free_flow_speed / max(current_speed, 1.0))
            return {
                "delay_factor": round(delay_factor, 2),
                "current_speed_kmh": round(current_speed, 1),
                "free_flow_speed_kmh": round(free_flow_speed, 1),
                "source": "TomTom Live Traffic API",
                "status": "connected"
            }
    except Exception:
        return {
            "delay_factor": 1.15,
            "current_speed_kmh": 52.0,
            "free_flow_speed_kmh": 60.0,
            "source": "TomTom Cached Fallback",
            "status": "fallback"
        }
