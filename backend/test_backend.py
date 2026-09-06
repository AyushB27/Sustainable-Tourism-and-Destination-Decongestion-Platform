import unittest
import json
import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.config import INITIAL_DESTINATIONS
from app.database import get_db_connection, init_database
from app.engine.dcc_calculator import calculate_dcc_metrics, generate_12hr_forecast
from app.engine.twin_matcher import cosine_similarity, find_twin_recommendations
from app.engine.itinerary_engine import generate_future_itinerary
from app.pipelines.weather_pipeline import fetch_live_weather
from app.pipelines.traffic_pipeline import fetch_live_traffic_delay
from app.pipelines.footfall_pipeline import fetch_live_footfall, scan_osm_amenities
from app.pipelines.ogd_india import fetch_ogd_tourism_benchmarks
from main import STAKEHOLDERS_DIRECTORY

class TestEcoRouteBackend(unittest.TestCase):

    def setUp(self):
        init_database()

    def test_database_connection_and_seeding(self):
        """Verify SQLite tables are initialized and destinations are seeded."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM destinations")
        dest_count = cursor.fetchone()[0]
        self.assertGreaterEqual(dest_count, 7, "Should have at least 7 Western Ghats destinations")

        cursor.execute("SELECT COUNT(*) FROM gazette_advisories")
        adv_count = cursor.fetchone()[0]
        self.assertGreaterEqual(adv_count, 1, "Should have seeded initial gazette advisories")

        conn.close()

    def test_dcc_metrics_calculation(self):
        """Test the Dynamic Carrying Capacity (DCC) index mathematical precision."""
        # 1. Optimal Case: 4,000 inflow / 10,000 capacity with 0.1 hazard
        opt = calculate_dcc_metrics(4000, 10000, 0.10, 3.5)
        self.assertEqual(opt["status"], "OPTIMAL")
        self.assertLess(opt["dcc_score"], 0.70)
        self.assertEqual(opt["wait_time_minutes"], 0)

        # 2. Critical Overload Case: 13,000 inflow / 10,000 capacity with 0.8 hazard
        crit = calculate_dcc_metrics(13000, 10000, 0.80, 3.5)
        self.assertEqual(crit["status"], "CRITICAL")
        self.assertGreaterEqual(crit["dcc_score"], 0.85)
        self.assertGreater(crit["wait_time_minutes"], 40, "Overloaded destination should compute queuing delays")

    def test_12hr_forecast_generation(self):
        """Verify 12-hour hourly predictive demand curve structure."""
        forecast = generate_12hr_forecast(5000, 8000, 0.20, 3.0)
        self.assertEqual(len(forecast), 13, "Should generate 13 forecast intervals from 06:00 to 18:00")
        self.assertTrue(any(pt["hour"] == "12:00" for pt in forecast))
        # Peak at midday
        midday = next(pt for pt in forecast if pt["hour"] == "12:00")
        morning = next(pt for pt in forecast if pt["hour"] == "06:00")
        self.assertGreater(midday["inflow"], morning["inflow"], "Midday inflow should exceed dawn inflow")

    def test_cosine_similarity_and_twin_matching(self):
        """Test 4D vector cosine matching between twin destinations."""
        vec1 = [0.90, 0.70, 0.50, 0.90] # Scenic & Family
        vec2 = [0.85, 0.60, 0.70, 0.85] # Similar hill station
        vec_orthogonal = [0.0, 0.0, 0.90, 0.0] # Only adventure

        sim_high = cosine_similarity(vec1, vec2)
        sim_low = cosine_similarity(vec1, vec_orthogonal)

        self.assertGreater(sim_high, 0.85, "Similar hill stations should have >85% cosine match")
        self.assertLess(sim_low, 0.40, "Dissimilar profiles should have low cosine score")

        # Test twin ranking
        lonavala = INITIAL_DESTINATIONS[0]
        twins = find_twin_recommendations(lonavala, INITIAL_DESTINATIONS)
        self.assertGreater(len(twins), 0, "Should return alternative twin recommendations")
        self.assertNotEqual(twins[0]["destination"]["id"], "LON", "Should not recommend target itself")

    def test_future_itinerary_engine(self):
        """Test future trip multi-day decongestion plan generator."""
        itinerary = generate_future_itinerary("2026-09-12", "2-day", "scenic")
        self.assertEqual(itinerary["duration"], "2-day")
        self.assertEqual(len(itinerary["itinerary_days"]), 2)
        self.assertGreater(itinerary["estimated_time_saved_minutes"], 60)
        self.assertGreater(itinerary["estimated_co2_offset_kg"], 10.0)

    def test_pipelines_live_fetch(self):
        """Test live pipelines (Open-Meteo, TomTom, BestTime, OSM, OGD India)."""
        weather = fetch_live_weather(18.7557, 73.4091)
        self.assertIn("temperature_c", weather)
        self.assertIn("hazard_score", weather)

        traffic = fetch_live_traffic_delay(18.7557, 73.4091)
        self.assertIn("delay_factor", traffic)
        self.assertGreaterEqual(traffic["delay_factor"], 1.0)

        footfall = fetch_live_footfall("Lonavala", destination_id="LON")
        self.assertIn("footfall_factor", footfall)
        self.assertIn("live_busyness_pct", footfall)
        self.assertIn(footfall["status"], ["connected", "fallback", "simulated"])
        self.assertTrue(any(s in footfall["source"] for s in ["BestTime", "Live", "Model", "Fallback"]))

        footfall_mat = fetch_live_footfall("Matheran", destination_id="MAT")
        footfall_tap = fetch_live_footfall("Tapola", destination_id="TAP")
        self.assertNotEqual(footfall["footfall_factor"], footfall_mat["footfall_factor"])
        self.assertNotEqual(footfall["live_busyness_pct"], footfall_tap["live_busyness_pct"])

        from app.pipelines.footfall_pipeline import get_besttime_full_telemetry
        bt_full = get_besttime_full_telemetry()
        self.assertIn(bt_full["status"], ["connected", "error", "unconfigured"])
        self.assertEqual(len(bt_full["hourly_curve"]), 24)
        self.assertIn("raw_payload", bt_full)

        osm = scan_osm_amenities(18.7557, 73.4091)
        self.assertIn("osm_poi_nodes", osm)

        ogd = fetch_ogd_tourism_benchmarks()
        self.assertIn("source", ogd)
        self.assertIn("annual_dtv_growth_pct", ogd)

    def test_stakeholder_credentials_directory(self):
        """Verify officer and provider credentials are valid in directory."""
        self.assertIn("pune.collector@gov.in", STAKEHOLDERS_DIRECTORY)
        self.assertIn("MTDC/2026/HOTEL-99", STAKEHOLDERS_DIRECTORY)
        
        collector = STAKEHOLDERS_DIRECTORY["pune.collector@gov.in"]
        self.assertEqual(collector["role"], "authority")
        self.assertEqual(collector["badgeNumber"], "IAS-MH-2018-9412")
        self.assertIsNotNone(collector.get("jurisdiction"))
        self.assertEqual(collector["jurisdiction"]["value"], "Pune")

    def test_jurisdiction_scoping_enforcement(self):
        """Verify server-side jurisdiction scoping rules."""
        from main import check_authority_jurisdiction
        pune_user = STAKEHOLDERS_DIRECTORY["pune.collector@gov.in"]
        raigad_user = STAKEHOLDERS_DIRECTORY["raigad.sp@gov.in"]
        maha_user = STAKEHOLDERS_DIRECTORY["director.tourism@maharashtra.gov.in"]

        # Pune Collector: permitted on LON (Pune District), denied on MAT (Raigad District), denied on ALL
        allowed_pune_lon, _ = check_authority_jurisdiction(pune_user, "LON")
        self.assertTrue(allowed_pune_lon)
        allowed_pune_mat, err_pune_mat = check_authority_jurisdiction(pune_user, "MAT")
        self.assertFalse(allowed_pune_mat)
        self.assertIn("outside your district jurisdiction", err_pune_mat)
        allowed_pune_all, err_pune_all = check_authority_jurisdiction(pune_user, "ALL")
        self.assertFalse(allowed_pune_all)
        self.assertIn("State-level jurisdiction", err_pune_all)

        # Raigad SP: permitted on MAT, ALB, KAS; denied on LON
        allowed_raigad_mat, _ = check_authority_jurisdiction(raigad_user, "MAT")
        self.assertTrue(allowed_raigad_mat)
        allowed_raigad_lon, _ = check_authority_jurisdiction(raigad_user, "LON")
        self.assertFalse(allowed_raigad_lon)

        # State Director: permitted on all spots and corridor-wide ALL
        allowed_maha_lon, _ = check_authority_jurisdiction(maha_user, "LON")
        allowed_maha_mat, _ = check_authority_jurisdiction(maha_user, "MAT")
        allowed_maha_all, _ = check_authority_jurisdiction(maha_user, "ALL")
        self.assertTrue(allowed_maha_lon)
        self.assertTrue(allowed_maha_mat)
        self.assertTrue(allowed_maha_all)

    def test_demand_flows_and_advisory_lifecycle(self):
        """Verify demand_flows and advisory schema with expires_at."""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM demand_flows")
        count = cursor.fetchone()[0]
        self.assertGreaterEqual(count, 1)

        cursor.execute("SELECT * FROM demand_flows WHERE origin_spot_id='LON'")
        flow = cursor.fetchone()
        self.assertIsNotNone(flow)
        self.assertIn("Tier 3", flow["source_tier"])

        cursor.execute("PRAGMA table_info(gazette_advisories)")
        cols = [r["name"] for r in cursor.fetchall()]
        self.assertIn("expires_at", cols)
        self.assertIn("revoked_at", cols)
        conn.close()

    def test_persistent_api_caching(self):
        """Verify persistent database and file-backed cache hit, TTL expiration, and purge."""
        from app.cache_manager import get_cached_telemetry, set_cached_telemetry, purge_cache, get_cache_status

        # 1. Clean test cache key
        test_key = "weather:TEST_DEST"
        purge_cache(cache_key=test_key)
        self.assertIsNone(get_cached_telemetry(test_key))

        # 2. Set cache entry
        test_payload = {
            "temperature_c": 21.5,
            "rain_mm": 0.0,
            "wind_kmh": 14.2,
            "hazard_score": 0.05,
            "source": "Open-Meteo Test Unit",
            "status": "connected"
        }
        set_cached_telemetry(test_key, "TEST_DEST", "weather", test_payload, ttl_seconds=600)

        # 3. Retrieve cache entry and verify metadata
        cached = get_cached_telemetry(test_key)
        self.assertIsNotNone(cached)
        self.assertTrue(cached.get("is_cached"))
        self.assertEqual(cached["temperature_c"], 21.5)
        self.assertGreater(cached["ttl_remaining_seconds"], 0)

        # 4. Verify pipeline integration: fetch_live_weather uses cache
        weather_cached = fetch_live_weather(18.75, 73.40, destination_id="TEST_DEST")
        self.assertTrue(weather_cached.get("is_cached"))
        self.assertEqual(weather_cached["temperature_c"], 21.5)

        # 5. Verify cache status telemetry
        status = get_cache_status()
        self.assertIn("metrics", status)
        self.assertGreaterEqual(status["metrics"]["cache_hits"], 1)
        self.assertGreaterEqual(status["metrics"]["api_tokens_saved"], 1)

        # 6. Purge test cache and verify clean state
        purged = purge_cache(cache_key=test_key)
        self.assertEqual(purged, 1)
        self.assertIsNone(get_cached_telemetry(test_key))

    def test_ml_forecaster_and_benchmarks(self):
        """Verify trained ML crowd forecaster, 12-hour intervals, CI bounds, and benchmark comparisons."""
        from app.engine.ml_forecaster import predict_12hr_crowd_ml, get_benchmark_report
        from app.engine.dcc_calculator import generate_ml_12hr_forecast

        # 1. Benchmark metrics verification
        report = get_benchmark_report()
        self.assertIn("regression_benchmarks", report)
        self.assertIn("classification_benchmarks", report)
        self.assertIn("XGBoost Regressor (EcoRoute Champion)", report["regression_benchmarks"])
        self.assertIn("Naive Persistence (Lag 168h)", report["regression_benchmarks"])
        self.assertIn("Diurnal Heuristic Formula", report["regression_benchmarks"])

        xgb_metrics = report["regression_benchmarks"]["XGBoost Regressor (EcoRoute Champion)"]
        naive_metrics = report["regression_benchmarks"]["Naive Persistence (Lag 168h)"]
        self.assertLess(xgb_metrics["mae"], naive_metrics["mae"], "XGBoost MAE must be lower than naive persistence")
        self.assertGreater(xgb_metrics["r2"], 0.50, "XGBoost R2 score must exceed 0.50")

        cls_metrics = report["classification_benchmarks"]["XGBoost Early-Warning Classifier"]
        self.assertGreaterEqual(cls_metrics["recall"], 0.90, "Critical breach recall must be at least 90%")

        # 2. Real-time inference verification
        pred = predict_12hr_crowd_ml("LON", 10000, 4800)
        self.assertTrue(pred["is_ml_active"])
        self.assertEqual(pred["destination_id"], "LON")
        self.assertEqual(len(pred["hourly_curve"]), 12)
        self.assertGreaterEqual(pred["critical_breach_probability_4h"], 0.0)
        self.assertLessEqual(pred["critical_breach_probability_4h"], 1.0)

        for step in pred["hourly_curve"]:
            self.assertIn("predicted_visitors", step)
            self.assertIn("lower_ci_95", step)
            self.assertIn("upper_ci_95", step)
            self.assertGreaterEqual(step["upper_ci_95"], step["lower_ci_95"])
            self.assertGreater(step["predicted_visitors"], 0)

        # 3. DCC calculator integration hook
        dcc_ml = generate_ml_12hr_forecast("MAT", 5000, 1200)
        self.assertEqual(len(dcc_ml["hourly_curve"]), 12)
        self.assertEqual(dcc_ml["destination_id"], "MAT")

if __name__ == "__main__":
    unittest.main(verbosity=2)

