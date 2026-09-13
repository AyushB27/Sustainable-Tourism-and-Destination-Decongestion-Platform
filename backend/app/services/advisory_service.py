"""
EcoRoute Bharat — Advisory & Regulatory Service
Provides secure, data-driven gazette advisory management.
Enforces strict authentication and role checking.
"""

from datetime import datetime
from typing import Dict, Any, List
from ..database import get_db_connection
from .event_service import log_event

def broadcast_advisory(data: Dict[str, Any], user: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Broadcasts an official district advisory with strict authentication.
    Rejects unauthenticated requests or tourists attempting to issue advisories.
    """
    if not user or not isinstance(user, dict):
        return {
            "status": "error",
            "message": "Authentication required: Only authorized district officials can issue official advisories."
        }

    role = user.get("role", "")
    if role not in ["authority", "admin", "collector", "director"]:
        return {
            "status": "error",
            "message": "Permission denied: Citizen tourists or providers cannot broadcast regulatory gazette advisories."
        }

    adv_id = f"ADV-{int(datetime.now().timestamp())}"
    destination_id = data.get("destination_id", "ALL")
    destination_name = data.get("destination_name", "All Western Ghats Corridors")
    severity = data.get("severity", "high")
    title = data.get("title", "Official Regulatory Advisory")
    message = data.get("message", "")
    author = user.get("name") or user.get("designation") or "District Magistrate"
    expires_at = data.get("expires_at", "2026-10-31T23:59:59")
    now_iso = datetime.now().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO gazette_advisories (
        id, destination_id, destination_name, severity, title, message, author, active, created_at, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    """, (adv_id, destination_id, destination_name, severity, title, message, author, now_iso, expires_at))
    conn.commit()
    conn.close()

    log_event("ADVISORY_CREATED", "authority", "advisory", adv_id, {
        "destination_id": destination_id,
        "severity": severity,
        "title": title,
        "author": author
    })

    return {
        "status": "success",
        "advisory_id": adv_id,
        "message": f"Advisory {adv_id} published successfully across all stakeholder feeds."
    }

def get_active_advisories(destination_id: str = None) -> List[Dict[str, Any]]:
    """Fetches active gazette advisories."""
    conn = get_db_connection()
    cursor = conn.cursor()
    if destination_id and destination_id != "ALL":
        cursor.execute("""
        SELECT * FROM gazette_advisories 
        WHERE active = 1 AND (destination_id = ? OR destination_id = 'ALL')
        ORDER BY created_at DESC
        """, (destination_id,))
    else:
        cursor.execute("SELECT * FROM gazette_advisories WHERE active = 1 ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
