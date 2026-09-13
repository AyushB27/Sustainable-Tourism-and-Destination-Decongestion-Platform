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
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
OGD_STATE_RESOURCE_ID = os.getenv("OGD_STATE_RESOURCE_ID", "38e073e6-404c-45df-8c7f-18bad688d8df").strip()
OGD_COASTAL_RESOURCE_ID = os.getenv("OGD_COASTAL_RESOURCE_ID", "51b5fc1c-9a4b-4c36-bcba-a90e55dc9fc8").strip()
BACKEND_HOST = os.getenv("BACKEND_HOST", "127.0.0.1")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost").strip()
POSTGRES_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
POSTGRES_DB = os.getenv("POSTGRES_DB", "ecoroute").strip()
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres").strip()
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "").strip()

# Base Western Ghats Destination Registry (21+ Maharashtra Corridors)
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
        "category": "Lake & Valley",
        "lat": 17.7812, "lon": 73.7225,
        "base_capacity": 3500,
        "base_inflow": 580,
        "features": [0.95, 0.60, 0.85, 0.75],
        "dwell_hrs": 4.0,
        "district": "Satara District, MH",
        "tagline": "The 'Mini Kashmir' of the Sahyadris",
        "description": "Scenic reservoir backwaters with water sports, agro-tourism, and zero traffic jams.",
        "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "PCH",
        "name": "Panchgani & Table Land",
        "category": "Hill Station",
        "lat": 17.9239, "lon": 73.8018,
        "base_capacity": 6000,
        "base_inflow": 2800,
        "features": [0.88, 0.68, 0.65, 0.90],
        "dwell_hrs": 3.2,
        "district": "Satara District, MH",
        "tagline": "Volcanic Laterite Plateaus & Strawberry Orchards",
        "description": "Asia's second-longest mountain plateau overlooking Krishna river valleys with cool breeze.",
        "image_url": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "KAA",
        "name": "Kaas Plateau of Flowers",
        "category": "Botanical Sanctuary",
        "lat": 17.7210, "lon": 73.8188,
        "base_capacity": 3000,
        "base_inflow": 850,
        "features": [0.98, 0.55, 0.50, 0.85],
        "dwell_hrs": 2.5,
        "district": "Satara District, MH",
        "tagline": "UNESCO World Natural Heritage Floral Biodiversity",
        "description": "Fragile volcanic laterite plateau blooming with 850+ endemic wild orchid and carnivorous flower species.",
        "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "IGA",
        "name": "Igatpuri & Bhavali Valley",
        "category": "Hill Station",
        "lat": 19.6974, "lon": 73.5606,
        "base_capacity": 4500,
        "base_inflow": 980,
        "features": [0.92, 0.75, 0.70, 0.80],
        "dwell_hrs": 4.0,
        "district": "Nashik District, MH",
        "tagline": "Mist Waterfalls, Vipassana & Sahyadri Gorges",
        "description": "Serene railway gap corridor with Bhavali dam overflow, Kalsubai view, and meditation sanctuaries.",
        "image_url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "SHI",
        "name": "Shirdi Spiritual Corridor",
        "category": "Pilgrimage & Heritage",
        "lat": 19.7667, "lon": 74.4764,
        "base_capacity": 35000,
        "base_inflow": 18500,
        "features": [0.60, 0.90, 0.20, 0.95],
        "dwell_hrs": 5.0,
        "district": "Ahmednagar District, MH",
        "tagline": "Global Spiritual Pilgrimage & Community Kitchens",
        "description": "Mass spiritual transit hub with zero-carbon solar megaplex kitchens and massive pilgrim influx.",
        "image_url": "https://images.unsplash.com/photo-1545232979-fbf6c63286f0?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "TRB",
        "name": "Trimbakeshwar & Brahmagiri",
        "category": "Sacred Grove",
        "lat": 19.9328, "lon": 73.5307,
        "base_capacity": 15000,
        "base_inflow": 6500,
        "features": [0.85, 0.75, 0.65, 0.85],
        "dwell_hrs": 4.5,
        "district": "Nashik District, MH",
        "tagline": "Godavari Origin & Ancient Black Stone Jyotirlinga",
        "description": "Sacred Sahyadri mountain grove where river Godavari emerges beneath holy Brahmagiri peaks.",
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "KLD",
        "name": "Kolad River Rapids",
        "category": "Adventure",
        "lat": 18.4237, "lon": 73.3263,
        "base_capacity": 3000,
        "base_inflow": 720,
        "features": [0.85, 0.65, 0.95, 0.70],
        "dwell_hrs": 4.5,
        "district": "Raigad District, MH",
        "tagline": "Kundalika River White Water Rafting",
        "description": "Maharashtra's prime dam-controlled river rafting and nature campsite corridor.",
        "image_url": "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "AMB",
        "name": "Amboli Mist Valley",
        "category": "Biodiversity Hotspot",
        "lat": 15.9610, "lon": 73.9997,
        "base_capacity": 2500,
        "base_inflow": 480,
        "features": [0.96, 0.65, 0.85, 0.75],
        "dwell_hrs": 4.0,
        "district": "Sindhudurg District, MH",
        "tagline": "Rainiest Sahyadri Ridge & Herpetofauna Haven",
        "description": "High-precipitation biodiversity corridor hosting rare Malabar Gliding frogs, pit vipers, and 750cm rain.",
        "image_url": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "TMH",
        "name": "Tamhini Ghat & Plus Valley",
        "category": "Cloud Forest",
        "lat": 18.4891, "lon": 73.4219,
        "base_capacity": 3500,
        "base_inflow": 890,
        "features": [0.95, 0.70, 0.90, 0.65],
        "dwell_hrs": 3.5,
        "district": "Pune / Raigad Border, MH",
        "tagline": "Cascading Monsoon Corridors & Plus Canyon",
        "description": "Dense mountain pass cutting through the Western Ghats with deep canyons and roaring waterfalls.",
        "image_url": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "HAR",
        "name": "Harishchandragad & Konkan Kada",
        "category": "Heritage & Trekking",
        "lat": 19.3872, "lon": 73.7770,
        "base_capacity": 2000,
        "base_inflow": 380,
        "features": [0.98, 0.60, 0.98, 0.50],
        "dwell_hrs": 6.0,
        "district": "Ahmednagar District, MH",
        "tagline": "The Dramatic 1,400m Concave Konkan Cliff",
        "description": "6th-century Kalachuri fort citadel with ancient Kedareshwar cave temple and mind-boggling vertical drop.",
        "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "VEL",
        "name": "Velas Turtle Beach",
        "category": "Wildlife Conservation",
        "lat": 17.9620, "lon": 73.0315,
        "base_capacity": 1500,
        "base_inflow": 280,
        "features": [0.92, 0.70, 0.60, 0.90],
        "dwell_hrs": 4.0,
        "district": "Ratnagiri District, MH",
        "tagline": "Community Olive Ridley Turtle Hatching Sanctuary",
        "description": "Pioneering eco-village where local families host tourists in homestays to protect baby sea turtles.",
        "image_url": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "TOR",
        "name": "Torna Fort Citadel",
        "category": "Heritage & Trekking",
        "lat": 18.2764, "lon": 73.6225,
        "base_capacity": 2500,
        "base_inflow": 420,
        "features": [0.94, 0.65, 0.90, 0.60],
        "dwell_hrs": 5.0,
        "district": "Pune District, MH",
        "tagline": "The First Swarajya Citadel of Shivaji Maharaj",
        "description": "Highest fort in Pune district (1,403m) featuring the legendary Zunjar Machi knife-edge ridge.",
        "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "SND",
        "name": "Sindhudurg & Tarkarli",
        "category": "Coastal & Marine",
        "lat": 16.0392, "lon": 73.4682,
        "base_capacity": 4500,
        "base_inflow": 1250,
        "features": [0.90, 0.70, 0.85, 0.85],
        "dwell_hrs": 5.0,
        "district": "Sindhudurg District, MH",
        "tagline": "Island Sea Fortress & Coral Reef Snorkeling",
        "description": "Chhatrapati Shivaji's invincible 1664 marine fortress built into the Arabian Sea with pristine coral waters.",
        "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "MCH",
        "name": "Morachi Chincholi Sanctuary",
        "category": "Agro-Tourism",
        "lat": 18.8475, "lon": 74.1977,
        "base_capacity": 2000,
        "base_inflow": 350,
        "features": [0.85, 0.80, 0.40, 0.95],
        "dwell_hrs": 4.0,
        "district": "Pune Rural, MH",
        "tagline": "Tamarind Groves & Wild Dancing Peacocks",
        "description": "Authentic rural agro-tourism sanctuary where 2,500+ wild peacocks roam freely in farming courtyards.",
        "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "JWH",
        "name": "Jawhar Tribal Hill Station",
        "category": "Tribal Heritage",
        "lat": 19.9142, "lon": 73.2325,
        "base_capacity": 2500,
        "base_inflow": 310,
        "features": [0.90, 0.75, 0.65, 0.85],
        "dwell_hrs": 4.0,
        "district": "Palghar District, MH",
        "tagline": "Indigenous Warli Paintings & Dabhosa Falls",
        "description": "Untouched tribal plateau home to the Jai Vilas Palace, centuries-old Warli art guild, and roaring waterfalls.",
        "image_url": "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
    }
]
