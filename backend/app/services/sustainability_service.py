"""
EcoRoute Bharat — 3-Dimensional Sustainability Engine
Evaluates trip sustainability across three independent pillars:
1. Environmental (40%): Carbon reduction, zero waste, congestion avoidance
2. Social (30%): Heritage respect, sacred grove observance, community guide engagement
3. Economic (30%): Local homestay retention, driver union hiring, agro-produce support
"""

from typing import Dict, Any

def calculate_environmental_score(
    transport_mode: str,
    waste_pledge: bool = True,
    off_peak_transit: bool = True,
    sensitive_zone: bool = True
) -> int:
    """Calculates environmental sustainability score (0-100)."""
    score = 50

    if transport_mode == "ultra_green":
        score += 35
    elif transport_mode in ["green_transit", "public_rail", "bus"]:
        score += 26
    elif transport_mode == "shared_vehicle":
        score += 15
    else:  # private_car
        score -= 15

    if waste_pledge:
        score += 10
    if off_peak_transit:
        score += 8
    if sensitive_zone:
        score += 4

    return max(20, min(100, round(score)))

def calculate_social_score(
    heritage_compliance: bool = True,
    cultural_experience: bool = True,
    local_guide: bool = True,
    respect_sacred_groves: bool = True
) -> int:
    """Calculates social & cultural sustainability score (0-100)."""
    score = 60
    if heritage_compliance:
        score += 12
    if cultural_experience:
        score += 10
    if local_guide:
        score += 10
    if respect_sacred_groves:
        score += 8
    return max(30, min(100, round(score)))

def calculate_economic_score(
    accommodation_type: str,
    use_local_drivers: bool = True,
    buy_local_produce: bool = True
) -> int:
    """Calculates local community economic retention score (0-100)."""
    score = 45
    if accommodation_type == "homestay":
        score += 35
    elif accommodation_type == "budget_hotel":
        score += 15
    else:
        score += 5

    if use_local_drivers:
        score += 12
    if buy_local_produce:
        score += 8

    return max(25, min(100, round(score)))

def calculate_3d_sustainability(
    transport_mode: str = "green_transit",
    accommodation_type: str = "homestay",
    waste_pledge: bool = True,
    off_peak_transit: bool = True,
    use_local_drivers: bool = True,
    buy_local_produce: bool = True,
    local_guide: bool = True,
    heritage_compliance: bool = True,
    cultural_experience: bool = True,
    respect_sacred_groves: bool = True
) -> Dict[str, Any]:
    """
    Computes all 3 dimensional scores and the weighted composite score.
    Weights: 40% Environmental, 30% Social, 30% Economic
    """
    env = calculate_environmental_score(transport_mode, waste_pledge, off_peak_transit)
    soc = calculate_social_score(heritage_compliance, cultural_experience, local_guide, respect_sacred_groves)
    econ = calculate_economic_score(accommodation_type, use_local_drivers, buy_local_produce)

    composite = round(0.40 * env + 0.30 * soc + 0.30 * econ)

    return {
        "environmental": env,
        "social": soc,
        "economic": econ,
        "overall": composite,
        "breakdown": {
            "environmental": {
                "weight": "40%",
                "score": env,
                "label": "Carbon & Waste Abatement",
                "factors": ["Low-carbon transit mode", "Carry-in carry-out waste pledge", "Dawn bypass transit"]
            },
            "social": {
                "weight": "30%",
                "score": soc,
                "label": "Cultural Heritage Respect",
                "factors": ["Sacred grove preservation", "Local indigenous guide participation", "Responsible behavior pledge"]
            },
            "economic": {
                "weight": "30%",
                "score": econ,
                "label": "Local Livelihood Retention",
                "factors": ["Accredited MTDC village homestay", "Local driver union fare retention", "GI agro-produce direct spend"]
            }
        }
    }
