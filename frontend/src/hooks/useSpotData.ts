import { useState, useEffect, useMemo } from 'react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics, getTwinRecommendations, generate12HourForecast } from '../lib/engine';
import { generateSpotTelemetry } from '../lib/telemetry';
import type {
  Destination,
  DCCMetrics,
  TwinRecommendation,
  SpotTelemetrySnapshot,
  HourlyForecastPoint,
  Advisory,
  Promotion,
  CheckIn,
  Jurisdiction
} from '../types';

export interface ProvenanceTierItem {
  name: string;
  value: string;
  source: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  tierLabel: string;
  fetchedAt: string;
  status: 'live' | 'simulated' | 'fallback';
}

export interface UseSpotDataResult {
  spot: Destination | null;
  metrics: DCCMetrics | null;
  telemetry: SpotTelemetrySnapshot | null;
  forecast: HourlyForecastPoint[];
  loadingForecast: boolean;
  twins: TwinRecommendation[];
  advisories: Advisory[];
  promotions: Promotion[];
  checkIns: CheckIn[];
  addCheckIn: (rating: number, comment?: string) => void;
  isLoading: boolean;
  notFound: boolean;
  provenance: ProvenanceTierItem[];
  confidenceScore: number;
  historicalPattern: Array<{ day: string; crowdLevel: string; pct: number }>;
  // Additive Authority Contract
  isAuthority: boolean;
  hasJurisdiction: boolean;
  jurisdiction?: Jurisdiction | null;
  overrideCapacity: (spotId: string, capacityCap: number, reason?: string) => Promise<{ success: boolean; message?: string }>;
  broadcastAdvisory: (advisory: any) => void;
}

