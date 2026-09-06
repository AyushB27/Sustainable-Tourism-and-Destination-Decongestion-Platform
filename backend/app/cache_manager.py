import os
import json
import sqlite3
from datetime import datetime, timedelta
from .database import get_db_connection
from .config import DATA_DIR

# Backup directory for secondary file-based cache persistence
CACHE_BACKUP_DIR = os.path.join(DATA_DIR, "cache_backups")
os.makedirs(CACHE_BACKUP_DIR, exist_ok=True)

# Default TTL (Time-To-Live) in seconds per sensor API source
DEFAULT_TTLS = {
    "weather": 1800,       # 30 minutes: Open-Meteo hourly observations
    "traffic": 1200,       # 20 minutes: TomTom traffic delay factor
    "footfall": 21600,     # 6 hours: BestTime attraction busyness curves
    "osm": 86400           # 24 hours: OpenStreetMap amenity/parking nodes
}

# Runtime statistics tracker
_cache_stats = {
    "hits": 0,
    "misses": 0,
    "tokens_saved": 0
}


def _safe_filename(key: str) -> str:
    """Converts a cache key into a safe filename."""
    return key.replace(":", "_").replace("/", "_").replace("\\", "_") + ".json"


def get_cached_telemetry(cache_key: str) -> dict | None:
    """
    Checks SQLite for an active, unexpired cache entry.
    Falls back to secondary JSON disk backup if needed.
    Returns parsed dictionary or None if expired/missing.
    """
    global _cache_stats
    now_iso = datetime.now().isoformat()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT payload_json, fetched_at, expires_at, api_source, destination_id
            FROM api_cache
            WHERE cache_key = ? AND expires_at > ?
        """, (cache_key, now_iso))
        row = cursor.fetchone()
        conn.close()

        if row:
            data = json.loads(row["payload_json"])
            data["is_cached"] = True
            data["cached_at"] = row["fetched_at"]
            data["expires_at"] = row["expires_at"]

            # Calculate seconds remaining
            exp_dt = datetime.fromisoformat(row["expires_at"])
            data["ttl_remaining_seconds"] = max(0, int((exp_dt - datetime.now()).total_seconds()))

            _cache_stats["hits"] += 1
            _cache_stats["tokens_saved"] += 1
            return data

    except Exception as e:
        print(f"[CacheManager] SQLite lookup warning: {e}")

    # Fallback to secondary JSON file backup
    file_path = os.path.join(CACHE_BACKUP_DIR, _safe_filename(cache_key))
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                backup = json.load(f)
            expires_at = backup.get("expires_at", "")
            if expires_at and expires_at > now_iso:
                payload = backup.get("payload", {})
                payload["is_cached"] = True
                payload["cached_at"] = backup.get("fetched_at", now_iso)
                payload["expires_at"] = expires_at
                exp_dt = datetime.fromisoformat(expires_at)
                payload["ttl_remaining_seconds"] = max(0, int((exp_dt - datetime.now()).total_seconds()))

                # Re-hydrate into SQLite
                set_cached_telemetry(
                    cache_key=cache_key,
                    destination_id=backup.get("destination_id", ""),
                    api_source=backup.get("api_source", "generic"),
                    payload=payload,
                    ttl_seconds=payload["ttl_remaining_seconds"]
                )

                _cache_stats["hits"] += 1
                _cache_stats["tokens_saved"] += 1
                return payload
        except Exception as e:
            print(f"[CacheManager] File backup read warning: {e}")

    _cache_stats["misses"] += 1
    return None


def set_cached_telemetry(
    cache_key: str,
    destination_id: str,
    api_source: str,
    payload: dict,
    ttl_seconds: int = None
):
    """
    Saves or updates telemetry in SQLite and creates a secondary JSON file backup.
    """
    if ttl_seconds is None:
        ttl_seconds = DEFAULT_TTLS.get(api_source, 1800)

    now = datetime.now()
    expires = now + timedelta(seconds=ttl_seconds)
    now_iso = now.isoformat()
    expires_iso = expires.isoformat()

    # Clean payload of transient caching meta before storing
    clean_payload = {k: v for k, v in payload.items() if k not in ("is_cached", "cached_at", "expires_at", "ttl_remaining_seconds")}
    payload_str = json.dumps(clean_payload)

    # 1. Persist to SQLite
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO api_cache (cache_key, destination_id, api_source, payload_json, fetched_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(cache_key) DO UPDATE SET
                destination_id = excluded.destination_id,
                api_source = excluded.api_source,
                payload_json = excluded.payload_json,
                fetched_at = excluded.fetched_at,
                expires_at = excluded.expires_at
        """, (cache_key, destination_id, api_source, payload_str, now_iso, expires_iso))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[CacheManager] Error writing to SQLite api_cache: {e}")

    # 2. Persist to secondary JSON disk file
    try:
        file_path = os.path.join(CACHE_BACKUP_DIR, _safe_filename(cache_key))
        backup_data = {
            "cache_key": cache_key,
            "destination_id": destination_id,
            "api_source": api_source,
            "fetched_at": now_iso,
            "expires_at": expires_iso,
            "payload": clean_payload
        }
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(backup_data, f, indent=2)
    except Exception as e:
        print(f"[CacheManager] Error writing file backup: {e}")


