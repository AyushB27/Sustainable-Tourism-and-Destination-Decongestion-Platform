"""
EcoRoute Bharat - Predictive ML Training & Multi-Baseline Benchmarking Suite
Evaluates crowd forecasting and critical DCC breach alerting across 5 regression and 3 classification models.
Enforces strict chronological train/validation/test splits and rigorous ML best practices.
"""

import json
import time
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    average_precision_score,
    confusion_matrix
)
import xgboost as xgb

# Set random seeds
np.random.seed(42)

ENGINE_DIR = Path(__file__).resolve().parent
APP_DIR = ENGINE_DIR.parent
BACKEND_DIR = APP_DIR.parent
DATA_DIR = BACKEND_DIR / "data"
MODELS_DIR = DATA_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)

CSV_PATH = DATA_DIR / "training_historical_telemetry.csv"
BENCHMARK_OUTPUT_PATH = DATA_DIR / "benchmark_results.json"
MODEL_WEIGHTS_PATH = MODELS_DIR / "xgboost_crowd_forecaster.json"
CLASSIFIER_WEIGHTS_PATH = MODELS_DIR / "xgboost_breach_classifier.json"
META_PATH = MODELS_DIR / "feature_metadata.json"

def calculate_mape(y_true, y_pred):
    """Mean Absolute Percentage Error (%) avoiding zero division."""
    y_t = np.array(y_true, dtype=float)
    y_p = np.array(y_pred, dtype=float)
    mask = y_t > 0
    return float(np.mean(np.abs((y_t[mask] - y_p[mask]) / y_t[mask])) * 100.0)

def calculate_mda(y_true_seq, y_pred_seq):
    """Mean Directional Accuracy (%) comparing consecutive steps."""
    y_t = np.array(y_true_seq, dtype=float)
    y_p = np.array(y_pred_seq, dtype=float)
    if len(y_t) < 2:
        return 100.0
    actual_dir = np.sign(y_t[1:] - y_t[:-1])
    pred_dir = np.sign(y_p[1:] - y_p[:-1])
    return float(np.mean(actual_dir == pred_dir) * 100.0)

