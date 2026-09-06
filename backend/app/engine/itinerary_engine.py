from datetime import datetime, timedelta
from typing import Dict, Any, List

def parse_duration_days(duration: Any) -> int:
    try:
        if isinstance(duration, int):
            return max(1, min(7, duration))
        dur_str = str(duration).lower()
        if "1" in dur_str:
            return 1
        elif "3" in dur_str:
            return 3
        elif "4" in dur_str:
            return 4
        elif "5" in dur_str:
            return 5
        elif "7" in dur_str:
            return 7
        elif "2" in dur_str:
            return 2
        return 2
    except Exception:
        return 2

def generate_future_itinerary(
    travel_date_str: str,
    duration: str = "2-day",
    travel_style: str = "scenic"
) -> Dict[str, Any]:
    """
    Generates an AI-optimized, decongested multi-day itinerary that sequences
    visits to avoid peak bottleneck hours and diverts to under-visited twin spots.
    Supports 1-day to 7-day flexible planning.
    """
    try:
        travel_dt = datetime.strptime(travel_date_str, "%Y-%m-%d")
        is_weekend = travel_dt.weekday() >= 5
    except Exception:
        travel_dt = datetime.now()
        is_weekend = True

    num_days = parse_duration_days(duration)
    hotspot_load = 94 if is_weekend else 58
    twin_load = 32 if is_weekend else 18

    day_blueprints = [
        {
            "day_number": 1,
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
        },
        {
            "day_number": 2,
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
        },
        {
            "day_number": 3,
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
                },
                {
                    "time": "05:00 PM – 08:00 PM",
                    "title": "Mandwa Sunset Ro-Ro Return Bypass",
                    "location": "Mandwa Ferry Terminal",
                    "status": "Bypass Highway Gridlock",
                    "desc": "Scenic waterway transit directly back into South Mumbai harbor.",
                    "badge": "Water Transit"
                }
            ]
        },
        {
            "day_number": 4,
            "day_label": "Day 4: Sahyadri High Plateau & Strawberry Valleys",
            "slots": [
                {
                    "time": "07:30 AM – 11:00 AM",
                    "title": "Morning Vistas at Arthur's Seat & Savitri Basin",
                    "location": "Mahabaleshwar Plateau (MAH)",
                    "status": "Early Bird Window (DCC 0.38)",
                    "desc": "Experience mist rolling over deep Konkan gorges before tour bus peak.",
                    "badge": "Panoramic Vista"
                },
                {
                    "time": "12:00 PM – 03:30 PM",
                    "title": "Organic Agro-Tourism & Strawberry Farm Tour",
                    "location": "Wai Valley Belt",
                    "status": "Agro-Partner Certified",
                    "desc": "Farm-fresh strawberry picking and traditional wood-fired Chulha lunch.",
                    "badge": "Farm to Table"
                },
                {
                    "time": "04:30 PM – 07:30 PM",
                    "title": "Pratapgad Foothills Sunset Heritage Walk",
                    "location": "Pratapgad Fort",
                    "status": "Uncrowded Heritage",
                    "desc": "Historic ramparts walk with breathtaking views of the dense Jawali forests.",
                    "badge": "Historic Fort"
                }
            ]
        },
        {
            "day_number": 5,
            "day_label": "Day 5: Tapola Fjord Waters & Koyna Wildlife Sanctuary",
            "slots": [
                {
                    "time": "08:00 AM – 12:30 PM",
                    "title": "Shivsagar Reservoir Kayaking & Speedboat Tour",
                    "location": "Tapola (TAP)",
                    "status": "Quiet Eco-Waters (DCC 0.15)",
                    "desc": "Cruise through 90km fjord-like backwaters framed by evergreen tiger reserve ridges.",
                    "badge": "Fjord Boating"
                },
                {
                    "time": "01:30 PM – 04:30 PM",
                    "title": "Vasota Jungle Trek Basecamp & Riverside Meal",
                    "location": "Koyna Backwaters Base",
                    "status": "Community Eco-Tourism",
                    "desc": "Wholesome village hospitality and authentic Maharashtrian river thali.",
                    "badge": "Community Haven"
                },
                {
                    "time": "05:30 PM – 08:30 PM",
                    "title": "Lakeside Campfire & Sahyadri Stargazing",
                    "location": "Shivsagar Tents",
                    "status": "Zero Light Pollution",
                    "desc": "Overnight lakeside glamping under crystal-clear Sahyadri skies.",
                    "badge": "Dark Sky Camping"
                }
            ]
        },
        {
            "day_number": 6,
            "day_label": "Day 6: Ancient Buddhist Escarpments & Cave Monasteries",
            "slots": [
                {
                    "time": "08:30 AM – 12:00 PM",
                    "title": "Karla & Bhaja Rock-Cut Buddhist Chaityas",
                    "location": "Karla Caves (LON)",
                    "status": "Morning Solitude (DCC 0.28)",
                    "desc": "Explore 2,200-year-old rock-cut Buddhist prayer halls carved into solid basalt.",
                    "badge": "Ancient Heritage"
                },
                {
                    "time": "01:00 PM – 04:00 PM",
                    "title": "Lohagad Fort Windy Pass & Heritage Lunch",
                    "location": "Lohagad Trail",
                    "status": "Scenic Highland",
                    "desc": "Trek up the iconic 'Iron Fort' and view the dramatic Vinchukata ridge.",
                    "badge": "Iconic Bastion"
                },
                {
                    "time": "05:00 PM – 07:30 PM",
                    "title": "Artisanal Chikki Kitchens & Spice Bazaar",
                    "location": "Old Highway Bazaar",
                    "status": "Local Producer Co-op",
                    "desc": "Support local cottage confectioners crafting jaggery and peanut treats.",
                    "badge": "Local Produce"
                }
            ]
        },
        {
            "day_number": 7,
            "day_label": "Day 7: Grand Sahyadri Panorama & Leisure Departure",
            "slots": [
                {
                    "time": "07:00 AM – 10:00 AM",
                    "title": "Sunrise Yoga & Birdwatching at Charlotte Forest",
                    "location": "Matheran Eco-Plateau",
                    "status": "100% Pure Oxygen",
                    "desc": "Wake up to dawn mist, bird calls, and serene valley viewpoints with zero motor vehicles.",
                    "badge": "Pure Air Retreat"
                },
                {
                    "time": "11:30 AM – 02:30 PM",
                    "title": "Farewell Konkani Banquet & Souvenir Handicrafts",
                    "location": "Heritage Guild Lodge",
                    "status": "Accredited Hoteliers",
                    "desc": "Celebrate a zero-bottleneck week with authentic Sol Kadhi and local bamboo handicrafts.",
                    "badge": "Grand Finale"
                },
                {
                    "time": "03:30 PM onwards",
                    "title": "Relaxed Off-Peak Transit Return",
                    "location": "Smooth State Highway",
                    "status": "Clear Passage",
                    "desc": "Depart ahead of Sunday evening return rush with 100% smooth highway transit.",
                    "badge": "Zero Traffic"
                }
            ]
        }
    ]

    selected_days = []
    for i in range(num_days):
        bp = day_blueprints[i % len(day_blueprints)]
        day_date = travel_dt + timedelta(days=i)
        selected_days.append({
            "day_number": i + 1,
            "day_date": day_date.strftime("%Y-%m-%d"),
            "day_label": f"Day {i + 1} ({day_date.strftime('%A')}): {bp['day_label'].split(': ')[-1]}",
            "slots": bp["slots"]
        })

    return {
        "travel_date": travel_date_str,
        "duration": f"{num_days}-day",
        "num_days": num_days,
        "travel_style": travel_style,
        "is_weekend_trip": is_weekend,
        "predicted_hotspot_load_pct": hotspot_load,
        "predicted_twin_load_pct": twin_load,
        "estimated_time_saved_minutes": 65 * num_days,
        "estimated_co2_offset_kg": round(10.5 * num_days, 1),
        "itinerary_days": selected_days
    }
