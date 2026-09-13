"""
EcoRoute Bharat — Provider & Hospitality Service
Manages local homestays, tour operators, room inventory,
and persistent SQLite occupancy synchronization.
"""

from datetime import datetime
from typing import Dict, Any
from ..database import get_db
from .event_service import log_event

def update_destination_occupancy(
    destination_id: str,
    occupancy_pct: float,
    available_rooms: int = 50,
    provider_id: str = "MTDC-HOMESTAY-01"
) -> Dict[str, Any]:
    """
    Updates room occupancy percentage and available rooms for a destination.
    CRITICAL: Updates persistent SQLite database so changes survive restarts and page refreshes.
    """
    # Validation constraints
    if not (0.0 <= float(occupancy_pct) <= 100.0):
        return {"status": "error", "message": f"occupancy_pct must be between 0 and 100, got {occupancy_pct}"}
    if int(available_rooms) < 0:
        return {"status": "error", "message": f"available_rooms cannot be negative, got {available_rooms}"}

    dest_id = destination_id.upper()
    now_iso = datetime.now().isoformat()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        UPDATE destinations 
        SET hotel_occupancy_pct = ?, available_rooms = ?
        WHERE id = ?
        """, (float(occupancy_pct), int(available_rooms), dest_id))
        affected = cursor.rowcount
        conn.commit()

    # Also update in-memory telemetry cache if running
    try:
        from ..background_worker import _telemetry_cache
        for d in _telemetry_cache.get("destinations", []):
            if d["id"] == dest_id:
                d["hotel_occupancy_pct"] = occupancy_pct
                d["available_rooms"] = available_rooms
                break
    except Exception:
        pass

    log_event("PROVIDER_OCCUPANCY_UPDATED", "provider", "destination", dest_id, {
        "occupancy_pct": occupancy_pct,
        "available_rooms": available_rooms,
        "provider_id": provider_id,
        "timestamp": now_iso
    })

    return {
        "status": "success",
        "destination_id": dest_id,
        "new_occupancy_pct": occupancy_pct,
        "available_rooms": available_rooms,
        "persisted_to_sqlite": bool(affected > 0),
        "message": f"Occupancy for {dest_id} saved permanently to database."
    }
