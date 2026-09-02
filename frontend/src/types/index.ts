export type DestinationCategory = 'Hill Station' | 'Coastal' | 'Heritage' | 'Pilgrimage';

export type DCCStatus = 'OPTIMAL' | 'MODERATE' | 'CRITICAL';

export type UserRole = 'tourist' | 'authority' | 'provider';

export interface LocalPressure {
  parkingSaturationPct: number;
  waterStressIndex: number; // 0.0 to 1.0
  municipalWasteAlert: boolean;
}

export interface Destination {
  id: string;
  code: string;
  name: string;
  category: DestinationCategory;
  coordinates: [number, number]; // [lat, lng]
  physicalCapacity: number;
  currentInflow: number;
  weatherHazardScore: number; // 0.0 (clear) to 1.0 (severe storm/landslide)
  avgDwellTimeHours: number;
  features: [number, number, number, number]; // [scenic, budget, adventure, family] (normalized 0.0 - 1.0)
  localPressure: LocalPressure;
  hotelOccupancyPct: number;
  activeAdvisory?: string;
  
  // Enriched metadata for realistic experience
  district: string;
  tagline: string;
  description: string;
  imageUrl: string;
  travelTimeFromHub: string;
  distanceKmFromHub: number;
  highlights: string[];
  bestFor: string[];
}

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
}

export interface HourlyForecastPoint {
  hour: string;
  timeLabel: string;
  inflow: number;
  capacity: number;
  dccScore: number;
  weatherRisk: number;
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
