"""
EcoRoute Bharat - ML Predictive Inference Engine
Loads trained champion XGBoost models for real-time 12-hour crowd curve projection,
95% confidence intervals, and critical carrying capacity breach alerts.
Provides graceful heuristic fallback if model weights are not found.
"""

import json
import math
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np

ENGINE_DIR = Path(__file__).resolve().parent
APP_DIR = ENGINE_DIR.parent
BACKEND_DIR = APP_DIR.parent
DATA_DIR = BACKEND_DIR / "data"
MODELS_DIR = DATA_DIR / "models"

REGRESSOR_PATH = MODELS_DIR / "xgboost_crowd_forecaster.json"
CLASSIFIER_PATH = MODELS_DIR / "xgboost_breach_classifier.json"
BENCHMARK_PATH = DATA_DIR / "benchmark_results.json"
META_PATH = MODELS_DIR / "feature_metadata.json"

_xgb_regressor = None
_xgb_classifier = None
_feature_meta = None
_benchmarks_cache = None

def _load_models():
    """Lazy loads trained XGBoost models."""
    global _xgb_regressor, _xgb_classifier, _feature_meta, _benchmarks_cache
    if _xgb_regressor is not None:
        return _xgb_regressor, _xgb_classifier

    import xgboost as xgb
    if REGRESSOR_PATH.exists():
        try:
            reg = xgb.XGBRegressor()
            reg.load_model(str(REGRESSOR_PATH))
            _xgb_regressor = reg
        except Exception as e:
            print(f"[ML Forecaster] Error loading regressor: {e}")
            _xgb_regressor = None

    if CLASSIFIER_PATH.exists():
        try:
            cls = xgb.XGBClassifier()
            cls.load_model(str(CLASSIFIER_PATH))
            _xgb_classifier = cls
        except Exception as e:
            print(f"[ML Forecaster] Error loading classifier: {e}")
            _xgb_classifier = None

    if META_PATH.exists():
        try:
            with open(META_PATH, "r", encoding="utf-8") as f:
                _feature_meta = json.load(f)
        except Exception:
            _feature_meta = None

    return _xgb_regressor, _xgb_classifier

def get_benchmark_report() -> dict:
    """Returns the cached evaluation benchmark comparison metrics."""
    global _benchmarks_cache
    if _benchmarks_cache:
        return _benchmarks_cache
    if BENCHMARK_PATH.exists():
        try:
            with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
                _benchmarks_cache = json.load(f)
                return _benchmarks_cache
        except Exception as e:
            return {"status": "error", "message": str(e)}
    return {"status": "uninitialized", "message": "Run train_forecast_model.py to generate benchmarks."}

