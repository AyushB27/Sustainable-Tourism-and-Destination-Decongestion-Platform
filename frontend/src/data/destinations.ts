import type { Destination, Advisory, Promotion } from '../types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'LON',
    code: 'LON',
    name: 'Lonavala & Khandala',
    category: 'Hill Station',
    coordinates: [18.7546, 73.4062],
    physicalCapacity: 10000,
    base_capacity_source_citation: 'Maharashtra Tourism Carrying Capacity Audit (MTDC/Env/2024-02)',
    currentInflow: 11800,
    weatherHazardScore: 0.30,
    avgDwellTimeHours: 3.5,
    features: [0.90, 0.70, 0.50, 0.90],
    localPressure: {
      parkingSaturationPct: 95,
      waterStressIndex: 0.82,
      municipalWasteAlert: true,
    },
    hotelOccupancyPct: 94,
    activeAdvisory: 'Heavy monsoon fog & severe 4km traffic queue on Amrutanjan Bridge / Tiger Point Ghats.',
    district: 'Pune',
    state: 'Maharashtra',
    tagline: 'Misty Waterfalls & Rajmachi Escarpment',
    description: 'Premier monsoon hotspot overlooking deep ravines. Currently facing severe vehicular gridlock and parking saturation.',
    imageUrl: 'https://images.unsplash.com/photo-1626014903816-16fce16936cb?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '2 hrs from Mumbai / 1.5 hrs from Pune',
    distanceKmFromHub: 83,
    highlights: ['Tiger Leap Viewpoint', 'Bhushi Dam', 'Karla & Bhaja Caves', 'Chikki Markets'],
    bestFor: ['Quick Weekend Getaway', 'Cloud Watching', 'Monsoon Drives'],
    isUnderVisited: false,
    associated_business_ids: ['biz-lon-01', 'biz-lon-02'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.38, note: 'Low footfall, clear roads' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.32, note: 'Quiet day, ample parking' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.35, note: 'Pleasant sightseeing' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.42, note: 'Slight pre-weekend rise' },
      { day: 'Fri', dayFull: 'Friday', level: 'MODERATE', typicalFootfallRatio: 0.72, note: 'Evening rush from Mumbai' },
      { day: 'Sat', dayFull: 'Saturday', level: 'CRITICAL', typicalFootfallRatio: 1.25, note: 'Severe gridlock near Tiger Point' },
      { day: 'Sun', dayFull: 'Sunday', level: 'CRITICAL', typicalFootfallRatio: 1.18, note: 'High congestion until 8 PM' }
    ],
    nearbyHotels: [
      { name: 'MTDC Holiday Resort Karla', type: 'Govt Eco-Resort', pricePerNight: '₹2,200', mtdcPartner: true, rating: 4.3 },
      { name: 'Fariyas Resort Khandala', type: 'Luxury Resort', pricePerNight: '₹7,500', mtdcPartner: false, rating: 4.5 },
      { name: 'Sahyadri Valley Homestay', type: 'Village Homestay', pricePerNight: '₹1,500', mtdcPartner: true, rating: 4.2 }
    ],
    nearbyAmenities: [
      { name: 'Lonavala Municipal Clean Water ATM', type: 'drinking_water', distanceMeters: 250 },
      { name: 'Tiger Point Public Comfort Station', type: 'toilets', distanceMeters: 180 },
      { name: 'Buvachi Misal Heritage Kitchen', type: 'restaurant', distanceMeters: 400 },
      { name: 'Lonavala Rural Primary Health Center', type: 'emergency', distanceMeters: 1200 }
    ],
    majorAttractions: [
      { name: 'Tiger Point (Lion’s Point)', type: 'viewpoint', blurb: 'Cliff edge with panoramic views of the Shivganga valley and seasonal cascading clouds.' },
      { name: 'Bhushi Dam Water Escarpment', type: 'waterfall', blurb: 'Popular overflow steps built on the Indrayani river; highly crowded on weekends.' },
      { name: 'Karla Buddhist Rock-cut Caves', type: 'temple', blurb: '2nd-century BC Buddhist rock cut cave shrines housing ancient Chaitya halls.' }
    ],
    gettingThere: {
      primaryRoute: 'Mumbai-Pune Expressway (NH-48)',
      liveEtaText: '2 hrs 45 mins (delay +45m)',
      bottleneckActive: true,
      bypassSuggestion: 'Bypass via Khopoli Old Ghat Road or choose Matheran via Neral.'
    }
  },
  {
    id: 'MAT',
    code: 'MAT',
    name: 'Matheran Eco-Zone',
    category: 'Hill Station',
    coordinates: [18.9865, 73.2687],
    physicalCapacity: 5000,
    base_capacity_source_citation: 'Union Ministry of Environment & Forests Eco-Sensitive Zone Notification (MoEF/ESZ/Matheran)',
    currentInflow: 2100,
    weatherHazardScore: 0.10,
    avgDwellTimeHours: 4.0,
    features: [0.85, 0.60, 0.70, 0.85],
    localPressure: {
      parkingSaturationPct: 30,
      waterStressIndex: 0.28,
      municipalWasteAlert: false,
    },
    hotelOccupancyPct: 42,
    district: 'Raigad',
    state: 'Maharashtra',
    tagline: 'Asia\'s Only Automobile-Free Hill Town',
    description: 'Pristine red-soil trails, heritage toy train routes, and peaceful clifftops with 100% clean air and zero vehicle exhaust.',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '2 hrs from Mumbai / 2.5 hrs from Pune',
    distanceKmFromHub: 87,
    highlights: ['Charlotte Lake', 'Echo Point Panorama', 'Horse Riding Trails', 'Toy Train Route'],
    bestFor: ['Zero Vehicle Pollution', 'Serene Walks', 'Family Picnics'],
    isUnderVisited: false,
    associated_business_ids: ['biz-mat-01', 'biz-mat-02'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.25, note: 'Completely unhurried' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.22, note: 'Prime photography conditions' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.28, note: 'Quiet forest walks' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.35, note: 'Pleasant weather' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.55, note: 'Manageable arrivals' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.68, note: 'Active trails, smooth transit' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.62, note: 'Steady eco-tourist traffic' }
    ],
    nearbyHotels: [
      { name: 'The Verandah in the Forest (Neemrana)', type: 'Heritage Bungalow', pricePerNight: '₹5,500', mtdcPartner: true, rating: 4.7 },
      { name: 'Lord\'s Central Heritage Lodge', type: 'Eco-Lodge', pricePerNight: '₹3,400', mtdcPartner: true, rating: 4.4 },
      { name: 'Matheran Forest Forest Rest House', type: 'Govt Forest Rest', pricePerNight: '₹1,200', mtdcPartner: true, rating: 4.0 }
    ],
    nearbyAmenities: [
      { name: 'Neral Dasturi Eco-Shuttle Point', type: 'emergency', distanceMeters: 500 },
      { name: 'Market Street RO Pure Water Station', type: 'drinking_water', distanceMeters: 150 },
      { name: 'Charlotte Lake Eco Restrooms', type: 'toilets', distanceMeters: 200 },
      { name: 'Kokboran Traditional Thali Hub', type: 'restaurant', distanceMeters: 300 }
    ],
    majorAttractions: [
      { name: 'Charlotte Lake Reservoir', type: 'lake', blurb: 'Primary freshwater lake encircled by deep evergreen forest and bird sanctuaries.' },
      { name: 'Echo Point Ridge', type: 'viewpoint', blurb: 'High cliff overlooking Sahyadri ravines where deep echoes bounce across valleys.' },
      { name: 'Louisa Point Sunset View', type: 'viewpoint', blurb: 'Spectacular sunset vantage point with views of the ruined Vishalgad and Prabal fort.' }
    ],
    gettingThere: {
      primaryRoute: 'SH-79 to Dasturi Point via Neral (vehicles park at Dasturi)',
      liveEtaText: '2 hrs 10 mins (uncongested)',
      bottleneckActive: false
    }
  },
  {
    id: 'BHA',
    code: 'BHA',
    name: 'Bhandardara Serene Haven',
    category: 'Hill Station',
    coordinates: [19.5397, 73.7635],
    physicalCapacity: 4000,
    base_capacity_source_citation: 'Irrigation & Forest Dept Carrying Capacity Framework for Arthur Lake Catchment',
    currentInflow: 1200,
    weatherHazardScore: 0.10,
    avgDwellTimeHours: 5.0,
    features: [0.95, 0.50, 0.80, 0.70],
    localPressure: {
      parkingSaturationPct: 25,
      waterStressIndex: 0.20,
      municipalWasteAlert: false,
    },
    hotelOccupancyPct: 35,
    district: 'Ahmednagar',
    state: 'Maharashtra',
    tagline: 'Arthur Lake & Kalsubai Peak Foothills',
    description: 'Lush green valleys, roaring Umbrella Falls, and tranquil lakeside camping nestled below Maharashtra’s highest peak.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '3.5 hrs from Mumbai / 3.5 hrs from Pune',
    distanceKmFromHub: 165,
    highlights: ['Arthur Lake Boating', 'Umbrella Falls', 'Kalsubai Basecamp', 'Firefly Night Walks'],
    bestFor: ['Lakeside Camping', 'Trekking Enthusiasts', 'Uncrowded Nature'],
    isUnderVisited: true, // Algorithmic promotion boost
    associated_business_ids: ['biz-bha-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.18, note: 'Near solitude' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Serene lakeside' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.18, note: 'Crystal clean air' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.22, note: 'Calm waters' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.35, note: 'Campers arriving' },
      { day: 'Sat', dayFull: 'Saturday', level: 'OPTIMAL', typicalFootfallRatio: 0.45, note: 'Relaxed uncrowded vibe' },
      { day: 'Sun', dayFull: 'Sunday', level: 'OPTIMAL', typicalFootfallRatio: 0.38, note: 'Smooth departure' }
    ],
    nearbyHotels: [
      { name: 'MTDC Resort Bhandardara', type: 'Govt Lakeside Resort', pricePerNight: '₹2,100', mtdcPartner: true, rating: 4.4 },
      { name: 'Anandvan Forest Resort', type: 'Eco Retreat', pricePerNight: '₹4,800', mtdcPartner: true, rating: 4.6 },
      { name: 'Arthur Lake Rural Camp', type: 'Community Tents', pricePerNight: '₹950', mtdcPartner: true, rating: 4.3 }
    ],
    nearbyAmenities: [
      { name: 'Bhandardara Dam Tourism Information Post', type: 'emergency', distanceMeters: 300 },
      { name: 'Wilson Dam Drinking Fountain', type: 'drinking_water', distanceMeters: 100 },
      { name: 'Shendi Village Sanitized Restrooms', type: 'toilets', distanceMeters: 450 },
      { name: 'Kalsubai Village Dhaba', type: 'restaurant', distanceMeters: 600 }
    ],
    majorAttractions: [
      { name: 'Arthur Lake (Pravara Basin)', type: 'lake', blurb: 'Placid turquoise reservoir framed by Sahyadri crags; perfect for sunset boating.' },
      { name: 'Umbrella Falls (Wilson Dam)', type: 'waterfall', blurb: 'Vigorous seasonal spillway creating a natural misty amphitheater.' },
      { name: 'Kalsubai Peak Trailhead', type: 'fort', blurb: 'Basecamp leading up to Maharashtra\'s highest geographical elevation (1,646 m).' }
    ],
    gettingThere: {
      primaryRoute: 'NH-160 via Igatpuri / Ghoti bypass',
      liveEtaText: '3 hrs 20 mins (scenic & smooth)',
      bottleneckActive: false
    }
  },
  {
    id: 'ALB',
    code: 'ALB',
    name: 'Alibaug Coastal Hub',
    category: 'Coastal',
    coordinates: [18.6414, 72.8722],
    physicalCapacity: 8000,
    base_capacity_source_citation: 'Maharashtra Maritime Board (MMB) & District Coastal Zone Capacity Study',
    currentInflow: 8900,
    weatherHazardScore: 0.20,
    avgDwellTimeHours: 3.0,
    features: [0.80, 0.80, 0.30, 0.90],
    localPressure: {
      parkingSaturationPct: 90,
      waterStressIndex: 0.75,
      municipalWasteAlert: true,
    },
    hotelOccupancyPct: 91,
    activeAdvisory: 'Mandwa Jetty ferry queues exceeding 75 minutes. Beachfront parking restricted at Varsoli.',
    district: 'Raigad',
    state: 'Maharashtra',
    tagline: 'Historic Sea Forts & Sandy Coastline',
    description: 'Famous weekend beach destination across the Mumbai harbor. Currently experiencing heavy coastal ferry backlog and traffic jams.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '1 hr via Ro-Ro Ferry / 2.5 hrs via Road',
    distanceKmFromHub: 95,
    highlights: ['Kolaba Fort Walk', 'Varsoli Water Sports', 'Fresh Konkani Seafood', 'Mandwa Beach Club'],
    bestFor: ['Speedboat Ferries', 'Resort Weekends', 'Seafood Cuisines'],
    isUnderVisited: false,
    associated_business_ids: ['biz-alb-01', 'biz-alb-02'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.40, note: 'Calm beach access' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.35, note: 'Easy parking' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.38, note: 'Low ferry turnaround' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.48, note: 'Moderate booking trend' },
      { day: 'Fri', dayFull: 'Friday', level: 'MODERATE', typicalFootfallRatio: 0.78, note: 'Mandwa terminal surge' },
      { day: 'Sat', dayFull: 'Saturday', level: 'CRITICAL', typicalFootfallRatio: 1.20, note: 'Varsoli beach parking full' },
      { day: 'Sun', dayFull: 'Sunday', level: 'CRITICAL', typicalFootfallRatio: 1.15, note: 'Long queue at Ro-Ro return' }
    ],
    nearbyHotels: [
      { name: 'Radisson Blu Resort & Spa Alibaug', type: 'Luxury Resort', pricePerNight: '₹8,900', mtdcPartner: false, rating: 4.5 },
      { name: 'MTDC Coastal Cottages Kihim', type: 'Govt Beach Cottages', pricePerNight: '₹2,400', mtdcPartner: true, rating: 4.2 },
      { name: 'Varsoli Green Palms Homestay', type: 'Konkani Homestay', pricePerNight: '₹1,800', mtdcPartner: true, rating: 4.3 }
    ],
    nearbyAmenities: [
      { name: 'Alibaug Civil Hospital & Casualty', type: 'emergency', distanceMeters: 800 },
      { name: 'Mandwa Passenger Terminal Water Post', type: 'drinking_water', distanceMeters: 100 },
      { name: 'Varsoli Beach Public Showers', type: 'toilets', distanceMeters: 150 },
      { name: 'Sanman Konkani Seafood Joint', type: 'restaurant', distanceMeters: 500 }
    ],
    majorAttractions: [
      { name: 'Kolaba Sea Fort', type: 'fort', blurb: '17th-century island fortress walkable at low tide, built by Chhatrapati Shivaji Maharaj.' },
      { name: 'Varsoli Water Sports Beach', type: 'lake', blurb: 'Bustling white sand beach offering parasailing and speed boat rides.' },
      { name: 'Kankeshwar Temple Clifftop', type: 'temple', blurb: 'Hilltop Shiva temple accessed via 700 ancient stone steps through dense teak groves.' }
    ],
    gettingThere: {
      primaryRoute: 'Ro-Ro ferry from Bhaucha Dhakka to Mandwa or NH-66 via Pen',
      liveEtaText: '1 hr 15 mins via ferry (+75m wait)',
      bottleneckActive: true,
      bypassSuggestion: 'Consider Kashid or Murud-Janjira for clear sands and less queue.'
    }
  },
  {
    id: 'KAS',
    code: 'KAS',
    name: 'Kashid & Murud Waters',
    category: 'Coastal',
    coordinates: [18.4283, 72.9083],
    physicalCapacity: 5000,
    base_capacity_source_citation: 'Coastal Regulation Zone Carrying Limits — Raigad District Collectorate',
    currentInflow: 1900,
    weatherHazardScore: 0.10,
    avgDwellTimeHours: 3.8,
    features: [0.85, 0.70, 0.40, 0.85],
    localPressure: {
      parkingSaturationPct: 35,
      waterStressIndex: 0.32,
      municipalWasteAlert: false,
    },
    hotelOccupancyPct: 40,
    district: 'Raigad',
    state: 'Maharashtra',
    tagline: 'White Sand Beaches & Murud-Janjira Fortress',
    description: 'Clean stretches of white sand with gentle surf, cashew groves, and the impregnable Janjira Island Fort just 25km south of Alibaug.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '3 hrs from Mumbai / 3 hrs from Pune',
    distanceKmFromHub: 125,
    highlights: ['White Sand Waves', 'Murud-Janjira Sea Fort', 'Phansad Wildlife Sanctuary', 'Suru Tree Groves'],
    bestFor: ['Clean Water Swimming', 'Historical Forts', 'Quiet Beachstays'],
    isUnderVisited: false,
    associated_business_ids: ['biz-kas-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.28, note: 'Near empty shores' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.25, note: 'Calm water conditions' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.30, note: 'Gentle sea breeze' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.36, note: 'Pleasant temperature' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.48, note: 'Steady weekend arrivals' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.65, note: 'Active watersports, no jam' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.60, note: 'Comfortable family day' }
    ],
    nearbyHotels: [
      { name: 'Prakruti Resorts Kashid', type: 'Luxury Beach Resort', pricePerNight: '₹6,200', mtdcPartner: true, rating: 4.6 },
      { name: 'Kashid Beach Holiday Resort', type: 'Coastal Stay', pricePerNight: '₹2,600', mtdcPartner: true, rating: 4.2 },
      { name: 'Janjira Island Homestay', type: 'Traditional Fisherfolk Homestay', pricePerNight: '₹1,400', mtdcPartner: true, rating: 4.4 }
    ],
    nearbyAmenities: [
      { name: 'Kashid Beach Lifeguard Station', type: 'emergency', distanceMeters: 50 },
      { name: 'Suru Baug Fresh Water Booth', type: 'drinking_water', distanceMeters: 120 },
      { name: 'Murud Coastal Tourist Restrooms', type: 'toilets', distanceMeters: 250 },
      { name: 'Patil Khanawal Home Dining', type: 'restaurant', distanceMeters: 350 }
    ],
    majorAttractions: [
      { name: 'Murud-Janjira Marine Fortress', type: 'fort', blurb: 'Spectacular island fort that resisted Dutch, British, and Portuguese sieges.' },
      { name: 'Phansad Wildlife Sanctuary', type: 'viewpoint', blurb: 'Coastal woodland haven famous for giant flying squirrels and scenic nature trails.' },
      { name: 'Kashid White Sand Bay', type: 'lake', blurb: 'Pristine 3km stretch of soft white sand with clean surf and shallow gradient.' }
    ],
    gettingThere: {
      primaryRoute: 'Alibaug-Murud Coastal Road (SH-91)',
      liveEtaText: '3 hrs 10 mins (scenic coastal highway)',
      bottleneckActive: false
    }
  },
  {
    id: 'MAH',
    code: 'MAH',
    name: 'Mahabaleshwar Plateau',
    category: 'Hill Station',
    coordinates: [17.9237, 73.6586],
    physicalCapacity: 12000,
    base_capacity_source_citation: 'Satara District Disaster Management Authority High Altitude Carrying Capacity Study',
    currentInflow: 13500,
    weatherHazardScore: 0.35,
    avgDwellTimeHours: 4.5,
    features: [0.92, 0.75, 0.60, 0.90],
    localPressure: {
      parkingSaturationPct: 92,
      waterStressIndex: 0.85,
      municipalWasteAlert: true,
    },
    hotelOccupancyPct: 96,
    activeAdvisory: 'High landslide warning on Pasarni Ghat. Long queues at Venna Lake boating dock.',
    district: 'Satara',
    state: 'Maharashtra',
    tagline: 'Strawberry Capital of the Sahyadris',
    description: 'Iconic high-altitude plateau known for cool weather, strawberry plantations, and dramatic canyon drops. Overcrowded this weekend.',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '4.5 hrs from Mumbai / 2.5 hrs from Pune',
    distanceKmFromHub: 230,
    highlights: ['Venna Lake', 'Arthur\'s Seat Point', 'Mapro Strawberry Garden', 'Pratapgad Fort'],
    bestFor: ['Family Vacations', 'Strawberry Treats', 'Plateau Vistas'],
    isUnderVisited: false,
    associated_business_ids: ['biz-mah-01', 'biz-mah-02'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.42, note: 'Uncluttered viewpoints' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.36, note: 'Easy strawberry farm tours' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.40, note: 'Clear mountain paths' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.50, note: 'Moderate hotel bookings' },
      { day: 'Fri', dayFull: 'Friday', level: 'MODERATE', typicalFootfallRatio: 0.80, note: 'Heavy ascent traffic at Wai' },
      { day: 'Sat', dayFull: 'Saturday', level: 'CRITICAL', typicalFootfallRatio: 1.28, note: 'Severe parking crunch at Venna' },
      { day: 'Sun', dayFull: 'Sunday', level: 'CRITICAL', typicalFootfallRatio: 1.20, note: 'Ghat crawling downhill' }
    ],
    nearbyHotels: [
      { name: 'Le Méridien Mahabaleshwar Resort', type: 'Luxury 5-Star', pricePerNight: '₹12,000', mtdcPartner: false, rating: 4.7 },
      { name: 'MTDC Holiday Resort Mahabaleshwar', type: 'Govt Forest Haven', pricePerNight: '₹2,600', mtdcPartner: true, rating: 4.2 },
      { name: 'Strawberry Valley Agro-Stays', type: 'Farm Stay', pricePerNight: '₹1,900', mtdcPartner: true, rating: 4.4 }
    ],
    nearbyAmenities: [
      { name: 'Mahabaleshwar Municipal Hospital', type: 'emergency', distanceMeters: 650 },
      { name: 'Venna Lake Public RO Kiosk', type: 'drinking_water', distanceMeters: 80 },
      { name: 'Arthur Seat Eco Washrooms', type: 'toilets', distanceMeters: 120 },
      { name: 'Mapro Food Park & Cafe', type: 'restaurant', distanceMeters: 900 }
    ],
    majorAttractions: [
      { name: 'Arthur’s Seat (Queen of Points)', type: 'viewpoint', blurb: 'Highest cliff vantage facing the dense Jor valley and Savitri river origin.' },
      { name: 'Venna Lake & Boating Dock', type: 'lake', blurb: 'Historic artificial lake built by Raja of Satara in 1842, flanked by pine trees.' },
      { name: 'Pratapgad Fort', type: 'fort', blurb: 'Historic hill bastion famous for the encounter between Shivaji Maharaj and Afzal Khan.' }
    ],
    gettingThere: {
      primaryRoute: 'NH-48 to Surur, then SH-72 via Wai and Pasarni Ghat',
      liveEtaText: '3 hrs 45 mins from Pune (+50m ghat crawl)',
      bottleneckActive: true,
      bypassSuggestion: 'Reroute to Tapola & Koyna Backwaters for peaceful fjords and zero crawl.'
    }
  },
  {
    id: 'TAP',
    code: 'TAP',
    name: 'Tapola & Koyna Backwaters',
    category: 'Hill Station',
    coordinates: [17.7812, 73.7225],
    physicalCapacity: 3500,
    base_capacity_source_citation: 'Koyna Wildlife Sanctuary & Dam Catchment Eco-Tourism Regulation Guidelines',
    currentInflow: 950,
    weatherHazardScore: 0.12,
    avgDwellTimeHours: 4.0,
    features: [0.95, 0.60, 0.85, 0.75],
    localPressure: {
      parkingSaturationPct: 20,
      waterStressIndex: 0.18,
      municipalWasteAlert: false,
    },
    hotelOccupancyPct: 32,
    district: 'Satara',
    state: 'Maharashtra',
    tagline: 'The "Mini Kashmir" of the Sahyadris',
    description: 'Serene fjord-like Shivsagar reservoir backwaters surrounded by deep reserved forests. Ideal quiet alternative to Mahabaleshwar.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '5 hrs from Mumbai / 3 hrs from Pune',
    distanceKmFromHub: 255,
    highlights: ['Koyna Reservoir Speedboating', 'Agritourism Camps', 'Vasota Jungle Trek Base', 'Island Picnics'],
    bestFor: ['Kayaking & Watersports', 'Eco-Resorts', 'Unspoiled Greenery'],
    isUnderVisited: true, // Algorithmic promotion boost
    associated_business_ids: ['biz-tap-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Tranquil mirror lake' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.12, note: 'Pure nature sounds' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Unbroken forest skyline' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.20, note: 'Idyllic for birdwatchers' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.32, note: 'Gentle weekend trickle' },
      { day: 'Sat', dayFull: 'Saturday', level: 'OPTIMAL', typicalFootfallRatio: 0.42, note: 'Spacious reservoir boating' },
      { day: 'Sun', dayFull: 'Sunday', level: 'OPTIMAL', typicalFootfallRatio: 0.35, note: 'Peaceful afternoon drive' }
    ],
    nearbyHotels: [
      { name: 'Koyna Agro Tourism Eco-Resort', type: 'Agro Resort', pricePerNight: '₹2,300', mtdcPartner: true, rating: 4.6 },
      { name: 'Shivsagar Lakefront Tents', type: 'Lakeside Camp', pricePerNight: '₹1,200', mtdcPartner: true, rating: 4.4 },
      { name: 'Tapola Water Sports Lodge', type: 'Waterfront Lodge', pricePerNight: '₹1,800', mtdcPartner: true, rating: 4.2 }
    ],
    nearbyAmenities: [
      { name: 'Tapola Water Sports Police Outpost', type: 'emergency', distanceMeters: 200 },
      { name: 'Shivsagar Boating Jetty Water Station', type: 'drinking_water', distanceMeters: 50 },
      { name: 'Tapola Village Panchayat Toilets', type: 'toilets', distanceMeters: 100 },
      { name: 'Riverfront Maharashtrian Lunch Home', type: 'restaurant', distanceMeters: 220 }
    ],
    majorAttractions: [
      { name: 'Shivsagar Reservoir Backwaters', type: 'lake', blurb: 'Enormous 90 km long reservoir formed by the Koyna Dam, resembling Scandinavian fjords.' },
      { name: 'Vasota Fort Jungle Launch Base', type: 'fort', blurb: 'Boat launch to Vasota fort trek through dense Koyna Wildlife Sanctuary tiger reserve.' },
      { name: 'Bamnoli Quiet Shoreline', type: 'viewpoint', blurb: 'Placid village edge offering boat rides to the sacred Datta Mandir island.' }
    ],
    gettingThere: {
      primaryRoute: 'Mahabaleshwar to Tapola Ghat Road (28 km past Mahabaleshwar)',
      liveEtaText: '3 hrs 15 mins from Pune (flowing smoothly)',
      bottleneckActive: false
    }
  }
];

