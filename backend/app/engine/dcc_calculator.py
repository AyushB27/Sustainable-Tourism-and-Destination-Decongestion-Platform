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
    curve = []
    hours = [
        ("06:00", "06:00 AM", 0.35),
        ("07:00", "07:00 AM", 0.48),
        ("08:00", "08:00 AM", 0.65),
        ("09:00", "09:00 AM", 0.82),
        ("10:00", "10:00 AM", 1.05),
        ("11:00", "11:00 AM", 1.25),
        ("12:00", "12:00 PM", 1.35),
        ("13:00", "01:00 PM", 1.30),
        ("14:00", "02:00 PM", 1.20),
        ("15:00", "03:00 PM", 1.10),
        ("16:00", "04:00 PM", 0.95),
        ("17:00", "05:00 PM", 0.75),
        ("18:00", "06:00 PM", 0.50),
    ]

    for h_code, h_label, multiplier in hours:
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
