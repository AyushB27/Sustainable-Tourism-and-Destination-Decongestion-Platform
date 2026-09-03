import time
import threading
from datetime import datetime
from .database import get_db_connection
from .config import INITIAL_DESTINATIONS
from .pipelines.weather_pipeline import fetch_live_weather
from .pipelines.traffic_pipeline import fetch_live_traffic_delay
from .pipelines.footfall_pipeline import fetch_live_footfall, scan_osm_amenities
from .pipelines.ogd_india import fetch_ogd_tourism_benchmarks
from .engine.dcc_calculator import calculate_dcc_metrics

_worker_thread = None
_stop_event = threading.Event()

# In-memory latest telemetry cache for instant sub-millisecond API responses
_telemetry_cache = {
    "last_updated": None,
    "destinations": [],
    "ogd_benchmarks": {}
}

def sync_telemetry_once():
    """Executes a full ETL pipeline cycle across all destinations."""
    global _telemetry_cache
    now = datetime.now()
    is_weekend = now.weekday() >= 5
    results = []
    ogd_meta = fetch_ogd_tourism_benchmarks()

    for d in INITIAL_DESTINATIONS:
        weather = fetch_live_weather(d["lat"], d["lon"])
        traffic = fetch_live_traffic_delay(d["lat"], d["lon"])
        footfall = fetch_live_footfall(d["name"])
        osm = scan_osm_amenities(d["lat"], d["lon"])

        traffic_mult = traffic["delay_factor"]
        footfall_mult = footfall["footfall_factor"]
        weekend_mult = 1.75 if is_weekend else 1.0

        calculated_inflow = int(d["base_inflow"] * traffic_mult * footfall_mult * weekend_mult)
        metrics = calculate_dcc_metrics(
            calculated_inflow,
            d["base_capacity"],
            weather["hazard_score"],
            d["dwell_hrs"]
        )

        record = {
            "id": d["id"],
            "name": d["name"],
            "category": d["category"],
            "district": d["district"],
            "tagline": d["tagline"],
            "description": d["description"],
            "image_url": d["image_url"],
            "coordinates": [d["lat"], d["lon"]],
            "physical_capacity": d["base_capacity"],
            "current_inflow": calculated_inflow,
            "dcc_score": metrics["dcc_score"],
            "status": metrics["status"],
            "capacity_utilization": metrics["capacity_utilization"],
            "estimated_wait_minutes": metrics["wait_time_minutes"],
            "live_sensors": {
                "weather": weather,
                "traffic": traffic,
                "footfall": footfall,
                "osm_amenities": osm
            },
            "features": d["features"],
            "avg_dwell_time_hours": d["dwell_hrs"]
        }
        results.append(record)

    # Log into SQLite in a single transaction with automatic close
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        for d, rec in zip(INITIAL_DESTINATIONS, results):
            weather = rec["live_sensors"]["weather"]
            traffic_mult = rec["live_sensors"]["traffic"]["delay_factor"]
            footfall_mult = rec["live_sensors"]["footfall"]["footfall_factor"]
            cursor.execute("""
            INSERT INTO sensor_readings (
                destination_id, timestamp, temperature_c, rain_mm, wind_kmh,
                hazard_score, traffic_delay_factor, footfall_factor,
                calculated_inflow, dcc_score, status, wait_minutes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                d["id"], now.isoformat(), weather["temperature_c"], weather["rain_mm"],
                weather["wind_kmh"], weather["hazard_score"], traffic_mult, footfall_mult,
                rec["current_inflow"], rec["dcc_score"], rec["status"], rec["estimated_wait_minutes"]
            ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Worker] Database log notice: {e}")

    _telemetry_cache = {
        "last_updated": now.isoformat(),
        "destinations": results,
        "ogd_benchmarks": ogd_meta
    }
    print(f"[Telemetry Worker] Successfully synced live sensors at {now.strftime('%H:%M:%S')}")
    return _telemetry_cache

def get_latest_telemetry():
    """Returns in-memory cached telemetry, or triggers an initial sync if empty."""
    global _telemetry_cache
    if not _telemetry_cache["destinations"]:
        sync_telemetry_once()
    return _telemetry_cache

def _worker_loop(interval_seconds=60):
    while not _stop_event.is_set():
        try:
            sync_telemetry_once()
        except Exception as e:
            print(f"[Worker] Error during telemetry sync: {e}")
        _stop_event.wait(interval_seconds)

def start_background_telemetry_worker(interval_seconds=60):
    """Starts the background telemetry polling thread."""
    global _worker_thread
    if _worker_thread is None or not _worker_thread.is_alive():
        _stop_event.clear()
        _worker_thread = threading.Thread(
            target=_worker_loop,
            args=(interval_seconds,),
            daemon=True
        )
        _worker_thread.start()
        print(f"[Background Worker] Telemetry worker started (interval: {interval_seconds}s)")