export const INITIAL_ADVISORIES: Advisory[] = [
  {
    id: 'adv-001',
    destinationId: 'LON',
    destinationName: 'Lonavala & Khandala',
    severity: 'critical',
    title: 'Severe Ghat Choke & Parking Saturation',
    message: 'NH-48 Ghat section operating at 180% capacity. Bhushi dam and Tiger point parking full. Traffic diverted at Express Way Toll Plaza.',
    timestamp: '10 mins ago',
    active: true,
    author: 'Highway Police & Municipal Council'
  },
  {
    id: 'adv-002',
    destinationId: 'ALB',
    destinationName: 'Alibaug Beach',
    severity: 'high',
    title: 'Ro-Ro & Jetty Surge Advisory',
    message: 'Mandwa water terminal passenger turnaround delay at 75 mins. Recommending travelers head to southern beaches like Kashid/Murud.',
    timestamp: '25 mins ago',
    active: true,
    author: 'Maharashtra Maritime Board'
  },
  {
    id: 'adv-003',
    destinationId: 'MAH',
    destinationName: 'Mahabaleshwar Plateau',
    severity: 'medium',
    title: 'Pasarni Ghat Rain & Fog Caution',
    message: 'Intermittent fog reducing visibility below 30m. Heavy vehicular crawling observed along Wai-Panchgani ascent.',
    timestamp: '45 mins ago',
    active: true,
    author: 'Satara District Disaster Cell'
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'prm-001',
    destinationId: 'BHA',
    destinationName: 'Bhandardara Serene Haven',
    discountPct: 25,
    title: 'Lakeside Homestay & Agro-Trek',
    badge: 'Flat 25% Off + Free Firefly Walk',
    description: 'Escape the crowd! Book direct with verified local heritage homestays around Arthur Lake with complimentary dinner.',
    code: 'DECONGEST25',
    validUntil: 'Valid this weekend',
    businessName: 'Sahyadri Rural Tourism Collective',
    businessType: 'Homestay'
  },
  {
    id: 'prm-002',
    destinationId: 'MAT',
    destinationName: 'Matheran Eco-Zone',
    discountPct: 20,
    title: 'Heritage Forest Lodge Escape',
    badge: '20% Eco-Pass Rebate',
    description: 'Automobile-free wellness weekend: Get 20% cashback on luxury forest villa stays and complimentary horse trail guide.',
    code: 'CLEANAIR20',
    validUntil: 'Valid this weekend',
    businessName: 'Matheran Heritage Hoteliers Guild',
    businessType: 'Resort'
  },
  {
    id: 'prm-003',
    destinationId: 'KAS',
    destinationName: 'Kashid & Murud Waters',
    discountPct: 30,
    title: 'Beachside Villa & Watersport Combo',
    badge: '30% Off Water Sports & Stays',
    description: 'Uncrowded white sand beaches: Avail flat 30% discount on banana boat rides and sea-facing cottage stays.',
    code: 'KASHID30',
    validUntil: 'Valid this weekend',
    businessName: 'Murud Coastal Tourism Association',
    businessType: 'Adventure Trek'
  },
  {
    id: 'prm-004',
    destinationId: 'TAP',
    destinationName: 'Tapola & Koyna Backwaters',
    discountPct: 35,
    title: 'Koyna Valley Agro-Resort & Boating',
    badge: '35% Off Agro-Stay + Free Kayak',
    description: 'Relax in mini Kashmir without the Mahabaleshwar traffic jam. 35% discount with direct riverfront camping.',
    code: 'TAPOLA35',
    validUntil: 'Valid this weekend',
    businessName: 'Koyna Eco-Tourism Society',
    businessType: 'Resort'
  }
];
