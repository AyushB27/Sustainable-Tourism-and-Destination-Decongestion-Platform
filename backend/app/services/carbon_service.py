"""
EcoRoute Bharat — Dedicated Trip-Level Carbon Engine
Calculates round-trip emissions covering outbound transit, return transit,
local destination mobility, accommodation type, and activity offsets.
"""

from typing import Dict, Any

# Configurable emission factors (kg CO2e per passenger-km)
# Sourced from standard transport energy research & CEA India grid factors
EMISSION_FACTORS = {
    "private_car": 0.192,         # Solo petrol/diesel passenger car
    "shared_vehicle": 0.085,      # Carpooling / shared cab (2-3 pax)
    "bus": 0.045,                 # Intercity coach / state transport
    "local_bus": 0.038,           # Municipal/local shuttle feeder
    "train": 0.028,               # Indian Railways electric passenger line
    "local_driver": 0.052,        # Local driver union shared diesel/CNG jeep
    "bicycle": 0.000,             # Zero emissions
    "walking": 0.000,             # Zero emissions
    "flight": 0.255               # Short-haul domestic aviation
}

# Accommodation daily factors (kg CO2e per room-night)
ACCOMMODATION_FACTORS = {
    "homestay": 6.5,              # MTDC-accredited rural homestay (solar/biomass/low-grid)
    "budget_hotel": 16.0,         # Standard local guest house / lodge
    "resort": 34.0                # Large commercial resort with centralized AC & pool
}

import math

def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two points using Haversine formula."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def estimate_roundtrip_km(dest_lat: float, dest_lon: float, origin_lat: float = 19.0760, origin_lon: float = 72.8777) -> float:
    """Estimate road roundtrip distance from origin (default: Mumbai) to destination.
    Uses Haversine * 1.3 road factor for Indian hill/coastal roads."""
    straight_line = _haversine_km(origin_lat, origin_lon, dest_lat, dest_lon)
    return round(straight_line * 1.3 * 2, 1)  # Round trip with road winding factor

def calculate_trip_carbon(
    transport_mode: str = "green_transit",
    duration_days: int = 2,
    accommodation_type: str = "homestay",
    base_roundtrip_km: float = 320.0,
    local_daily_km: float = 35.0,
    travelers_count: int = 2,
    dest_lat: float = 0.0,
    dest_lon: float = 0.0
) -> Dict[str, Any]:
    """
    Calculates comprehensive estimated round-trip carbon footprint.
    Compares against a conventional solo/pair private car + commercial hotel baseline.
    """
    if dest_lat != 0.0 and dest_lon != 0.0:
        base_roundtrip_km = estimate_roundtrip_km(dest_lat, dest_lon)

    pax = max(1, travelers_count)
    days = max(1, min(14, duration_days))

    # Map general UI transport_mode to specific transit keys
    if transport_mode == "ultra_green":
        intercity_key = "train"
        local_key = "bicycle"
    elif transport_mode == "green_transit":
        intercity_key = "bus"
        local_key = "local_driver"
    elif transport_mode == "public_rail":
        intercity_key = "train"
        local_key = "local_bus"
    else:
        intercity_key = "private_car"
        local_key = "private_car"

    intercity_factor = EMISSION_FACTORS.get(intercity_key, 0.065)
    local_factor = EMISSION_FACTORS.get(local_key, 0.052)
    stay_factor = ACCOMMODATION_FACTORS.get(accommodation_type, 16.0)

    # 1. Outbound + Return long-distance transit
    # Each leg is half the round-trip distance
    one_way_km = base_roundtrip_km / 2.0
    outbound_carbon_kg = round(one_way_km * intercity_factor * pax, 1)
    return_carbon_kg = round(one_way_km * intercity_factor * pax, 1)
    transport_carbon_kg = round(outbound_carbon_kg + return_carbon_kg, 1)

    # 2. Local mobility within destination circuit
    total_local_km = max(1, days - 1) * local_daily_km  # Ensure 1-day trips still have local mobility
    local_transport_carbon_kg = round(total_local_km * local_factor * pax, 1)

    # 3. Accommodation emissions
    rooms_needed = max(1, (pax + 1) // 2)
    accommodation_carbon_kg = round((days - 1) * stay_factor * rooms_needed, 1)

    # Total planned footprint
    total_carbon_kg = round(transport_carbon_kg + local_transport_carbon_kg + accommodation_carbon_kg, 1)

    # 4. Conventional Baseline (Private Car + Commercial Resort)
    baseline_transport_kg = round(base_roundtrip_km * EMISSION_FACTORS["private_car"] * pax, 1)
    baseline_local_kg = round(total_local_km * EMISSION_FACTORS["private_car"] * pax, 1)
    baseline_stay_kg = round((days - 1) * ACCOMMODATION_FACTORS["resort"] * rooms_needed, 1)
    baseline_carbon_kg = round(baseline_transport_kg + baseline_local_kg + baseline_stay_kg, 1)

    # 5. Carbon Avoided
    carbon_avoided_kg = max(0.0, round(baseline_carbon_kg - total_carbon_kg, 1))
    carbon_saved_pct = round((carbon_avoided_kg / max(baseline_carbon_kg, 1.0)) * 100, 1)

    # Equivalents
    trees_annual = round(carbon_avoided_kg / 21.77)  # Don't clamp to 1 when savings are zero
    fuel_saved_liters = round(carbon_avoided_kg / 2.31)

    return {
        "total_carbon_kg": total_carbon_kg,
        "outbound_carbon_kg": outbound_carbon_kg,
        "return_carbon_kg": return_carbon_kg,
        "transport_carbon_kg": transport_carbon_kg,
        "local_transport_carbon_kg": local_transport_carbon_kg,
        "accommodation_carbon_kg": accommodation_carbon_kg,
        "baseline_carbon_kg": baseline_carbon_kg,
        "carbon_avoided_kg": carbon_avoided_kg,
        "carbon_saved_pct": carbon_saved_pct,
        "round_trip_km": round(base_roundtrip_km + total_local_km, 1),
        "trees_equivalent_annual": trees_annual,
        "fuel_saved_liters": fuel_saved_liters,
        "is_estimate": True,
        "methodology": "Emission Factors from CEA India Grid & MoEFCC Transport Standards"
    }
