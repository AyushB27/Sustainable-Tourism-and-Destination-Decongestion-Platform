"""
EcoRoute Bharat - Historical Multi-Sensor Telemetry Dataset Generator
Synthesizes 18 months of calibrated hourly historical data across all 7 corridor destinations.
Generates realistic covariance between weather hazards, traffic delays, holidays, and crowd surges.
"""

import os
import math
import random
from pathlib import Path
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

# Ensure deterministic reproducibility
np.random.seed(42)
random.seed(42)

SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent
DATA_DIR = BACKEND_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
OUTPUT_CSV = DATA_DIR / "training_historical_telemetry.csv"

# Destination baseline profiles
DESTINATIONS = [
    {
        "id": "LON",
        "name": "Lonavala & Khandala",
        "category": "Hill Station",
        "base_capacity": 10000,
        "base_inflow": 4800,
        "monsoon_multiplier": 1.65,  # High monsoon attraction (waterfalls)
        "weekend_multiplier": 2.10,
        "base_temp": 24.0,
        "rain_intensity": 1.4
    },
    {
        "id": "MAT",
        "name": "Matheran Eco-Zone",
        "category": "Hill Station",
        "base_capacity": 5000,
        "base_inflow": 1200,
        "monsoon_multiplier": 1.25,
        "weekend_multiplier": 1.70,
        "base_temp": 25.0,
        "rain_intensity": 1.3
    },
    {
        "id": "BHA",
        "name": "Bhandardara Serene Haven",
        "category": "Hill Station",
        "base_capacity": 4000,
        "base_inflow": 750,
        "monsoon_multiplier": 1.40,
        "weekend_multiplier": 1.50,
        "base_temp": 23.0,
        "rain_intensity": 1.2
    },
    {
        "id": "ALB",
        "name": "Alibaug Coastal Hub",
        "category": "Coastal",
        "base_capacity": 8000,
        "base_inflow": 3900,
        "monsoon_multiplier": 0.65,  # Coastal beach demand drops in monsoon
        "weekend_multiplier": 2.20,
        "base_temp": 29.0,
        "rain_intensity": 1.1
    },
    {
        "id": "KAS",
        "name": "Kashid & Murud Waters",
        "category": "Coastal",
        "base_capacity": 5000,
        "base_inflow": 1100,
        "monsoon_multiplier": 0.60,
        "weekend_multiplier": 1.65,
        "base_temp": 29.5,
        "rain_intensity": 1.1
    },
    {
        "id": "MAH",
        "name": "Mahabaleshwar Plateau",
        "category": "Hill Station",
        "base_capacity": 12000,
        "base_inflow": 5200,
        "monsoon_multiplier": 1.45,
        "weekend_multiplier": 2.05,
        "base_temp": 20.0,
        "rain_intensity": 1.5
    },
    {
        "id": "TAP",
        "name": "Tapola & Koyna Backwaters",
        "category": "Hill Station",
        "base_capacity": 3500,
        "base_inflow": 580,
        "monsoon_multiplier": 1.30,
        "weekend_multiplier": 1.40,
        "base_temp": 22.0,
        "rain_intensity": 1.3
    }
]

# Major Indian Gazetted Holidays and High-Traffic Long Weekends (2025 - 2026)
HIGH_IMPACT_HOLIDAYS = {
    (1, 26),  # Republic Day
    (3, 14),  # Holi (approx 2025)
    (4, 14),  # Ambedkar Jayanti
    (5, 1),   # Maharashtra Day
    (8, 15),  # Independence Day
    (8, 27),  # Ganesh Chaturthi
    (10, 2),  # Gandhi Jayanti
    (10, 20), (10, 21), (10, 22), # Diwali long weekend
    (11, 5),  # Guru Nanak Jayanti
    (12, 24), (12, 25), (12, 31), (1, 1), # Year-end holidays
}

