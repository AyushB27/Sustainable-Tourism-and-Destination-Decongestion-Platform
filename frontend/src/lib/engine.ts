import type {
  Destination,
  DCCMetrics,
  DCCStatus,
  TwinRecommendation,
  HourlyForecastPoint,
  Promotion,
  CorridorMetrics
} from '../types';

/**
 * 1. Compute Dynamic Carrying Capacity (DCC) Index and Queuing Wait Times
 */
export function calculateDCCMetrics(destination: Destination): DCCMetrics {
  const capacity = Math.max(1, Number(destination.physicalCapacity) || 1);
  const inflow = Math.max(0, Number(destination.currentInflow) || 0);
  
  // Capacity Utilization = Inflow / Physical Capacity
  const capacityUtilization = inflow / capacity;
  
  // Weather Hazard Risk (0.0 to 1.0)
  const rawHazard = typeof destination.weatherHazardScore === 'number' && Number.isFinite(destination.weatherHazardScore)
    ? destination.weatherHazardScore
    : 0.15;
  const weatherRisk = Math.min(1, Math.max(0, rawHazard));
  
  // DCC Score = (0.70 * Capacity Utilization) + (0.30 * Weather Hazard Risk)
  const rawDcc = (0.70 * capacityUtilization) + (0.30 * weatherRisk);
  const dccScore = Number.isFinite(rawDcc) ? Number(rawDcc.toFixed(2)) : 0.45;
  
  // Status mapping
  let status: DCCStatus = 'OPTIMAL';
  if (dccScore >= 0.85) {
    status = 'CRITICAL';
  } else if (dccScore >= 0.70) {
    status = 'MODERATE';
  }
  
  // Wait-Time Queuing Estimation:
  // Estimated Wait (mins) = max(0, (Current Inflow - Physical Capacity) / Physical Capacity) * Avg Dwell Time (hrs) * 60
  let waitTimeMinutes = 0;
  if (inflow > capacity) {
    const overflowRatio = (inflow - capacity) / capacity;
    const dwellHours = Number(destination.avgDwellTimeHours) || 2.5;
    waitTimeMinutes = Math.round(overflowRatio * dwellHours * 60);
  }
  
  return {
    dccScore,
    status,
    capacityUtilization: Number.isFinite(capacityUtilization) ? Number(capacityUtilization.toFixed(2)) : 0,
    waitTimeMinutes
  };
}

/**
 * Vector Dot Product and Cosine Similarity between 4D Feature vectors:
 * [Scenic, Budget, Trekking/Adventure, Family-Friendly]
 */
