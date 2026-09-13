"""
EcoRoute Bharat — Destination Intelligence & Twin Diversion Service
Models Dynamic Carrying Capacity (DCC), destination pressure index,
hilly-region vehicle restriction rules, and dynamic twin diversion matching.
"""

import math
from typing import Dict, Any, List, Optional
from ..config import INITIAL_DESTINATIONS
from ..database import get_db_connection

# Sensitive Region Vehicle Restrictions & Perimeter Interchange Hubs
SENSITIVE_REGION_RULES = {
    "MAT": {
        "requires_vehicle_restriction": True,
        "restriction_level": "MANDATORY_AUTOMOBILE_FREE",
        "perimeter_hub": "Dasturi Naka Interchange Parking (Raigad)",
        "internal_transit": "Neral-Matheran Toy Train / Electric Feeder Shuttle / Horse Trail / Walking",
        "guidance": "Asia's only eco-sensitive automobile-free plateau. Park personal cars at Dasturi Naka."
    },
    "MAH": {
        "requires_vehicle_restriction": True,
        "restriction_level": "PEAK_CONGESTION_RESTRICTION",
        "perimeter_hub": "Wai Valley Gateway Parking (Satara)",
        "internal_transit": "MTDC Shared Feeder Minibuses & Verified Strawberry Farm Jeeps",
        "guidance": "High altitude ghat hairpin congestion. Switch to municipal e-shuttles at Wai bypass."
    },
    "KAA": {
        "requires_vehicle_restriction": True,
        "restriction_level": "ECOLOGICAL_SANCTUARY_CAP",
        "perimeter_hub": "Kaas Forest Checkpoint Bypass (Satara)",
        "internal_transit": "Forest Department Solar Minibuses / Walking Wooden Boardwalks",
        "guidance": "UNESCO World Biosphere floral beds. Only official solar shuttles allowed on laterite plateau."
    },
    "LON": {
        "requires_vehicle_restriction": False,
        "restriction_level": "HIGHWAY_DECONGESTION_ADVISORY",
        "perimeter_hub": "Valvan Expressway Interchange Hub (Pune)",
        "internal_transit": "Verified Local Ghat Driver Unions & E-Rickshaws",
        "guidance": "Save ~2 hours Khandala bottleneck delay by parking at Valvan and hiring local drivers."
    },
    "TAP": {
        "requires_vehicle_restriction": True,
        "restriction_level": "WATER_CONSERVATION_BUFFER",
        "perimeter_hub": "Tapola Shivsagar Jetty Terminal",
        "internal_transit": "Solar Electric Boats, Kayaks & Rural Guide Walkers",
        "guidance": "Vasota jungle trek buffer. All road vehicles stay at lakeside jetty parking."
    }
}

# Pre-computed curated twin links grounded in geographical corridors
TWIN_CORRIDOR_MAP = {
    "LON": ["MAT", "BHA", "IGA", "KLD"],
    "MAT": ["LON", "BHA", "KLD", "TMH"],
    "BHA": ["MAT", "IGA", "LON", "TRB"],
    "ALB": ["KAS", "HAR", "VEL", "MCH"],
    "KAS": ["ALB", "HAR", "VEL", "SND"],
    "MAH": ["TAP", "PCH", "KAA", "AMB"],
    "TAP": ["MAH", "PCH", "KAA", "TOR"],
    "PCH": ["TAP", "MAH", "KAA", "AMB"],
    "KAA": ["TAP", "PCH", "MAH", "AMB"],
    "IGA": ["BHA", "LON", "TRB", "JWH"],
    "SHI": ["TRB", "IGA", "BHA", "JWH"],
    "TRB": ["SHI", "IGA", "BHA", "JWH"],
    "KLD": ["TMH", "MAT", "LON", "ALB"],
    "AMB": ["MAH", "TAP", "MCH", "SND"],
    "TMH": ["KLD", "LON", "TOR", "MAT"],
    "HAR": ["VEL", "KAS", "ALB", "MCH"],
    "VEL": ["HAR", "KAS", "ALB", "MCH"],
    "TOR": ["TMH", "LON", "TAP", "MAH"],
    "SND": ["MCH", "HAR", "VEL", "AMB"],
    "MCH": ["SND", "HAR", "VEL", "AMB"],
    "JWH": ["IGA", "TRB", "BHA", "LON"]
}

def calculate_dcc_metrics(
    current_inflow: int,
    physical_capacity: int,
    weather_hazard_score: float = 0.05,
    dwell_hrs: float = 3.5,
    environmental_sensitivity: float = 0.30
) -> Dict[str, Any]:
    """
    Calculates Dynamic Carrying Capacity (DCC) and destination pressure score.
    Formula: Pressure = (0.60 * Inflow_Ratio) + (0.25 * Weather_Hazard) + (0.15 * Env_Sensitivity)
    """
    cap = max(1, physical_capacity)
    inflow = max(0, current_inflow)
    cap_util = inflow / cap

    pressure_score = round(
        (0.70 * min(1.5, cap_util)) + (0.30 * max(0.0, min(1.0, weather_hazard_score))),
        2
    )

    if pressure_score < 0.65:
        status = "OPTIMAL"
    elif pressure_score < 0.85:
        status = "MODERATE"
    elif pressure_score < 1.05:
        status = "HIGH"
    else:
        status = "CRITICAL"

    wait_mins = round(max(0.0, (inflow - cap) / cap) * dwell_hrs * 60) if inflow > cap else 0

    return {
        "dcc_score": pressure_score,
        "pressure_score": pressure_score,
        "status": status,
        "capacity_utilization": round(cap_util, 3),
        "wait_time_minutes": wait_mins,
        "current_inflow": inflow,
        "physical_capacity": cap
    }