def generate_telemetry_dataset(start_date: datetime, total_days: int = 548):
    """
    Generates hourly records for 18 months (~548 days * 24h = 13,152 hours) per destination.
    Total records: 13,152 * 7 = 92,064 rows.
    """
    print(f"Generating {total_days} days of hourly multi-sensor telemetry starting {start_date.strftime('%Y-%m-%d')}...")
    
    rows = []
    
    for d in DESTINATIONS:
        dest_id = d["id"]
        base_cap = d["base_capacity"]
        base_inflow = d["base_inflow"]
        is_hill = (d["category"] == "Hill Station")
        
        # Track continuous visitor state
        current_visitors = base_inflow * 0.45
        
        for day_offset in range(total_days):
            current_day = start_date + timedelta(days=day_offset)
            month = current_day.month
            day = current_day.day
            weekday = current_day.weekday()
            is_weekend = int(weekday in [5, 6])
            is_holiday = int((month, day) in HIGH_IMPACT_HOLIDAYS)
            is_monsoon = int(month in [6, 7, 8, 9])
            
            # Daily seasonal temperature baseline
            month_temp_shift = math.sin((month - 1) / 12.0 * 2 * math.pi) * 3.5
            day_base_temp = d["base_temp"] - month_temp_shift
            
            # Daily monsoon rain probability
            is_rainy_day = (random.random() < 0.70) if is_monsoon else (random.random() < 0.12)
            
            for hour in range(24):
                current_time = current_day + timedelta(hours=hour)
                
                # Diurnal temperature cycle (peaks at 14:00, coolest at 05:00)
                diurnal_temp = math.sin((hour - 8) / 24.0 * 2 * math.pi) * 4.5
                temp_c = round(day_base_temp + diurnal_temp + np.random.normal(0, 0.8), 1)
                
                # Rainfall simulation
                if is_rainy_day and (11 <= hour <= 19 or random.random() < 0.35):
                    base_rain = (15.0 if is_monsoon else 3.0) * d["rain_intensity"]
                    rain_mm = round(max(0.0, base_rain * np.random.exponential(0.8)), 1)
                else:
                    rain_mm = 0.0
                    
                # Wind speed (km/h)
                wind_kmh = round(max(4.0, 12.0 + (6.0 if is_monsoon else 0.0) + np.random.normal(0, 3.0)), 1)
                
                # Weather hazard index [0.0 to 1.0]
                hazard_score = round(min(1.0, (rain_mm / 45.0) * 0.7 + (wind_kmh / 55.0) * 0.3), 2)
                
                # Diurnal Footfall Curve (peaks 11:00 - 16:00 on weekends)
                if 10 <= hour <= 17:
                    hour_surge = 1.35 + 0.35 * math.sin((hour - 10) / 7.0 * math.pi)
                elif 18 <= hour <= 21:
                    hour_surge = 1.10
                elif 6 <= hour <= 9:
                    hour_surge = 0.70
                else:
                    hour_surge = 0.25
                    
                # Macro Multipliers
                weekend_mult = d["weekend_multiplier"] if is_weekend else 1.0
                holiday_mult = 1.50 if is_holiday else 1.0
                monsoon_mult = d["monsoon_multiplier"] if is_monsoon else 1.0
                
                # Weather suppression: heavy rain dampens day-trippers
                weather_dampener = max(0.40, 1.0 - (hazard_score * 0.65))
                
                target_hourly_inflow = (
                    base_inflow
                    * hour_surge
                    * weekend_mult
                    * holiday_mult
                    * monsoon_mult
                    * weather_dampener
                )
                
                # Stochastic noise
                noisy_inflow = max(20, int(target_hourly_inflow * np.random.normal(1.0, 0.08)))
                
                # Update visitor state: inflow minus natural outflow based on dwell hours (~3.5h)
                outflow = current_visitors / 3.5
                current_visitors = max(50.0, current_visitors + (noisy_inflow - outflow))
                active_visitors = int(current_visitors)
                
                # Traffic delay factor (TomTom correlation)
                # Traffic surges when visitors surge + rain hazard narrows ghat roads
                surge_ratio = min(2.5, active_visitors / (base_cap * 0.6))
                traffic_delay = round(max(1.0, 1.0 + (surge_ratio - 0.7) * 0.9 + hazard_score * 0.4), 2)
                traffic_delay = max(1.0, min(3.5, traffic_delay))
                
                # Highway vehicle inflow rate (vph)
                highway_vph = int(min(3200, 350 + (active_visitors / 3.2) * (1.2 if is_weekend else 0.8)))
                
                # Parking occupancy pct
                parking_pct = min(100, int((active_visitors / base_cap) * 110))
                
                # Dynamic Carrying Capacity (DCC) Threshold
                # DCC shrinks with weather hazard and traffic bottlenecks
                env_mod = max(0.40, 1.0 - 0.60 * hazard_score)
                traffic_mod = max(0.50, 1.0 / traffic_delay)
                infra_mod = 0.95
                
                dcc_threshold = int(base_cap * env_mod * traffic_mod * infra_mod)
                dcc_load_ratio = round(active_visitors / max(dcc_threshold, 1), 3)
                
                rows.append({
                    "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "destination_id": dest_id,
                    "destination_name": d["name"],
                    "category": d["category"],
                    "base_capacity": base_cap,
                    "hour": hour,
                    "day_of_week": weekday,
                    "month": month,
                    "is_weekend": is_weekend,
                    "is_holiday": is_holiday,
                    "is_monsoon": is_monsoon,
                    "temperature_c": temp_c,
                    "rainfall_mm": rain_mm,
                    "wind_kmh": wind_kmh,
                    "weather_hazard_score": hazard_score,
                    "traffic_delay_factor": traffic_delay,
                    "highway_ingress_vph": highway_vph,
                    "parking_occupancy_pct": parking_pct,
                    "active_visitors": active_visitors,
                    "dcc_threshold": dcc_threshold,
                    "dcc_load_ratio": dcc_load_ratio,
                    "is_critical_breach": int(dcc_load_ratio >= 0.85)
                })

    df = pd.DataFrame(rows)
    print(f"Dataset generated: {len(df):,} total hourly observations across {len(DESTINATIONS)} destinations.")
    
    # Sort chronologically by destination then timestamp to compute lead targets cleanly
    df["dt"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values(by=["destination_id", "dt"]).reset_index(drop=True)
    
    # Compute multi-horizon predictive targets (t+1h and t+12h ahead)
    print("Computing forward-looking predictive targets (t+1h, t+12h, and 4-hour critical window)...")
    df["target_visitors_1h"] = df.groupby("destination_id")["active_visitors"].shift(-1)
    df["target_visitors_12h"] = df.groupby("destination_id")["active_visitors"].shift(-12)
    df["target_dcc_ratio_1h"] = df.groupby("destination_id")["dcc_load_ratio"].shift(-1)
    df["target_dcc_ratio_12h"] = df.groupby("destination_id")["dcc_load_ratio"].shift(-12)
    
    # 4-hour forward lookahead for critical breach alert (any breach in [t+1..t+4])
    def compute_forward_breach(sub_df):
        is_crit = sub_df["is_critical_breach"].values
        n = len(is_crit)
        forward_any = np.zeros(n, dtype=int)
        for i in range(n):
            window = is_crit[i+1 : min(i+5, n)]
            if len(window) > 0 and np.any(window == 1):
                forward_any[i] = 1
        sub_df["target_breach_next_4h"] = forward_any
        return sub_df

    df = df.groupby("destination_id", group_keys=False).apply(compute_forward_breach)
    
    # Drop rows at the tail where 12-hour targets are NaN
    df = df.dropna(subset=["target_visitors_1h", "target_visitors_12h"]).drop(columns=["dt"])
    
    print(f"Final clean dataset shape: {df.shape[0]:,} rows x {df.shape[1]} columns.")
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"Saved dataset successfully to: {OUTPUT_CSV}")
    return df

if __name__ == "__main__":
    # Start 18 months prior to today
    start_point = datetime.now() - timedelta(days=548)
    generate_telemetry_dataset(start_point, total_days=548)
