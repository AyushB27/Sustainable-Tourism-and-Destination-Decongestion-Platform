import json
from datetime import datetime
from ..database import get_db_connection

def log_event(event_type: str, source_domain: str, entity_type: str, entity_id: str = None, payload: dict = None) -> bool:
    """
    Records an internal domain event in SQLite for loose coupling,
    auditability, and privacy-preserving authority/NGO analytics.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        now_iso = datetime.now().isoformat()
        payload_str = json.dumps(payload or {})
        cursor.execute("""
        INSERT INTO domain_events (event_type, source_domain, entity_type, entity_id, payload_json, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (event_type, source_domain, entity_type, entity_id or "", payload_str, now_iso))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"[EventService] Error logging event {event_type}: {e}")
        return False

def get_recent_events(limit: int = 50, event_type: str = None) -> list:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if event_type:
            cursor.execute("""
            SELECT * FROM domain_events WHERE event_type = ? ORDER BY id DESC LIMIT ?
            """, (event_type, limit))
        else:
            cursor.execute("""
            SELECT * FROM domain_events ORDER BY id DESC LIMIT ?
            """, (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]
    except Exception:
        return []
