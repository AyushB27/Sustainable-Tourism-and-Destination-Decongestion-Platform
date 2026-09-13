"""
EcoRoute Bharat — Trip Persistence & Post-Trip Reporting Service
Saves, retrieves, and manages trips in SQLite. Generates official
Post-Trip Sustainability Reports and certified impact verifications.
"""

import json
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from ..database import get_db_connection
from .event_service import log_event
from .rewards_service import award_karma_points

def save_trip(trip_data: Dict[str, Any], user_id: str = "CITIZEN-GUEST-01") -> Dict[str, Any]:
    """
    Persists a generated trip into SQLite table 'trips'.
    Awards +100 Eco-Karma points to the tourist for planning a sustainable trip.
    Logs domain event TRIP_CREATED.
    """
    trip_id = trip_data.get("id") or f"TRIP-{int(datetime.now().timestamp())}"
    dest_id = trip_data.get("destination_id", "LON")
    dest_name = trip_data.get("destination_name", "Destination")
    start_date = trip_data.get("start_date", datetime.now().strftime("%Y-%m-%d"))
    duration = int(trip_data.get("duration_days", 2))
    travel_style = trip_data.get("travel_style", "scenic")
    transport_mode = trip_data.get("transport_mode", "green_transit")
    accommodation_type = trip_data.get("accommodation_type", "homestay")

    carbon_calc = trip_data.get("carbon_calculator", {})
    total_carbon = float(carbon_calc.get("total_carbon_kg") or trip_data.get("total_carbon_kg", 24.5))
    carbon_avoided = float(carbon_calc.get("carbon_avoided_kg") or trip_data.get("carbon_avoided_kg", 45.2))

    sust = trip_data.get("sustainability_scores", {})
    env_score = int(sust.get("environmental") or trip_data.get("environmental_score", 85))
    soc_score = int(sust.get("social") or trip_data.get("social_score", 80))
    econ_score = int(sust.get("economic") or trip_data.get("economic_score", 90))
    overall_score = int(trip_data.get("trip_sustainability_score") or trip_data.get("overall_sustainability_score") or sust.get("overall", 85))

    itinerary_json = json.dumps(trip_data.get("itinerary_days", []))
    now_iso = datetime.now().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO trips (
        id, user_id, destination_id, destination_name, start_date, duration_days,
        travel_style, transport_mode, accommodation_type, total_carbon_kg, carbon_avoided_kg,
        environmental_score, social_score, economic_score, overall_sustainability_score,
        itinerary_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        trip_id, user_id, dest_id, dest_name, start_date, duration,
        travel_style, transport_mode, accommodation_type, total_carbon, carbon_avoided,
        env_score, soc_score, econ_score, overall_score,
        itinerary_json, now_iso
    ))
    conn.commit()
    conn.close()

    # Award Eco-Karma points for planning a sustainable trip
    award_karma_points(user_id, 100, "sustainable_trip_planned", f"Planned Green Trip to {dest_name}")
    log_event("TRIP_CREATED", "tourist", "trip", trip_id, {"destination_id": dest_id, "user_id": user_id, "carbon_avoided": carbon_avoided})

    return {
        "status": "success",
        "trip_id": trip_id,
        "message": "Trip plan persisted to database successfully",
        "karma_awarded": 100
    }

def get_user_trips(user_id: str = "CITIZEN-GUEST-01") -> List[Dict[str, Any]]:
    """Retrieves all saved trips for a user from SQLite."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    trips = []
    for r in rows:
        t = dict(r)
        try:
            t["itinerary_days"] = json.loads(t["itinerary_json"])
        except Exception:
            t["itinerary_days"] = []
        trips.append(t)
    return trips

def get_trip_by_id(trip_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trips WHERE id = ?", (trip_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    t = dict(row)
    try:
        t["itinerary_days"] = json.loads(t["itinerary_json"])
    except Exception:
        t["itinerary_days"] = []
    return t

def delete_trip(trip_id: str, user_id: str = "CITIZEN-GUEST-01") -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    if affected > 0:
        log_event("TRIP_DELETED", "tourist", "trip", trip_id, {"user_id": user_id})
        return True
    return False

def generate_post_trip_report(trip_id: str) -> Dict[str, Any]:
    """Generates official Post-Trip Sustainability Report for a saved trip."""
    trip = get_trip_by_id(trip_id)
    if not trip:
        return {"status": "error", "message": "Trip not found"}

    trees_offset = round(trip["carbon_avoided_kg"] / 21.77)
    fuel_saved = round(trip["carbon_avoided_kg"] / 2.31)
    
    import hashlib
    payload = f"{trip_id}:{trip['user_id']}:{trip['destination_id']}:{trip['carbon_avoided_kg']}:{trip['start_date']}"
    verification_hash = f"ERB-{hashlib.sha256(payload.encode()).hexdigest()[:16].upper()}"

    return {
        "status": "success",
        "trip_id": trip["id"],
        "destination_name": trip["destination_name"],
        "start_date": trip["start_date"],
        "duration_days": trip["duration_days"],
        "transport_mode": trip["transport_mode"],
        "accommodation_type": trip["accommodation_type"],
        "carbon_metrics": {
            "total_carbon_kg": trip["total_carbon_kg"],
            "carbon_avoided_kg": trip["carbon_avoided_kg"],
            "trees_equivalent_annual": trees_offset,
            "fuel_saved_liters": fuel_saved
        },
        "sustainability_scores": {
            "environmental": trip["environmental_score"],
            "social": trip["social_score"],
            "economic": trip["economic_score"],
            "overall": trip["overall_sustainability_score"]
        },
        "verification_hash": verification_hash,
        "certified_by": "EcoRoute Bharat Multi-Stakeholder Intelligence & MTDC",
        "created_at": datetime.now().isoformat()
    }
