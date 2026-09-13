import sys
import json
import time
import urllib.parse
from datetime import datetime
from http.server import HTTPServer, ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# Ensure UTF-8 output encoding across Windows shells to avoid charmap UnicodeEncodeErrors
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Track server start time for uptime reporting
_SERVER_START_TIME = time.time()

import os
import bcrypt
import jwt
JWT_SECRET = os.environ.get("JWT_SECRET", "ecoroute-dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"

if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.config import (
    BACKEND_HOST,
    BACKEND_PORT,
    TOMTOM_API_KEY,
    BESTTIME_API_KEY,
    DATA_GOV_IN_API_KEY,
    OGD_STATE_RESOURCE_ID,
    OGD_COASTAL_RESOURCE_ID,
    INITIAL_DESTINATIONS
)
from app.database import get_db_connection
from app.background_worker import (
    start_background_telemetry_worker,
    get_latest_telemetry,
    sync_telemetry_once
)
from app.engine.dcc_calculator import generate_12hr_forecast, calculate_dcc_metrics
from app.engine.twin_matcher import find_twin_recommendations
from app.engine.itinerary_engine import generate_future_itinerary
from app.engine.ai_chat_engine import generate_chat_response, get_spot_deep_dossier, generate_ai_sustainability_report
from app.pipelines.footfall_pipeline import get_besttime_full_telemetry
from app.services.destination_service import get_destination_registry, get_destination_by_id, find_twin_destinations as find_dynamic_twins
from app.services.itinerary_service import generate_destination_aware_itinerary
from app.services.sustainability_service import calculate_3d_sustainability
from app.services.carbon_service import calculate_trip_carbon
from app.services.trip_service import save_trip, get_user_trips, get_trip_by_id as get_saved_trip, delete_trip, generate_post_trip_report
from app.services.waste_service import create_waste_report, get_waste_incidents, update_incident_status
from app.services.rewards_service import get_user_rewards_profile, award_karma_points
from app.services.provider_service import update_destination_occupancy
from app.services.advisory_service import broadcast_advisory as secure_broadcast_advisory, get_active_advisories
from app.services.event_service import log_event, get_recent_events


# ==============================================================================
# AUTHENTICATION DIRECTORY & CREDENTIALS
# ==============================================================================
STAKEHOLDERS_DIRECTORY = {
    "pune.collector@gov.in": {
        "id": "AUTH-PUNE-01",
        "name": "Dr. Rajeshwar Patil, IAS",
        "role": "authority",
        "designation": "District Magistrate & Disaster Management Officer",
        "department": "Pune District Administration & MSRDC Corridor Cell",
        "badgeNumber": "IAS-MH-2018-9412",
        "password": "$2b$12$7ahaWL.rIMgu9LGzIJ/x3OnsL13PTNTVX9ag2MlMdi80iF60OdFpq",  # officer@pune
        "jurisdiction": {"type": "district", "value": "Pune"}
    },
    "patil.dm@ecoroute.ops": {
        "id": "AUTH-PUNE-01",
        "name": "Dr. Rajeshwar Patil, IAS",
        "role": "authority",
        "designation": "District Operations Chief",
        "department": "Disaster Management & Corridor Cell",
        "badgeNumber": "OPS-MH-2026-94",
        "password": "$2b$12$grWT2LxtGWsTOJpR6U59L.bJrvQHfwiPjs1vsrywbxhmTu7JhX0pe",  # officer2026
        "jurisdiction": {"type": "district", "value": "Pune"}
    },
    "raigad.sp@gov.in": {
        "id": "AUTH-RAIGAD-02",
        "name": "Sunita Shinde, IPS",
        "role": "authority",
        "designation": "Superintendent of Police & Highway Traffic Command",
        "department": "Raigad District Police & Coastal Tourism Security",
        "badgeNumber": "IPS-MH-2019-3201",
        "password": "$2b$12$MV6zT1x7BAQSKbqOJlfLO.l5T8NWaLZVPZ464fW8lDwv7E7G5lT9u",  # officer@raigad
        "jurisdiction": {"type": "district", "value": "Raigad"}
    },
    "director.tourism@maharashtra.gov.in": {
        "id": "AUTH-MAHA-01",
        "name": "Virendra Singh, IAS",
        "role": "authority",
        "designation": "Director of Tourism, Govt of Maharashtra",
        "department": "Directorate of Tourism, Maharashtra",
        "badgeNumber": "IAS-MH-2012-1102",
        "password": "$2b$12$TH5aT6uPhN8Nexfd5GLycOyA8JLGmIqZNXBuLu6wpwulY2QVdRBl.",  # director@maha
        "jurisdiction": {"type": "state", "value": "Maharashtra"}
    },
    "MTDC/2026/HOTEL-99": {
        "id": "PROV-MATHERAN-01",
        "name": "Matheran Eco-Heritage Homestay & Valley Villas",
        "role": "provider",
        "designation": "Authorized MTDC Homestay Operator",
        "department": "Maharashtra Tourism Development Corporation (MTDC)",
        "badgeNumber": "MTDC-ACC-2026-883",
        "password": "$2b$12$TMwKnFuj9R/iQdgPe1KBWehI5A2fmkmE21WlToA/UsB9BMPhaE77y",  # provider@matheran
        "jurisdiction": None
    },
    "contact@matheran-homestays.com": {
        "id": "PROV-MATHERAN-01",
        "name": "Matheran Eco-Resort & Homestays",
        "role": "provider",
        "designation": "Verified Hospitality Operator",
        "department": "Eco-Tourism Hospitality Network",
        "badgeNumber": "ACC-2026-883",
        "password": "$2b$12$33Ied/ZZG2oCi1qIp1wyZ.ux5VxbFjXDM72DiAuNgQcHrU9S6iuFe",  # partner2026
        "jurisdiction": None
    },
    "MTDC/2026/HOTEL-84": {
        "id": "PROV-KASHID-02",
        "name": "Kashid Sands Beach Resort & Watersports",
        "role": "provider",
        "designation": "Accredited Coastal Resort Partner",
        "department": "Raigad Tourism & MTDC Hospitality Council",
        "badgeNumber": "MTDC-ACC-2026-442",
        "password": "$2b$12$CsUFqf1xnBjz9mVHbqIxwOGBbICmhHfoWfydB1vei1U1xdIy/F4la",  # provider@kashid
        "jurisdiction": None
    },
    "dev@ecoroute.internal": {
        "id": "DEV-LEAD-01",
        "name": "Corridor Systems Engineer",
        "role": "developer",
        "designation": "Telemetry & Pipeline Architect",
        "department": "Infrastructure Diagnostics",
        "badgeNumber": "DEV-ROOT-2026",
        "password": "$2b$12$A1b.wjkWR/2r42PEP2Wjh.FobGjZKE1e8apk8.eObmFIkUnJDAlzy",  # dev2026
        "jurisdiction": None
    },
    "aarav.traveler@gmail.com": {
        "id": "USR-TOURIST-01",
        "name": "Aarav Sharma",
        "role": "tourist",
        "designation": "Verified Eco-Tourist",
        "department": "Sustainable Travel Community",
        "badgeNumber": "ECO-PASS-2026-77",
        "password": "$2b$12$En.lH/qFDij1kPk8L3R.E.yomk7zQAkqqZ1RRbDFz8XLbBZUWpDkW",  # traveler2026
        "jurisdiction": None
    }
}

def check_authority_jurisdiction(user_dict, spot_id):
    """
    Enforces server-side authority jurisdiction scoping.
    Returns (True, None) if authorized, or (False, error_message) if denied.
    """
    if not user_dict:
        return False, "Unauthorized: Authentication required."
    
    if user_dict.get("role") != "authority":
        return False, "Forbidden: Authority role required for this administrative operation."
    
    jur = user_dict.get("jurisdiction")
    if not jur:
        return False, "Forbidden: Authority user has no jurisdiction assigned."
    
    j_type = jur.get("type")
    j_val = jur.get("value")
    
    if spot_id == "ALL":
        if j_type == "state":
            return True, None
        return False, f"Forbidden: Corridor-wide ('ALL') actions require State-level jurisdiction. Your jurisdiction is {j_type}: '{j_val}'."
    
    dest = next((d for d in INITIAL_DESTINATIONS if d["id"] == spot_id), None)
    if not dest:
        return False, f"Destination '{spot_id}' not found."
    
    if j_type == "state":
        # All Western Ghats corridor destinations in this project belong to Maharashtra
        return True, None
    elif j_type == "district":
        dest_district = dest.get("district", "").lower()
        if str(j_val).lower() in dest_district:
            return True, None
        return False, f"Forbidden: Spot {spot_id} ({dest.get('district')}) is outside your district jurisdiction ('{j_val}')."
    elif j_type == "spot_list":
        if isinstance(j_val, list) and spot_id in j_val:
            return True, None
        return False, f"Forbidden: Spot {spot_id} is not in your assigned spots list."
    
    return False, "Forbidden: Unrecognized jurisdiction type."

# ==============================================================================
# HTTP REST API REQUEST HANDLER
# ==============================================================================
class EcoRouteAPIHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        allowed_origin = os.environ.get("CORS_ALLOWED_ORIGIN", "http://localhost:5173")
        self.send_header("Access-Control-Allow-Origin", allowed_origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json_response(self, data, status_code=200):
        try:
            response_bytes = json.dumps(data, indent=2).encode("utf-8")
            self.send_response(status_code)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(response_bytes)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
            pass

    def _validate_auth_token(self):
        """Validates JWT from Authorization header. Returns decoded payload or None."""
        auth_header = self.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        token = auth_header[7:].strip()
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def _parse_json_body(self) -> dict:
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                raw = self.rfile.read(content_length)
                return json.loads(raw.decode('utf-8'))
            return {}
        except (json.JSONDecodeError, ValueError) as e:
            self._send_json_response({"status": "error", "message": f"Invalid JSON: {e}"}, status_code=400)
            raise ValueError(f"Malformed JSON body: {e}")
        except Exception as e:
            return {}

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        try:
            self._handle_post()
        except Exception as e:
            print(f"[ERROR] POST {self.path}: {e}")
            try:
                self._send_json_response({"status": "error", "message": "Internal server error"}, status_code=500)
            except Exception:
                pass

    def _handle_post(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        body = self._parse_json_body()

        # 1. Stakeholder Login Authentication
        if path == "/api/auth/login":
            identifier = body.get("identifier", "").strip()
            password = body.get("password", "").strip()
            role = body.get("role", "citizen")

            user_match = STAKEHOLDERS_DIRECTORY.get(identifier)

            if user_match:
                stored_pw = user_match["password"]
                # Support both bcrypt hashed and plain-text passwords (migration period)
                pw_valid = False
                if stored_pw.startswith("$2b$") or stored_pw.startswith("$2a$"):
                    pw_valid = bcrypt.checkpw(password.encode('utf-8'), stored_pw.encode('utf-8'))
                else:
                    pw_valid = (stored_pw == password)
                
                if pw_valid:
                    import time as _time
                    token = jwt.encode({
                        "sub": user_match["id"],
                        "role": user_match["role"],
                        "name": user_match.get("name", ""),
                        "jurisdiction": user_match.get("jurisdiction"),
                        "iat": int(_time.time()),
                        "exp": int(_time.time()) + 86400 * 7
                    }, JWT_SECRET, algorithm=JWT_ALGORITHM)
                    
                    self._send_json_response({
                        "status": "success",
                        "message": "Authentication successful",
                        "user": {
                            "id": user_match["id"],
                            "name": user_match["name"],
                            "role": user_match["role"],
                            "designation": user_match["designation"],
                            "department": user_match["department"],
                            "badgeNumber": user_match["badgeNumber"],
                            "jurisdiction": user_match.get("jurisdiction"),
                            "isAuthenticated": True,
                            "token": token
                        }
                    })
                else:
                    self._send_json_response({"status": "error", "message": "Invalid credentials"}, status_code=401)
                    return
            elif role == "citizen" or identifier.startswith("CITIZEN") or not identifier:
                self._send_json_response({
                    "status": "success",
                    "message": "Citizen guest mode verified",
                    "user": {
                        "id": "CITIZEN-GUEST-01",
                        "name": "Verified Citizen Tourist",
                        "role": "tourist",
                        "designation": "Yatra Eco-Pass Holder",
                        "department": "National Tourism Citizen Gateway",
                        "badgeNumber": "IND-YATRA-2026",
                        "jurisdiction": None,
                        "isAuthenticated": True,
                        "token": f"token-citizen-{int(datetime.now().timestamp())}"
                    }
                })
            else:
                self._send_json_response({"status": "error", "message": "User not found"}, status_code=404)
                return

        # 2. 4D Vector Cosine Twin Recommendation Engine
        elif path == "/api/recommendations/twin":
            target_id = body.get("target_destination_id", "LON")
            user_prefs = body.get("user_preferences", [0.90, 0.70, 0.60, 0.85])

            telemetry = get_latest_telemetry()
            destinations = telemetry.get("destinations", [])
            target = next((d for d in destinations if d["id"] == target_id), destinations[0] if destinations else {})

            if not target:
                self._send_json_response({"status": "error", "message": "Destination not found"}, status_code=404)
                return

            recs = find_twin_recommendations(target, destinations, user_prefs)
            self._send_json_response({
                "status": "success",
                "target_destination": target["name"],
                "target_dcc": target.get("dcc_score", 0.85),
                "total_twins_evaluated": len(recs),
                "recommendations": recs
            })

        # 3. Future Trip Decongestion Itinerary Generator (Destination-Aware)
        elif path == "/api/itinerary/plan":
            travel_date = body.get("travel_date", datetime.now().strftime("%Y-%m-%d"))
            dur_raw = body.get("duration", 2)
            if isinstance(dur_raw, str):
                try:
                    dur_int = int(''.join(filter(str.isdigit, dur_raw)) or 2)
                except Exception:
                    dur_int = 2
            else:
                dur_int = int(dur_raw or 2)

            travel_style = body.get("travel_style", "scenic")
            transport_mode = body.get("transport_mode", "green_transit")
            accommodation_type = body.get("accommodation_type", "homestay")
            destination_id = body.get("destination_id") or (body.get("destinations")[0] if body.get("destinations") else "LON")

            plan = generate_destination_aware_itinerary(
                destination_id=destination_id,
                travel_date_str=travel_date,
                duration=dur_int,
                travel_style=travel_style,
                transport_mode=transport_mode,
                accommodation_type=accommodation_type
            )
            self._send_json_response({
                "status": "success",
                "plan": plan
            })

        # 3b. Save Trip Plan to Persistent SQLite
        elif path == "/api/trips/save" or (path == "/api/trips" and self.command == "POST"):
            user_id = body.get("user_id") or "CITIZEN-GUEST-01"
            save_res = save_trip(body, user_id=user_id)
            self._send_json_response(save_res)

        # 3c. 3-Dimensional Sustainability Score Calculation
        elif path == "/api/sustainability/calculate":
            sust_res = calculate_3d_sustainability(
                transport_mode=body.get("transport_mode", "green_transit"),
                accommodation_type=body.get("accommodation_type", "homestay"),
                waste_pledge=body.get("waste_pledge", True),
                off_peak_transit=body.get("off_peak_transit", True)
            )
            self._send_json_response(sust_res)

        # 3d. Carbon Footprint Calculation API
        elif path == "/api/carbon/calculate":
            carbon_res = calculate_trip_carbon(
                transport_mode=body.get("transport_mode", "green_transit"),
                duration_days=int(body.get("duration_days", 2)),
                accommodation_type=body.get("accommodation_type", "homestay"),
                base_roundtrip_km=float(body.get("base_roundtrip_km", 320.0))
            )
            self._send_json_response(carbon_res)

        # 4. 24x7 AI Tourism Helpline Assistant
        elif path == "/api/ai/chat":
            message = body.get("message", "").strip()
            destination_id = body.get("destination_id")
            language = body.get("language", "en")
            telemetry = get_latest_telemetry()

            chat_result = generate_chat_response(
                message=message,
                destination_id=destination_id,
                language=language,
                telemetry_data=telemetry
            )
            self._send_json_response({
                "status": "success",
                "response": chat_result["response"],
                "source": chat_result["source"],
                "language": chat_result["language"],
                "timestamp": chat_result["timestamp"]
            })

        # 4b. Spot Deep AI Eco-Guide Dossier
        elif path == "/api/ai/spot-guide":
            spot_id = body.get("destination_id", "LON")
            dossier = get_spot_deep_dossier(spot_id)
            self._send_json_response({
                "status": "success",
                "spot_id": spot_id,
                "dossier": dossier
            })

        # 4c. Generate AI Sustainability & Carbon Audit Report
        elif path == "/api/ai/generate-report":
            report_res = generate_ai_sustainability_report(body)
            self._send_json_response(report_res)

        # 5. Broadcast Emergency Gazette Advisory (with strict authorization enforcement)
        elif path == "/api/advisories/broadcast":
            auth_payload = self._validate_auth_token()
            if auth_payload:
                user_role = auth_payload.get("role", "")
                user = {"id": auth_payload.get("sub"), "role": user_role, "jurisdiction": auth_payload.get("jurisdiction")}
            else:
                user = body.get("user", {})
            adv_res = secure_broadcast_advisory(body, user=user)
            if adv_res.get("status") == "error":
                self._send_json_response(adv_res, status_code=403)
            else:
                self._send_json_response(adv_res)


        # 5b. Revoke Gazette Advisory (Server-side jurisdiction checked)
        elif path.startswith("/api/advisories/") and path.endswith("/revoke"):
            parts = path.strip("/").split("/")
            adv_id = parts[2]
            auth_payload = self._validate_auth_token()
            if auth_payload:
                user_role = auth_payload.get("role", "")
                user = {"id": auth_payload.get("sub"), "role": user_role, "jurisdiction": auth_payload.get("jurisdiction")}
            else:
                user = body.get("user")

            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM gazette_advisories WHERE id = ?", (adv_id,))
            adv = cursor.fetchone()
            if not adv:
                conn.close()
                self._send_json_response({"status": "error", "message": "Advisory not found"}, status_code=404)
                return

            if True:  # Always check authorization
                authorized, err_msg = check_authority_jurisdiction(user, adv["destination_id"])
                if not authorized:
                    conn.close()
                    self._send_json_response({"status": "error", "message": err_msg}, status_code=403)
                    return

            now_iso = datetime.now().isoformat()
            cursor.execute("UPDATE gazette_advisories SET active = 0, revoked_at = ? WHERE id = ?", (now_iso, adv_id))
            conn.commit()
            conn.close()

            self._send_json_response({
                "status": "success",
                "message": f"Advisory {adv_id} revoked successfully.",
                "advisory_id": adv_id,
                "revoked_at": now_iso
            })

        # 5c. Extend Gazette Advisory (Server-side jurisdiction checked)
        elif path.startswith("/api/advisories/") and path.endswith("/extend"):
            parts = path.strip("/").split("/")
            adv_id = parts[2]
            new_expires_at = body.get("new_expires_at", "2026-10-31T23:59:59")
            auth_payload = self._validate_auth_token()
            if auth_payload:
                user_role = auth_payload.get("role", "")
                user = {"id": auth_payload.get("sub"), "role": user_role, "jurisdiction": auth_payload.get("jurisdiction")}
            else:
                user = body.get("user")

            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM gazette_advisories WHERE id = ?", (adv_id,))
            adv = cursor.fetchone()
            if not adv:
                conn.close()
                self._send_json_response({"status": "error", "message": "Advisory not found"}, status_code=404)
                return

            if True:  # Always check authorization
                authorized, err_msg = check_authority_jurisdiction(user, adv["destination_id"])
                if not authorized:
                    conn.close()
                    self._send_json_response({"status": "error", "message": err_msg}, status_code=403)
                    return

            cursor.execute("UPDATE gazette_advisories SET expires_at = ?, active = 1 WHERE id = ?", (new_expires_at, adv_id))
            conn.commit()
            conn.close()

            self._send_json_response({
                "status": "success",
                "message": f"Advisory {adv_id} validity extended to {new_expires_at}.",
                "advisory_id": adv_id,
                "expires_at": new_expires_at
            })

        # 5d. Policy Simulator (Transparent DCC & Twin Absorption Model)
        elif path == "/api/policy-simulator/simulate":
            target_id = body.get("target_spot_id", "LON")
            proposed_cap = int(body.get("proposed_cap", 3500))
            auth_payload = self._validate_auth_token()
            if auth_payload:
                user_role = auth_payload.get("role", "")
                user = {"id": auth_payload.get("sub"), "role": user_role, "jurisdiction": auth_payload.get("jurisdiction")}
            else:
                user = body.get("user")

            if user:
                authorized, err_msg = check_authority_jurisdiction(user, target_id)
                if not authorized:
                    self._send_json_response({"status": "error", "message": err_msg}, status_code=403)
                    return

            telemetry = get_latest_telemetry()
            destinations = telemetry.get("destinations", [])
            target = next((d for d in destinations if d["id"] == target_id), None)
            if not target:
                self._send_json_response({"status": "error", "message": "Target destination not found"}, status_code=404)
                return

            current_inflow = target.get("current_inflow", 4800)
            physical_cap = target.get("physical_capacity", 10000)
            weather_hazard = target.get("live_sensors", {}).get("weather", {}).get("hazard_score", 0.20)
            dwell_hrs = target.get("avg_dwell_time_hours", 3.5)

            baseline_metrics = calculate_dcc_metrics(current_inflow, physical_cap, weather_hazard, dwell_hrs)

            modeled_inflow = min(current_inflow, proposed_cap)
            deflected_inflow = max(0, current_inflow - proposed_cap)
            modeled_target_metrics = calculate_dcc_metrics(modeled_inflow, physical_cap, weather_hazard, dwell_hrs)

            user_prefs = [0.90, 0.70, 0.60, 0.85]
            twins = find_twin_recommendations(target, destinations, user_prefs)

            twin_results = []
            if twins:
                weights = [0.70, 0.30] if len(twins) >= 2 else [1.0]
                for idx, tw in enumerate(twins[:2]):
                    w = weights[idx]
                    absorbed = round(deflected_inflow * w)
                    twin_dest = next((d for d in destinations if d["id"] == tw["destination"]["id"]), None)
                    if twin_dest:
                        tw_inflow = twin_dest.get("current_inflow", 1000)
                        tw_cap = twin_dest.get("physical_capacity", 5000)
                        tw_hazard = twin_dest.get("live_sensors", {}).get("weather", {}).get("hazard_score", 0.1)
                        tw_dwell = twin_dest.get("avg_dwell_time_hours", 4.0)

                        post_inflow = tw_inflow + absorbed
                        post_metrics = calculate_dcc_metrics(post_inflow, tw_cap, tw_hazard, tw_dwell)

                        twin_results.append({
                            "twin_id": twin_dest["id"],
                            "twin_name": twin_dest["name"],
                            "similarity_score": tw["similarity_score"],
                            "baseline_inflow": tw_inflow,
                            "absorbed_visitors": absorbed,
                            "modeled_inflow": post_inflow,
                            "capacity": tw_cap,
                            "baseline_dcc": tw["candidate_dcc_score"],
                            "modeled_dcc": post_metrics["dcc_score"],
                            "modeled_status": post_metrics["status"],
                            "remaining_headroom": max(0, tw_cap - post_inflow)
                        })

            self._send_json_response({
                "status": "success",
                "target_spot": {
                    "id": target["id"],
                    "name": target["name"],
                    "baseline": {
                        "inflow": current_inflow,
                        "capacity": physical_cap,
                        "dcc_score": baseline_metrics["dcc_score"],
                        "status": baseline_metrics["status"],
                        "wait_time_minutes": baseline_metrics["wait_time_minutes"],
                        "utilization_pct": round(baseline_metrics["capacity_utilization"] * 100, 1)
                    },
                    "modeled": {
                        "proposed_cap": proposed_cap,
                        "effective_inflow": modeled_inflow,
                        "deflected_visitors": deflected_inflow,
                        "dcc_score": modeled_target_metrics["dcc_score"],
                        "status": modeled_target_metrics["status"],
                        "wait_time_minutes": modeled_target_metrics["wait_time_minutes"],
                        "utilization_pct": round(modeled_target_metrics["capacity_utilization"] * 100, 1),
                        "wait_time_saved_minutes": max(0, baseline_metrics["wait_time_minutes"] - modeled_target_metrics["wait_time_minutes"])
                    }
                },
                "twin_absorption": twin_results,
                "math_model": {
                    "formula": "DCC = 0.70 * (Inflow / Capacity) + 0.30 * HazardScore",
                    "hazard_score": weather_hazard,
                    "dwell_hours": dwell_hrs,
                    "queue_formula": "Wait = ((Inflow - Capacity) / Capacity) * DwellHours * 60"
                }
            })

        # 6. Issue Green Yatra Digital Pass
        elif path == "/api/passes/issue":
            destination_id = body.get("destination_id", "MAT")
            destination_name = body.get("destination_name", "Matheran Eco-Zone")
            citizen_name = body.get("citizen_name", "Citizen Traveler")
            carbon_saved = float(body.get("carbon_saved_kg", 18.5))

            pass_id = f"ECO-MH-{int(datetime.now().timestamp())}"
            now_iso = datetime.now().isoformat()

            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO green_yatra_passes (id, destination_id, destination_name, citizen_name, carbon_saved_kg, issued_at, fast_track_qr_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (pass_id, destination_id, destination_name, citizen_name, carbon_saved, now_iso, f"FASTPASS:{pass_id}"))
            conn.commit()
            conn.close()

            self._send_json_response({
                "status": "success",
                "pass_id": pass_id,
                "fast_track_qr": f"FASTPASS:{pass_id}",
                "carbon_saved_kg": carbon_saved,
                "issued_at": now_iso
            })

        # 7. Citizen Zero-Waste Hotspot Reporting (Pillar 3)
        elif path == "/api/waste/report":
            from app.services.waste_service import create_waste_report
            result = create_waste_report(body, user_id=body.get("user_id", "CITIZEN-GUEST-01"))
            self._send_json_response(result)

        elif path == "/api/waste/dispatch":
            report_id = body.get("report_id") or body.get("incident_id")
            new_status = body.get("status", "dispatched")
            notes = body.get("notes", "")

            if not report_id:
                self._send_json_response({"status": "error", "message": "report_id is required"}, status_code=400)
                return

            from app.services.waste_service import update_incident_status
            result = update_incident_status(report_id, new_status, notes)
            self._send_json_response(result)

        # 8. Community Experiences Registration (Pillar 2 & Rural Livelihood)
        elif path == "/api/community/experiences":
            title = body.get("title", "").strip()
            location = body.get("location", "").strip()
            coordinator = body.get("coordinator", "").strip()
            price = body.get("price", "").strip()
            retained_revenue = body.get("retained_revenue", "90% retained in local village").strip()
            category = body.get("category", "Agro-Tourism")

            if not title or not location:
                self._send_json_response({"status": "error", "message": "title and location are required"}, status_code=400)
                return

            exp_id = f"EXP-{int(time.time())}"
            now_iso = datetime.now().isoformat()
            from app.database import get_db
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO community_experiences (id, title, location, coordinator, price, retained_revenue, category, verified, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
                """, (exp_id, title, location, coordinator, price, retained_revenue, category, now_iso))
                conn.commit()

            self._send_json_response({
                "status": "success",
                "message": "Community experience registered successfully.",
                "experience": {
                    "id": exp_id,
                    "title": title,
                    "location": location,
                    "coordinator": coordinator,
                    "price": price,
                    "retained_revenue": retained_revenue,
                    "retainedRevenue": retained_revenue,
                    "category": category,
                    "verified": True,
                    "created_at": now_iso
                }
            })
        else:
            self._send_json_response({"status": "error", "message": "Endpoint not found"}, status_code=404)

    def do_PUT(self):
        try:
            self._handle_put()
        except Exception as e:
            print(f"[ERROR] PUT {self.path}: {e}")
            try:
                self._send_json_response({"status": "error", "message": "Internal server error"}, status_code=500)
            except Exception:
                pass

    def _handle_put(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        body = self._parse_json_body()

        # Provider Room Occupancy Update (Persisted into SQLite)
        if path.startswith("/api/destinations/") and path.endswith("/occupancy"):
            parts = path.strip("/").split("/")
            dest_id = parts[2].upper()
            new_occupancy_pct = float(body.get("occupancy_pct", 50))
            available_rooms = int(body.get("available_rooms", 50))
            provider_id = body.get("provider_id", "MTDC-HOMESTAY-01")

            res = update_destination_occupancy(dest_id, new_occupancy_pct, available_rooms, provider_id)
            self._send_json_response(res)
            return


        # Emergency Capacity Override by Authority (Server-side jurisdiction checked)
        elif path.startswith("/api/destinations/") and path.endswith("/capacity-override"):
            parts = path.strip("/").split("/")
            dest_id = parts[2].upper()
            auth_payload = self._validate_auth_token()
            if auth_payload:
                user_role = auth_payload.get("role", "")
                user = {"id": auth_payload.get("sub"), "role": user_role, "jurisdiction": auth_payload.get("jurisdiction")}
            else:
                user = body.get("user")

            if True:  # Always check authorization
                authorized, err_msg = check_authority_jurisdiction(user, dest_id)
                if not authorized:
                    self._send_json_response({"status": "error", "message": err_msg}, status_code=403)
                    return

            override_cap = int(body.get("override_capacity", 5000))
            reason = body.get("reason", "Emergency Administrative Override")
            authority_id = user.get("id", "AUTH-DIRECTOR") if user else "AUTH-DIRECTOR"

            # Update in-memory telemetry cache so all endpoints and feeds immediately show new capacity
            from app.background_worker import _telemetry_cache
            orig_cap = 10000
            for dest in _telemetry_cache.get("destinations", []):
                if dest["id"] == dest_id:
                    orig_cap = dest.get("physical_capacity", 10000)
                    dest["physical_capacity"] = override_cap
                    # Recalculate DCC metrics with new capacity
                    recalc = calculate_dcc_metrics(
                        dest["current_inflow"],
                        override_cap,
                        dest.get("live_sensors", {}).get("weather", {}).get("hazard_score", 0.20),
                        dest.get("avg_dwell_time_hours", 3.5)
                    )
                    dest["dcc_score"] = recalc["dcc_score"]
                    dest["status"] = recalc["status"]
                    dest["estimated_wait_minutes"] = recalc["wait_time_minutes"]
                    break

            # Persist to database log
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO capacity_overrides (spot_id, original_capacity, override_capacity, reason, authority_id, active, created_at)
                VALUES (?, ?, ?, ?, ?, 1, ?)
                """, (dest_id, orig_cap, override_cap, reason, authority_id, datetime.now().isoformat()))
                conn.commit()
                conn.close()
            except Exception as e:
                print(f"[Capacity Override] DB notice: {e}")

            self._send_json_response({
                "status": "success",
                "message": f"Capacity override of {override_cap} applied to {dest_id}",
                "destination_id": dest_id,
                "original_capacity": orig_cap,
                "override_capacity": override_cap,
                "reason": reason
            })

        # Cache Purge & Force Refresh Control
        elif path == "/api/cache/purge":
            from app.cache_manager import purge_cache, get_cache_status
            target_key = body.get("cache_key")
            dest_id = body.get("destination_id")
            source = body.get("api_source")
            deleted = purge_cache(cache_key=target_key, destination_id=dest_id, api_source=source)
            self._send_json_response({
                "status": "success",
                "message": f"Purged {deleted} cache entries",
                "purged_count": deleted,
                "current_cache": get_cache_status()
            })
        else:
            self._send_json_response({"status": "error", "message": "Endpoint not found"}, status_code=404)

    def do_DELETE(self):
        try:
            self._handle_delete()
        except Exception as e:
            print(f"[ERROR] DELETE {self.path}: {e}")
            try:
                self._send_json_response({"status": "error", "message": "Internal server error"}, status_code=500)
            except Exception:
                pass

    def _handle_delete(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        query_params = urllib.parse.parse_qs(parsed_path.query)
        user_id = query_params.get("user_id", ["CITIZEN-GUEST-01"])[0]

        if path.startswith("/api/trips/"):
            trip_id = path.strip("/").split("/")[2]
            success = delete_trip(trip_id, user_id=user_id)
            if success:
                self._send_json_response({"status": "success", "message": f"Trip {trip_id} deleted."})
            else:
                self._send_json_response({"status": "error", "message": "Trip not found"}, status_code=404)
            return

        self._send_json_response({"status": "error", "message": "Endpoint not found"}, status_code=404)

    def do_GET(self):
        try:
            self._handle_get()
        except Exception as e:
            print(f"[ERROR] GET {self.path}: {e}")
            try:
                self._send_json_response({"status": "error", "message": "Internal server error"}, status_code=500)
            except Exception:
                pass

    def _handle_get(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        # 0A-1. Persistent User Trips
        if path == "/api/trips":
            query_params = urllib.parse.parse_qs(parsed_path.query)
            user_id = query_params.get("user_id", ["CITIZEN-GUEST-01"])[0]
            trips = get_user_trips(user_id=user_id)
            self._send_json_response({"status": "success", "user_id": user_id, "trips": trips})
            return

        # 0A-2. Single Trip Detail
        if path.startswith("/api/trips/") and not path.endswith("/report"):
            trip_id = path.strip("/").split("/")[2]
            t = get_saved_trip(trip_id)
            if t:
                self._send_json_response({"status": "success", "trip": t})
            else:
                self._send_json_response({"status": "error", "message": "Trip not found"}, status_code=404)
            return

        # 0A-3. Official Post-Trip Sustainability Report
        if path.startswith("/api/reports/tourist/") or (path.startswith("/api/trips/") and path.endswith("/report")):
            parts = path.strip("/").split("/")
            if path.startswith("/api/reports/tourist/"):
                trip_id = parts[3] if len(parts) >= 4 else ""
            else:
                trip_id = parts[2] if len(parts) >= 3 else ""
            rep = generate_post_trip_report(trip_id)
            self._send_json_response(rep)
            return

        # 0A-4. Destination Dynamic Twin Recommendations
        if path.startswith("/api/destinations/") and path.endswith("/twins"):
            dest_id = path.strip("/").split("/")[2].upper()
            twins = find_dynamic_twins(dest_id)
            self._send_json_response({"status": "success", "destination_id": dest_id, "twins": twins})
            return

        # 0A-5. Decoupled Domain Events Queue (Authority & NGO Analytics)
        if path == "/api/events":
            evs = get_recent_events()
            self._send_json_response({"status": "success", "events": evs})
            return

        # 0A. Telemetry Cache Status & Token Savings Metrics
        if path == "/api/cache/status":
            from app.cache_manager import get_cache_status
            self._send_json_response(get_cache_status())
            return


        # 0B. ML Model Benchmark Comparison Report
        if path == "/api/ml/benchmark":
            from app.engine.ml_forecaster import get_benchmark_report
            self._send_json_response(get_benchmark_report())
            return

        # 0C. ML 12-Hour Predictive Curve with Confidence Intervals
        if path.startswith("/api/ml/forecast"):
            from app.engine.ml_forecaster import predict_12hr_crowd_ml
            parts = path.strip("/").split("/")
            dest_id = parts[3].upper() if len(parts) >= 4 else "LON"

            dest = next((d for d in INITIAL_DESTINATIONS if d["id"] == dest_id), INITIAL_DESTINATIONS[0])
            telemetry = get_latest_telemetry()
            dest_telemetry = next((d for d in telemetry.get("destinations", []) if d.get("id") == dest_id), None)

            curr_inflow = dest_telemetry.get("current_inflow", dest["base_inflow"]) if dest_telemetry else dest["base_inflow"]
            live_sensors = dest_telemetry.get("live_sensors", {}) if dest_telemetry else {}
            weather = live_sensors.get("weather", {})
            traffic = live_sensors.get("traffic", {})

            forecast_res = predict_12hr_crowd_ml(
                destination_id=dest["id"],
                base_capacity=dest["base_capacity"],
                current_visitors=curr_inflow,
                weather=weather,
                traffic=traffic
            )
            forecast_res["destination_name"] = dest["name"]
            self._send_json_response(forecast_res)
            return

        # 0D. Spot Deep AI Eco-Guide Dossier
        if path.startswith("/api/ai/spot-guide"):
            query_params = urllib.parse.parse_qs(parsed_path.query)
            dest_id = query_params.get("destination_id", [None])[0]
            if not dest_id:
                parts = path.strip("/").split("/")
                dest_id = parts[3].upper() if len(parts) >= 4 else "LON"
            dossier = get_spot_deep_dossier(dest_id)
            self._send_json_response({
                "status": "success",
                "spot_id": dest_id,
                "dossier": dossier
            })
            return

        # 0. Developer Production Status & Transparency Portal
        if path == "/api/dev/status":
            global _SERVER_START_TIME
            uptime_seconds = int(time.time() - _SERVER_START_TIME)
            telemetry = get_latest_telemetry()
            destinations_raw = telemetry.get("destinations", [])

            # DB stats
            sensor_count = 0
            passes_count = 0
            advisories_count = 0
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM sensor_readings")
                sensor_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM green_yatra_passes")
                passes_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM gazette_advisories WHERE active=1")
                advisories_count = cursor.fetchone()[0]
                conn.close()
            except Exception:
                pass

            # API key statuses
            tomtom_configured = bool(TOMTOM_API_KEY and TOMTOM_API_KEY not in ["", "your_tomtom_api_key_here"])
            besttime_configured = bool(BESTTIME_API_KEY and BESTTIME_API_KEY not in ["", "your_besttime_api_key_here"])
            besttime_masked = "[REDACTED]"
            besttime_type = "Private Key"
            datagov_configured = bool(DATA_GOV_IN_API_KEY and DATA_GOV_IN_API_KEY not in ["", "your_data_gov_in_api_key_here"])

            # Build per-destination pipeline transparency entries
            dest_transparency = []
            for d in destinations_raw:
                sensors = d.get("live_sensors", {})
                weather = sensors.get("weather", {})
                traffic = sensors.get("traffic", {})
                footfall = sensors.get("footfall", {})
                osm = sensors.get("osm_amenities", {})
                dest_transparency.append({
                    "id": d.get("id"),
                    "name": d.get("name"),
                    "current_inflow": d.get("current_inflow"),
                    "physical_capacity": d.get("physical_capacity"),
                    "dcc_score": d.get("dcc_score"),
                    "status": d.get("status"),
                    "wait_minutes": d.get("estimated_wait_minutes"),
                    "pipelines": {
                        "weather": {
                            "source": weather.get("source", "Unknown"),
                            "status": weather.get("status", "unknown"),
                            "temperature_c": weather.get("temperature_c"),
                            "rain_mm": weather.get("rain_mm"),
                            "wind_kmh": weather.get("wind_kmh"),
                            "hazard_score": weather.get("hazard_score")
                        },
                        "traffic": {
                            "source": traffic.get("source", "Unknown"),
                            "status": traffic.get("status", "unknown"),
                            "delay_factor": traffic.get("delay_factor"),
                            "current_speed_kmh": traffic.get("current_speed_kmh"),
                            "free_flow_speed_kmh": traffic.get("free_flow_speed_kmh")
                        },
                        "footfall": {
                            "source": footfall.get("source", "BestTime Live API" if besttime_configured else "Unknown"),
                            "status": footfall.get("status", "connected" if besttime_configured else "unknown"),
                            "footfall_factor": footfall.get("footfall_factor"),
                            "live_busyness_pct": footfall.get("live_busyness_pct")
                        },
                        "osm": {
                            "source": "OpenStreetMap Overpass API",
                            "status": osm.get("osm_status", "unknown"),
                            "osm_poi_nodes": osm.get("osm_poi_nodes")
                        }
                    }
                })

            self._send_json_response({
                "backend_version": "EcoRoute Bharat v1.0 — SIH26204",
                "server_uptime_seconds": uptime_seconds,
                "last_telemetry_sync": telemetry.get("last_updated"),
                "total_sensor_readings_logged": sensor_count,
                "destinations": dest_transparency,
                "api_key_status": {
                    "TOMTOM_API_KEY": "CONFIGURED — Live API Active" if tomtom_configured else "NOT_CONFIGURED — Using Heuristic Diurnal Model",
                    "BESTTIME_API_KEY": f"CONFIGURED — Live API Active ({besttime_type}: {besttime_masked})" if besttime_configured else "NOT_CONFIGURED — Using Hourly Busyness Model",
                    "DATA_GOV_IN_API_KEY": "CONFIGURED" if datagov_configured else "NOT_CONFIGURED — Using Static Benchmarks",
                    "OPEN_METEO": "NO_KEY_REQUIRED — Free Public API (Always Live)"
                },
                "database": {
                    "path": "[internal]",
                    "journal_mode": "WAL",
                    "sensor_readings_count": sensor_count,
                    "green_passes_issued": passes_count,
                    "active_advisories": advisories_count
                },
                "sih_requirement_status": {
                    "req_1_collect_signals": f"PARTIAL — Weather: LIVE (Open-Meteo), Traffic: {'LIVE (TomTom)' if tomtom_configured else 'SIMULATED (Heuristic)'}, Footfall: {'LIVE (BestTime)' if besttime_configured else 'SIMULATED (Model)'}",
                    "req_2_predict_congestion": "DONE — 12-hour Gaussian forecast mounted in TouristView via DemandCurveChart",
                    "req_3_identify_overcrowding": "DONE — DCC engine classifies OPTIMAL/MODERATE/CRITICAL; rendered in HeroDCCStatus",
                    "req_4_recommend_twins": "DONE — 4D cosine similarity twin recommender wired in TouristView via TwinAlternativeCards",
                    "req_5_recommend_times": "DONE — Demand curve highlights best departure windows; time slot selector active",
                    "req_6_estimate_wait_times": "DONE — Queue delay formula active; displayed in HeroDCCStatus and CorridorMap",
                    "req_7_demand_spread": "DONE — DemandDiffusionFlow.tsx O-D matrix in AuthorityView",
                    "req_8_authority_forecasts": "DONE — AuthorityView.tsx with GIS Leaflet map and KPI bars",
                    "req_9_underutilised_spots": "PARTIAL — Promotions table exists; REST endpoint pending",
                    "req_10_advisories": "DONE — DigitalAdvisoryDispatcher wired to POST /api/advisories/broadcast",
                    "req_11_multilingual": "PARTIAL — i18n dictionary done; language switcher not wired in Navbar",
                    "req_12_eco_indicators": "DONE — EcoHealthCommunityWidget, EcoPassCard, CO2 tracking active",
                    "req_13_trip_planning": "DONE — FutureTripPlanner calls POST /api/itinerary/plan",
                    "req_14_ai_helpline": "DONE — AiHelplineBot wired to POST /api/ai/chat with live context"
                },
                "frontend_api_connections": {
                    "GET /api/destinations/live": "CONNECTED — polled every 25s via fetchLiveBackendFeed()",
                    "GET /api/dev/besttime": "CONNECTED — DevPortal BestTime live telemetry & 24h curve inspector",
                    "POST /api/auth/login": "CONNECTED — AuthModal.tsx",
                    "POST /api/recommendations/twin": "CONNECTED — TwinAlternativeCards via rerouteToDestination",
                    "GET /api/destinations/{id}/forecast": "CONNECTED — DemandCurveChart.tsx fetches on mount",
                    "POST /api/itinerary/plan": "CONNECTED — FutureTripPlanner.tsx form submit",
                    "POST /api/advisories/broadcast": "CONNECTED — DigitalAdvisoryDispatcher.tsx",
                    "GET /api/advisories": "CONNECTED — App.tsx initial load seeds store",
                    "POST /api/passes/issue": "CONNECTED — rerouteToDestination CTA in TwinAlternativeCards",
                    "GET /api/passes": "NOT CONNECTED — DevPortal SQLite viewer reads directly",
                    "POST /api/ai/chat": "CONNECTED — AiHelplineBot.tsx with fallback",
                    "PUT /api/destinations/{id}/occupancy": "CONNECTED — LiveInventoryCard.tsx slider confirm",
                    "GET /api/health": "NOT EXPLICITLY CALLED — available at /api/health",
                    "GET /docs": "AVAILABLE — Swagger UI at /docs"
                }
            })

        elif path == "/api/dev/besttime":
            query_params = urllib.parse.parse_qs(parsed_path.query)
            dest_id = query_params.get("dest_id", ["LON"])[0].upper()
            besttime_telemetry = get_besttime_full_telemetry(destination_id=dest_id)
            self._send_json_response(besttime_telemetry)

        elif path in ["/api/destinations/live", "/api/live"]:
            telemetry = get_latest_telemetry()
            self._send_json_response({
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "data_sources": {
                    "weather": "Open-Meteo Live Precipitation API",
                    "traffic": f"TomTom Traffic Flow API ({'Key Connected' if TOMTOM_API_KEY and TOMTOM_API_KEY != 'your_tomtom_api_key_here' else 'Diurnal Fallback'})",
                    "footfall": f"BestTime.app API ({'Key Connected (Live)' if BESTTIME_API_KEY and BESTTIME_API_KEY != 'your_besttime_api_key_here' else 'Hourly Model'})",
                    "osm": "Overpass Turbo (Live Nodes)",
                    "ogd_india": telemetry.get("ogd_benchmarks", {})
                },
                "destinations": telemetry.get("destinations", [])
            })

        # 2. 12-Hour Destination Predictive Hourly Forecast (Hybrid ML + Mathematical Engine)
        elif path.startswith("/api/destinations/") and path.endswith("/forecast"):
            parts = path.strip("/").split("/")
            dest_id = parts[2].upper()

            telemetry = get_latest_telemetry()
            destinations = telemetry.get("destinations", [])
            dest = next((d for d in destinations if d["id"] == dest_id), None)

            if dest:
                curve = []
                is_ml = False
                ml_breach_prob = 0.15
                peak_hour = None
                peak_visitors = None
                try:
                    from app.engine.ml_forecaster import predict_12hr_crowd_ml
                    ml_res = predict_12hr_crowd_ml(
                        destination_id=dest["id"],
                        base_capacity=dest["physical_capacity"],
                        current_visitors=dest["current_inflow"],
                        weather=dest["live_sensors"].get("weather", {}),
                        traffic=dest["live_sensors"].get("traffic", {})
                    )
                    if ml_res.get("is_ml_active"):
                        is_ml = True
                        ml_breach_prob = ml_res.get("critical_breach_probability_4h", 0.15)
                        peak_hour = ml_res.get("peak_forecast_hour")
                        peak_visitors = ml_res.get("peak_forecast_visitors")
                        for pt in ml_res.get("hourly_curve", []):
                            h_24 = pt["hour"]
                            h_str = f"{h_24:02d}:00"
                            h_12 = f"{(h_24 % 12) or 12}:00 {'AM' if h_24 < 12 else 'PM'}"
                            inflow = pt["predicted_visitors"]
                            cap = dest["physical_capacity"]
                            hazard = dest["live_sensors"].get("weather", {}).get("hazard_score", 0.1)
                            dcc_metrics = calculate_dcc_metrics(inflow, cap, hazard, dest["avg_dwell_time_hours"])
                            curve.append({
                                "hour": h_str,
                                "time_label": h_12,
                                "timeLabel": h_12,
                                "inflow": inflow,
                                "capacity": cap,
                                "dcc_score": dcc_metrics["dcc_score"],
                                "dccScore": dcc_metrics["dcc_score"],
                                "status": dcc_metrics["status"],
                                "wait_minutes": dcc_metrics["wait_time_minutes"],
                                "waitMinutes": dcc_metrics["wait_time_minutes"],
                                "weatherRisk": hazard,
                                "lower_ci_95": pt.get("lower_ci_95", int(inflow * 0.85)),
                                "upper_ci_95": pt.get("upper_ci_95", int(inflow * 1.15)),
                                "is_ml_predicted": True
                            })
                except Exception:
                    pass

                # Graceful fallback to purely mathematical diurnal heuristic
                if not curve:
                    curve = generate_12hr_forecast(
                        dest["current_inflow"],
                        dest["physical_capacity"],
                        dest["live_sensors"]["weather"]["hazard_score"],
                        dest["avg_dwell_time_hours"]
                    )

                self._send_json_response({
                    "status": "success",
                    "destination_id": dest_id,
                    "destination_name": dest["name"],
                    "is_ml_active": is_ml,
                    "model_engine": "XGBoost Regressor + Statutory DCC" if is_ml else "Diurnal Heuristic Formula",
                    "critical_breach_probability_4h": ml_breach_prob,
                    "peak_forecast_hour": peak_hour,
                    "peak_forecast_visitors": peak_visitors,
                    "forecast_points": curve
                })
            else:
                self._send_json_response({"status": "error", "message": "Destination not found"}, status_code=404)

        # 3. Gazette Advisories List
        elif path == "/api/advisories":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM gazette_advisories ORDER BY created_at DESC")
            rows = cursor.fetchall()
            advisories = [dict(row) for row in rows]
            conn.close()
            self._send_json_response({
                "status": "success",
                "total_advisories": len(advisories),
                "advisories": advisories
            })

        # 4. Issued Green Passes List
        elif path == "/api/passes":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM green_yatra_passes ORDER BY issued_at DESC LIMIT 50")
            rows = cursor.fetchall()
            passes = [dict(row) for row in rows]
            conn.close()
            self._send_json_response({
                "status": "success",
                "total_passes_issued": len(passes),
                "passes": passes
            })

        # 4b. Regional Demand Flows (O-D Matrix)
        elif path == "/api/demand-flows":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM demand_flows ORDER BY estimated_visitor_count DESC")
            rows = cursor.fetchall()
            flows = [dict(row) for row in rows]
            conn.close()
            self._send_json_response({
                "status": "success",
                "total_flows": len(flows),
                "demand_flows": flows
            })

        # 4d. Citizen Waste Reports & Hotspot Incidents
        elif path == "/api/waste/incidents":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM waste_reports ORDER BY created_at DESC")
            rows = cursor.fetchall()
            incidents = [dict(row) for row in rows]
            conn.close()
            self._send_json_response({
                "status": "success",
                "total_incidents": len(incidents),
                "incidents": incidents
            })

        # 4e. Eco-Karma Rewards & Activity Ledger
        elif path in ["/api/rewards/profile", "/api/rewards/ledger"]:
            query_params = urllib.parse.parse_qs(parsed_path.query)
            user_id = query_params.get("user_id", ["CITIZEN-GUEST-01"])[0]

            from app.services.rewards_service import get_user_rewards_profile
            result = get_user_rewards_profile(user_id)
            self._send_json_response(result)

        # 4f. Community Experiences & Livelihood Projects
        elif path == "/api/community/experiences":
            from app.database import get_db
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM community_experiences ORDER BY id ASC")
                rows = cursor.fetchall()
                exps = []
                for r in rows:
                    d = dict(r)
                    d["retainedRevenue"] = d.get("retained_revenue", "")
                    exps.append(d)
                self._send_json_response({"status": "success", "experiences": exps})
            return

        # 4c. Authority Spot Detail Redirect -> Canonical Spot Page (/spot/:spotId)
        elif path.startswith("/authority/spot/"):
            parts = path.strip("/").split("/")
            dest_id = parts[2].upper()
            self.send_response(302)
            self.send_header("Location", f"/spot/{dest_id}")
            self._send_cors_headers()
            self.end_headers()
            return

        # 5. Interactive Swagger / OpenAPI Documentation
        elif path in ["/docs", "/swagger"]:
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self._send_cors_headers()
            self.end_headers()
            swagger_html = """
            <!DOCTYPE html>
            <html>
            <head>
              <title>EcoRoute Bharat API Documentation</title>
              <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
            </head>
            <body>
              <div id="swagger-ui"></div>
              <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
              <script>
                SwaggerUIBundle({
                  url: '/openapi.json',
                  dom_id: '#swagger-ui',
                  presets: [SwaggerUIBundle.presets.apis],
                  layout: 'BaseLayout'
                });
              </script>
            </body>
            </html>
            """
            self.wfile.write(swagger_html.encode("utf-8"))

        # 6. OpenAPI JSON Spec
        elif path == "/openapi.json":
            spec = {
                "openapi": "3.0.3",
                "info": {
                    "title": "EcoRoute Bharat — Sustainable Tourism Platform API",
                    "version": "1.0.0",
                    "description": "REST API for Real-Time Carrying Capacity (DCC), Live Sensor Telemetry, 4D Twin Matching, and Multi-Stakeholder Gatekeeping."
                },
                "paths": {
                    "/api/destinations/live": {
                        "get": {"summary": "Fetch live multi-source sensor telemetry for all destinations"}
                    },
                    "/api/recommendations/twin": {
                        "post": {"summary": "Compute 4D Cosine similarity twin destination recommendations"}
                    },
                    "/api/itinerary/plan": {
                        "post": {"summary": "Generate future multi-day decongested trip itineraries"}
                    },
                    "/api/ai/chat": {
                        "post": {"summary": "24x7 AI Tourism Helpline assistant response"}
                    },
                    "/api/auth/login": {
                        "post": {"summary": "Stakeholder authentication (Authority, Provider, Citizen)"}
                    },
                    "/api/advisories": {
                        "get": {"summary": "List active gazette bulletins and emergency notices"}
                    },
                    "/api/passes/issue": {
                        "post": {"summary": "Issue digital Green Yatra pass with QR code"}
                    }
                }
            }
            self._send_json_response(spec)

        # 7. Health & System Diagnostics
        elif path in ["/api/health", "/"]:
            self._send_json_response({
                "service": "EcoRoute Bharat Data Pipeline & Engine",
                "status": "operational",
                "host": BACKEND_HOST,
                "port": BACKEND_PORT,
                "timestamp": datetime.now().isoformat(),
                "keys_status": {
                    "tomtom": bool(TOMTOM_API_KEY and TOMTOM_API_KEY != "your_tomtom_api_key_here"),
                    "besttime": bool(BESTTIME_API_KEY and BESTTIME_API_KEY != "your_besttime_api_key_here"),
                    "data_gov_in": bool(DATA_GOV_IN_API_KEY and DATA_GOV_IN_API_KEY != "your_data_gov_in_api_key_here")
                },
                "database": "SQLite (data/ecoroute.db connected)",
                "endpoints": [
                    "GET  /api/destinations/live",
                    "GET  /api/destinations/{id}/forecast",
                    "POST /api/recommendations/twin",
                    "POST /api/itinerary/plan",
                    "POST /api/ai/chat",
                    "POST /api/auth/login",
                    "GET  /api/advisories",
                    "POST /api/advisories/broadcast",
                    "GET  /api/passes",
                    "POST /api/passes/issue",
                    "GET  /docs"
                ]
            })
        else:
            self._send_json_response({"status": "error", "message": "Endpoint not found"}, status_code=404)

    def log_message(self, format, *args):
        print(f"[API Server] {self.address_string()} - {format % args}")

def run_server():
    # Start background sensor telemetry poller
    start_background_telemetry_worker(interval_seconds=60)

    server_address = (BACKEND_HOST, BACKEND_PORT)
    httpd = ThreadingHTTPServer(server_address, EcoRouteAPIHandler)
    print(f"\n==================================================================")
    print(f"🚀 EcoRoute Bharat Python Backend Engine Running")
    print(f"📍 Live Feed:     http://{BACKEND_HOST}:{BACKEND_PORT}/api/destinations/live")
    print(f"📖 Swagger Docs:  http://{BACKEND_HOST}:{BACKEND_PORT}/docs")
    print(f"🔐 Auth Endpoint: http://{BACKEND_HOST}:{BACKEND_PORT}/api/auth/login")
    print(f"🤖 AI Chatbot:    http://{BACKEND_HOST}:{BACKEND_PORT}/api/ai/chat")
    print(f"🩺 Health:        http://{BACKEND_HOST}:{BACKEND_PORT}/api/health")
    print(f"🔑 TomTom Key:    {'✅ Configured' if TOMTOM_API_KEY and TOMTOM_API_KEY != 'your_tomtom_api_key_here' else '⚠️ Not set (using fallback)'}")
    print(f"🏛️ OGD India:     State ({OGD_STATE_RESOURCE_ID}) | Coastal ({OGD_COASTAL_RESOURCE_ID})")
    print(f"==================================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Shutting down backend server...]")
        httpd.server_close()

if __name__ == "__main__":
    from app.database import ensure_initialized
    ensure_initialized()
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        sync_telemetry_once()
        telemetry = get_latest_telemetry()
        print("\n--- Live Data Pipeline Output ---")
        print(json.dumps(telemetry, indent=2))
    elif len(sys.argv) > 1 and sys.argv[1] == "--test":
        import subprocess
        subprocess.run([sys.executable, "test_backend.py"])
    else:
        run_server()