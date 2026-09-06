export type DestinationCategory = 'Hill Station' | 'Coastal' | 'Heritage' | 'Pilgrimage';

export type DCCStatus = 'OPTIMAL' | 'MODERATE' | 'CRITICAL';

export type UserRole = 'tourist' | 'authority' | 'provider' | 'developer';

export interface Jurisdiction {
  type: 'state' | 'district' | 'spot_list';
  value: string | string[];
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  department: string;
  badgeNumber: string;
  isAuthenticated: boolean;
  jurisdiction?: Jurisdiction | null;
  token?: string;
  homeCity?: string;
  homeState?: string;
  travelStyleVector?: [number, number, number, number]; // [scenic, budget, adventure, family]
  interests?: string[];
}

export interface LocalPressure {
  parkingSaturationPct: number;
  waterStressIndex: number; // 0.0 to 1.0
  municipalWasteAlert: boolean;
}

export interface NearbyHotel {
  name: string;
  type: string;
  pricePerNight: string;
  mtdcPartner: boolean;
  rating: number;
}

export interface NearbyAmenity {
  name: string;
  type: 'restaurant' | 'drinking_water' | 'toilets' | 'emergency';
  distanceMeters: number;
}

export interface MajorAttraction {
  name: string;
  type: 'viewpoint' | 'waterfall' | 'fort' | 'lake' | 'temple';
  blurb: string;
}

export interface WeeklyPatternPoint {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  dayFull: string;
  level: 'OPTIMAL' | 'MODERATE' | 'CRITICAL';
  typicalFootfallRatio: number;
  note: string;
}

export interface Destination {
  id: string;
  code: string;
  name: string;
  category: DestinationCategory;
  coordinates: [number, number]; // [lat, lng]
  physicalCapacity: number;
  base_capacity_source_citation: string;
  currentInflow: number;
  weatherHazardScore: number; // 0.0 (clear) to 1.0 (severe storm/landslide)
  avgDwellTimeHours: number;
  features: [number, number, number, number]; // [scenic, budget, adventure, family] (normalized 0.0 - 1.0)
  localPressure: LocalPressure;
  hotelOccupancyPct: number;
  activeAdvisory?: string;
  
  // Explicit separated geography per §2.1 & §7
  district: string;
  state: string;
  
  tagline: string;
  description: string;
  imageUrl: string;
  travelTimeFromHub: string;
  distanceKmFromHub: number;
  highlights: string[];
  bestFor: string[];

  // Algorithmic Discover & load-balancing metadata
  isUnderVisited?: boolean;
  associated_business_ids?: string[];
  
  // Weekly historical pattern (Tier 2/3)
  historicalWeeklyPattern?: WeeklyPatternPoint[];
  
  // Nearby & practical OSM / Places info
  nearbyHotels?: NearbyHotel[];
  nearbyAmenities?: NearbyAmenity[];
  majorAttractions?: MajorAttraction[];
  gettingThere?: {
    primaryRoute: string;
    liveEtaText: string;
    bottleneckActive: boolean;
    bypassSuggestion?: string;
  };
}

// Canonical alias for Spot
export type Spot = Destination;

export interface DCCMetrics {
  dccScore: number;
  status: DCCStatus;
  capacityUtilization: number;
  waitTimeMinutes: number;
}

export interface TwinRecommendation {
  destination: Destination;
  similarityScore: number;      // 0.0 to 1.0
  candidateDccScore: number;   // DCC score of alternative
  utilityScore: number;        // (0.60 * sim) + (0.40 * (1 - DCC))
  crowdReductionPct: number;   // % fewer tourists compared to target
  travelTimeDeltaText: string; // e.g. "+15 mins from Pune"
  distanceDeltaKm: number;
  activePromo?: Promotion;
}

export interface Advisory {
  id: string;
  destinationId: string; // destination ID or 'ALL' for corridor-wide
  destinationName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  active: boolean;
  author: string;
  createdAt?: string;
  expiresAt?: string;
  revokedAt?: string;
}

export interface DemandFlow {
  id: number;
  origin_spot_id: string;
  destination_spot_id: string;
  date: string;
  estimated_visitor_count: number;
  source_tier: string;
}

export interface PolicySimulationResult {
  target_spot: {
    id: string;
    name: string;
    baseline: {
      inflow: number;
      capacity: number;
      dcc_score: number;
      status: DCCStatus;
      wait_time_minutes: number;
      utilization_pct: number;
    };
    modeled: {
      proposed_cap: number;
      effective_inflow: number;
      deflected_visitors: number;
      dcc_score: number;
      status: DCCStatus;
      wait_time_minutes: number;
      utilization_pct: number;
      wait_time_saved_minutes: number;
    };
  };
  twin_absorption: Array<{
    twin_id: string;
    twin_name: string;
    similarity_score: number;
    baseline_inflow: number;
    absorbed_visitors: number;
    modeled_inflow: number;
    capacity: number;
    baseline_dcc: number;
    modeled_dcc: number;
    modeled_status: DCCStatus;
    remaining_headroom: number;
  }>;
  math_model: {
    formula: string;
    hazard_score: number;
    dwell_hours: number;
    queue_formula: string;
  };
}

