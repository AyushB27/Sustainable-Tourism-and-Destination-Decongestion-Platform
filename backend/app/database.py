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
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

from contextlib import contextmanager

@contextmanager
def get_db():
    """Context manager for database connections. Ensures connection is always closed."""
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

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
        created_at TEXT NOT NULL,
        expires_at TEXT,
        revoked_at TEXT
    )
    """)

    # Migration for existing DB: add expires_at and revoked_at if missing
    cursor.execute("PRAGMA table_info(gazette_advisories)")
    adv_cols = [row["name"] for row in cursor.fetchall()]
    if "expires_at" not in adv_cols:
        try:
            cursor.execute("ALTER TABLE gazette_advisories ADD COLUMN expires_at TEXT;")
        except Exception:
            pass
    if "revoked_at" not in adv_cols:
        try:
            cursor.execute("ALTER TABLE gazette_advisories ADD COLUMN revoked_at TEXT;")
        except Exception:
            pass

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

    # 6. Regional Demand Flows Table (Origin-Destination Movement Patterns)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS demand_flows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origin_spot_id TEXT NOT NULL,
        destination_spot_id TEXT NOT NULL,
        date TEXT NOT NULL,
        estimated_visitor_count INTEGER NOT NULL,
        source_tier TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # 7. Emergency Capacity Overrides Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS capacity_overrides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spot_id TEXT NOT NULL,
        original_capacity INTEGER NOT NULL,
        override_capacity INTEGER NOT NULL,
        reason TEXT,
        authority_id TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
    )
    """)

    # 8. Persistent API Telemetry Cache Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS api_cache (
        cache_key TEXT PRIMARY KEY,
        destination_id TEXT,
        api_source TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        fetched_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
    )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_api_cache_lookup ON api_cache (cache_key, expires_at);")

    # 9. Citizen Zero-Waste Reports Table (Pillar 3)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS waste_reports (
        id TEXT PRIMARY KEY,
        destination_id TEXT NOT NULL,
        destination_name TEXT NOT NULL,
        reporter_name TEXT NOT NULL,
        category TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'medium',
        description TEXT NOT NULL,
        photo_url TEXT,
        lat REAL,
        lon REAL,
        status TEXT NOT NULL DEFAULT 'pending',
        karma_awarded INTEGER NOT NULL DEFAULT 100,
        created_at TEXT NOT NULL,
        dispatched_at TEXT,
        resolved_at TEXT
    )
    """)

    # 10. Citizen Eco-Karma Points Ledger (Pillar 2 & Rewards)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS eco_karma_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        points_change INTEGER NOT NULL,
        activity_type TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # 11. Dynamic AI Spot Dossier Cache Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS spot_dossier_cache (
        destination_id TEXT PRIMARY KEY,
        dossier_json TEXT NOT NULL,
        source TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # 12. Persistent User Trips Table (Phase 3 & 4)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        destination_id TEXT NOT NULL,
        destination_name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        duration_days INTEGER NOT NULL DEFAULT 2,
        travel_style TEXT NOT NULL DEFAULT 'scenic',
        transport_mode TEXT NOT NULL DEFAULT 'green_transit',
        accommodation_type TEXT NOT NULL DEFAULT 'homestay',
        total_carbon_kg REAL NOT NULL DEFAULT 0.0,
        carbon_avoided_kg REAL NOT NULL DEFAULT 0.0,
        environmental_score INTEGER NOT NULL DEFAULT 85,
        social_score INTEGER NOT NULL DEFAULT 80,
        economic_score INTEGER NOT NULL DEFAULT 90,
        overall_sustainability_score INTEGER NOT NULL DEFAULT 85,
        itinerary_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # 13. System Domain Events Table (Decoupled Audit & Analytics)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS domain_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        source_domain TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        payload_json TEXT,
        timestamp TEXT NOT NULL
    )
    """)

    # 14. Provider Services & Live Occupancy Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS provider_services (
        id TEXT PRIMARY KEY,
        provider_id TEXT NOT NULL,
        destination_id TEXT NOT NULL,
        service_type TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 50,
        available INTEGER NOT NULL DEFAULT 25,
        occupancy_pct REAL NOT NULL DEFAULT 50.0,
        sustainability_rating REAL NOT NULL DEFAULT 4.5,
        updated_at TEXT NOT NULL
    )
    """)

    # 15. Community Experiences & Rural Livelihood Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS community_experiences (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        coordinator TEXT NOT NULL,
        price TEXT NOT NULL,
        retained_revenue TEXT NOT NULL,
        category TEXT DEFAULT 'Agro-Tourism',
        verified INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
    )
    """)

    # Seed community experiences if empty
    cursor.execute("SELECT COUNT(*) as count FROM community_experiences")
    if cursor.fetchone()["count"] == 0:
        initial_experiences = [
            ('EXP-01', 'Traditional Warli Rice-Paste Painting Masterclass', 'Jawhar Tribal Belt (Palghar)', 'Warli Gramin Mahila Bachat Gat', '₹450 / person', '95% directly retained in village', 'Tribal Art', 1, datetime.now().isoformat()),
            ('EXP-02', 'Vasota Rainforest Jungle Guide Collective', 'Tapola Backwaters (Satara)', 'Koyna Native Guide Union', '₹700 / group', '100% retained by native trackers', 'Eco-Trek', 1, datetime.now().isoformat()),
            ('EXP-03', 'Organic GI Strawberry Picking & Farm-To-Table Walk', 'Mahabaleshwar - Wai Valley', 'Shivsagar Strawberry Agro-FPO', '₹350 / basket', 'Direct farmer cooperative purchase', 'Agro-Tourism', 1, datetime.now().isoformat()),
            ('EXP-04', 'Malvani Coastal Fishermen Heritage Seafood Lunch', 'Tarkarli & Malvan Sanctuary', 'Sindhudurg Native Boatmen Guild', '₹500 / thali', 'Traditional coastal culinary support', 'Culinary Heritage', 1, datetime.now().isoformat())
        ]
        cursor.executemany("""
        INSERT INTO community_experiences (id, title, location, coordinator, price, retained_revenue, category, verified, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_experiences)

    # Ensure destinations table has occupancy persistence columns
    cursor.execute("PRAGMA table_info(destinations)")
    dest_cols = [row["name"] for row in cursor.fetchall()]
    if "hotel_occupancy_pct" not in dest_cols:
        try:
            cursor.execute("ALTER TABLE destinations ADD COLUMN hotel_occupancy_pct REAL DEFAULT 50.0;")
        except Exception:
            pass
    if "available_rooms" not in dest_cols:
        try:
            cursor.execute("ALTER TABLE destinations ADD COLUMN available_rooms INTEGER DEFAULT 50;")
        except Exception:
            pass

    # Performance indexes for high-frequency query paths
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_karma_user ON eco_karma_ledger(user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensor_dest_ts ON sensor_readings(destination_id, timestamp);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_waste_status ON waste_reports(status, destination_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_advisories_active ON gazette_advisories(active, destination_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_overrides_active ON capacity_overrides(spot_id, active);")

    # Upsert all 21+ Destinations so new locations are immediately populated
    for d in INITIAL_DESTINATIONS:
        cursor.execute("""
        INSERT INTO destinations (
            id, name, category, lat, lon, base_capacity, base_inflow, dwell_hrs,
            features_json, district, tagline, description, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            category = excluded.category,
            lat = excluded.lat,
            lon = excluded.lon,
            base_capacity = excluded.base_capacity,
            base_inflow = excluded.base_inflow,
            dwell_hrs = excluded.dwell_hrs,
            features_json = excluded.features_json,
            district = excluded.district,
            tagline = excluded.tagline,
            description = excluded.description,
            image_url = excluded.image_url
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
            id, destination_id, destination_name, severity, title, message, author, active, created_at, expires_at
        ) VALUES 
        ('ADV-01', 'LON', 'Lonavala & Khandala', 'high', 'Expressway Ghat Congestion Alert',
         'Heavy monsoon vehicular bottleneck between Khandala tunnel and Rajmachi point. Diversions active.',
         'Pune District Collectorate', 1, ?, '2026-09-30T23:59:59'),
        ('ADV-02', 'MAH', 'Mahabaleshwar Plateau', 'medium', 'Parking Saturation Advisory',
         'Venna Lake and main market parking reaches 92% occupancy. Use municipal shuttle feeder.',
         'Satara District Police', 1, ?, '2026-09-30T23:59:59'),
        ('ADV-03', 'KAA', 'Kaas Plateau of Flowers', 'critical', 'Ecological Carrying Capacity Cap',
         'Maximum 3,000 visitors permitted per day on floral laterite beds. Digital Green Pass mandatory.',
         'Satara Forest Department & UNESCO Cell', 1, ?, '2026-09-30T23:59:59')
        """, (datetime.now().isoformat(), datetime.now().isoformat(), datetime.now().isoformat()))

    # Seed Demand Flows if empty
    cursor.execute("SELECT COUNT(*) FROM demand_flows")
    if cursor.fetchone()[0] == 0:
        today_iso = datetime.now().strftime("%Y-%m-%d")
        cursor.execute("""
        INSERT INTO demand_flows (origin_spot_id, destination_spot_id, date, estimated_visitor_count, source_tier, created_at)
        VALUES 
        ('LON', 'MAT', ?, 1420, 'Tier 3 — Calibrated TripPlan/CheckIn Model', ?),
        ('LON', 'BHA', ?, 890, 'Tier 3 — Calibrated TripPlan/CheckIn Model', ?),
        ('ALB', 'KAS', ?, 1150, 'Tier 3 — Calibrated TripPlan/CheckIn Model', ?),
        ('MAH', 'TAP', ?, 620, 'Tier 3 — Calibrated TripPlan/CheckIn Model', ?),
        ('LON', 'TMH', ?, 740, 'Tier 3 — Calibrated TripPlan/CheckIn Model', ?),
        ('PCH', 'KAA', ?, 950, 'Tier 3 — Calibrated TripPlan/CheckIn Model', ?)
        """, (today_iso, datetime.now().isoformat(),
              today_iso, datetime.now().isoformat(),
              today_iso, datetime.now().isoformat(),
              today_iso, datetime.now().isoformat(),
              today_iso, datetime.now().isoformat(),
              today_iso, datetime.now().isoformat()))

    # Seed Initial Karma Ledger for Demo User
    cursor.execute("SELECT COUNT(*) FROM eco_karma_ledger")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO eco_karma_ledger (user_id, points_change, activity_type, description, created_at)
        VALUES
        ('CITIZEN-GUEST-01', 150, 'green_transit', 'Electric Rail Journey to Matheran Eco-Zone', ?),
        ('CITIZEN-GUEST-01', 100, 'homestay_booking', 'Accredited MTDC Village Homestay Stay', ?),
        ('CITIZEN-GUEST-01', 100, 'waste_repatriation', '100% Dry Waste Repatriation at Valvan Hub', ?)
        """, (datetime.now().isoformat(), datetime.now().isoformat(), datetime.now().isoformat()))

    # Seed Initial Waste Reports if empty
    cursor.execute("SELECT COUNT(*) FROM waste_reports")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO waste_reports (
            id, destination_id, destination_name, reporter_name, category, severity,
            description, photo_url, lat, lon, status, karma_awarded, created_at
        ) VALUES 
        ('WST-101', 'LON', 'Lonavala & Khandala', 'Pooja Deshmukh', 'Plastic Bottles', 'high',
         'Discarded PET bottles near Tiger Point viewing deck cliff edge.', 
         'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80',
         18.7562, 73.4105, 'pending', 100, ?),
        ('WST-102', 'MAH', 'Mahabaleshwar Plateau', 'Rahul Patil', 'Packaging / Wrappers', 'medium',
         'Overflowing tourist dustbin near Arthur Seat viewpoint walkway.',
         'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80',
         17.9245, 73.6592, 'dispatched', 100, ?)
        """, (datetime.now().isoformat(), datetime.now().isoformat()))

    conn.commit()
    conn.close()

def ensure_initialized():
    """Call this explicitly from main.py startup, not on import."""
    try:
        init_database()
    except Exception as e:
        print(f"[Database] Init notice: {e}")