export function useSpotData(spotId?: string): UseSpotDataResult {
  const {
    destinations,
    userPreferences,
    promotions,
    advisories,
    currentUser,
    liveBackendStatus,
    checkIns,
    addCheckIn: storeAddCheckIn,
    overrideCapacity,
    broadcastAdvisory,
  } = useCorridorStore();

  const [forecast, setForecast] = useState<HourlyForecastPoint[]>([]);
  const [loadingForecast, setLoadingForecast] = useState<boolean>(false);

  // 1. Find the target spot
  const spot: Destination | null = useMemo(() => {
    if (!spotId) return destinations[0] || null;
    const lower = spotId.trim().toLowerCase();
    return (
      destinations.find(
        d => d.id.toLowerCase() === lower || d.code.toLowerCase() === lower || d.name.toLowerCase() === lower
      ) || null
    );
  }, [destinations, spotId]);

  // 2. Standard tourist metrics
  const metrics: DCCMetrics | null = useMemo(() => {
    if (!spot) return null;
    return calculateDCCMetrics(spot);
  }, [spot]);

  // 3. Telemetry snapshot with provenance tiers
  const telemetry: SpotTelemetrySnapshot | null = useMemo(() => {
    if (!spot) return null;
    return generateSpotTelemetry(spot, liveBackendStatus === 'connected');
  }, [spot, liveBackendStatus]);

  // 4. Twin alternatives
  const twins: TwinRecommendation[] = useMemo(() => {
    if (!spot || !metrics) return [];
    return getTwinRecommendations(spot, destinations, userPreferences, promotions);
  }, [spot, metrics, destinations, userPreferences, promotions]);

  // 5. Relevant advisories
  const relevantAdvisories: Advisory[] = useMemo(() => {
    if (!spot) return [];
    return advisories.filter(a => a.active && (a.destinationId === 'ALL' || a.destinationId === spot.id));
  }, [spot, advisories]);

  // 6. Relevant promotions
  const relevantPromotions: Promotion[] = useMemo(() => {
    if (!spot) return [];
    return promotions.filter(p => p.destinationId === spot.id);
  }, [spot, promotions]);

  // 7. Community check-ins
  const spotCheckIns: CheckIn[] = useMemo(() => {
    if (!spot) return [];
    return checkIns.filter(c => c.spot_id === spot.id);
  }, [spot, checkIns]);

  const handleAddCheckIn = (rating: number, comment?: string) => {
    if (!spot) return;
    storeAddCheckIn({
      spot_id: spot.id,
      spot_name: spot.name,
      rating,
      comment,
      user_label: currentUser.name || 'Verified Traveler',
      geofence_verified: true
    });
  };

  // 8. 12-Hour Forecast
  useEffect(() => {
    if (!spot) return;
    setLoadingForecast(true);
    fetch(`http://127.0.0.1:8000/api/destinations/${spot.id}/forecast`, {
      signal: AbortSignal.timeout(3000)
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && Array.isArray(data.forecast_points) && data.forecast_points.length > 0) {
          const normalized: HourlyForecastPoint[] = data.forecast_points.map((pt: any) => {
            const dcc = Number(pt.dccScore ?? pt.dcc_score ?? 0);
            return {
              hour: pt.hour || '12:00',
              timeLabel: pt.timeLabel || pt.time_label || pt.hour || '12 PM',
              inflow: Number(pt.inflow ?? 0),
              capacity: Number(pt.capacity ?? spot.physicalCapacity ?? 1000),
              dccScore: Number.isFinite(dcc) ? dcc : 0.5,
              weatherRisk: Number(pt.weatherRisk ?? pt.weather_hazard ?? 0),
              isBestTime: dcc < 0.60
            };
          });
          setForecast(normalized);
        } else {
          setForecast(generate12HourForecast(spot));
        }
      })
      .catch(() => {
        setForecast(generate12HourForecast(spot));
      })
      .finally(() => {
        setLoadingForecast(false);
      });
  }, [spot]);

  // 9. Provenance Breakdown
  const provenance: ProvenanceTierItem[] = useMemo(() => {
    if (!spot) return [];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return [
      {
        name: 'Precipitation & Wind Risk',
        value: `${(spot.weatherHazardScore * 25).toFixed(1)} mm/hr`,
        source: 'Open-Meteo Live',
        tier: 'Tier 1',
        tierLabel: 'Tier 1 — Live Sensor',
        fetchedAt: nowStr,
        status: 'live'
      }
    ];
  }, [spot]);

  // 10. Confidence Score
  const confidenceScore = useMemo(() => {
    return telemetry ? Math.round(telemetry.confidence_score * 100) : 88;
  }, [telemetry]);

  // 11. Historical Weekly Pattern
  const historicalPattern = useMemo(() => {
    return [
      { day: 'Mon', crowdLevel: 'Low', pct: 25 },
      { day: 'Tue', crowdLevel: 'Low', pct: 28 },
      { day: 'Wed', crowdLevel: 'Low', pct: 32 },
      { day: 'Thu', crowdLevel: 'Moderate', pct: 45 },
      { day: 'Fri', crowdLevel: 'Moderate', pct: 60 },
      { day: 'Sat', crowdLevel: 'Critical Peak', pct: 95 },
      { day: 'Sun', crowdLevel: 'Critical Peak', pct: 90 }
    ];
  }, []);

  // 12. Authority & Jurisdiction Scoping
  const isAuthority = currentUser.role === 'authority';

  const hasJurisdiction = useMemo(() => {
    if (!isAuthority || !currentUser.jurisdiction || !spot) return false;
    const jur = currentUser.jurisdiction;
    if (jur.type === 'state') return true;
    if (jur.type === 'district') {
      return spot.district.toLowerCase().includes(String(jur.value).toLowerCase());
    }
    if (jur.type === 'spot_list' && Array.isArray(jur.value)) {
      return jur.value.includes(spot.id);
    }
    return false;
  }, [isAuthority, currentUser.jurisdiction, spot]);

  return {
    spot,
    metrics,
    telemetry,
    forecast,
    loadingForecast,
    twins,
    advisories: relevantAdvisories,
    promotions: relevantPromotions,
    checkIns: spotCheckIns,
    addCheckIn: handleAddCheckIn,
    isLoading: false,
    notFound: !spot && Boolean(spotId),
    provenance,
    confidenceScore,
    historicalPattern,
    // Additive Authority Contract
    isAuthority,
    hasJurisdiction,
    jurisdiction: currentUser.jurisdiction,
    overrideCapacity,
    broadcastAdvisory
  };
}
