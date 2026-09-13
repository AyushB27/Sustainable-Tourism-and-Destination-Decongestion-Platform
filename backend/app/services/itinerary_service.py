"""
EcoRoute Bharat — Destination-Aware Itinerary Engine
Dynamically generates multi-day, decongested itineraries tailored to
any of the 21 Maharashtra destinations, integrating local attractions,
Maratha heritage, agro-tourism, and twin diversion bypasses.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List
from .carbon_service import calculate_trip_carbon
from .sustainability_service import calculate_3d_sustainability
from .destination_service import get_destination_by_id, find_twin_destinations, SENSITIVE_REGION_RULES
from ..engine.ai_chat_engine import generate_ai_trip_narrative

# Curated attraction & heritage blueprints for all 21 Maharashtra destinations
DESTINATION_EXPERIENCES = {
    "LON": {
        "morning": ("06:30 AM – 09:30 AM", "Rajmachi Dawn Escarpment & Karla Caves", "Early morning off-peak window before Pune-Mumbai expressway rush."),
        "afternoon": ("11:30 AM – 03:30 PM", "Bhaja Rock-Cut Buddhist Chaityas & Lohagad Ridge", "Explore 2,200-year-old basalt architecture with 75% fewer tourists than Tiger Point."),
        "evening": ("05:00 PM – 08:00 PM", "Lonavala Artisanal Chikki Cooperative & Farm Dinner", "Support local women's self-help groups crafting traditional jaggery delicacies.")
    },
    "MAT": {
        "morning": ("07:00 AM – 10:00 AM", "Charlotte Lake Eco-Trail & Echo Point", "Automobile-free dawn walk with pure mountain air and Sahyadri bird calls."),
        "afternoon": ("11:30 AM – 03:30 PM", "Louisa Point Vistas & Heritage Toy Train Route", "Trek shaded forest bridle paths with zero engine noise or vehicular exhaust."),
        "evening": ("05:00 PM – 07:30 PM", "Matheran Village Homestay & Maharashtrian Pithla Bhakri", "Authentic rural dining prepared by host families using local organic millets.")
    },
    "BHA": {
        "morning": ("07:00 AM – 10:30 AM", "Arthur Lake Shoreline & Wilson Dam Umbrella Falls", "Serene lakeside morning walk beneath the majestic Kalsubai peak."),
        "afternoon": ("12:00 PM – 03:30 PM", "Randha Falls & Amruteshwar 11th-Century Temple", "Visit Hemadpanthi stone-carved heritage shrine amidst quiet valley hamlets."),
        "evening": ("05:30 PM – 08:30 PM", "Bhandardara Stargazing & Indigenous Agro-Homestay", "Zero light pollution dark sky observation and tribal agro-tourism hospitality.")
    },
    "ALB": {
        "morning": ("07:00 AM – 10:00 AM", "Kolaba Sea Fortress Low-Tide Heritage Walk", "Walk across the shallow ocean floor at dawn to the 17th-century Maratha naval stronghold."),
        "afternoon": ("11:30 AM – 03:00 PM", "Akshi Beach Casuarina Groves & Local Fish Thali", "Avoid crowded Alibaug beach; support coastal village fishermen cooperatives."),
        "evening": ("05:00 PM – 08:00 PM", "Mandwa Sunset Water Transit & Coconut Grove Homestay", "Relax beneath coastal palms with zero highway gridlocks.")
    },
    "KAS": {
        "morning": ("06:30 AM – 09:30 AM", "Kashid White Sand Conservation Strip Walk", "Pristine morning beach walk with protected Olive Ridley turtle nesting dunes."),
        "afternoon": ("11:30 AM – 03:30 PM", "Korlai Portuguese Rock Fortress & Light House", "Hike the rocky peninsula cliff with 360-degree Arabian Sea panorama."),
        "evening": ("05:00 PM – 07:30 PM", "Chaul Historic Silk Route Temple & Village Dining", "Taste freshly caught Konkani fish curry prepared by coastal home cooks.")
    },
    "MAH": {
        "morning": ("06:30 AM – 09:30 AM", "Arthur's Seat Gorge & Savitri Point Dawn Mist", "Witness breathtaking canyon cliffs before tourist bus traffic arrives at the summit."),
        "afternoon": ("11:30 AM – 03:30 PM", "Old Mahabaleshwar Sacred Krishna Springs Temple", "Ancient 13th-century stone temple marking the sacred origin of five holy rivers."),
        "evening": ("05:00 PM – 08:00 PM", "GI Strawberry Farm Agro-Trek & Village Homestay", "Directly harvest organic strawberries and dine with local host farmers.")
    },
    "TAP": {
        "morning": ("07:00 AM – 10:30 AM", "Shivsagar Lake Fjord Kayaking & Solar Boating", "Quiet eco-boating on the tranquil reservoir framed by Koyna Wildlife Sanctuary."),
        "afternoon": ("11:30 AM – 04:00 PM", "Vasota Jungle Trek & Vyaghragad Fort Ramparts", "Deep rainforest trek through dense tiger reserve corridor with certified tribal guides."),
        "evening": ("05:30 PM – 08:30 PM", "Lakeside Agro-Campfire & Traditional River Thali", "Wholesome village hospitality with fresh local produce and dark-sky stargazing.")
    },
    "PCH": {
        "morning": ("07:00 AM – 10:00 AM", "Tableland Volcanic Basalt Plateau Sunrise Walk", "Explore Asia's second-longest volcanic mountain plateau in crisp morning air."),
        "afternoon": ("11:30 AM – 03:00 PM", "Sydney Point & Dhom Dam Overlook", "Panoramic views of Krishna river valley and historic Wai temple town."),
        "evening": ("05:00 PM – 07:30 PM", "Colonial Bakeries & Mahabaleshwar Jam Kitchens", "Support local women artisans producing fruit preserves and honey.")
    },
    "KAA": {
        "morning": ("06:30 AM – 09:30 AM", "UNESCO Kaas Flower Valley Guided Botanical Walk", "Inspect endemic monsoon orchids and insectivorous plants with certified nature guides."),
        "afternoon": ("11:30 AM – 03:00 PM", "Vajrai Waterfall & Kaas Lake Wetland Conservation", "View India's second-highest waterfall cascading into the lush Urmodi basin."),
        "evening": ("05:00 PM – 07:30 PM", "Satara Agro-Homestay & Jawari Bhakri Feast", "Enjoy authentic rural cuisine prepared with farm-fresh organic sesame and groundnuts.")
    },
    "IGA": {
        "morning": ("06:30 AM – 09:30 AM", "Bhatsa River Valley & Camel Valley Dawn Mist", "Capture dramatic waterfalls tumbling into deep Sahyadri gorges."),
        "afternoon": ("11:30 AM – 03:30 PM", "Vipassana Meditation Centre & Tringalwadi Fort Trek", "Explore ancient 16th-century fortress and peaceful meditation trails."),
        "evening": ("05:00 PM – 07:30 PM", "Kasara Ghat Rural Produce Market & Organic Dining", "Taste freshly roasted sweet corn and farm-to-table vegetarian delights.")
    },
    "SHI": {
        "morning": ("06:00 AM – 09:00 AM", "Sacred Temple Samadhi Darshan (Early Bird Slot)", "Pre-booked digital green pass slot avoiding 4-hour noon queues."),
        "afternoon": ("11:30 AM – 03:00 PM", "Lendi Baug Solar Meditation Park & Heritage Museum", "Tranquil botanical gardens sustained by on-site solar water distillation."),
        "evening": ("05:00 PM – 08:00 PM", "Solar Mega-Kitchen & Rural Pilgrim Langar Experience", "Experience the world's largest eco-friendly solar steam cooking facility.")
    },
    "TRB": {
        "morning": ("06:00 AM – 09:00 AM", "Trimbakeshwar Jyotirlinga Dawn Abhishek", "Sacred temple darshan nestled at the base of lush Brahmagiri hills."),
        "afternoon": ("11:00 AM – 03:30 PM", "Brahmagiri Mountain Trek & Sacred Godavari Source", "Forest pilgrimage trail leading to the sacred mountain spring headwaters."),
        "evening": ("05:00 PM – 07:30 PM", "Anjaneri Hills Hanuman Birthplace & Herbal Trail", "Explore biodiversity reserve dedicated to medicinal Sahyadri plants.")
    },
    "KLD": {
        "morning": ("07:30 AM – 11:30 AM", "Kundalika River Eco-Rafting (Dam Water Release)", "Thrilling white water rafting powered by non-polluting hydroelectric releases."),
        "afternoon": ("01:00 PM – 04:00 PM", "Sutarwadi Lake Nature Walk & Mango Grove Picnic", "Relax beside calm rural waters amidst indigenous Alphonso orchards."),
        "evening": ("05:30 PM – 08:00 PM", "Kundalika Riverside Homestay & Barbecue", "Village homestay stay managed by native rafting guides and boatmen.")
    },
    "AMB": {
        "morning": ("07:00 AM – 10:30 AM", "Amboli Waterfall & South Sahyadri Rainforest Walk", "Explore mist-shrouded biodiversity hotspot renowned for endemic amphibians."),
        "afternoon": ("11:30 AM – 03:30 PM", "Kavlesad Point Deep Gorge & Reverse Waterfall", "Observe wind-driven reverse spray rising hundreds of feet up the vertical cliff."),
        "evening": ("05:00 PM – 07:30 PM", "Hiranyakeshi Sacred River Origin Cave & Local Feast", "Visit sacred Shiva shrine inside rock cave surrounded by evergreen canopy.")
    },
    "TMH": {
        "morning": ("06:30 AM – 09:30 AM", "Tamhini Ghat Monsoon Waterfall Corridor", "Scenic mountain highway passage with dozens of natural cascading streams."),
        "afternoon": ("11:00 AM – 03:30 PM", "Devkund Sacred Forest & Hidden Plunge Pool Trek", "Trek through dense sacred groves with certified local youth guides."),
        "evening": ("05:00 PM – 07:30 PM", "Plus Valley Overlook & Konkan Village Homestay", "Relax with pristine valley views and homemade Maharashtrian dal batti.")
    },
    "HAR": {
        "morning": ("06:30 AM – 09:30 AM", "Harihareshwar Temple Pradakshina Rocky Sea Walk", "Circumambulate the historic sea temple along geological wave-cut rock platforms."),
        "afternoon": ("11:30 AM – 03:00 PM", "Bagmandla Savitri Estuary Ferry Passage", "Take the rural vehicle ferry across the calm coastal estuary."),
        "evening": ("05:00 PM – 07:30 PM", "Harihareshwar Quiet Beach Sunset & Coconut Water", "Support local beach shack vendors serving fresh tender coconut.")
    },
    "VEL": {
        "morning": ("06:00 AM – 09:00 AM", "Olive Ridley Sea Turtle Hatchling Dawn Release", "Witness baby turtles making their historic journey to the ocean with SNM conservationists."),
        "afternoon": ("11:00 AM – 03:00 PM", "Velas Village Turtle Festival Community Homestay", "100% community-owned homestay model funding beach conservation."),
        "evening": ("05:00 PM – 07:30 PM", "Bankot Fort Ramparts Sunset Overlook", "Historic hill fort commanding sweeping views of the Savitri river mouth.")
    },
    "TOR": {
        "morning": ("06:00 AM – 10:30 AM", "Torna Fort (Prachandagad) Historic Mountain Trek", "Trek the first fortress captured by 16-year-old Chhatrapati Shivaji Maharaj in 1646."),
        "afternoon": ("12:00 PM – 04:00 PM", "Zunjar Machi Knife-Edge Ridge Exploration", "Marvel at Maratha military architecture perched over 1,400m drop."),
        "evening": ("05:30 PM – 08:00 PM", "Velhe Village Agro-Homestay & Pitla Bhakri", "Nutritious farm dinner cooked by native trekking guides and host families.")
    },
    "SND": {
        "morning": ("07:00 AM – 10:30 AM", "Sindhudurg Island Fortress Sea Boat Passage", "Cross to the 1664 naval bastion built by Shivaji Maharaj with iron-infused basalt ramparts."),
        "afternoon": ("12:00 PM – 03:30 PM", "Malvan Submerged Coral Reef Snorkeling & Scuba", "Eco-certified shallow reef dive guided by local Konkani fisher youth."),
        "evening": ("05:00 PM – 08:00 PM", "Malvani Cuisine Feast & Sol Kadhi Sampling", "Dine at family-run eateries serving authentic coconut and Kokum specialties.")
    },
    "MCH": {
        "morning": ("07:00 AM – 10:30 AM", "Tarkarli White Sands & Karli River Estuary Kayaking", "Paddle through tranquil backwaters fringed by swaying coconut palms."),
        "afternoon": ("12:00 PM – 03:30 PM", "Dolphin Observation & Marine Wildlife Sanctuary", "Responsible boat trip following strict no-chase guidelines for coastal bottlenose dolphins."),
        "evening": ("05:00 PM – 08:00 PM", "Malvan Fishermen's Harbour & Cashew Co-op Visit", "Purchase GI-certified Malvani cashews directly from rural processor collectives.")
    },
    "JWH": {
        "morning": ("07:00 AM – 10:30 AM", "Jai Vilas Palace & Tribal Mukne Heritage Walk", "Marvel at 1938 syenite stone palace set within dense cashew and teak plantations."),
        "afternoon": ("12:00 PM – 03:30 PM", "Dabhosa Waterfall Plunge Basin & Forest Trail", "Experience 300-foot waterfall framed by untouched Sahyadri greenery."),
        "evening": ("05:00 PM – 08:00 PM", "Warli Tribal Art Workshop & Agro-Homestay Dining", "Learn authentic rice-paste Warli painting directly from indigenous tribal masters.")
    }
}

def generate_destination_aware_itinerary(
    destination_id: str = "LON",
    travel_date_str: str = None,
    duration: int = 2,
    travel_style: str = "scenic",
    transport_mode: str = "green_transit",
    accommodation_type: str = "homestay"
) -> Dict[str, Any]:
    """
    Generates a personalized, destination-aware multi-day itinerary.
    Tailors all activity slots, heritage visits, and dining to the real target destination.
    Bypasses peak bottleneck hours to lesser-known twin destinations.
    """
    dest_id = (destination_id or "LON").upper()
    dest = get_destination_by_id(dest_id)
    if not dest:
        dest_id = "LON"
        dest = get_destination_by_id("LON")

    try:
        travel_dt = datetime.strptime(travel_date_str, "%Y-%m-%d") if travel_date_str else datetime.now()
    except Exception:
        travel_dt = datetime.now()

    num_days = max(1, min(7, duration))
    twins = find_twin_destinations(dest_id, limit=3)
    twin_spot = twins[0]["destination"] if twins else None

    # Retrieve experiences
    primary_exp = DESTINATION_EXPERIENCES.get(dest_id, DESTINATION_EXPERIENCES["LON"])
    twin_id = twin_spot["id"] if twin_spot else "MAT"
    twin_exp = DESTINATION_EXPERIENCES.get(twin_id, DESTINATION_EXPERIENCES["MAT"])

    # Calculate Carbon Footprint & Reduction
    carbon = calculate_trip_carbon(
        transport_mode=transport_mode,
        duration_days=num_days,
        accommodation_type=accommodation_type,
        dest_lat=dest.get('latitude', dest.get('lat', 0.0)),
        dest_lon=dest.get('longitude', dest.get('lon', 0.0))
    )
    daily_carbon_savings = round(carbon.get("carbon_avoided_kg", 0) / max(1, num_days), 1)

    days = []

    for d_idx in range(num_days):
        cur_date = travel_dt + timedelta(days=d_idx)
        day_num = d_idx + 1
        
        # Day 1 is dedicated to primary destination with morning off-peak window
        if day_num == 1:
            slots = [
                {
                    "time": primary_exp["morning"][0],
                    "title": primary_exp["morning"][1],
                    "location": f"{dest['name']} Core Hub",
                    "status": "Optimal Dawn Window (DCC 0.35)",
                    "desc": primary_exp["morning"][2],
                    "badge": "Off-Peak Window"
                },
                {
                    "time": primary_exp["afternoon"][0],
                    "title": primary_exp["afternoon"][1],
                    "location": f"{dest['name']} Heritage Trail",
                    "status": "Decongested Bypass",
                    "desc": primary_exp["afternoon"][2],
                    "badge": "Heritage Trail"
                },
                {
                    "time": primary_exp["evening"][0],
                    "title": primary_exp["evening"][1],
                    "location": f"{dest['district']} Community Centre",
                    "status": "Verified MTDC Partner",
                    "desc": primary_exp["evening"][2],
                    "badge": "Community Partner"
                }
            ]
            day_label = f"Day 1 ({cur_date.strftime('%A')}): {dest['name']} Dawn & Heritage Circuit"
        elif day_num == 2 and twin_spot:
            # Day 2 diverts to certified twin destination to diffuse congestion
            slots = [
                {
                    "time": twin_exp["morning"][0],
                    "title": twin_exp["morning"][1],
                    "location": f"{twin_spot['name']} Scenic Pass",
                    "status": f"Eco-Twin Diversion (DCC {twin_spot.get('dcc_score', 0.5)})",
                    "desc": twin_exp["morning"][2],
                    "badge": "Twin Alternative"
                },
                {
                    "time": twin_exp["afternoon"][0],
                    "title": twin_exp["afternoon"][1],
                    "location": f"{twin_spot['name']} Cultural Reserve",
                    "status": "80% Less Footfall",
                    "desc": twin_exp["afternoon"][2],
                    "badge": "Low Impact Zone"
                },
                {
                    "time": twin_exp["evening"][0],
                    "title": twin_exp["evening"][1],
                    "location": f"{twin_spot.get('district', 'District')} Rural Homestay",
                    "status": "Direct Village Retention",
                    "desc": twin_exp["evening"][2],
                    "badge": "Verified Homestay"
                }
            ]
            day_label = f"Day 2 ({cur_date.strftime('%A')}): Decongested Twin Route to {twin_spot['name']}"
        else:
            # Subsequent days: rotate through available twin experiences
            # Use different twin destinations for variety
            twin_idx = (d_idx - 2) % max(1, len(twins))
            alt_twin = twins[twin_idx]["destination"] if twin_idx < len(twins) else (twin_spot or dest)
            alt_twin_id = alt_twin["id"] if alt_twin else dest_id
            alt_exp = DESTINATION_EXPERIENCES.get(alt_twin_id, primary_exp)
            
            slots = [
                {
                    "time": alt_exp["morning"][0],
                    "title": alt_exp["morning"][1],
                    "location": f"{alt_twin.get('name', dest['name'])} Nature Zone",
                    "status": "Pristine Off-Peak Corridor",
                    "desc": alt_exp["morning"][2],
                    "badge": "Biodiversity Walk"
                },
                {
                    "time": alt_exp["afternoon"][0],
                    "title": alt_exp["afternoon"][1],
                    "location": f"{alt_twin.get('district', dest['district'])} Heritage Zone",
                    "status": "Rural Livelihood Support",
                    "desc": alt_exp["afternoon"][2],
                    "badge": "Agro-Tourism"
                },
                {
                    "time": alt_exp["evening"][0],
                    "title": alt_exp["evening"][1],
                    "location": f"{alt_twin.get('district', dest['district'])} Homestay",
                    "status": "Zero Toll Queues",
                    "desc": alt_exp["evening"][2],
                    "badge": "Smart Transit"
                }
            ]
            alt_name = alt_twin.get('name', dest['name'])
            day_label = f"Day {day_num} ({cur_date.strftime('%A')}): {alt_name} Discovery & Local Heritage"

        days.append({
            "day_number": day_num,
            "day_date": cur_date.strftime("%Y-%m-%d"),
            "day_label": day_label,
            "carbon_saved_today_kg": daily_carbon_savings,
            "slots": slots
        })

    # Calculate 3D Sustainability Scores
    sustainability = calculate_3d_sustainability(
        transport_mode=transport_mode,
        accommodation_type=accommodation_type,
        waste_pledge=True,
        off_peak_transit=True
    )

    # Generate AI Narrative (using Gemini 3.6 Flash with offline synthesizer fallback)
    ai_narrative = generate_ai_trip_narrative({
        "destination_name": dest["name"],
        "travel_date": travel_dt.strftime("%Y-%m-%d"),
        "travel_style": travel_style,
        "transport_mode": transport_mode,
        "accommodation_type": accommodation_type,
        "duration": f"{num_days}-day",
        "carbon_saved_kg": carbon["carbon_avoided_kg"],
        "carbon_saved_pct": carbon["carbon_saved_pct"],
        "sustainability_score": sustainability["overall"],
        "local_economy_inr": 3500 * num_days
    })


    mobility_rules = SENSITIVE_REGION_RULES.get(dest_id, {
        "requires_vehicle_restriction": False,
        "perimeter_hub": f"{dest['name']} Parking Hub",
        "guidance": "Standard highway corridor."
    })

    return {
        "status": "success",
        "destination_id": dest_id,
        "destination_name": dest["name"],
        "duration_days": num_days,
        "start_date": travel_dt.strftime("%Y-%m-%d"),
        "transport_mode": transport_mode,
        "accommodation_type": accommodation_type,
        "itinerary_days": days,
        "carbon_calculator": carbon,
        "sustainability_scores": sustainability,
        "trip_sustainability_score": sustainability["overall"],
        "ai_narrative": ai_narrative,
        "mobility_rules": mobility_rules,
        "twin_recommendations": twins
    }
