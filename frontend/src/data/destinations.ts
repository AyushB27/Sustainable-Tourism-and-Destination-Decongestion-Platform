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
  },
  {
    id: 'PCH',
    code: 'PCH',
    name: 'Panchgani Table Land',
    category: 'Hill Station',
    coordinates: [17.9239, 73.8018],
    physicalCapacity: 6000,
    base_capacity_source_citation: 'Satara District Regional Plan & ESZ Authority (SDRP/ESZ/2024)',
    currentInflow: 2800,
    weatherHazardScore: 0.12,
    avgDwellTimeHours: 3.2,
    features: [0.88, 0.68, 0.65, 0.90],
    localPressure: { parkingSaturationPct: 45, waterStressIndex: 0.35, municipalWasteAlert: false },
    hotelOccupancyPct: 52,
    district: 'Satara',
    state: 'Maharashtra',
    tagline: 'Volcanic Laterite Plateaus & Strawberry Orchards',
    description: "Asia's second-longest volcanic basalt plateau overlooking Krishna river valleys with cool breezes and strawberry farms.",
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '2 hrs from Pune / 4.5 hrs from Mumbai',
    distanceKmFromHub: 98,
    highlights: ['Table Land Plateau', 'Sydney Point', 'Parsi Point', 'Mapro Garden & Berry Farms'],
    bestFor: ['Scenic Plateau Walks', 'Paragliding', 'Farm Visits'],
    isUnderVisited: false,
    associated_business_ids: ['biz-pch-01', 'biz-pch-02'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.30, note: 'Gentle breeze, zero wait' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.28, note: 'Ideal photography hours' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.32, note: 'Pleasant and quiet' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.40, note: 'Moderate footfall' },
      { day: 'Fri', dayFull: 'Friday', level: 'MODERATE', typicalFootfallRatio: 0.65, note: 'Arrival of weekenders' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.88, note: 'Table land horse rides active' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.82, note: 'Evening market influx' }
    ],
    nearbyHotels: [
      { name: 'Hotel Ravine Panchgani', type: 'Valley View Resort', pricePerNight: '₹3,800', mtdcPartner: false, rating: 4.3 },
      { name: 'Il Palazzo Heritage Hotel', type: 'Heritage Lodge', pricePerNight: '₹4,500', mtdcPartner: true, rating: 4.6 }
    ],
    nearbyAmenities: [
      { name: 'Panchgani Municipal Water Point', type: 'drinking_water', distanceMeters: 120 },
      { name: 'Table Land Base Comfort Center', type: 'toilets', distanceMeters: 80 }
    ],
    majorAttractions: [
      { name: 'Table Land Basalt Mesa', type: 'viewpoint', blurb: 'Vast volcanic laterite plateau with 360-degree views of Wai valley and Rajpuri caves.' },
      { name: 'Sydney Point Valley Vista', type: 'viewpoint', blurb: 'Cliff overlook viewing the Dhom dam waters and Pandavgad fort.' }
    ],
    gettingThere: {
      primaryRoute: 'SH-72 via Wai and Pasarni Ghat',
      liveEtaText: '2 hrs 10 mins from Pune (flowing smoothly)',
      bottleneckActive: false
    }
  },
  {
    id: 'KAA',
    code: 'KAA',
    name: 'Kaas Plateau of Flowers',
    category: 'Botanical Sanctuary',
    coordinates: [17.7210, 73.8188],
    physicalCapacity: 3000,
    base_capacity_source_citation: 'UNESCO World Natural Heritage Committee & Satara Forest Division (UNESCO-WHC-48-2023)',
    currentInflow: 850,
    weatherHazardScore: 0.15,
    avgDwellTimeHours: 2.5,
    features: [0.98, 0.55, 0.50, 0.85],
    localPressure: { parkingSaturationPct: 28, waterStressIndex: 0.20, municipalWasteAlert: false },
    hotelOccupancyPct: 35,
    district: 'Satara',
    state: 'Maharashtra',
    tagline: 'UNESCO World Natural Heritage Floral Biodiversity',
    description: 'Fragile volcanic laterite plateau blooming with 850+ endemic wild orchid and carnivorous flower species.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '2.5 hrs from Pune / 5 hrs from Mumbai',
    distanceKmFromHub: 125,
    highlights: ['Kaas Lake', 'Kumudini Flower Pond', 'Endemic Orchid Beds', 'Vajrai Waterfall View'],
    bestFor: ['UNESCO Floral Walks', 'Botanical Photography', 'Silent Nature Immersion'],
    isUnderVisited: true,
    associated_business_ids: ['biz-kaa-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.18, note: 'Strict slot booking peaceful' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Untouched flower beds' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.20, note: 'Botanical research day' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.25, note: 'Pleasant sunshine' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.45, note: 'Slot booking advised' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.70, note: 'Daily 3,000 cap enforced' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.75, note: 'Forest guard checks active' }
    ],
    nearbyHotels: [
      { name: 'Kaas Forest Eco-Homestay', type: 'Village Homestay', pricePerNight: '₹1,400', mtdcPartner: true, rating: 4.5 },
      { name: 'Satara Valley Retreat', type: 'Eco-Resort', pricePerNight: '₹2,600', mtdcPartner: true, rating: 4.2 }
    ],
    nearbyAmenities: [
      { name: 'Kaas Gate Forest Checkpost Water ATM', type: 'drinking_water', distanceMeters: 50 },
      { name: 'UNESCO Information Center Toilets', type: 'toilets', distanceMeters: 40 }
    ],
    majorAttractions: [
      { name: 'Kumudini Water Lily Lake', type: 'lake', blurb: 'Natural highland pond carpeted with endemic floating Kumudini lilies.' },
      { name: 'Vajrai Waterfall Gorge View', type: 'waterfall', blurb: 'Highest tiered waterfall in Maharashtra tumbling into Urmodi basin.' }
    ],
    gettingThere: {
      primaryRoute: 'Satara-Kaas Forest Road (22 km from Satara)',
      liveEtaText: '40 mins from Satara (clear scenic road)',
      bottleneckActive: false
    }
  },
  {
    id: 'IGA',
    code: 'IGA',
    name: 'Igatpuri & Bhavali Valley',
    category: 'Hill Station',
    coordinates: [19.6974, 73.5606],
    physicalCapacity: 4500,
    base_capacity_source_citation: 'Nashik District Tourism & Forest Corridor Survey (NDTC/2024)',
    currentInflow: 980,
    weatherHazardScore: 0.18,
    avgDwellTimeHours: 4.0,
    features: [0.92, 0.75, 0.70, 0.80],
    localPressure: { parkingSaturationPct: 22, waterStressIndex: 0.25, municipalWasteAlert: false },
    hotelOccupancyPct: 40,
    district: 'Nashik',
    state: 'Maharashtra',
    tagline: 'Mist Waterfalls, Vipassana & Sahyadri Gorges',
    description: 'Serene railway gap corridor with Bhavali dam overflow, Kalsubai view, and meditation sanctuaries.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '2 hrs from Mumbai / 45 mins from Nashik',
    distanceKmFromHub: 120,
    highlights: ['Bhavali Dam Waterfall', 'Vipassana International Academy', 'Camel Valley', 'Vaitarna Lake'],
    bestFor: ['Monsoon Retreat', 'Meditation & Wellness', 'Photography'],
    isUnderVisited: true,
    associated_business_ids: ['biz-iga-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.20, note: 'Tranquil waterfalls' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.18, note: 'Clear mountain breeze' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.22, note: 'Ideal meditation setting' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.28, note: 'Quiet misty walks' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.50, note: 'Weekend wellness arrivals' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.68, note: 'Moderate dam visitors' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.62, note: 'Serene afternoon departures' }
    ],
    nearbyHotels: [
      { name: 'Mystic Valley Spa Resort', type: 'Wellness Resort', pricePerNight: '₹4,200', mtdcPartner: false, rating: 4.4 },
      { name: 'Bhavali Eco-Farm Homestay', type: 'Village Homestay', pricePerNight: '₹1,500', mtdcPartner: true, rating: 4.6 }
    ],
    nearbyAmenities: [
      { name: 'Igatpuri Railhead Filtered Water', type: 'drinking_water', distanceMeters: 200 },
      { name: 'Bhavali Dam View Comfort Station', type: 'toilets', distanceMeters: 150 }
    ],
    majorAttractions: [
      { name: 'Bhavali Dam Overflow Cascades', type: 'waterfall', blurb: 'Natural wall of foaming monsoon water cascading into green valleys.' },
      { name: 'Camel Valley Escarpment', type: 'viewpoint', blurb: 'Deep rock gorge plunging 1,000 feet with seasonal mist curtains.' }
    ],
    gettingThere: {
      primaryRoute: 'NH-160 (Mumbai-Nashik Highway via Kasara Ghat)',
      liveEtaText: '1 hr 55 mins from Thane (flowing freely)',
      bottleneckActive: false
    }
  },
  {
    id: 'SHI',
    code: 'SHI',
    name: 'Shirdi Spiritual Corridor',
    category: 'Pilgrimage',
    coordinates: [19.7667, 74.4764],
    physicalCapacity: 35000,
    base_capacity_source_citation: 'Shri Saibaba Sansthan Trust Crowd Safety Audit (SSST/2024-01)',
    currentInflow: 18500,
    weatherHazardScore: 0.05,
    avgDwellTimeHours: 5.0,
    features: [0.60, 0.90, 0.20, 0.95],
    localPressure: { parkingSaturationPct: 65, waterStressIndex: 0.55, municipalWasteAlert: false },
    hotelOccupancyPct: 78,
    district: 'Ahmednagar',
    state: 'Maharashtra',
    tagline: 'Global Spiritual Pilgrimage & Community Kitchens',
    description: 'Mass spiritual transit hub with zero-carbon solar megaplex kitchens and massive pilgrim influx.',
    imageUrl: 'https://images.unsplash.com/photo-1545232979-fbf6c63286f0?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '4 hrs from Pune / 4.5 hrs from Mumbai',
    distanceKmFromHub: 240,
    highlights: ['Samadhi Mandir', 'Solar Kitchen Complex', 'Dwarkamai', 'Lendi Baugh'],
    bestFor: ['Spiritual Darshan', 'Community Dining', 'Family Pilgrimage'],
    isUnderVisited: false,
    associated_business_ids: ['biz-shi-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.45, note: 'Shorter queue times' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.40, note: 'Smooth temple darshan' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.48, note: 'Moderate queue' },
      { day: 'Thu', dayFull: 'Thursday', level: 'CRITICAL', typicalFootfallRatio: 1.30, note: 'Peak Thursday Aarti rush' },
      { day: 'Fri', dayFull: 'Friday', level: 'MODERATE', typicalFootfallRatio: 0.70, note: 'Manageable pilgrim transit' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.92, note: 'High weekend influx' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.95, note: 'Evening departures' }
    ],
    nearbyHotels: [
      { name: 'MTDC Pilgrim Inn Shirdi', type: 'Govt Guest House', pricePerNight: '₹1,200', mtdcPartner: true, rating: 4.1 },
      { name: 'Sun-n-Sand Shirdi', type: 'Luxury Hotel', pricePerNight: '₹4,800', mtdcPartner: false, rating: 4.4 }
    ],
    nearbyAmenities: [
      { name: 'Sansthan RO Water Kiosk', type: 'drinking_water', distanceMeters: 50 },
      { name: 'Complex Toilet Block Gate 3', type: 'toilets', distanceMeters: 40 }
    ],
    majorAttractions: [
      { name: 'Samadhi Mandir Complex', type: 'temple', blurb: 'Central sanctum holding the marble samadhi of Shri Sai Baba.' },
      { name: 'World Largest Solar Kitchen', type: 'viewpoint', blurb: 'Eco-marvel preparing 40,000 free solar-steam cooked meals daily.' }
    ],
    gettingThere: {
      primaryRoute: 'Samruddhi Mahamarg (Expressway)',
      liveEtaText: '3 hrs 30 mins from Mumbai via Samruddhi',
      bottleneckActive: false
    }
  },
  {
    id: 'TRB',
    code: 'TRB',
    name: 'Trimbakeshwar & Brahmagiri',
    category: 'Heritage',
    coordinates: [19.9328, 73.5307],
    physicalCapacity: 15000,
    base_capacity_source_citation: 'Nashik District Administration & Devasthan Trust Audit (NDT/2024)',
    currentInflow: 6500,
    weatherHazardScore: 0.12,
    avgDwellTimeHours: 4.5,
    features: [0.85, 0.75, 0.65, 0.85],
    localPressure: { parkingSaturationPct: 58, waterStressIndex: 0.40, municipalWasteAlert: false },
    hotelOccupancyPct: 60,
    district: 'Nashik',
    state: 'Maharashtra',
    tagline: 'Godavari Origin & Ancient Black Stone Jyotirlinga',
    description: 'Sacred Sahyadri mountain grove where river Godavari emerges beneath holy Brahmagiri peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '30 mins from Nashik / 3.5 hrs from Mumbai',
    distanceKmFromHub: 165,
    highlights: ['Jyotirlinga Temple', 'Brahmagiri Hill Trek', 'Kushavarta Kund', 'Anjaneri Monkey Sanctuary'],
    bestFor: ['Heritage Architecture', 'Pilgrimage', 'Sacred Forest Treks'],
    isUnderVisited: false,
    associated_business_ids: ['biz-trb-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'CRITICAL', typicalFootfallRatio: 1.25, note: 'Somwar special abhishek rush' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.40, note: 'Peaceful temple darshan' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.38, note: 'Pleasant Brahmagiri climb' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.42, note: 'Clear forest trails' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.50, note: 'Moderate footfall' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.85, note: 'Weekend pilgrims' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.88, note: 'High family visitors' }
    ],
    nearbyHotels: [
      { name: 'MTDC Resort Trimbakeshwar', type: 'Govt Resort', pricePerNight: '₹1,800', mtdcPartner: true, rating: 4.2 },
      { name: 'Brahmagiri Valley Homestay', type: 'Village Homestay', pricePerNight: '₹1,300', mtdcPartner: true, rating: 4.5 }
    ],
    nearbyAmenities: [
      { name: 'Kushavarta Kund Filtered Water', type: 'drinking_water', distanceMeters: 60 },
      { name: 'North Gate Municipal Toilet Unit', type: 'toilets', distanceMeters: 50 }
    ],
    majorAttractions: [
      { name: '12th Century Jyotirlinga Mandir', type: 'temple', blurb: 'Ancient Hemadpanthi basalt stone temple housing three-faced linga.' },
      { name: 'Brahmagiri Mountain Origin Trail', type: 'viewpoint', blurb: 'Steep stone-cut steps climbing 1,298m to the holy origin stream of river Godavari.' }
    ],
    gettingThere: {
      primaryRoute: 'Trimbak Road via Nashik City (28 km)',
      liveEtaText: '35 mins from Nashik Central (flowing freely)',
      bottleneckActive: false
    }
  },
  {
    id: 'KLD',
    code: 'KLD',
    name: 'Kolad River Rapids',
    category: 'Adventure',
    coordinates: [18.4237, 73.3263],
    physicalCapacity: 3000,
    base_capacity_source_citation: 'Maharashtra Maritime Board Eco-Adventure Carrying Capacity (MMB/ADV/2024)',
    currentInflow: 720,
    weatherHazardScore: 0.20,
    avgDwellTimeHours: 4.5,
    features: [0.85, 0.65, 0.95, 0.70],
    localPressure: { parkingSaturationPct: 25, waterStressIndex: 0.15, municipalWasteAlert: false },
    hotelOccupancyPct: 38,
    district: 'Raigad',
    state: 'Maharashtra',
    tagline: 'Kundalika River White Water Rafting',
    description: "Maharashtra's prime dam-controlled river rafting and nature campsite corridor.",
    imageUrl: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '2.5 hrs from Mumbai / 2.5 hrs from Pune',
    distanceKmFromHub: 110,
    highlights: ['Kundalika River Grade-III Rapids', 'Bhira Dam Overflow', 'Riverside Campsites', 'Kayaking Lagoons'],
    bestFor: ['River Rafting', 'Adventure Camping', 'Team Building'],
    isUnderVisited: true,
    associated_business_ids: ['biz-kld-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.20, note: 'Dam release schedule normal' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.18, note: 'Quiet river conditions' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.22, note: 'Uncrowded rafting batches' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.25, note: 'Clear riverside' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.45, note: 'Camping check-ins' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.75, note: 'Morning 8 AM rafting batch' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.72, note: 'Afternoon wrap-up' }
    ],
    nearbyHotels: [
      { name: 'Kundalika Rafting Camp', type: 'Eco Campsite', pricePerNight: '₹2,100', mtdcPartner: true, rating: 4.5 },
      { name: 'Nature Trails Kolad', type: 'Adventure Resort', pricePerNight: '₹3,200', mtdcPartner: false, rating: 4.2 }
    ],
    nearbyAmenities: [
      { name: 'Rafting Starting Point Water Station', type: 'drinking_water', distanceMeters: 50 },
      { name: 'Changing Rooms and Washrooms Base', type: 'toilets', distanceMeters: 30 }
    ],
    majorAttractions: [
      { name: 'Kundalika Dam Release Rapids', type: 'waterfall', blurb: '12 km thrilling white water stretch with 10 challenging Grade II-III rapids.' },
      { name: 'Ghosala Fort Trek Base', type: 'fort', blurb: 'Lesser-known hill fort standing between the Revdanda and Salav creeks.' }
    ],
    gettingThere: {
      primaryRoute: 'Mumbai-Goa Highway (NH-66)',
      liveEtaText: '2 hrs 25 mins from Navi Mumbai',
      bottleneckActive: false
    }
  },
  {
    id: 'AMB',
    code: 'AMB',
    name: 'Amboli Mist Valley',
    category: 'Biodiversity Hotspot',
    coordinates: [15.9610, 73.9997],
    physicalCapacity: 2500,
    base_capacity_source_citation: 'Sindhudurg Wildlife Division ESZ Assessment (SWD/ESZ/2023)',
    currentInflow: 480,
    weatherHazardScore: 0.25,
    avgDwellTimeHours: 4.0,
    features: [0.96, 0.65, 0.85, 0.75],
    localPressure: { parkingSaturationPct: 20, waterStressIndex: 0.10, municipalWasteAlert: false },
    hotelOccupancyPct: 30,
    district: 'Sindhudurg',
    state: 'Maharashtra',
    tagline: 'Rainiest Sahyadri Ridge & Herpetofauna Haven',
    description: 'High-precipitation biodiversity corridor hosting rare Malabar Gliding frogs, pit vipers, and 750cm rain.',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '1.5 hrs from Belgaum / 2 hrs from Panaji',
    distanceKmFromHub: 350,
    highlights: ['Amboli Main Waterfall', 'Hiranyakeshi River Origin Cave', 'Sunset Point', 'Night Amphibian Trail'],
    bestFor: ['Rainforest Ecology', 'Herping Tours', 'Monsoon Waterfalls'],
    isUnderVisited: true,
    associated_business_ids: ['biz-amb-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Pristine rainforest silence' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.14, note: 'Superb macro photography' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.16, note: 'Clear misty forest walks' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.20, note: 'Fresh rainfall showers' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.35, note: 'Nature enthusiasts arrive' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.55, note: 'Waterfall viewing lively' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.50, note: 'Peaceful afternoon mist' }
    ],
    nearbyHotels: [
      { name: 'MTDC Green Valley Resort Amboli', type: 'Govt Eco-Resort', pricePerNight: '₹2,000', mtdcPartner: true, rating: 4.4 },
      { name: 'Whistling Woods Eco-Stay', type: 'Forest Lodge', pricePerNight: '₹1,600', mtdcPartner: true, rating: 4.6 }
    ],
    nearbyAmenities: [
      { name: 'Forest Information Center Water Tap', type: 'drinking_water', distanceMeters: 40 },
      { name: 'Amboli Waterfall Municipal Facility', type: 'toilets', distanceMeters: 60 }
    ],
    majorAttractions: [
      { name: 'Amboli Ghat Waterfall Cascades', type: 'waterfall', blurb: 'Roaring mountain waterfall spilling directly along the road parapets.' },
      { name: 'Hiranyakeshi Cave Shrine', type: 'temple', blurb: 'Sacred stone cave temple where the crystal clear Hiranyakeshi river originates.' }
    ],
    gettingThere: {
      primaryRoute: 'Sawantwadi-Amboli Ghat Highway (SH-121)',
      liveEtaText: '45 mins from Sawantwadi railhead',
      bottleneckActive: false
    }
  },
  {
    id: 'TMH',
    code: 'TMH',
    name: 'Tamhini Ghat & Plus Valley',
    category: 'Cloud Forest',
    coordinates: [18.4891, 73.4219],
    physicalCapacity: 3500,
    base_capacity_source_citation: 'Tamhini Wildlife Sanctuary Management Plan (MWR/TAM/2024)',
    currentInflow: 890,
    weatherHazardScore: 0.22,
    avgDwellTimeHours: 3.5,
    features: [0.95, 0.70, 0.90, 0.65],
    localPressure: { parkingSaturationPct: 32, waterStressIndex: 0.18, municipalWasteAlert: false },
    hotelOccupancyPct: 34,
    district: 'Pune',
    state: 'Maharashtra',
    tagline: 'Cascading Monsoon Corridors & Plus Canyon',
    description: 'Dense mountain pass cutting through the Western Ghats with deep canyons and roaring waterfalls.',
    imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '1.5 hrs from Pune / 3 hrs from Mumbai',
    distanceKmFromHub: 70,
    highlights: ['Plus Valley Canyon View', 'Mulshi Backwaters View', 'Kansai Waterfall', 'Devkund Trail Access'],
    bestFor: ['Monsoon Drives', 'Canyon Hiking', 'Waterfall Cascades'],
    isUnderVisited: true,
    associated_business_ids: ['biz-tmh-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.18, note: 'Empty ghat curves' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.16, note: 'Clear air and quiet' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.20, note: 'Pristine monsoon road' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.24, note: 'Light traffic flow' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.48, note: 'Drive enthusiasts arrive' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.72, note: 'Viewpoint parking active' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.68, note: 'Police patrolling active' }
    ],
    nearbyHotels: [
      { name: 'Plus Valley View Eco-Cabins', type: 'Nature Cabins', pricePerNight: '₹2,400', mtdcPartner: true, rating: 4.3 },
      { name: 'Mulshi Lake Village Homestay', type: 'Village Homestay', pricePerNight: '₹1,600', mtdcPartner: true, rating: 4.5 }
    ],
    nearbyAmenities: [
      { name: 'Sanctuary Entry Post Water Kiosk', type: 'drinking_water', distanceMeters: 50 },
      { name: 'Kansai Viewpoint Public Toilets', type: 'toilets', distanceMeters: 70 }
    ],
    majorAttractions: [
      { name: 'Plus Valley Gorge Canyon', type: 'viewpoint', blurb: 'Mind-boggling canyon carved in the shape of a plus sign resembling the Grand Canyon of Sahyadris.' },
      { name: 'Devkund Waterfall Foothill Trail', type: 'waterfall', blurb: 'Dense sacred forest trail leading to emerald pool waterfall fed by Tamhini streams.' }
    ],
    gettingThere: {
      primaryRoute: 'Paud Road via Pirangut and Mulshi Dam',
      liveEtaText: '1 hr 35 mins from Pune University',
      bottleneckActive: false
    }
  },
  {
    id: 'HAR',
    code: 'HAR',
    name: 'Harishchandragad & Konkan Kada',
    category: 'Heritage',
    coordinates: [19.3872, 73.7770],
    physicalCapacity: 2000,
    base_capacity_source_citation: 'Kalsubai Harishchandragad Wildlife Sanctuary Eco-Audit (KHW/2024)',
    currentInflow: 380,
    weatherHazardScore: 0.28,
    avgDwellTimeHours: 6.0,
    features: [0.98, 0.60, 0.98, 0.50],
    localPressure: { parkingSaturationPct: 18, waterStressIndex: 0.22, municipalWasteAlert: false },
    hotelOccupancyPct: 25,
    district: 'Ahmednagar',
    state: 'Maharashtra',
    tagline: 'The Dramatic 1,400m Concave Konkan Cliff',
    description: '6th-century Kalachuri fort citadel with ancient Kedareshwar cave temple and mind-boggling vertical drop.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '3.5 hrs from Pune / 4 hrs from Mumbai',
    distanceKmFromHub: 160,
    highlights: ['Konkan Kada Semicircular Precipice', 'Kedareshwar Water Cave Temple', 'Taramati Peak (1,429m)', 'Saptatirtha Pushkarni'],
    bestFor: ['Extreme Cliff Photography', 'Heritage Trekking', 'Stargazing Camp'],
    isUnderVisited: true,
    associated_business_ids: ['biz-har-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.12, note: 'Pure wilderness trails' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.10, note: 'Zero trekkers, pristine' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.14, note: 'Ancient caves serene' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.18, note: 'Clear horizon at Konkan Kada' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.40, note: 'Base village homestays open' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.65, note: 'Trekker groups on trail' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.55, note: 'Early descent before sunset' }
    ],
    nearbyHotels: [
      { name: 'Khireshwar Base Village Homestay', type: 'Village Homestay', pricePerNight: '₹900', mtdcPartner: true, rating: 4.7 },
      { name: 'Pachnai Guide Camp & Meals', type: 'Trekker Camp', pricePerNight: '₹800', mtdcPartner: true, rating: 4.5 }
    ],
    nearbyAmenities: [
      { name: 'Kedareshwar Cave Natural Spring', type: 'drinking_water', distanceMeters: 20 },
      { name: 'Base Village Panchayat Restrooms', type: 'toilets', distanceMeters: 100 }
    ],
    majorAttractions: [
      { name: 'Konkan Kada Dramatic Overhang', type: 'viewpoint', blurb: 'Enormous concave rock wall dropping 1,424 meters straight into the Konkan plains.' },
      { name: 'Kedareshwar Cave Ice Water Shiva Linga', type: 'temple', blurb: 'Ancient rock-cut temple carved into a cave surrounded by waist-deep glacial water.' }
    ],
    gettingThere: {
      primaryRoute: 'Alephata-Otur-Khireshwar or Ghoti-Pachnai route',
      liveEtaText: '3 hrs 45 mins to Pachnai base village',
      bottleneckActive: false
    }
  },
  {
    id: 'VEL',
    code: 'VEL',
    name: 'Velas Turtle Beach',
    category: 'Coastal',
    coordinates: [17.9620, 73.0315],
    physicalCapacity: 1500,
    base_capacity_source_citation: 'Sahyadri Nisarga Mitra & Forest Dept Olive Ridley Action Plan (SNM/OR/2024)',
    currentInflow: 280,
    weatherHazardScore: 0.10,
    avgDwellTimeHours: 4.0,
    features: [0.92, 0.70, 0.60, 0.90],
    localPressure: { parkingSaturationPct: 15, waterStressIndex: 0.12, municipalWasteAlert: false },
    hotelOccupancyPct: 22,
    district: 'Ratnagiri',
    state: 'Maharashtra',
    tagline: 'Community Olive Ridley Turtle Hatching Sanctuary',
    description: 'Pioneering eco-village where local families host tourists in homestays to protect baby sea turtles.',
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '5 hrs from Mumbai / 4.5 hrs from Pune',
    distanceKmFromHub: 210,
    highlights: ['Olive Ridley Hatchery Releases', 'Harihareshwar Ferry Cross', 'Village Agro-Homestays', 'Bankot Fort'],
    bestFor: ['Wildlife Conservation', 'Authentic Konkani Living', 'Eco-Education'],
    isUnderVisited: true,
    associated_business_ids: ['biz-vel-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.10, note: 'Turtle tracks at sunrise' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.10, note: 'Silent beach mornings' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.12, note: 'Hatchery monitoring quiet' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Warm Konkani hospitality' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.30, note: 'Evening homestay dinners' },
      { day: 'Sat', dayFull: 'Saturday', level: 'OPTIMAL', typicalFootfallRatio: 0.45, note: 'Dawn 06:30 AM release watch' },
      { day: 'Sun', dayFull: 'Sunday', level: 'OPTIMAL', typicalFootfallRatio: 0.42, note: 'Dusk 05:30 PM release watch' }
    ],
    nearbyHotels: [
      { name: 'Velas Eco-Village Homestay Network', type: 'Community Homestay', pricePerNight: '₹1,200', mtdcPartner: true, rating: 4.8 },
      { name: 'Bankot Bay Fisherman Cottage', type: 'Village Stay', pricePerNight: '₹1,100', mtdcPartner: true, rating: 4.4 }
    ],
    nearbyAmenities: [
      { name: 'Village Community Water Well Filter', type: 'drinking_water', distanceMeters: 40 },
      { name: 'Eco-Information Center Washrooms', type: 'toilets', distanceMeters: 50 }
    ],
    majorAttractions: [
      { name: 'Velas Olive Ridley Turtle Hatchery', type: 'viewpoint', blurb: 'Community-guarded beach enclosure where tiny turtle hatchlings crawl into the sea.' },
      { name: 'Bankot Fort Overlooking Savitri River', type: 'fort', blurb: 'Old Portuguese and Maratha coastal stronghold commanding the mouth of Savitri river.' }
    ],
    gettingThere: {
      primaryRoute: 'Mangaon-Mahad-Mandangad-Velas or Bagmandla ferry',
      liveEtaText: '4 hrs 45 mins from Pune via Varandha Ghat',
      bottleneckActive: false
    }
  },
  {
    id: 'TOR',
    code: 'TOR',
    name: 'Torna Fort Citadel',
    category: 'Heritage',
    coordinates: [18.2764, 73.6225],
    physicalCapacity: 2500,
    base_capacity_source_citation: 'ASI Pune Circle & Western Ghats Fort Authority (ASI/PUN/2023)',
    currentInflow: 420,
    weatherHazardScore: 0.20,
    avgDwellTimeHours: 5.0,
    features: [0.94, 0.65, 0.90, 0.60],
    localPressure: { parkingSaturationPct: 20, waterStressIndex: 0.15, municipalWasteAlert: false },
    hotelOccupancyPct: 28,
    district: 'Pune',
    state: 'Maharashtra',
    tagline: 'The First Swarajya Citadel of Shivaji Maharaj',
    description: 'Highest fort in Pune district (1,403m) featuring the legendary Zunjar Machi knife-edge ridge.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '1.5 hrs from Pune / 4 hrs from Mumbai',
    distanceKmFromHub: 65,
    highlights: ['Zunjar Machi Knife Edge', 'Mengai Devi Temple', 'Budhla Machi Rock Formation', 'Bini Darwaja'],
    bestFor: ['Maratha Military History', 'Mountain Scrambling', 'Panoramic Sahyadri Views'],
    isUnderVisited: true,
    associated_business_ids: ['biz-tor-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.14, note: 'Quiet historical bastions' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.12, note: 'Solo trekking tranquility' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Clear air at the summit' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.20, note: 'Panoramic cloud views' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.38, note: 'Trekker camps in Velhe' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.60, note: 'Enthusiasts tackling Zunjar ridge' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.55, note: 'Village lunch homes busy' }
    ],
    nearbyHotels: [
      { name: 'Velhe Foothill Maratha Homestay', type: 'Village Homestay', pricePerNight: '₹1,000', mtdcPartner: true, rating: 4.6 },
      { name: 'Torna Heritage Agro-Lodge', type: 'Farm Stay', pricePerNight: '₹1,400', mtdcPartner: true, rating: 4.4 }
    ],
    nearbyAmenities: [
      { name: 'Mengai Temple Natural Cistern Water', type: 'drinking_water', distanceMeters: 30 },
      { name: 'Velhe Base Village Restrooms', type: 'toilets', distanceMeters: 100 }
    ],
    majorAttractions: [
      { name: 'Zunjar Machi Knife-Edge Razor Ridge', type: 'viewpoint', blurb: 'Hair-raising narrow mountain ridge fortified with high defensive stone parapets.' },
      { name: 'Budhla Machi Citadel Bastion', type: 'fort', blurb: 'Natural stone bastion resembling an owl (Budhla) offering commanding view of Rajgad fort.' }
    ],
    gettingThere: {
      primaryRoute: 'Sinhagad Road via Nasrapur-Velhe Road',
      liveEtaText: '1 hr 35 mins from Pune Swargate',
      bottleneckActive: false
    }
  },
  {
    id: 'SND',
    code: 'SND',
    name: 'Sindhudurg & Tarkarli',
    category: 'Coastal',
    coordinates: [16.0392, 73.4682],
    physicalCapacity: 4500,
    base_capacity_source_citation: 'MTDC Scuba & Marine Sanctuary Carrying Capacity Study (MTDC/SND/2024)',
    currentInflow: 1250,
    weatherHazardScore: 0.12,
    avgDwellTimeHours: 5.0,
    features: [0.90, 0.70, 0.85, 0.85],
    localPressure: { parkingSaturationPct: 35, waterStressIndex: 0.22, municipalWasteAlert: false },
    hotelOccupancyPct: 48,
    district: 'Sindhudurg',
    state: 'Maharashtra',
    tagline: 'Island Sea Fortress & Coral Reef Snorkeling',
    description: "Chhatrapati Shivaji's invincible 1664 marine fortress built into the Arabian Sea with pristine coral waters.",
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '1 hr from Chipi Airport / 7 hrs from Pune',
    distanceKmFromHub: 380,
    highlights: ['Sindhudurg Island Fort', 'Tarkarli Beach & Scuba Center', 'Karli River Estuary Houseboats', 'Rock Garden Malvan'],
    bestFor: ['Scuba & Snorkeling', 'Fortified Maritime History', 'Malvani Seafood Cuisine'],
    isUnderVisited: true,
    associated_business_ids: ['biz-snd-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.25, note: 'Crystal clear scuba visibility' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.22, note: 'Pristine dolphin cruises' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.28, note: 'Quiet fort boat ferries' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.32, note: 'Snorkeling reef calm' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.50, note: 'Houseboat check-ins' },
      { day: 'Sat', dayFull: 'Saturday', level: 'MODERATE', typicalFootfallRatio: 0.75, note: 'Active watersports' },
      { day: 'Sun', dayFull: 'Sunday', level: 'MODERATE', typicalFootfallRatio: 0.70, note: 'Fresh Malvani market bustle' }
    ],
    nearbyHotels: [
      { name: 'MTDC Tarkarli Coastal Resort', type: 'Govt Beach Resort', pricePerNight: '₹2,800', mtdcPartner: true, rating: 4.4 },
      { name: 'Malvan Coral Homestay', type: 'Village Homestay', pricePerNight: '₹1,500', mtdcPartner: true, rating: 4.7 }
    ],
    nearbyAmenities: [
      { name: 'Malvan Jetty Water Purification Unit', type: 'drinking_water', distanceMeters: 40 },
      { name: 'Tarkarli Beach Comfort Complex', type: 'toilets', distanceMeters: 60 }
    ],
    majorAttractions: [
      { name: 'Sindhudurg Island Sea Fort', type: 'fort', blurb: 'Massive 48-acre sea citadel with 3 km stone ramparts built on Kurte island in 1664.' },
      { name: 'Tarkarli Coral Reef & Scuba Sanctuary', type: 'viewpoint', blurb: 'Protected coastal lagoon with rich staghorn corals, sea anemones, and colorful fish.' }
    ],
    gettingThere: {
      primaryRoute: 'NH-66 to Kankavli, then MDR to Malvan',
      liveEtaText: '50 mins from Chipi Airport / 1 hr 15 mins from Kankavli station',
      bottleneckActive: false
    }
  },
  {
    id: 'MCH',
    code: 'MCH',
    name: 'Morachi Chincholi Sanctuary',
    category: 'Heritage',
    coordinates: [18.8475, 74.1977],
    physicalCapacity: 2000,
    base_capacity_source_citation: 'Maharashtra Agro-Tourism Development Corporation (ATDC/MCH/2024)',
    currentInflow: 350,
    weatherHazardScore: 0.08,
    avgDwellTimeHours: 4.0,
    features: [0.85, 0.80, 0.40, 0.95],
    localPressure: { parkingSaturationPct: 15, waterStressIndex: 0.10, municipalWasteAlert: false },
    hotelOccupancyPct: 20,
    district: 'Pune',
    state: 'Maharashtra',
    tagline: 'Tamarind Groves & Wild Dancing Peacocks',
    description: 'Authentic rural agro-tourism sanctuary where 2,500+ wild peacocks roam freely in farming courtyards.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '1 hr 15 mins from Pune / 3 hrs from Mumbai',
    distanceKmFromHub: 55,
    highlights: ['Free-Roaming Peacocks', 'Bullock Cart Rides', 'Organic Hurda Parties', 'Tamarind Grove Walks'],
    bestFor: ['Rural Farm Immersion', 'Birdwatching with Children', 'Organic Vegetarian Thali'],
    isUnderVisited: true,
    associated_business_ids: ['biz-mch-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.12, note: 'Peacocks dancing freely' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.10, note: 'Village calm and serene' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.14, note: 'Tamarind shade walks' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.16, note: 'Organic farm harvesting' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.30, note: 'Family stays arrive' },
      { day: 'Sat', dayFull: 'Saturday', level: 'OPTIMAL', typicalFootfallRatio: 0.50, note: 'Hurda party day' },
      { day: 'Sun', dayFull: 'Sunday', level: 'OPTIMAL', typicalFootfallRatio: 0.48, note: 'Evening bird calls' }
    ],
    nearbyHotels: [
      { name: 'Mayur Baugh Agro-Tourism Farm', type: 'Agro Farm Stay', pricePerNight: '₹1,300', mtdcPartner: true, rating: 4.6 },
      { name: 'Sahyadri Peacock Eco-Resort', type: 'Village Lodge', pricePerNight: '₹1,500', mtdcPartner: true, rating: 4.3 }
    ],
    nearbyAmenities: [
      { name: 'Mayur Baugh Fresh Well Water', type: 'drinking_water', distanceMeters: 30 },
      { name: 'Farm Center Clean Restrooms', type: 'toilets', distanceMeters: 40 }
    ],
    majorAttractions: [
      { name: 'Centuries-Old Tamarind Canopy Courtyards', type: 'viewpoint', blurb: 'Dense cluster of 2,000+ heirloom tamarind trees planted during the Peshwa era.' },
      { name: 'Dawn & Dusk Peacock Gathering Arena', type: 'viewpoint', blurb: 'Courtyard where flocks of wild peacocks feed and display their colorful feathers.' }
    ],
    gettingThere: {
      primaryRoute: 'Pune-Ahmednagar Highway via Shikrapur',
      liveEtaText: '1 hr 10 mins from Pune Airport',
      bottleneckActive: false
    }
  },
  {
    id: 'JWH',
    code: 'JWH',
    name: 'Jawhar Tribal Hill Station',
    category: 'Heritage',
    coordinates: [19.9142, 73.2325],
    physicalCapacity: 2500,
    base_capacity_source_citation: 'Palghar Tribal Development Directorate & MTDC Hill Audit (PTD/JWH/2024)',
    currentInflow: 310,
    weatherHazardScore: 0.15,
    avgDwellTimeHours: 4.0,
    features: [0.90, 0.75, 0.65, 0.85],
    localPressure: { parkingSaturationPct: 12, waterStressIndex: 0.15, municipalWasteAlert: false },
    hotelOccupancyPct: 24,
    district: 'Palghar',
    state: 'Maharashtra',
    tagline: 'Indigenous Warli Paintings & Dabhosa Falls',
    description: 'Untouched tribal plateau home to the Jai Vilas Palace, centuries-old Warli art guild, and roaring waterfalls.',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
    travelTimeFromHub: '2.5 hrs from Mumbai / 2 hrs from Nashik',
    distanceKmFromHub: 135,
    highlights: ['Jai Vilas Palace (Rajbari)', 'Dabhosa Waterfall (300 ft)', 'Warli Tribal Artisans Village', 'Sunset Point Jawhar'],
    bestFor: ['Tribal Art Workshops', 'Uncrowded Mist Views', 'Indigenous Forest Honey'],
    isUnderVisited: true,
    associated_business_ids: ['biz-jwh-01'],
    historicalWeeklyPattern: [
      { day: 'Mon', dayFull: 'Monday', level: 'OPTIMAL', typicalFootfallRatio: 0.12, note: 'Palace gardens tranquil' },
      { day: 'Tue', dayFull: 'Tuesday', level: 'OPTIMAL', typicalFootfallRatio: 0.10, note: 'Warli artists painting at home' },
      { day: 'Wed', dayFull: 'Wednesday', level: 'OPTIMAL', typicalFootfallRatio: 0.12, note: 'Clean fresh air on plateau' },
      { day: 'Thu', dayFull: 'Thursday', level: 'OPTIMAL', typicalFootfallRatio: 0.15, note: 'Dabhosa waterfall roaring' },
      { day: 'Fri', dayFull: 'Friday', level: 'OPTIMAL', typicalFootfallRatio: 0.32, note: 'Tribal weekly haat market' },
      { day: 'Sat', dayFull: 'Saturday', level: 'OPTIMAL', typicalFootfallRatio: 0.48, note: 'Art lovers visiting studios' },
      { day: 'Sun', dayFull: 'Sunday', level: 'OPTIMAL', typicalFootfallRatio: 0.45, note: 'Scenic sunset over ghats' }
    ],
    nearbyHotels: [
      { name: 'MTDC Tribal Resort Jawhar', type: 'Govt Eco-Resort', pricePerNight: '₹1,700', mtdcPartner: true, rating: 4.3 },
      { name: 'Warli Heritage Homestay', type: 'Village Homestay', pricePerNight: '₹1,200', mtdcPartner: true, rating: 4.6 }
    ],
    nearbyAmenities: [
      { name: 'Jawhar Palace Gate Water Fountain', type: 'drinking_water', distanceMeters: 40 },
      { name: 'Municipal Garden Comfort Block', type: 'toilets', distanceMeters: 50 }
    ],
    majorAttractions: [
      { name: 'Jai Vilas Palace (Rajbari)', type: 'fort', blurb: 'Neo-classical stone palace built by Mukne kings surrounded by 70 acres of cashew orchards.' },
      { name: 'Dabhosa Waterfall Plunge', type: 'waterfall', blurb: 'Dramatic 300-foot sheer vertical waterfall plunging into a deep rocky crater pool.' }
    ],
    gettingThere: {
      primaryRoute: 'NH-48 to Manor, then state highway via Vikramgad to Jawhar',
      liveEtaText: '2 hrs 35 mins from Thane',
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