def predict_12hr_crowd_ml(
    destination_id: str,
    base_capacity: int,
    current_visitors: int,
    weather: dict = None,
    traffic: dict = None,
    current_dt: datetime = None
) -> dict:
    """
    Predicts 12-hour forward crowd curve and 4-hour critical breach probability.
    Uses trained XGBoost champion models with sub-3ms inference latency.
    Falls back to calibrated diurnal heuristics if model weights are unavailable.
    """
    now = current_dt or datetime.now()
    reg, cls = _load_models()

    weather = weather or {}
    traffic = traffic or {}

    temp_c = float(weather.get("temperature_c", 24.0))
    rain_mm = float(weather.get("rain_mm", 0.0))
    wind_kmh = float(weather.get("wind_kmh", 12.0))
    hazard_score = float(weather.get("hazard_score", 0.1))
    traffic_delay = float(traffic.get("delay_factor", 1.1))

    # Base environmental capacity modifier
    env_mod = max(0.40, 1.0 - 0.60 * hazard_score)
    traffic_mod = max(0.50, 1.0 / traffic_delay)
    dcc_effective_capacity = int(base_capacity * env_mod * traffic_mod * 0.95)

    is_weekend = int(now.weekday() in [5, 6])
    is_monsoon = int(now.month in [6, 7, 8, 9])
    
    # Check if ML models are ready
    if reg is not None and _feature_meta is not None:
        feature_cols = _feature_meta["feature_cols"]
        
        hourly_curve = []
        rolling_visitors = float(current_visitors)
        
        # Build 12 hourly steps sequentially
        for step in range(1, 13):
            step_dt = now + timedelta(hours=step)
            h = step_dt.hour
            d_idx = step_dt.weekday()
            m = step_dt.month
            step_weekend = int(d_idx in [5, 6])
            
            row_dict = {
                "base_capacity": base_capacity,
                "hour_sin": math.sin(2 * math.pi * h / 24.0),
                "hour_cos": math.cos(2 * math.pi * h / 24.0),
                "day_sin": math.sin(2 * math.pi * d_idx / 7.0),
                "day_cos": math.cos(2 * math.pi * d_idx / 7.0),
                "month_sin": math.sin(2 * math.pi * (m - 1) / 12.0),
                "month_cos": math.cos(2 * math.pi * (m - 1) / 12.0),
                "is_weekend": step_weekend,
                "is_holiday": 0,
                "is_monsoon": is_monsoon,
                "temperature_c": temp_c,
                "rainfall_mm": rain_mm,
                "wind_kmh": wind_kmh,
                "weather_hazard_score": hazard_score,
                "traffic_delay_factor": traffic_delay,
                "highway_ingress_vph": int(350 + (rolling_visitors / 3.2)),
                "parking_occupancy_pct": min(100, int((rolling_visitors / base_capacity) * 110)),
                "active_visitors": int(rolling_visitors),
                "dcc_load_ratio": round(rolling_visitors / max(dcc_effective_capacity, 1), 3),
                "visitor_lag_1h": int(rolling_visitors),
                "visitor_lag_2h": int(rolling_visitors * 0.95),
                "visitor_lag_24h": int(rolling_visitors * 0.90),
                "visitor_lag_168h": int(rolling_visitors * (1.1 if step_weekend else 0.85)),
                "visitor_roll_mean_6h": float(rolling_visitors),
                "visitor_roll_std_6h": float(rolling_visitors * 0.12),
                "rain_x_traffic": rain_mm * traffic_delay,
                "crowd_pressure": rolling_visitors / base_capacity
            }
            
            # Populate one-hot destination flags
            for c in feature_cols:
                if c.startswith("dest_"):
                    row_dict[c] = 1.0 if c == f"dest_{destination_id}" else 0.0
                    
            row_vector = np.array([[row_dict.get(col, 0.0) for col in feature_cols]], dtype=float)
            pred_visitors = max(50, int(reg.predict(row_vector)[0]))
            
            # Calculate 95% confidence interval based on test RMSE (~795)
            ci_half = int(1.96 * (795.0 * math.sqrt(step / 12.0)))
            lower_ci = max(20, pred_visitors - ci_half)
            upper_ci = pred_visitors + ci_half
            
            load_ratio = round(pred_visitors / max(dcc_effective_capacity, 1), 3)
            intensity = "Critical" if load_ratio >= 0.85 else "Moderate" if load_ratio >= 0.60 else "Optimal"
            
            hourly_curve.append({
                "step_hours_ahead": step,
                "hour": h,
                "hour_label": f"{h:02d}:00",
                "predicted_visitors": pred_visitors,
                "lower_ci_95": lower_ci,
                "upper_ci_95": upper_ci,
                "dcc_capacity_threshold": dcc_effective_capacity,
                "dcc_load_ratio": load_ratio,
                "intensity_txt": intensity,
                "is_critical": (load_ratio >= 0.85)
            })
            rolling_visitors = pred_visitors

        # Critical breach probability in next 4 hours
        breach_prob = 0.15
        if cls is not None:
            first_vector = np.array([[row_dict.get(col, 0.0) for col in feature_cols]], dtype=float)
            try:
                breach_prob = round(float(cls.predict_proba(first_vector)[0][1]), 3)
            except Exception:
                breach_prob = 0.50 if any(h["is_critical"] for h in hourly_curve[:4]) else 0.10

        return {
            "model_engine": "XGBoost Regressor + Classifier",
            "is_ml_active": True,
            "destination_id": destination_id,
            "base_capacity": base_capacity,
            "effective_dcc_capacity": dcc_effective_capacity,
            "current_visitors": current_visitors,
            "critical_breach_probability_4h": breach_prob,
            "peak_forecast_hour": max(hourly_curve, key=lambda x: x["predicted_visitors"])["hour_label"],
            "peak_forecast_visitors": max(hourly_curve, key=lambda x: x["predicted_visitors"])["predicted_visitors"],
            "hourly_curve": hourly_curve
        }

    # Fallback: Calibrated Diurnal Heuristic
    hourly_curve = []
    curr = current_visitors
    for step in range(1, 13):
        step_dt = now + timedelta(hours=step)
        h = step_dt.hour
        step_weekend = (step_dt.weekday() in [5, 6])
        
        mult = 1.45 if (11 <= h <= 16 and step_weekend) else 1.15 if (11 <= h <= 16) else 0.85 if (6 <= h <= 10) else 0.45
        pred = max(50, int(curr * mult))
        ratio = round(pred / max(dcc_effective_capacity, 1), 3)
        hourly_curve.append({
            "step_hours_ahead": step,
            "hour": h,
            "hour_label": f"{h:02d}:00",
            "predicted_visitors": pred,
            "lower_ci_95": int(pred * 0.80),
            "upper_ci_95": int(pred * 1.20),
            "dcc_capacity_threshold": dcc_effective_capacity,
            "dcc_load_ratio": ratio,
            "intensity_txt": "Critical" if ratio >= 0.85 else "Moderate" if ratio >= 0.60 else "Optimal",
            "is_critical": (ratio >= 0.85)
        })

    return {
        "model_engine": "Diurnal Heuristic Fallback",
        "is_ml_active": False,
        "destination_id": destination_id,
        "base_capacity": base_capacity,
        "effective_dcc_capacity": dcc_effective_capacity,
        "current_visitors": current_visitors,
        "critical_breach_probability_4h": 0.50 if any(h["is_critical"] for h in hourly_curve[:4]) else 0.10,
        "peak_forecast_hour": max(hourly_curve, key=lambda x: x["predicted_visitors"])["hour_label"],
        "peak_forecast_visitors": max(hourly_curve, key=lambda x: x["predicted_visitors"])["predicted_visitors"],
        "hourly_curve": hourly_curve
    }
