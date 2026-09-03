import math
from typing import List, Dict, Any

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Calculates 4D cosine similarity between two feature vectors."""
    if len(vec_a) != len(vec_b) or len(vec_a) == 0:
        return 0.0

    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a * a for a in vec_a))
    mag_b = math.sqrt(sum(b * b for b in vec_b))

    if mag_a == 0 or mag_b == 0:
        return 0.0

    return round(min(1.0, max(0.0, dot_product / (mag_a * mag_b))), 3)

def find_twin_recommendations(
    target_destination: Dict[str, Any],
    all_destinations: List[Dict[str, Any]],
    user_preferences: List[float] = None
) -> List[Dict[str, Any]]:
    """
    Ranks alternative under-visited twin destinations that match the target's vibe
    and visitor preferences while maintaining safe carrying capacity (DCC < 0.70).
    """
    target_features = target_destination.get("features", [0.8, 0.7, 0.6, 0.8])
    target_inflow = target_destination.get("current_inflow", 5000)
    user_prefs = user_preferences or [0.90, 0.70, 0.60, 0.85]

    # Blend target features with user preferences (60% vibe, 40% user preference)
    blended_target = [
        (0.60 * tf) + (0.40 * up)
        for tf, up in zip(target_features, user_prefs)
    ]

    recommendations = []

    for cand in all_destinations:
        if cand["id"] == target_destination["id"]:
            continue

        cand_features = cand.get("features", [0.8, 0.6, 0.6, 0.8])
        cand_dcc = cand.get("dcc_score", 0.35)
        cand_inflow = cand.get("current_inflow", 1200)

        # Calculate cosine vibe match
        similarity = cosine_similarity(blended_target, cand_features)

        # Multi-objective utility score: (0.60 * similarity) + (0.40 * (1 - candidate_DCC))
        utility_score = round((0.60 * similarity) + (0.40 * max(0.0, 1.0 - cand_dcc)), 3)

        # Crowd reduction % compared to overloaded target
        crowd_reduction_pct = max(0, int(((target_inflow - cand_inflow) / max(1, target_inflow)) * 100))

        recommendations.append({
            "destination": cand,
            "similarity_score": similarity,
            "candidate_dcc_score": cand_dcc,
            "utility_score": utility_score,
            "crowd_reduction_pct": crowd_reduction_pct,
            "is_optimal_twin": cand_dcc < 0.70
        })

    # Sort descending by utility score
    recommendations.sort(key=lambda x: x["utility_score"], reverse=True)
    return recommendations
