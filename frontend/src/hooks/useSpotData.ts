import { useMemo } from 'react';
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
  CheckIn
} from '../types';

export interface UseSpotDataResult {
  spot: Destination | null;
  metrics: DCCMetrics | null;
  telemetry: SpotTelemetrySnapshot | null;
  forecast: HourlyForecastPoint[];
  twins: TwinRecommendation[];
  advisories: Advisory[];
  promotions: Promotion[];
  checkIns: CheckIn[];
  addCheckIn: (rating: number, comment?: string) => void;
  isLoading: boolean;
  notFound: boolean;
}

export function useSpotData(spotId?: string): UseSpotDataResult {
  const {
    destinations,
    userPreferences,
    promotions,
    advisories,
    liveBackendStatus,
    checkIns,
    addCheckIn
  } = useCorridorStore();

  const spot = useMemo(() => {
    if (!spotId) return null;
    const lower = spotId.trim().toLowerCase();
    return destinations.find(
      d => d.id.toLowerCase() === lower || d.code.toLowerCase() === lower || d.name.toLowerCase() === lower
    ) || null;
  }, [destinations, spotId]);

  const metrics = useMemo(() => {
    if (!spot) return null;
    return calculateDCCMetrics(spot);
  }, [spot]);

  const telemetry = useMemo(() => {
    if (!spot) return null;
    return generateSpotTelemetry(spot, liveBackendStatus === 'connected');
  }, [spot, liveBackendStatus]);

  const forecast = useMemo(() => {
    if (!spot) return [];
    return generate12HourForecast(spot);
  }, [spot]);

  const twins = useMemo(() => {
    if (!spot || !metrics) return [];
    return getTwinRecommendations(spot, destinations, userPreferences, promotions);
  }, [spot, metrics, destinations, userPreferences, promotions]);

  const relevantAdvisories = useMemo(() => {
    if (!spot) return [];
    return advisories.filter(a => a.active && (a.destinationId === 'ALL' || a.destinationId === spot.id));
  }, [spot, advisories]);

  const relevantPromotions = useMemo(() => {
    if (!spot) return [];
    return promotions.filter(p => p.destinationId === spot.id);
  }, [spot, promotions]);

  const spotCheckIns = useMemo(() => {
    if (!spot) return [];
    return checkIns.filter(c => c.spot_id === spot.id);
  }, [spot, checkIns]);

  const handleAddCheckIn = (rating: number, comment?: string) => {
    if (!spot) return;
    addCheckIn({
      spot_id: spot.id,
      spot_name: spot.name,
      rating,
      comment,
      user_label: 'Verified Traveler',
      geofence_verified: true
    });
  };

  return {
    spot,
    metrics,
    telemetry,
    forecast,
    twins,
    advisories: relevantAdvisories,
    promotions: relevantPromotions,
    checkIns: spotCheckIns,
    addCheckIn: handleAddCheckIn,
    isLoading: false,
    notFound: !spot && Boolean(spotId)
  };
}
