import sqlite3
import json
from datetime import datetime
from .config import DB_PATH, INITIAL_DESTINATIONS

def get_db_connection():
    """
    Returns a SQLite connection with Row factory enabled and a 30-second timeout.
    """
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initializes SQLite schema and seeds initial baseline data."""
    conn = get_db_connection()
    try:
        # Enable WAL mode once during initialization
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")
    except Exception:
        pass

    cursor = conn.cursor()

    # 1. Destinations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS destinations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        base_capacity INTEGER NOT NULL,
        base_inflow INTEGER NOT NULL,
        dwell_hrs REAL NOT NULL,
        features_json TEXT NOT NULL,
        district TEXT NOT NULL,
        tagline TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    )
    """)

    # 2. Live & Historical Sensor Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destination_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        temperature_c REAL,
        rain_mm REAL,
        wind_kmh REAL,
        hazard_score REAL,
        traffic_delay_factor REAL,
        footfall_factor REAL,
        calculated_inflow INTEGER,
        dcc_score REAL,
        status TEXT,
        wait_minutes INTEGER,
        FOREIGN KEY (destination_id) REFERENCES destinations (id)
    )
    """)

    # 3. Issued Green Yatra Digital Passes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS green_yatra_passes (
        id TEXT PRIMARY KEY,
        destination_id TEXT NOT NULL,
        destination_name TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        carbon_saved_kg REAL NOT NULL,
        issued_at TEXT NOT NULL,
        fast_track_qr_code TEXT NOT NULL
    )
    """)

    # 4. Official Gazette Advisories Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS gazette_advisories (
        id TEXT PRIMARY KEY,
        destination_id TEXT NOT NULL,
        destination_name TEXT NOT NULL,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        author TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
    )
    """)

    # 5. MTDC Homestay & Operator Promotions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS promotions (
        id TEXT PRIMARY KEY,
        destination_id TEXT NOT NULL,
        destination_name TEXT NOT NULL,
        discount_pct INTEGER NOT NULL,
        title TEXT NOT NULL,
        badge TEXT NOT NULL,
        description TEXT NOT NULL,
        code TEXT NOT NULL,
        valid_until TEXT NOT NULL,
        business_name TEXT NOT NULL,
        business_type TEXT NOT NULL
    )
    """)

    # Seed Destinations if not populated
    cursor.execute("SELECT COUNT(*) FROM destinations")
    if cursor.fetchone()[0] == 0:
        for d in INITIAL_DESTINATIONS:
            cursor.execute("""
            INSERT INTO destinations (
                id, name, category, lat, lon, base_capacity, base_inflow, dwell_hrs,
                features_json, district, tagline, description, image_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                d["id"], d["name"], d["category"], d["lat"], d["lon"],
                d["base_capacity"], d["base_inflow"], d["dwell_hrs"],
                json.dumps(d["features"]), d["district"], d["tagline"],
                d["description"], d["image_url"]
            ))

    # Seed Initial Advisories if empty
    cursor.execute("SELECT COUNT(*) FROM gazette_advisories")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO gazette_advisories (
            id, destination_id, destination_name, severity, title, message, author, active, created_at
        ) VALUES 
        ('ADV-01', 'LON', 'Lonavala & Khandala', 'high', 'Expressway Ghat Congestion Alert',
         'Heavy monsoon vehicular bottleneck between Khandala tunnel and Rajmachi point. Diversions active.',
         'Pune District Collectorate', 1, ?),
        ('ADV-02', 'MAH', 'Mahabaleshwar Plateau', 'medium', 'Parking Saturation Advisory',
         'Venna Lake and main market parking reaches 92% occupancy. Use municipal shuttle feeder.',
         'Satara District Police', 1, ?)
        """, (datetime.now().isoformat(), datetime.now().isoformat()))

    conn.commit()
    conn.close()

# Auto-initialize database on import
try:
    init_database()
except Exception as e:
    print(f"[Database] Init notice: {e}")