export interface Promotion {
  id: string;
  destinationId: string;
  destinationName: string;
  discountPct: number;
  title: string;
  badge: string;
  description: string;
  code: string;
  validUntil: string;
  businessName: string;
  businessType: 'Homestay' | 'Resort' | 'Adventure Trek' | 'Local Dining' | 'Eco-Pass';
  redemptionCount?: number;
}

export interface HourlyForecastPoint {
  hour: string;
  timeLabel: string;
  inflow: number;
  capacity: number;
  dccScore: number;
  weatherRisk: number;
  isBestTime?: boolean;
  dcc_score?: number;
  time_label?: string;
  status?: string;
  waitMinutes?: number;
  wait_minutes?: number;
  lower_ci_95?: number;
  upper_ci_95?: number;
  breach_probability?: number;
  is_ml_predicted?: boolean;
}

export interface MLForecastData {
  is_ml_active: boolean;
  model_engine: string;
  critical_breach_probability_4h: number;
  peak_forecast_hour?: string;
  peak_forecast_visitors?: number;
  forecast_points: HourlyForecastPoint[];
}

export interface CorridorMetrics {
  totalCapacity: number;
  totalInflow: number;
  criticalCount: number;
  moderateCount: number;
  optimalCount: number;
  redPercentage: number;
  activeAdvisoriesCount: number;
  avgDcc: number;
  corridorStressStatus: DCCStatus;
}

// ─── Data Tiers & Telemetry Snapshot (§6, §7, §8) ─────────────────────────

export type DataTierLevel = 1 | 2 | 3 | 4;

export interface DataTierProvenance {
  tier: DataTierLevel;
  tierLabel: string; // e.g. "Tier 1 — Live, No Key"
  component: string; // e.g. "Weather & Rainfall"
  source: string;    // e.g. "Open-Meteo API (Live)"
  status: 'live' | 'historical' | 'calibrated' | 'synthetic';
  citation: string;
  contribution: string;
}

export interface SpotTelemetrySnapshot {
  spot_id: string;
  timestamp: string;
  weather: {
    temp_c: number;
    rain_mm: number;
    hazard_score: number;
    source: string;
    fetched_at: string;
    tier: DataTierLevel;
  };
  calendar_flags: {
    holiday: boolean;
    school_vacation: boolean;
    season: string;
    tier: DataTierLevel;
  };
  popularity: {
    value: number;
    source: string;
    fetched_at: string;
    tier: DataTierLevel;
  };
  crowdsourced: {
    avg_rating: number;
    report_count: number;
    last_report_at: string;
    tier: DataTierLevel;
  };
  computed_crowd_index: number;
  confidence_score: number; // 0.0 to 1.0 (e.g. 0.94)
  active_tiers: DataTierProvenance[];
}

// ─── Community Check-In Entity (§3.1, §7) ───────────────────────────────────

export interface CheckIn {
  id: string;
  user_id?: string;
  spot_id: string;
  spot_name: string;
  rating: number; // 1 to 5 (1 = Empty, 5 = Extreme Jam)
  user_label: string;
  comment?: string;
  timestamp: string;
  geofence_verified: boolean;
}

// ─── Trip Planner & GreenPass Entities (§4.4, §7) ──────────────────────────

export interface TripDayPlan {
  dayNumber: number;
  date: string;
  destinationId: string;
  destinationName: string;
  morningActivity: string;
  afternoonActivity: string;
  eveningActivity: string;
  recommendedLodging: string;
  estimatedCrowdLevel: DCCStatus;
  transitTip: string;
}

export interface TripPlan {
  id: string;
  user_id: string;
  destinations: string[];
  dates: {
    start: string;
    end: string;
  };
  budget_band: '₹' | '₹₹' | '₹₹₹';
  group_type: 'solo' | 'couple' | 'family' | 'friends';
  itinerary: TripDayPlan[];
  totalCo2SavedKg: number;
  created_at: string;
}

export interface GreenPass {
  id: string;
  user_id: string;
  trip_plan_id?: string;
  original_spot_id: string;
  original_spot_name: string;
  twin_spot_id: string;
  twin_spot_name: string;
  distance_delta_km: number;
  co2_saved_kg: number;
  geofence_verified: boolean;
  issued_at: string;
  code: string;
  status: 'active' | 'redeemed';
  discountPct: number;
  operatorName: string;
}

// ─── 3-Tier Search Entities (§2.1) ──────────────────────────────────────────

export interface SearchMatch {
  id: string;
  title: string;
  subtitle: string;
  type: 'spot' | 'district' | 'state';
  route: string;
  badge?: string;
  category?: string;
  status?: DCCStatus;
}