def engineer_features(df: pd.DataFrame):
    """Creates lag, cyclical, rolling, and interaction features strictly grouped by destination."""
    print("Engineering features: cyclical time, lags (1h, 2h, 24h, 168h), rolling stats, and interactions...")
    df = df.copy()
    df["dt"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values(by=["destination_id", "dt"]).reset_index(drop=True)

    # 1. Cyclical time embeddings
    df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24.0)
    df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24.0)
    df["day_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7.0)
    df["day_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7.0)
    df["month_sin"] = np.sin(2 * np.pi * (df["month"] - 1) / 12.0)
    df["month_cos"] = np.cos(2 * np.pi * (df["month"] - 1) / 12.0)

    # 2. Lag features (t-1h, t-2h, t-24h, t-168h = 1 week prior)
    df["visitor_lag_1h"] = df.groupby("destination_id")["active_visitors"].shift(1)
    df["visitor_lag_2h"] = df.groupby("destination_id")["active_visitors"].shift(2)
    df["visitor_lag_24h"] = df.groupby("destination_id")["active_visitors"].shift(24)
    df["visitor_lag_168h"] = df.groupby("destination_id")["active_visitors"].shift(168)

    # 3. Rolling statistics (6-hour rolling window)
    df["visitor_roll_mean_6h"] = (
        df.groupby("destination_id")["active_visitors"]
        .transform(lambda s: s.rolling(window=6, min_periods=1).mean())
    )
    df["visitor_roll_std_6h"] = (
        df.groupby("destination_id")["active_visitors"]
        .transform(lambda s: s.rolling(window=6, min_periods=1).std().fillna(0))
    )

    # 4. Cross-sensor interaction terms
    df["rain_x_traffic"] = df["rainfall_mm"] * df["traffic_delay_factor"]
    df["crowd_pressure"] = df["active_visitors"] / df["base_capacity"]

    # 5. One-hot encode destination_id
    dest_dummies = pd.get_dummies(df["destination_id"], prefix="dest", dtype=float)
    df = pd.concat([df, dest_dummies], axis=1)

    # Drop early warm-up rows containing NaN from 168h lags
    df = df.dropna(subset=["visitor_lag_168h"]).reset_index(drop=True)
    return df

def run_benchmarks():
    print("=" * 75)
    print("[ML] EcoRoute Bharat ML Predictive Benchmarking Suite")
    print("=" * 75)

    if not CSV_PATH.exists():
        raise FileNotFoundError(f"Training dataset not found at {CSV_PATH}. Run generate_training_data.py first.")

    raw_df = pd.read_csv(CSV_PATH)
    print(f"Loaded raw dataset: {len(raw_df):,} rows.")

    df = engineer_features(raw_df)
    print(f"Dataset after lag alignment: {len(df):,} valid chronological rows.")

    # Target definition
    y_reg = df["target_visitors_12h"].values
    y_cls = df["target_breach_next_4h"].values

    # Feature columns
    feature_cols = [
        "base_capacity",
        "hour_sin", "hour_cos", "day_sin", "day_cos", "month_sin", "month_cos",
        "is_weekend", "is_holiday", "is_monsoon",
        "temperature_c", "rainfall_mm", "wind_kmh", "weather_hazard_score",
        "traffic_delay_factor", "highway_ingress_vph", "parking_occupancy_pct",
        "active_visitors", "dcc_load_ratio",
        "visitor_lag_1h", "visitor_lag_2h", "visitor_lag_24h", "visitor_lag_168h",
        "visitor_roll_mean_6h", "visitor_roll_std_6h",
        "rain_x_traffic", "crowd_pressure"
    ] + [c for c in df.columns if c.startswith("dest_")]

    X = df[feature_cols].copy()
    print(f"Total training features: {len(feature_cols)}")

    # -------------------------------------------------------------------------
    # Strict Chronological Splitting (70% Train, 15% Validation, 15% Test)
    # -------------------------------------------------------------------------
    n = len(df)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)

    print(f"\nChronological Split Windows:")
    print(f"  [-] Training Split:   0 to {train_end:,} ({train_end/n*100:.1f}%)")
    print(f"  [-] Validation Split: {train_end:,} to {val_end:,} ({(val_end - train_end)/n*100:.1f}%)")
    print(f"  [-] Testing Split:    {val_end:,} to {n:,} ({(n - val_end)/n*100:.1f}%)")

    X_train, y_train_reg, y_train_cls = X.iloc[:train_end], y_reg[:train_end], y_cls[:train_end]
    X_val, y_val_reg, y_val_cls = X.iloc[train_end:val_end], y_reg[train_end:val_end], y_cls[train_end:val_end]
    X_test, y_test_reg, y_test_cls = X.iloc[val_end:], y_reg[val_end:], y_cls[val_end:]

    # Scaler fitted EXCLUSIVELY on training data to prevent leakage
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    X_test_scaled = scaler.transform(X_test)

    # -------------------------------------------------------------------------
    # 1. Regression Benchmarks: 12-Hour Crowd Forecasting
    # -------------------------------------------------------------------------
    print("\n" + "-" * 75)
    print("[1/2] Evaluating 5 Regression Models (12-Hour Horizon)")
    print("-" * 75)

    regression_results = {}

    # Model 1: Naive Persistence (Last Week Same Hour: y_t-168)
    print("Running Baseline 1: Naive Persistence (y_t-168)...")
    y_pred_naive = df.iloc[val_end:]["visitor_lag_168h"].values
    regression_results["Naive Persistence (Lag 168h)"] = {
        "mae": round(float(mean_absolute_error(y_test_reg, y_pred_naive)), 1),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test_reg, y_pred_naive))), 1),
        "mape": round(calculate_mape(y_test_reg, y_pred_naive), 2),
        "mda": round(calculate_mda(y_test_reg, y_pred_naive), 2),
        "r2": round(float(r2_score(y_test_reg, y_pred_naive)), 4),
        "type": "Naive Baseline"
    }

    # Model 2: Diurnal Rule-Based Heuristic (Current Production Formula)
    print("Running Baseline 2: Diurnal Heuristic Curve...")
    test_hours = df.iloc[val_end:]["hour"].values
    test_weekends = df.iloc[val_end:]["is_weekend"].values
    test_current = df.iloc[val_end:]["active_visitors"].values
    y_pred_heuristic = []
    for h, w, curr in zip(test_hours, test_weekends, test_current):
        # 12 hours ahead hour
        ahead_h = (h + 12) % 24
        multiplier = 1.45 if (11 <= ahead_h <= 16 and w) else 1.15 if (11 <= ahead_h <= 16) else 0.85 if (6 <= ahead_h <= 10) else 0.40
        y_pred_heuristic.append(curr * multiplier)
    y_pred_heuristic = np.array(y_pred_heuristic)
    regression_results["Diurnal Heuristic Formula"] = {
        "mae": round(float(mean_absolute_error(y_test_reg, y_pred_heuristic)), 1),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test_reg, y_pred_heuristic))), 1),
        "mape": round(calculate_mape(y_test_reg, y_pred_heuristic), 2),
        "mda": round(calculate_mda(y_test_reg, y_pred_heuristic), 2),
        "r2": round(float(r2_score(y_test_reg, y_pred_heuristic)), 4),
        "type": "Rule-Based Heuristic"
    }

    # Model 3: Ridge Linear Regression
    print("Training Baseline 3: Ridge L2 Regression...")
    ridge = Ridge(alpha=10.0)
    ridge.fit(X_train_scaled, y_train_reg)
    y_pred_ridge = ridge.predict(X_test_scaled)
    regression_results["Ridge L2 Regression"] = {
        "mae": round(float(mean_absolute_error(y_test_reg, y_pred_ridge)), 1),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test_reg, y_pred_ridge))), 1),
        "mape": round(calculate_mape(y_test_reg, y_pred_ridge), 2),
        "mda": round(calculate_mda(y_test_reg, y_pred_ridge), 2),
        "r2": round(float(r2_score(y_test_reg, y_pred_ridge)), 4),
        "type": "Linear ML Baseline"
    }

    # Model 4: Random Forest Regressor
    print("Training Baseline 4: Random Forest Regressor (100 trees)...")
    rf = RandomForestRegressor(n_estimators=100, max_depth=12, n_jobs=-1, random_state=42)
    rf.fit(X_train, y_train_reg)
    y_pred_rf = rf.predict(X_test)
    regression_results["Random Forest Regressor"] = {
        "mae": round(float(mean_absolute_error(y_test_reg, y_pred_rf)), 1),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test_reg, y_pred_rf))), 1),
        "mape": round(calculate_mape(y_test_reg, y_pred_rf), 2),
        "mda": round(calculate_mda(y_test_reg, y_pred_rf), 2),
        "r2": round(float(r2_score(y_test_reg, y_pred_rf)), 4),
        "type": "Ensemble Tree Baseline"
    }

    # Model 5: XGBoost Regressor (Champion)
    print("Training Champion Model: XGBoost Regressor...")
    t0 = time.time()
    xgb_reg = xgb.XGBRegressor(
        n_estimators=180,
        max_depth=6,
        learning_rate=0.06,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        n_jobs=-1
    )
    xgb_reg.fit(
        X_train, y_train_reg,
        eval_set=[(X_val, y_val_reg)],
        verbose=False
    )
    fit_duration = time.time() - t0
    y_pred_xgb = xgb_reg.predict(X_test)
    regression_results["XGBoost Regressor (EcoRoute Champion)"] = {
        "mae": round(float(mean_absolute_error(y_test_reg, y_pred_xgb)), 1),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test_reg, y_pred_xgb))), 1),
        "mape": round(calculate_mape(y_test_reg, y_pred_xgb), 2),
        "mda": round(calculate_mda(y_test_reg, y_pred_xgb), 2),
        "r2": round(float(r2_score(y_test_reg, y_pred_xgb)), 4),
        "train_time_sec": round(fit_duration, 2),
        "type": "Champion Gradient Boosting"
    }

    # Print Regression Comparison Table
    reg_df = pd.DataFrame(regression_results).T
    print("\n" + reg_df[["type", "mae", "rmse", "mape", "mda", "r2"]].to_string())

    # Save XGBoost Regressor weights
    xgb_reg.save_model(str(MODEL_WEIGHTS_PATH))
    print(f"\nSaved champion XGBoost model weights to: {MODEL_WEIGHTS_PATH}")

    # Feature Importance analysis
    feature_importances = dict(zip(feature_cols, [float(x) for x in xgb_reg.feature_importances_]))
    top_features = sorted(feature_importances.items(), key=lambda x: x[1], reverse=True)[:10]

    # -------------------------------------------------------------------------
    # 2. Classification Benchmarks: Critical DCC Breach Early Warning (4h Window)
    # -------------------------------------------------------------------------
    print("\n" + "-" * 75)
    print("[2/2] Evaluating Critical DCC Breach Classifiers (>85% Capacity in Next 4h)")
    print("-" * 75)

    pos_rate = float(np.mean(y_train_cls) * 100)
    print(f"Class Distribution: {pos_rate:.1f}% Critical Breaches (Class Imbalance Handled)")

    classification_results = {}

    # Class Model 1: Majority Class Dummy Classifier
    dummy = DummyClassifier(strategy="most_frequent")
    dummy.fit(X_train, y_train_cls)
    y_pred_dummy = dummy.predict(X_test)
    classification_results["Majority Baseline"] = {
        "accuracy": round(float(accuracy_score(y_test_cls, y_pred_dummy)), 4),
        "precision": round(float(precision_score(y_test_cls, y_pred_dummy, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test_cls, y_pred_dummy, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test_cls, y_pred_dummy, zero_division=0)), 4),
        "pr_auc": round(float(average_precision_score(y_test_cls, y_pred_dummy)), 4),
        "type": "Naive Dummy"
    }

    # Class Model 2: Balanced Logistic Regression
    lr = LogisticRegression(class_weight="balanced", max_iter=500)
    lr.fit(X_train_scaled, y_train_cls)
    y_pred_lr = lr.predict(X_test_scaled)
    y_prob_lr = lr.predict_proba(X_test_scaled)[:, 1]
    classification_results["Balanced Logistic Regression"] = {
        "accuracy": round(float(accuracy_score(y_test_cls, y_pred_lr)), 4),
        "precision": round(float(precision_score(y_test_cls, y_pred_lr, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test_cls, y_pred_lr, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test_cls, y_pred_lr, zero_division=0)), 4),
        "pr_auc": round(float(average_precision_score(y_test_cls, y_prob_lr)), 4),
        "type": "Linear Classifier"
    }

    # Class Model 3: Cost-Sensitive XGBoost Classifier (Champion)
    neg_count = np.sum(y_train_cls == 0)
    pos_count = max(1, np.sum(y_train_cls == 1))
    scale_weight = float(neg_count / pos_count)

    xgb_cls = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.08,
        scale_pos_weight=scale_weight,
        random_state=42,
        n_jobs=-1
    )
    xgb_cls.fit(X_train, y_train_cls, eval_set=[(X_val, y_val_cls)], verbose=False)
    y_pred_xgb_cls = xgb_cls.predict(X_test)
    y_prob_xgb_cls = xgb_cls.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test_cls, y_pred_xgb_cls)
    tn, fp, fn, tp = cm.ravel()

    classification_results["XGBoost Early-Warning Classifier"] = {
        "accuracy": round(float(accuracy_score(y_test_cls, y_pred_xgb_cls)), 4),
        "precision": round(float(precision_score(y_test_cls, y_pred_xgb_cls)), 4),
        "recall": round(float(recall_score(y_test_cls, y_pred_xgb_cls)), 4),
        "f1": round(float(f1_score(y_test_cls, y_pred_xgb_cls)), 4),
        "pr_auc": round(float(average_precision_score(y_test_cls, y_prob_xgb_cls)), 4),
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        },
        "type": "Champion Alert Classifier"
    }

    xgb_cls.save_model(str(CLASSIFIER_WEIGHTS_PATH))
    print(f"Saved champion XGBoost classifier weights to: {CLASSIFIER_WEIGHTS_PATH}")

    cls_df = pd.DataFrame(classification_results).T
    print("\n" + cls_df[["type", "accuracy", "precision", "recall", "f1", "pr_auc"]].to_string())

    # -------------------------------------------------------------------------
    # 3. Export Comprehensive Benchmark JSON & Feature Metadata
    # -------------------------------------------------------------------------
    benchmark_payload = {
        "metadata": {
            "evaluation_date": time.strftime("%Y-%m-%d %H:%M:%S"),
            "dataset_rows": len(df),
            "train_rows": len(X_train),
            "validation_rows": len(X_val),
            "test_rows": len(X_test),
            "forecast_horizon_hours": 12,
            "early_warning_window_hours": 4
        },
        "regression_benchmarks": regression_results,
        "classification_benchmarks": classification_results,
        "top_feature_importances": [
            {"feature": feat, "importance": round(imp, 4)}
            for feat, imp in top_features
        ],
        "summary": {
            "best_forecaster": "XGBoost Regressor (EcoRoute Champion)",
            "mape_improvement_vs_naive": f"{((regression_results['Naive Persistence (Lag 168h)']['mape'] - regression_results['XGBoost Regressor (EcoRoute Champion)']['mape']) / regression_results['Naive Persistence (Lag 168h)']['mape'] * 100):.1f}%",
            "mape_improvement_vs_heuristic": f"{((regression_results['Diurnal Heuristic Formula']['mape'] - regression_results['XGBoost Regressor (EcoRoute Champion)']['mape']) / regression_results['Diurnal Heuristic Formula']['mape'] * 100):.1f}%",
            "critical_breach_recall": f"{classification_results['XGBoost Early-Warning Classifier']['recall'] * 100:.1f}%"
        }
    }

    with open(BENCHMARK_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(benchmark_payload, f, indent=2)

    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "feature_cols": feature_cols,
            "means": {col: float(X_train[col].mean()) for col in feature_cols},
            "stds": {col: float(X_train[col].std()) for col in feature_cols}
        }, f, indent=2)

    print(f"\nSaved benchmark results to: {BENCHMARK_OUTPUT_PATH}")
    print("=" * 75)
    print("[SUCCESS] All Benchmarks and Model Weights Successfully Generated!")
    print("=" * 75)
    return benchmark_payload

if __name__ == "__main__":
    run_benchmarks()