export function calculateCosineSimilarity(
  vecA: [number, number, number, number],
  vecB: [number, number, number, number]
): number {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  
  for (let i = 0; i < 4; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  
  if (magA === 0 || magB === 0) return 0;
  
  const similarity = dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
  return Math.min(1, Math.max(0, similarity));
}

/**
 * 3. Preference-Preserving "Twin Destination" Recommender
 */
export function getTwinRecommendations(
  targetDestination: Destination,
  allDestinations: Destination[],
  customPreferences?: [number, number, number, number],
  promotions: Promotion[] = []
): TwinRecommendation[] {
  // Vector to match against: user customized preferences or target destination's inherent features
  const sourceVector = customPreferences || targetDestination.features;
  
  // Filter candidates:
  // - Same category
  // - Candidate DCC < 0.75 (unsaturated)
  // - Exclude target destination itself
  const candidatePool = allDestinations.filter((cand) => {
    if (cand.id === targetDestination.id) return false;
    if (cand.category !== targetDestination.category) return false;
    
    const candMetrics = calculateDCCMetrics(cand);
    return candMetrics.dccScore < 0.75;
  });

  const scoredCandidates: TwinRecommendation[] = candidatePool.map((candidate) => {
    const candMetrics = calculateDCCMetrics(candidate);
    const cosineSim = calculateCosineSimilarity(sourceVector, candidate.features);
    
    // Utility = (0.60 * Cosine Sim) + (0.40 * [1.0 - Candidate DCC Score])
    const candidateDcc = candMetrics.dccScore;
    const utility = (0.60 * cosineSim) + (0.40 * Math.max(0, 1.0 - candidateDcc));
    
    // Crowd reduction delta %
    const targetInflow = targetDestination.currentInflow;
    const candInflow = candidate.currentInflow;
    let crowdReductionPct = 0;
    if (targetInflow > 0) {
      crowdReductionPct = Math.max(0, Math.round(((targetInflow - candInflow) / targetInflow) * 100));
    }
    
    // Distance / travel time delta
    const distanceDeltaKm = candidate.distanceKmFromHub - targetDestination.distanceKmFromHub;
    const sign = distanceDeltaKm >= 0 ? '+' : '';
    const travelTimeDeltaText = `${sign}${Math.round(distanceDeltaKm * 1.2)} mins / ${sign}${distanceDeltaKm} km`;
    
    // Active promotion if any
    const activePromo = promotions.find(p => p.destinationId === candidate.id);
    
    return {
      destination: candidate,
      similarityScore: Number(cosineSim.toFixed(2)),
      candidateDccScore: candidateDcc,
      utilityScore: Number(utility.toFixed(3)),
      crowdReductionPct,
      travelTimeDeltaText,
      distanceDeltaKm,
      activePromo
    };
  });
  
  // Sort by highest Utility Score descending
  scoredCandidates.sort((a, b) => b.utilityScore - a.utilityScore);
  
  // Return top 2 recommendations
  return scoredCandidates.slice(0, 2);
}

/**
 * 12-Hour Hourly Predictive Inflow Curve Generator
 */
export function generate12HourForecast(destination: Destination): HourlyForecastPoint[] {
  const baseCapacity = destination.physicalCapacity;
  const currentInflow = destination.currentInflow;
  const weatherHazard = destination.weatherHazardScore;
  
  const hourlyFactors = [
    { hour: '06:00', label: '6 AM', factor: 0.22 },
    { hour: '07:00', label: '7 AM', factor: 0.35 },
    { hour: '08:00', label: '8 AM', factor: 0.55 },
    { hour: '09:00', label: '9 AM', factor: 0.78 },
    { hour: '10:00', label: '10 AM', factor: 0.92 },
    { hour: '11:00', label: '11 AM', factor: 1.05 },
    { hour: '12:00', label: '12 PM', factor: 1.15 },
    { hour: '13:00', label: '1 PM', factor: 1.10 },
    { hour: '14:00', label: '2 PM', factor: 1.20 },
    { hour: '15:00', label: '3 PM', factor: 1.18 },
    { hour: '16:00', label: '4 PM', factor: 1.00 },
    { hour: '17:00', label: '5 PM', factor: 0.75 },
    { hour: '18:00', label: '6 PM', factor: 0.45 },
  ];
  
  const baseScale = currentInflow / 1.10;
  
  return hourlyFactors.map(pt => {
    const simulatedInflow = Math.round(baseScale * pt.factor);
    const capacityUtil = simulatedInflow / Math.max(1, baseCapacity);
    const pointDcc = Number(((0.70 * capacityUtil) + (0.30 * weatherHazard)).toFixed(2));
    
    return {
      hour: pt.hour,
      timeLabel: pt.label,
      inflow: simulatedInflow,
      capacity: baseCapacity,
      dccScore: pointDcc,
      weatherRisk: weatherHazard
    };
  });
}

/**
 * Corridor-Wide Metrics Calculation
 */
export function calculateCorridorMetrics(
  destinations: Destination[],
  activeAdvisoriesCount: number
): CorridorMetrics {
  let totalCapacity = 0;
  let totalInflow = 0;
  let criticalCount = 0;
  let moderateCount = 0;
  let optimalCount = 0;
  let totalDcc = 0;
  
  destinations.forEach(dest => {
    const cap = Math.max(1, Number(dest.physicalCapacity) || 0);
    const inf = Math.max(0, Number(dest.currentInflow) || 0);
    totalCapacity += cap;
    totalInflow += inf;
    
    const { dccScore, status } = calculateDCCMetrics(dest);
    const safeDcc = Number.isFinite(dccScore) ? dccScore : 0.45;
    totalDcc += safeDcc;
    
    if (status === 'CRITICAL') criticalCount++;
    else if (status === 'MODERATE') moderateCount++;
    else optimalCount++;
  });
  
  const count = destinations.length || 1;
  const redPercentage = Math.round((criticalCount / count) * 100);
  const rawAvgDcc = totalDcc / count;
  const avgDcc = Number.isFinite(rawAvgDcc) ? Number(rawAvgDcc.toFixed(2)) : 0.45;
  
  let corridorStressStatus: DCCStatus = 'OPTIMAL';
  if (redPercentage >= 35 || avgDcc >= 0.85) {
    corridorStressStatus = 'CRITICAL';
  } else if (redPercentage > 0 || avgDcc >= 0.70) {
    corridorStressStatus = 'MODERATE';
  }
  
  return {
    totalCapacity,
    totalInflow,
    criticalCount,
    moderateCount,
    optimalCount,
    redPercentage,
    activeAdvisoriesCount,
    avgDcc,
    corridorStressStatus
  };
}
