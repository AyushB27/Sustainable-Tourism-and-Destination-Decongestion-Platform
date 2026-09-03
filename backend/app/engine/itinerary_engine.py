from datetime import datetime
from typing import Dict, Any, List

def generate_future_itinerary(
    travel_date_str: str,
    duration: str = "2-day",
    travel_style: str = "scenic"
) -> Dict[str, Any]:
    """
    Generates an AI-optimized, decongested multi-day itinerary that sequences
    visits to avoid peak bottleneck hours and diverts to under-visited twin spots.
    """
    try:
        travel_dt = datetime.strptime(travel_date_str, "%Y-%m-%d")
        is_weekend = travel_dt.weekday() >= 5
    except Exception:
        is_weekend = True

    hotspot_load = 94 if is_weekend else 58
    twin_load = 32 if is_weekend else 18

    days = []

    # Day 1
    days.append({
        "day_label": "Day 1: Western Ghats Dawn & Eco-Twin Route",
        "slots": [
            {
                "time": "06:30 AM – 09:30 AM",
                "title": "Early Dawn Hotspot Transit (Lonavala & Tiger Point)",
                "location": "Lonavala (LON)",
                "status": "Optimal Green Window (DCC 0.35)",
                "desc": "Visit Rajmachi viewpoint during the morning off-peak window before highway rush.",
                "badge": "Off-Peak Transit"
            },
            {
                "time": "11:30 AM – 04:30 PM",
                "title": "Bypass to Matheran Eco-Zone & Charlotte Lake",
                "location": "Matheran (MAT)",
                "status": "Decongested Twin (DCC 0.22)",
                "desc": "Bypass expressway traffic gridlocks to peaceful automobile-free Matheran trails.",
                "badge": "Twin Destination"
            },
            {
                "time": "05:30 PM – 08:30 PM",
                "title": "Sunset Homestay Check-in & MTDC Dining",
                "location": "Matheran / Valley Villas",
                "status": "Verified MTDC Partner",
                "desc": "Check in at verified eco-homestay with 25% off-peak subsidy (HOMESTAY25).",
                "badge": "Verified Homestay"
            }
        ]
    })

    if duration in ["2-day", "3-day"]:
        days.append({
            "day_label": "Day 2: Arthur Lake & Kalsubai Nature Trail",
            "slots": [
                {
                    "time": "07:00 AM – 10:30 AM",
                    "title": "Bhandardara Serene Lake & Dam Nature Walk",
                    "location": "Bhandardara (BHA)",
                    "status": "Zero Queue (DCC 0.18)",
                    "desc": "Experience pristine lake views and Kalsubai foothills with 80% fewer tourists.",
                    "badge": "Eco-Corridor Trail"
                },
                {
                    "time": "12:00 PM – 03:30 PM",
                    "title": "Organic Farm Lunch & Local Handicrafts Market",
                    "location": "Bhandardara Rural Centre",
                    "status": "Rural Livelihood Support",
                    "desc": "Support indigenous artisans and local agro-tourism dining initiatives.",
                    "badge": "Sustainable Tourism"
                },
                {
                    "time": "04:30 PM onwards",
                    "title": "Smooth Return Transit via Ghoti Bypass",
                    "location": "NH-60 Corridor",
                    "status": "Gridlock Bypassed",
                    "desc": "Return journey via alternate northern artery, bypassing the 3-hour Khandala bottleneck.",
                    "badge": "Save 110 Mins"
                }
            ]
        })

    if duration == "3-day":
        days.append({
            "day_label": "Day 3: Coastal Konkan White Sands & Murud Janjira",
            "slots": [
                {
                    "time": "08:00 AM – 12:00 PM",
                    "title": "Kashid White Beach & Murud Janjira Fort Walk",
                    "location": "Kashid (KAS)",
                    "status": "Optimal Coastal Flow (DCC 0.25)",
                    "desc": "Explore clean sandy beaches and historic sea fort with minimal footfall.",
                    "badge": "Heritage Sea Fort"
                },
                {
                    "time": "01:00 PM – 04:00 PM",
                    "title": "Coastal Agro-Tourism & Fresh Coconut Grove Lunch",
                    "location": "Kashid Coastal Hub",
                    "status": "Community Partner",
                    "desc": "Enjoy local seafood and agro-tourism experience in certified coastal belt.",
                    "badge": "Agro-Tourism"
                }
            ]
        })

    return {
        "travel_date": travel_date_str,
        "duration": duration,
        "travel_style": travel_style,
        "is_weekend_trip": is_weekend,
        "predicted_hotspot_load_pct": hotspot_load,
        "predicted_twin_load_pct": twin_load,
        "estimated_time_saved_minutes": 140,
        "estimated_co2_offset_kg": 24.5,
        "itinerary_days": days
    }