def get_destination_registry() -> List[Dict[str, Any]]:
    """Returns the full list of all 21 destinations with live DCC metadata."""
    destinations = []
    
    # Try fetching persistent hotel occupancy from DB
    occupancy_map = {}
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, hotel_occupancy_pct, available_rooms FROM destinations")
        for r in cursor.fetchall():
            occupancy_map[r["id"]] = {
                "occupancy_pct": r["hotel_occupancy_pct"] or 50.0,
                "available_rooms": r["available_rooms"] or 50
            }
        conn.close()
    except Exception:
        pass

    for d in INITIAL_DESTINATIONS:
        dest_id = d["id"]
        # Determine environmental sensitivity
        env_sens = 0.50 if dest_id in ["MAT", "KAA", "TAP", "AMB", "VEL"] else 0.30
        
        # Calculate DCC metrics
        dcc = calculate_dcc_metrics(
            current_inflow=d["base_inflow"],
            physical_capacity=d["base_capacity"],
            weather_hazard_score=0.08,
            dwell_hrs=d.get("dwell_hrs", 3.5),
            environmental_sensitivity=env_sens
        )

        occ_info = occupancy_map.get(dest_id, {"occupancy_pct": 50.0, "available_rooms": 50})
        mobility_rules = SENSITIVE_REGION_RULES.get(dest_id, {
            "requires_vehicle_restriction": False,
            "restriction_level": "OPEN_HIGHWAY",
            "perimeter_hub": f"{d['name']} Perimeter Parking",
            "internal_transit": "Public State Transport & Local Cabs",
            "guidance": "Standard highway corridor. Follow local traffic signage."
        })

        destinations.append({
            "id": dest_id,
            "name": d["name"],
            "district": d["district"],
            "category": d["category"],
            "lat": d["lat"],
            "lon": d["lon"],
            "coordinates": [d["lat"], d["lon"]],
            "description": d["description"],
            "tagline": d["tagline"],
            "image_url": d["image_url"],
            "physical_capacity": d["base_capacity"],
            "current_inflow": d["base_inflow"],
            "features": d.get("features", [0.8, 0.7, 0.6, 0.8]),
            "avg_dwell_time_hours": d.get("dwell_hrs", 3.5),
            "dcc_score": dcc["dcc_score"],
            "status": dcc["status"],
            "capacity_utilization": dcc["capacity_utilization"],
            "wait_time_minutes": dcc["wait_time_minutes"],
            "hotel_occupancy_pct": occ_info["occupancy_pct"],
            "available_rooms": occ_info["available_rooms"],
            "mobility_rules": mobility_rules,
            "twin_ids": TWIN_CORRIDOR_MAP.get(dest_id, []),
            "telemetry_source": "SIMULATED / DEMO DATA"
        })

    return destinations

def get_destination_by_id(dest_id: str) -> Optional[Dict[str, Any]]:
    dests = get_destination_registry()
    return next((d for d in dests if d["id"] == dest_id.upper()), None)

def find_twin_destinations(dest_id: str, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Dynamically recommends nearby less-crowded twin destinations.
    Returns destination object, reason, estimated wait reduction, and sustainability advantage.
    """
    dest = get_destination_by_id(dest_id)
    if not dest:
        return []

    target_dcc = dest["dcc_score"]
    all_dests = {d["id"]: d for d in get_destination_registry()}
    candidate_ids = TWIN_CORRIDOR_MAP.get(dest_id.upper(), [])

    twins = []
    for cid in candidate_ids:
        c_dest = all_dests.get(cid)
        if not c_dest:
            continue
        
        # Calculate pressure advantage
        pressure_diff = round(target_dcc - c_dest["dcc_score"], 2)
        wait_reduction = max(0, dest["wait_time_minutes"] - c_dest["wait_time_minutes"])
        
        # Calculate distance (haversine approximation)
        d_lat = math.radians(c_dest["lat"] - dest["lat"])
        d_lon = math.radians(c_dest["lon"] - dest["lon"])
        a = math.sin(d_lat / 2)**2 + math.cos(math.radians(dest["lat"])) * math.cos(math.radians(c_dest["lat"])) * math.sin(d_lon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance_km = round(6371.0 * c, 1)

        twins.append({
            "destination": c_dest,
            "reason": f"Avoid {dest['name']} bottlenecks. {c_dest['name']} operates at {c_dest['status']} capacity with {int((1.0 - c_dest['capacity_utilization']) * 100)}% open corridor capacity.",
            "pressure_difference": pressure_diff,
            "estimated_wait_reduction_mins": wait_reduction or 45,
            "distance_km": distance_km,
            "sustainability_advantage": f"Saves ~{round(distance_km * 0.08, 1)} kg CO2e in idling queues; direct revenue for {c_dest['district']} homestays."
        })

    # Sort by lowest crowd pressure first
    twins.sort(key=lambda x: x["destination"]["dcc_score"])
    return twins[:limit]
