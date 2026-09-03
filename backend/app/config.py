import os
from pathlib import Path

# Base Paths
BACKEND_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BACKEND_DIR.parent
DATA_DIR = BACKEND_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
DB_PATH = DATA_DIR / "ecoroute.db"

def load_env_file():
    """Loads key-value pairs from .env files into os.environ."""
    candidates = [
        BACKEND_DIR / ".env",
        ROOT_DIR / ".env",
        Path.cwd() / ".env",
        Path.cwd() / "backend" / ".env"
    ]
    for env_path in candidates:
        if env_path.exists():
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            key, val = line.split("=", 1)
                            key = key.strip()
                            val = val.strip().strip("'\"")
                            if key and key not in os.environ:
                                os.environ[key] = val
                print(f"[Config] Loaded environment variables from {env_path}")
                break
            except Exception as e:
                print(f"[Config] Error reading {env_path}: {e}")

load_env_file()

# API Keys and Configuration Values
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "").strip()
BESTTIME_API_KEY = os.getenv("BESTTIME_API_KEY", "").strip()
DATA_GOV_IN_API_KEY = os.getenv("DATA_GOV_IN_API_KEY", "").strip()
OGD_STATE_RESOURCE_ID = os.getenv("OGD_STATE_RESOURCE_ID", "38e073e6-404c-45df-8c7f-18bad688d8df").strip()
OGD_COASTAL_RESOURCE_ID = os.getenv("OGD_COASTAL_RESOURCE_ID", "51b5fc1c-9a4b-4c36-bcba-a90e55dc9fc8").strip()
BACKEND_HOST = os.getenv("BACKEND_HOST", "127.0.0.1")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))

# Base Western Ghats Destination Registry
INITIAL_DESTINATIONS = [
    {
        "id": "LON",
        "name": "Lonavala & Khandala",
        "category": "Hill Station",
        "lat": 18.7557, "lon": 73.4091,
        "base_capacity": 10000,
        "base_inflow": 4800,
        "features": [0.90, 0.70, 0.50, 0.90], # [Scenic, Budget, Adventure, Family]
        "dwell_hrs": 3.5,
        "district": "Pune District, MH",
        "tagline": "Misty Waterfalls & Rajmachi Escarpment",
        "description": "Maharashtra's prime hill corridor facing peak monsoon weekend gridlocks.",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "MAT",
        "name": "Matheran Eco-Zone",
        "category": "Hill Station",
        "lat": 18.9866, "lon": 73.2678,
        "base_capacity": 5000,
        "base_inflow": 1200,
        "features": [0.85, 0.60, 0.70, 0.85],
        "dwell_hrs": 4.0,
        "district": "Raigad District, MH",
        "tagline": "Asia's Only Automobile-Free Hill Town",
        "description": "Peaceful heritage eco-sensitive zone with Charlotte Lake and red clay walking trails.",
        "image_url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "BHA",
        "name": "Bhandardara Serene Haven",
        "category": "Hill Station",
        "lat": 19.5392, "lon": 73.7667,
        "base_capacity": 4000,
        "base_inflow": 750,
        "features": [0.95, 0.50, 0.80, 0.70],
        "dwell_hrs": 5.0,
        "district": "Ahmednagar District, MH",
        "tagline": "Arthur Lake & Kalsubai Peak Foothills",
        "description": "Unhurried high-altitude reservoir with lush waterfalls and night firefly sanctuary.",
        "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "ALB",
        "name": "Alibaug Coastal Hub",
        "category": "Coastal",
        "lat": 18.6414, "lon": 72.8722,
        "base_capacity": 8000,
        "base_inflow": 3900,
        "features": [0.80, 0.80, 0.30, 0.90],
        "dwell_hrs": 3.0,
        "district": "Raigad District, MH",
        "tagline": "Historic Sea Forts & Sandy Coastline",
        "description": "Popular coastal getaway with heavy ferry and road influx on weekends.",
        "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "KAS",
        "name": "Kashid & Murud Waters",
        "category": "Coastal",
        "lat": 18.4283, "lon": 72.9083,
        "base_capacity": 5000,
        "base_inflow": 1100,
        "features": [0.85, 0.70, 0.40, 0.85],
        "dwell_hrs": 3.8,
        "district": "Raigad District, MH",
        "tagline": "White Sand Beaches & Murud-Janjira Fortress",
        "description": "Pristine white sand coastline and historic Janjira sea fortress with 75% fewer crowds.",
        "image_url": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "MAH",
        "name": "Mahabaleshwar Plateau",
        "category": "Hill Station",
        "lat": 17.9237, "lon": 73.6586,
        "base_capacity": 12000,
        "base_inflow": 5200,
        "features": [0.92, 0.75, 0.60, 0.90],
        "dwell_hrs": 4.5,
        "district": "Satara District, MH",
        "tagline": "Strawberry Capital of the Sahyadris",
        "description": "High-altitude plateau with dense evergreen forests and severe parking congestion.",
        "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "TAP",
        "name": "Tapola & Koyna Backwaters",
        "category": "Hill Station",
        "lat": 17.7812, "lon": 73.7225,
        "base_capacity": 3500,
        "base_inflow": 580,
        "features": [0.95, 0.60, 0.85, 0.75],
        "dwell_hrs": 4.0,
        "district": "Satara District, MH",
        "tagline": "The 'Mini Kashmir' of the Sahyadris",
        "description": "Scenic reservoir backwaters with water sports, agro-tourism, and zero traffic jams.",
        "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    }
]
