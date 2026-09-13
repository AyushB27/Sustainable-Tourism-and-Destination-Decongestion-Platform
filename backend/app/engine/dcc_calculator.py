import math
from typing import Dict, Any, List

def calculate_dcc_metrics(
    current_inflow: int,
    physical_capacity: int,
    weather_hazard_score: float,
    avg_dwell_time_hours: float
) -> Dict[str, Any]:
    """
    Calculates the Dynamic Carrying Capacity (DCC) index and queuing wait-time.
    Formula: DCC = (0.70 * Capacity_Utilization) + (0.30 * Weather_Hazard_Score)
    Status:
      - OPTIMAL: DCC < 0.70
      - MODERATE: 0.70 <= DCC < 0.85
      - CRITICAL: DCC >= 0.85
    """
    capacity = max(1, physical_capacity)
    inflow = max(0, current_inflow)
    cap_util = inflow / capacity
    hazard = max(0.0, min(1.0, weather_hazard_score))

    dcc_score = round((0.70 * cap_util) + (0.30 * hazard), 2)

    if dcc_score < 0.70:
        status = "OPTIMAL"
    elif dcc_score < 0.85:
        status = "MODERATE"
    else:
        status = "CRITICAL"

    if inflow > capacity:
        overload_ratio = (inflow - capacity) / capacity
        wait_mins = round(overload_ratio * avg_dwell_time_hours * 60)
    else:
        wait_mins = 0

    return {
        "dcc_score": dcc_score,
        "status": status,
        "capacity_utilization": round(cap_util, 3),
        "wait_time_minutes": wait_mins,
        "raw_inflow": inflow,
        "raw_capacity": capacity
    }

def generate_12hr_forecast(
    base_inflow: int,
    physical_capacity: int,
    weather_hazard: float,
    dwell_hrs: float
) -> List[Dict[str, Any]]:
    """
    Generates a 12-hour hourly predictive demand curve for a destination.
    Applies Gaussian peak surges around 11:00 AM - 03:00 PM.
    """
    from datetime import datetime
    current_hour = datetime.now().hour
    hours = [(current_hour + i) % 24 for i in range(13)]
    
    curve = []
    
    multiplier_map = {
        6: 0.35, 7: 0.48, 8: 0.65, 9: 0.82, 10: 1.05,
        11: 1.25, 12: 1.35, 13: 1.30, 14: 1.20, 15: 1.10,
        16: 0.95, 17: 0.75, 18: 0.50
    }

    for h in hours:
        h_code = f"{h:02d}:00"
        ampm = "AM" if h < 12 else "PM"
        display_h = h if 1 <= h <= 12 else (h - 12 if h > 12 else 12)
        h_label = f"{display_h:02d}:00 {ampm}"
        multiplier = multiplier_map.get(h, 0.30)
        hourly_inflow = int(base_inflow * multiplier)
        metrics = calculate_dcc_metrics(hourly_inflow, physical_capacity, weather_hazard, dwell_hrs)
        curve.append({
            "hour": h_code,
            "time_label": h_label,
            "timeLabel": h_label,
            "inflow": hourly_inflow,
            "capacity": physical_capacity,
            "dcc_score": metrics["dcc_score"],
            "dccScore": metrics["dcc_score"],
            "status": metrics["status"],
            "wait_minutes": metrics["wait_time_minutes"],
            "waitMinutes": metrics["wait_time_minutes"],
            "weatherRisk": weather_hazard
        })

    return curve

def generate_ml_12hr_forecast(
    destination_id: str,
    base_capacity: int,
    current_visitors: int,
    weather: dict = None,
    traffic: dict = None
) -> dict:
    """
    Produces high-precision ML crowd and carrying capacity forecast using trained XGBoost models.
    Includes 95% confidence intervals and 4-hour critical breach alert probability.
    """
    from .ml_forecaster import predict_12hr_crowd_ml
    return predict_12hr_crowd_ml(destination_id, base_capacity, current_visitors, weather, traffic)