def purge_cache(cache_key: str = None, destination_id: str = None, api_source: str = None) -> int:
    """
    Purges cache entries from SQLite and matching backup files.
    If no filters are provided, purges all cached entries.
    """
    clauses = []
    params = []
    if cache_key:
        clauses.append("cache_key = ?")
        params.append(cache_key)
    if destination_id:
        clauses.append("destination_id = ?")
        params.append(destination_id)
    if api_source:
        clauses.append("api_source = ?")
        params.append(api_source)

    where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    deleted_count = 0
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"SELECT cache_key FROM api_cache {where_sql}", params)
        keys_to_delete = [row["cache_key"] for row in cursor.fetchall()]

        cursor.execute(f"DELETE FROM api_cache {where_sql}", params)
        deleted_count = cursor.rowcount
        conn.commit()
        conn.close()

        for k in keys_to_delete:
            fpath = os.path.join(CACHE_BACKUP_DIR, _safe_filename(k))
            if os.path.exists(fpath):
                try:
                    os.remove(fpath)
                except Exception:
                    pass
    except Exception as e:
        print(f"[CacheManager] Error during cache purge: {e}")

    return deleted_count


def get_cache_status() -> dict:
    """
    Returns current cache health, active entries with countdowns, and token saving stats.
    """
    now_dt = datetime.now()
    active_entries = []

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT cache_key, destination_id, api_source, fetched_at, expires_at
            FROM api_cache
            ORDER BY expires_at DESC
        """)
        rows = cursor.fetchall()
        conn.close()

        for r in rows:
            exp_dt = datetime.fromisoformat(r["expires_at"])
            remaining = int((exp_dt - now_dt).total_seconds())
            is_active = remaining > 0

            active_entries.append({
                "cache_key": r["cache_key"],
                "destination_id": r["destination_id"],
                "api_source": r["api_source"],
                "fetched_at": r["fetched_at"],
                "expires_at": r["expires_at"],
                "ttl_remaining_seconds": max(0, remaining),
                "is_active": is_active
            })
    except Exception as e:
        print(f"[CacheManager] Status query warning: {e}")

    total_requests = _cache_stats["hits"] + _cache_stats["misses"]
    hit_ratio = round((_cache_stats["hits"] / total_requests) * 100, 1) if total_requests > 0 else 0.0

    return {
        "status": "operational",
        "ttls_configured_seconds": DEFAULT_TTLS,
        "metrics": {
            "total_cached_entries": len(active_entries),
            "active_unexpired_entries": sum(1 for e in active_entries if e["is_active"]),
            "cache_hits": _cache_stats["hits"],
            "cache_misses": _cache_stats["misses"],
            "hit_ratio_pct": hit_ratio,
            "api_tokens_saved": _cache_stats["tokens_saved"]
        },
        "entries": active_entries
    }
