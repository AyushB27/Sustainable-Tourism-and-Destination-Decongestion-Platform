"""
EcoRoute Bharat — Waste & Cleanliness Intelligence Service
Manages citizen zero-waste geo-reporting, municipal dispatch queue,
squad assignment, and resolution impact tracking.
"""

from datetime import datetime
from typing import Dict, Any, List
from ..database import get_db_connection
from .event_service import log_event
from .rewards_service import award_karma_points

def create_waste_report(report_data: Dict[str, Any], user_id: str = "CITIZEN-GUEST-01") -> Dict[str, Any]:
    """
    Submits a citizen waste report, awards +100 Eco-Karma points,
    and queues it for District Authority / NGO dispatch.
    """
    report_id = f"WST-{int(datetime.now().timestamp())}"
    dest_id = report_data.get("destination_id", "LON")
    dest_name = report_data.get("destination_name", "Western Ghats Corridor")
    reporter = report_data.get("reporter_name", "Eco Citizen")
    category = report_data.get("category", "plastic_waste")
    severity = report_data.get("severity", "medium")
    desc = report_data.get("description", "Uncollected plastic packaging along trail.")
    lat = float(report_data.get("lat", 18.75))
    lon = float(report_data.get("lon", 73.40))
    now_iso = datetime.now().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO waste_reports (
        id, destination_id, destination_name, reporter_name, category,
        severity, description, lat, lon, status, karma_awarded, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 100, ?)
    """, (report_id, dest_id, dest_name, reporter, category, severity, desc, lat, lon, now_iso))
    conn.commit()
    conn.close()

    # Award Eco-Karma points
    award_karma_points(user_id, 100, "waste_report", f"Reported {category} at {dest_name}")
    log_event("WASTE_REPORTED", "waste", "incident", report_id, {
        "destination_id": dest_id,
        "category": category,
        "severity": severity,
        "status": "pending"
    })

    return {
        "status": "success",
        "report_id": report_id,
        "incident_id": report_id,
        "message": "Incident logged. Municipal clean-up squad alerted.",
        "karma_awarded": 100
    }

def get_waste_incidents(status_filter: str = None) -> List[Dict[str, Any]]:
    """Retrieves all waste incidents for Authority and NGO consoles."""
    conn = get_db_connection()
    cursor = conn.cursor()
    if status_filter and status_filter != "all":
        cursor.execute("SELECT * FROM waste_reports WHERE status = ? ORDER BY created_at DESC", (status_filter,))
    else:
        cursor.execute("SELECT * FROM waste_reports ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_incident_status(incident_id: str, new_status: str, note: str = "") -> Dict[str, Any]:
    """Updates incident status (pending -> dispatched -> resolved)."""
    now_iso = datetime.now().isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()
    if new_status == "dispatched":
        cursor.execute("""
        UPDATE waste_reports SET status = 'dispatched', dispatched_at = ? WHERE id = ?
        """, (now_iso, incident_id))
    elif new_status == "resolved":
        cursor.execute("""
        UPDATE waste_reports SET status = 'resolved', resolved_at = ? WHERE id = ?
        """, (now_iso, incident_id))
    else:
        cursor.execute("UPDATE waste_reports SET status = ? WHERE id = ?", (new_status, incident_id))
    
    affected = cursor.rowcount
    conn.commit()
    conn.close()

    if affected > 0:
        event_type = "WASTE_RESOLVED" if new_status == "resolved" else "WASTE_STATUS_CHANGED"
        log_event(event_type, "authority", "incident", incident_id, {"new_status": new_status, "note": note})
        return {"status": "success", "incident_id": incident_id, "new_status": new_status}
    
    return {"status": "error", "message": "Incident not found"}
