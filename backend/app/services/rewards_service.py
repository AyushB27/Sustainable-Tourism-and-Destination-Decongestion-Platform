"""
EcoRoute Bharat — Eco-Karma Rewards & Ledger Service
Tracks verified sustainable tourist actions, awards points,
and manages redeemable partner vouchers.
"""

from datetime import datetime
from typing import Dict, Any, List
from ..database import get_db_connection

REDEEMABLE_VOUCHERS = [
    {
        "id": "VOUCH-01",
        "title": "MTDC Heritage Homestay ₹500 Discount",
        "points_required": 300,
        "code": "MTDC-ECO500",
        "category": "Stay",
        "valid_until": "2026-12-31"
    },
    {
        "id": "VOUCH-02",
        "title": "Matheran Electric Shuttle Free Day Pass",
        "points_required": 200,
        "code": "MATHERAN-ESHUTTLE",
        "category": "Transit",
        "valid_until": "2026-12-31"
    },
    {
        "id": "VOUCH-03",
        "title": "GI Mahabaleshwar Organic Strawberry Basket",
        "points_required": 250,
        "code": "STRAWBERRY-FARM",
        "category": "Local Food",
        "valid_until": "2026-12-31"
    },
    {
        "id": "VOUCH-04",
        "title": "Kaas UNESCO Conservation Guide Voucher",
        "points_required": 400,
        "code": "KAAS-ECOGUIDE",
        "category": "Heritage",
        "valid_until": "2026-12-31"
    }
]

def award_karma_points(user_id: str, points: int, activity_type: str, description: str) -> int:
    """Awards Eco-Karma points and records the transaction in SQLite."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        now_iso = datetime.now().isoformat()
        cursor.execute("""
        INSERT INTO eco_karma_ledger (user_id, points_change, activity_type, description, created_at)
        VALUES (?, ?, ?, ?, ?)
        """, (user_id, points, activity_type, description, now_iso))
        conn.commit()

        cursor.execute("SELECT SUM(points_change) FROM eco_karma_ledger WHERE user_id = ?", (user_id,))
        total = cursor.fetchone()[0] or 0
        conn.close()
        return total
    except Exception as e:
        print(f"[RewardsService] Error awarding points: {e}")
        return 0

def get_user_rewards_profile(user_id: str = "CITIZEN-GUEST-01") -> Dict[str, Any]:
    """Returns user total points, tier, transaction ledger, and vouchers."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM eco_karma_ledger WHERE user_id = ? ORDER BY id DESC LIMIT 20
    """, (user_id,))
    ledger_rows = cursor.fetchall()

    cursor.execute("SELECT SUM(points_change) FROM eco_karma_ledger WHERE user_id = ?", (user_id,))
    total_points = cursor.fetchone()[0] or 0
    conn.close()

    if total_points > 500:
        tier = "Sahyadri Guardian"
    elif total_points > 250:
        tier = "Eco Pioneer"
    else:
        tier = "Eco Explorer"

    return {
        "status": "success",
        "user_id": user_id,
        "total_points": total_points,
        "tier": tier,
        "ledger": [dict(r) for r in ledger_rows],
        "vouchers": REDEEMABLE_VOUCHERS
    }
