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

        footfall = fetch_live_footfall("Lonavala")
        self.assertIn("footfall_factor", footfall)

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

if __name__ == "__main__":
    unittest.main(verbosity=2)
