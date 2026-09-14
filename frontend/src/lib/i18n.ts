export type Language = 'en' | 'hi' | 'mr';

export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  version: string;
  westernGhatsLive: string;
  activeVisitors: string;
  overloadedZones: string;
  diversionsActive: string;
  co2Avoided: string;
  reset: string;
  touristPortal: string;
  authorityPortal: string;
  providerPortal: string;
  liveSimulation: string;
  selectTargetDestination: string;
  corridorFilter: string;
  vibePreferences: string;
  scenic: string;
  budget: string;
  adventure: string;
  family: string;
  optimalCapacity: string;
  moderateCapacity: string;
  criticalCapacity: string;
  dccScore: string;
  estWait: string;
  queuesActive: string;
  zeroDelay: string;
  inflowVsCap: string;
  parkingLoad: string;
  weatherRisk: string;
  activeAdvisoryBadge: string;
  twinTitle: string;
  recommendedReroute: string;
  vibeMatch: string;
  fewerTourists: string;
  rerouteCta: string;
  hourlyCurveTitle: string;
  optimalWindow: string;
  greenEcoPass: string;
  authorityTitle: string;
  gisMapTitle: string;
  thresholdTableTitle: string;
  communityImpactTitle: string;
  digitalDispatcherTitle: string;
  broadcastBtn: string;
  providerTitle: string;
  occupancySlider: string;
  inflowPredictorTitle: string;
  publishDeal: string;
  demandDiffusionTitle: string;
  timeSlotTitle: string;
  navExplore: string;
  navDiscover: string;
  navTripPlanner: string;
  navMyTrips: string;
  tripSustainabilityScore: string;
  carbonFootprint: string;
  carbonSaved: string;
  greenTrips: string;
  transportation: string;
  accommodation: string;
  activities: string;
  wasteManagement: string;
  localEconomy: string;
  environmentalImpact: string;
  aiEcoGuide: string;
  biodiversity: string;
  heritageCulture: string;
  zeroWaste: string;
  localLivelihoods: string;
  lowImpactHours: string;
  askAiGuide: string;

  // ── Landing Page ──
  ldMinistryTicker: string;
  ldGhatsCorridorsLabel: string;
  ldMonitoredCount: string;
  ldLiveTelemetryLabel: string;
  ldActiveStatus: string;
  ldHeroTitleLine1: string;
  ldHeroTitleLine2: string;
  ldHeroSubtitlePart1: string;
  ldHeroSubtitlePart2: string;
  ldStatCo2: string;
  ldStatDiverted: string;
  ldStatCapacity: string;
  ldStatBottlenecks: string;
  ldSearchPlaceholder: string;
  ldQuickThemes: string;
  ldThemeMistyGhats: string;
  ldThemeCoastalForts: string;
  ldThemeHeritageTreks: string;
  ldThemeSacredGroves: string;
  ldBtnLaunchPlanner: string;
  ldBtnStakeholderDemo: string;
  ldBtnSampleCertificate: string;
  ldPillarsEyebrow: string;
  ldPillarsTitle: string;
  ldPillarsSubtitle: string;
  ldWeight40: string;
  ldWeight30: string;
  ldPillar1Title: string;
  ldPillar1Desc: string;
  ldPillar1B1: string;
  ldPillar1B2: string;
  ldPillar1B3: string;
  ldPillar2Title: string;
  ldPillar2Desc: string;
  ldPillar2B1: string;
  ldPillar2B2: string;
  ldPillar2B3: string;
  ldPillar3Title: string;
  ldPillar3Desc: string;
  ldPillar3B1: string;
  ldPillar3B2: string;
  ldPillar3B3: string;
  ldLoopEyebrow: string;
  ldLoopTitle: string;
  ldLoopSubtitle: string;
  ldStage1Title: string; ldStage1Desc: string;
  ldStage2Title: string; ldStage2Desc: string;
  ldStage3Title: string; ldStage3Desc: string;
  ldStage4Title: string; ldStage4Desc: string;
  ldStage5Title: string; ldStage5Desc: string;
  ldStage6Title: string; ldStage6Desc: string;
  ldStage7Title: string; ldStage7Desc: string;
  ldStage8Title: string; ldStage8Desc: string;
  ldCatalogEyebrow: string;
  ldCatalogTitle: string;
  ldCatAllSpots: string;
  ldStatusComfortable: string;
  ldStatusModerate: string;
  ldStatusOvercrowded: string;
  ldCapacitySuffix: string;
  ldViewFullCatalogBtn: string;
  ldRewardsEyebrow: string;
  ldRewardsTitle: string;
  ldRewardsBtnLedger: string;
  ldReward1Title: string; ldReward1Desc: string;
  ldReward2Title: string; ldReward2Desc: string;
  ldReward3Title: string; ldReward3Desc: string;

  // ── Discover Page ──
  dpEyebrow: string;
  dpTitle: string;
  dpSubtitle: string;
  dpPersonalizingFrom: string;
  dpStyleQuestion: string;
  dpPriorityHigh: string;
  dpStandard: string;
  dpCategoryLabel: string;
  dpAllCategories: string;
  dpDistanceLabel: string;
  dpDistanceAny: string;
  dpDistanceDayTrip: string;
  dpDistanceWeekend: string;
  dpUnderVisitedOnly: string;
  dpFoundPrefix: string;
  dpFoundSuffix: string;
  dpRankedBadge: string;
  dpGridView: string;
  dpMapView: string;
  dpNoResultsTitle: string;
  dpNoResultsDesc: string;
  dpHiddenGemBadge: string;
  dpMatchSuffix: string;
  dpStatusOptimal: string;
  dpStatusModerate: string;
  dpStatusCritical: string;
  dpWaitSuffix: string;
  dpKmFromHub: string;
  dpQueueFree: string;
  dpModerateInflow: string;
  dpPeakWaiting: string;
  dpViewSpotPage: string;
  dpStyleScenic: string;
  dpStyleBudget: string;
  dpStyleAdventure: string;
  dpStyleFamily: string;

  // ── Search Results Page ──
  srEyebrow: string;
  srAllResultsTitle: string;
  srResultsForPrefix: string;
  srFoundPrefix: string;
  srFoundSuffix: string;
  srSwitchToDiscover: string;
  srSearchPlaceholder: string;
  srNoMatchTitlePrefix: string;
  srNoMatchDesc: string;
  srBrowseAllBtn: string;
  srGoToDiscoverBtn: string;
  srDestinationsHeading: string;
  srTier1Label: string;
  srDistrictsHeading: string;
  srTier2Label: string;
  srStatesHeading: string;
  srTier3Label: string;
  srViewSpot: string;
  srExplore: string;
  srViewAllSpots: string;
  srStateCoverageLabel: string;
  srStatusLowCrowds: string;
  srStatusModerateTraffic: string;
  srStatusCriticalOvercrowding: string;

  // ── Trip Planner Page ──
  tpHeaderEyebrow: string;
  tpTitle: string;
  tpSubtitle: string;
  tpModeAiTab: string;
  tpModeCustomTab: string;
  tpLiveAiBadge: string;
  tpStep1Title: string;
  tpDestModeSingle: string;
  tpDestModeMulti: string;
  tpYourDestinationLabel: string;
  tpBaseDestinationLabel: string;
  tpConnectingGemLabel: string;
  tpSingleModeTitle: string;
  tpStep2Title: string;
  tpSelectLengthLabel: string;
  tpStartDateLabel: string;
  tpEndDateLabel: string;
  tpWeekendNote: string;
  tpStep3Title: string;
  tpStep4Title: string;
  tpBudgetBudget: string; tpBudgetBudgetDesc: string;
  tpBudgetBalanced: string; tpBudgetBalancedDesc: string;
  tpBudgetPremium: string; tpBudgetPremiumDesc: string;
  tpGroupSolo: string;
  tpGroupCouple: string;
  tpGroupFamily: string;
  tpGroupFriends: string;
  tpGenerateBtnPrefix: string;
  tpGenerateBtnSuffix: string;
  tpModalEyebrow: string;
  tpModalTitle: string;
  tpModalSubtitle: string;
  tpModalField1Label: string;
  tpModalField2Label: string;
  tpSkipBtn: string;
  tpSaveClaimBtn: string;

  // ── Spot Page ──
  spNotFoundTitle: string;
  spNotFoundDesc: string;
  spExploreDiscoverBtn: string;
  spViewAllMhBtn: string;
  spStatusOptimalHeadline: string; spStatusOptimalSub: string;
  spStatusModerateHeadline: string; spStatusModerateSub: string;
  spStatusCriticalHeadline: string; spStatusCriticalSub: string;
  spUnderVisitedBadge: string;
  spTravelTime: string;
  spDistance: string;
  spStatutoryCapacity: string;
  spLiveLocationGis: string;
  spPlanTripBtn: string;
  spShareStatusBtn: string;
  spAuthorityGisLink: string;
  spDiscoverFeedLink: string;
  spCarryingCapacityEyebrow: string;
  spCrowdPressureTitle: string;
  spBookingBannerTitle: string;
  spBookingBannerBadge: string;
  spBookingBannerDesc: string;
  spInflowVsCapacity: string;
  spOperatingAtPrefix: string;
  spOperatingAtSuffix: string;
  spEstWaitQueue: string;
  spFreeFlowing: string;
  spWeatherHazard: string;
  spCaution: string;
  spSafe: string;
  sp12hForecastTitle: string;
  sp12hForecastDesc: string;
  spWeeklyTitle: string;
  spWeeklyDesc: string;
  spProvenanceCollapseHint: string;
  spProvenanceExpandHint: string;
  spProvenanceToggleLabel: string;
  spProvenanceIntro: string;
  spTwinsEyebrow: string;
  spTwinsTitlePrefix: string;
  spTwinsZeroTraffic: string;
  spTwinsIntroPrefix: string;
  spTwinsIntroSuffix: string;
  spTwinsTipLabel: string;
  spTwinsTipBody: string;
  spTwinsHighwayDelay: string;
  spTwinsExploreBtnPrefix: string;
  spPracticalInfoEyebrow: string;
  spPracticalInfoTitle: string;
  spHighlightsWithinPrefix: string;
  spOsmVerified: string;
  spGettingThere: string;
  spPrimaryRoute: string;
  spLiveEta: string;
  spChokeAdvisoryLabel: string;
  spHospitalityEyebrow: string;
  spVerifiedStaysTitle: string;
  spMtdcPrioritized: string;
  spMtdcPartnerBadge: string;
  spPerNight: string;
  spBookItineraryBtn: string;
  spCheckInsEyebrow: string;
  spCheckInsTitlePrefix: string;
  spCheckInBtn: string;
  spNoCheckIns: string;
  spCongestionLabel: string;
  spLightPleasant: string;
  spModerateLevel: string;
  spHeavyGridlock: string;
  spGeofenceVerified: string;
  spCheckInModalTitle: string;
  spCheckInModalDescPrefix: string;
  spCheckInModalDescSuffix: string;
  spCongestionScaleLabel: string;
  spOptionalNoteLabel: string;
  spNotePlaceholder: string;
  spGeofenceNote: string;
  spCancelBtn: string;
  spSubmitCheckInBtn: string;
  spShareModalTitle: string;
  spShareCardDescPrefix: string;
  spShareCardDescMid: string;
  spShareFooter: string;
  spWhatsAppShareBtn: string;
  spCopyShareBtn: string;
  spCopiedBtn: string;

  // ── Future Trip Planner ──
  ftpTitle: string;
  ftpBadgeAiScheduler: string;
  ftpBadgeBackendApi: string;
  ftpBadgeOffline: string;
  ftpSubtitle: string;
  ftpSaveBtn: string;
  ftpSavingBtn: string;
  ftpReportBtn: string;
  ftpPrintBtn: string;
  ftpViewInPasses: string;
  ftpDestLabel: string;
  ftpDateLabel: string;
  ftpDurationLabel: string;
  ftpStyleLabel: string;
  ftpStyleScenic: string; ftpStyleAdventure: string; ftpStyleFamily: string; ftpStyleBudget: string;
  ftpMobilityLabel: string;
  ftpMobilityGreen: string; ftpMobilityUltraGreen: string; ftpMobilityPersonalCar: string;
  ftpStayLabel: string;
  ftpStayHomestay: string; ftpStayHotel: string;
  ftpConventionalHotspots: string;
  ftpPredictedCrowdLoadPrefix: string;
  ftpHeavyTraffic: string;
  ftpModerateCrowds: string;
  ftpDecongestedTwin: string;
  ftpComfortableSuffix: string;
  ftpZeroDelays: string;
  ftpSustainabilityTitle: string;
  ftpPillar1Badge: string;
  ftpSustainabilityDesc: string;
  ftpEnvironmental: string;
  ftpSocialCultural: string;
  ftpLocalEconomic: string;
  ftpCarbonReductionTitle: string;
  ftpRoundTripDistance: string;
  ftpSoloCarBaseline: string;
  ftpEcoRoutePlanned: string;
  ftpCarbonSavedSuffix: string;
  ftpTreesAbsorption: string;
  ftpTreesDesc: string;
  ftpFuelSaved: string;
  ftpFuelDesc: string;
  ftpIdlingAvoided: string;
  ftpIdlingDesc: string;
  ftpLocalInjection: string;
  ftpLocalInjectionDesc: string;
  ftpAiInsightsTitle: string;
  ftpAiCarbonWhyTitle: string;
  ftpAiCommunityTitle: string;
  ftpGreenModeTitle: string;
  ftpGreenModeDesc: string;
  ftpOptimizedItineraryTitle: string;
  ftpAvoidsDelayBadge: string;
  ftpReportModalTitle: string;
  ftpReportModalSubtitle: string;
  ftpGeneratingReport: string;
  ftpReportValidNote: string;
  ftpPrintSaveBtn: string;
  ftpCloseBtn: string;
  ftpSocialSubLabel: string;
  ftpDecongestedSchedule: string;

  // ── Trip Planner Page (redesigned) ──
  ppEyebrow: string;
  ppTitle: string;
  ppSubtitle: string;
  ppPreferencesLabel: string;
  ppSpotsLabel: string;
  ppSpotsPlaceholder: string;
  ppSpotsSearchPlaceholder: string;
  ppScheduleLabel: string;
  ppStartDateLabel: string;
  ppEndDateLabel: string;
  ppGenerateBtn: string;
  ppLocationRequesting: string;
  ppLocationGranted: string;
  ppLocationFallback: string;
  ppSelectSpotsHint: string;
  ppNoSpotsSelected: string;
  ppAllDestinations: string;
  ppSelectedSuffix: string;
  ppOutputEyebrow: string;
  ppTripTimelineTitle: string;
  ppTripTimelineDesc: string;
  ppEcoTimelineTitle: string;
  ppEcoTimelineDesc: string;
  ppReplacesLabel: string;
  ppNoTwinFound: string;
  ppDayLabel: string;
  ppFreeDayLabel: string;
  ppSummaryTitle: string;
  ppSummaryDistance: string;
  ppSummaryCo2: string;
  ppSummaryCo2Saved: string;
  ppSummaryOriginalRoute: string;
  ppSummaryEcoRoute: string;
  ppSummaryCrowdReduction: string;
  ppSummaryDates: string;
  ppSummaryPreferences: string;
  ppSharePrintTitle: string;
  ppPrintBtn: string;
  ppCopyBtn: string;
  ppCopiedBtn: string;
  ppWhatsAppBtn: string;
  ppEditPlanBtn: string;
  ppKmSuffix: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    appName: 'EcoRoute Bharat',
    appSubtitle: 'Dynamic Carrying Capacity & Twin-Destination Rerouting Engine',
    version: 'SIH26204 AI Decongestion v2.4',
    westernGhatsLive: 'Western Ghats Corridor Live',
    activeVisitors: 'Active Visitors',
    overloadedZones: 'Overloaded Zones',
    diversionsActive: 'Diversions Active',
    co2Avoided: 'CO₂ avoided',
    reset: 'Reset',
    touristPortal: 'Tourist Experience Portal',
    authorityPortal: 'Authority Command Center',
    providerPortal: 'Service Provider & Economy',
    liveSimulation: 'Live Simulation Mode',
    selectTargetDestination: 'Select Target Destination',
    corridorFilter: 'Corridor Category Filter',
    vibePreferences: 'Vibe Recommender Preferences',
    scenic: 'Scenic Vistas',
    budget: 'Budget Friendly',
    adventure: 'Trekking & Adventure',
    family: 'Family Friendly',
    optimalCapacity: 'OPTIMAL CARRYING CAPACITY',
    moderateCapacity: 'MODERATE CROWD DENSITY',
    criticalCapacity: 'CRITICAL CONGESTION ALERT',
    dccScore: 'DCC Index Score',
    estWait: 'Est. Entry & Attraction Wait',
    queuesActive: 'Queues Active',
    zeroDelay: 'Zero Delay',
    inflowVsCap: 'Tourist Inflow / Capacity',
    parkingLoad: 'Parking Load',
    weatherRisk: 'Weather Risk',
    activeAdvisoryBadge: 'Official Government Advisory Active',
    twinTitle: 'Preference-Preserving "Twin" Destinations',
    recommendedReroute: 'Recommended Reroute',
    vibeMatch: 'Vibe Match',
    fewerTourists: 'Fewer Tourists',
    rerouteCta: 'Reroute Trip & Explore',
    hourlyCurveTitle: '12-Hour Hourly Predictive Inflow Curve',
    optimalWindow: 'Optimal Visiting Window',
    greenEcoPass: 'Maharashtra Green Corridor Eco-Pass',
    authorityTitle: 'Authority GIS Command & Emergency Dispatch Center',
    gisMapTitle: 'Corridor GIS Carrying Capacity Map',
    thresholdTableTitle: 'Corridor Destination Threshold Monitoring Table',
    communityImpactTitle: 'Local Community Impact & Eco-Health Gauges',
    digitalDispatcherTitle: 'Digital Advisory & Emergency Dispatcher',
    broadcastBtn: 'Broadcast Advisory',
    providerTitle: 'Service Provider & Local Hospitality Economy Console',
    occupancySlider: 'Adjust Reported Hotel & Resort Occupancy %',
    inflowPredictorTitle: '3-Day Footfall Velocity & Inflow Predictor',
    publishDeal: 'Publish Incentive Deal',
    demandDiffusionTitle: 'Corridor Origin-Destination Tourist Diffusion & Movement Analysis',
    timeSlotTitle: 'Smart Hourly Time-Slot Recommendation & Entry Flow',
    navExplore: 'Explore',
    navDiscover: 'Discover',
    navTripPlanner: 'Trip Planner',
    navMyTrips: 'My Green Passes',
    tripSustainabilityScore: 'Trip Sustainability Score',
    carbonFootprint: 'Carbon Footprint',
    carbonSaved: 'Carbon Saved vs Solo Car',
    greenTrips: 'Green Trip Mobility',
    transportation: 'Transportation (30%)',
    accommodation: 'Accommodation (20%)',
    activities: 'Activities (15%)',
    wasteManagement: 'Waste Management (15%)',
    localEconomy: 'Local Economy (10%)',
    environmentalImpact: 'Resource Impact (10%)',
    aiEcoGuide: 'AI Eco-Guide & Dossier',
    biodiversity: 'Biodiversity & Ecology',
    heritageCulture: 'Heritage & Culture',
    zeroWaste: 'Zero-Waste Rules',
    localLivelihoods: 'Local Livelihoods',
    lowImpactHours: 'Low-Impact Visiting Hours',
    askAiGuide: 'Ask AI Eco-Guide about this destination',

    ldMinistryTicker: 'SIH-26204 • Ministry of Tourism & Government of Maharashtra',
    ldGhatsCorridorsLabel: 'Western Ghats Bio-Corridors:',
    ldMonitoredCount: '21 Monitored',
    ldLiveTelemetryLabel: 'Live Telemetry:',
    ldActiveStatus: 'Active',
    ldHeroTitleLine1: 'Transforming Tourism into a',
    ldHeroTitleLine2: 'Sustainable, Low-Impact Journey',
    ldHeroSubtitlePart1: 'Instead of asking "Where should I go?", EcoRoute Bharat answers:',
    ldHeroSubtitlePart2: '"How can I visit while cutting emissions, supporting rural homestays, eliminating plastic, and skipping highway jams?"',
    ldStatCo2: 'Avoided CO2e',
    ldStatDiverted: 'Travelers Diverted',
    ldStatCapacity: 'Corridor Capacity',
    ldStatBottlenecks: 'Ghat Bottlenecks',
    ldSearchPlaceholder: 'Search by spot name, district, or eco-category (e.g., Matheran, Kaas, Pune)...',
    ldQuickThemes: 'Quick themes:',
    ldThemeMistyGhats: 'Misty Ghats',
    ldThemeCoastalForts: 'Coastal & Forts',
    ldThemeHeritageTreks: 'Heritage Treks',
    ldThemeSacredGroves: 'Sacred Groves',
    ldBtnLaunchPlanner: 'Launch Green Trip Planner',
    ldBtnStakeholderDemo: '1-Click Stakeholder Auth Demo',
    ldBtnSampleCertificate: 'View Sample MTDC Green Certificate',
    ldPillarsEyebrow: 'Holistic Impact Framework',
    ldPillarsTitle: 'The 3 Pillars of Sustainable Tourism',
    ldPillarsSubtitle: 'Balancing environmental protection, cultural heritage respect, and direct village economic empowerment.',
    ldWeight40: 'Weight: 40%',
    ldWeight30: 'Weight: 30%',
    ldPillar1Title: '🌱 Environmental Stewardship',
    ldPillar1Desc: 'Aggressive carbon footprint reduction, zero single-use plastic, dynamic carrying capacity (DCC), and ecological buffer protection.',
    ldPillar1B1: 'Round-trip & local transit CO2e calculation',
    ldPillar1B2: 'Dynamic Carrying Capacity (DCC) throttling',
    ldPillar1B3: 'Zero-waste trail geotagging & clean-up squads',
    ldPillar2Title: '👥 Social & Cultural Heritage',
    ldPillar2Desc: 'Preservation of sacred devrais (sacred groves), respectful pilgrim etiquette, native storyteller guides, and barrier-free trails.',
    ldPillar2B1: 'Sacred grove preservation & silence corridors',
    ldPillar2B2: 'Native storyteller & guide union bookings',
    ldPillar2B3: 'Multilingual Marathi/Hindi/English audio tours',
    ldPillar3Title: '💰 Local Economic Retention',
    ldPillar3Desc: 'Direct tourist spending retained within rural villages, farm-to-table strawberry cooperatives, and Warli artisan guilds.',
    ldPillar3B1: '90%+ revenue retained in village homestays',
    ldPillar3B2: 'Direct farmer cooperative & FPO integration',
    ldPillar3B3: 'Off-peak traveler diversion into rural districts',
    ldLoopEyebrow: 'SIH-26204 Closed Ecosystem Loop',
    ldLoopTitle: 'The 8-Stage Continuous Improvement Feedback Loop',
    ldLoopSubtitle: 'From the moment a traveler explores a destination to post-trip data analysis by district collectors, every stage feeds into corridor preservation.',
    ldStage1Title: 'Discover', ldStage1Desc: 'Live DCC telemetry & AI twin suggestions divert crowds before departure.',
    ldStage2Title: 'Plan', ldStage2Desc: 'Multi-modal transit generator cuts emissions using trains, EVs & bypass hubs.',
    ldStage3Title: 'Measure', ldStage3Desc: 'Real-time 3D sustainability score (Env, Soc, Econ) calculated per itinerary.',
    ldStage4Title: 'Travel Sustainably', ldStage4Desc: 'Use electric shuttles at Valvan & Dasturi, hire native village guides.',
    ldStage5Title: 'Reward', ldStage5Desc: 'Earn Eco-Karma points, redeem MTDC credits, and earn verified certificates.',
    ldStage6Title: 'Report', ldStage6Desc: 'Citizens report trail litter & overcrowding incidents via geo-tagged photos.',
    ldStage7Title: 'Analyze', ldStage7Desc: 'District GIS engine correlates live sensor feeds and tourist waste reports.',
    ldStage8Title: 'Improve', ldStage8Desc: 'Authorities execute emergency capacity overrides and dynamic pricing.',
    ldCatalogEyebrow: 'Demand-Diffusion Engine • Actively Boosted Spots',
    ldCatalogTitle: 'Under-Visited Destinations Boosted by Our Engine',
    ldCatAllSpots: 'All Boosted Spots',
    ldStatusComfortable: 'Comfortable',
    ldStatusModerate: 'Moderate',
    ldStatusOvercrowded: 'Overcrowded',
    ldCapacitySuffix: 'capacity',
    ldViewFullCatalogBtn: 'View Full 21 Destination Catalog in Discover Feed',
    ldRewardsEyebrow: 'Pillar 2 & 3 • Citizen Rewards',
    ldRewardsTitle: 'Earn Green Karma Points & Redeem MTDC Vouchers',
    ldRewardsBtnLedger: 'View My Rewards Ledger',
    ldReward1Title: 'Report Waste Hotspots', ldReward1Desc: 'Geo-tag plastic litter along mountain passes. Authority clean-up vans are dispatched automatically.',
    ldReward2Title: 'Electric & Rail Transit', ldReward2Desc: 'Take electric train to Neral or local shared e-shuttles into Matheran to prevent vehicular exhaust.',
    ldReward3Title: 'Stay at Village Homestays', ldReward3Desc: 'Book MTDC-accredited rural homestays to ensure 85% of your travel spend stays with local farming families.',

    dpEyebrow: 'Curated Just For You',
    dpTitle: 'Personalized & Hidden Gem Escapes',
    dpSubtitle: 'Discover breathtaking, peaceful getaways matched to your travel vibe. Skip the highway gridlock and enjoy queue-free holidays across Maharashtra.',
    dpPersonalizingFrom: 'Personalizing From',
    dpStyleQuestion: 'What kind of holiday are you looking for? (Tap to select):',
    dpPriorityHigh: 'Priority (High)',
    dpStandard: 'Standard',
    dpCategoryLabel: 'Category:',
    dpAllCategories: 'All Categories',
    dpDistanceLabel: 'Distance:',
    dpDistanceAny: 'Any',
    dpDistanceDayTrip: 'Day-Trip (<110km)',
    dpDistanceWeekend: 'Weekend (>110km)',
    dpUnderVisitedOnly: '🌿 Under-Visited Only',
    dpFoundPrefix: 'Found',
    dpFoundSuffix: 'destinations matching your travel vibe',
    dpRankedBadge: '✨ Ranked by calmest crowds & lowest impact',
    dpGridView: 'Grid View',
    dpMapView: 'Corridor GIS Map',
    dpNoResultsTitle: 'No matching escapes found',
    dpNoResultsDesc: "We couldn't find any destinations matching your exact filter combination. Try adjusting your category or distance preferences.",
    dpHiddenGemBadge: '🌿 Hidden Gem • Peaceful',
    dpMatchSuffix: 'Match',
    dpStatusOptimal: 'Optimal Headroom',
    dpStatusModerate: 'Moderate Crowd',
    dpStatusCritical: 'Heavily Crowded',
    dpWaitSuffix: 'm wait',
    dpKmFromHub: 'km from hub',
    dpQueueFree: 'Queue-Free Entry',
    dpModerateInflow: 'Moderate Inflow',
    dpPeakWaiting: 'Peak Waiting Times',
    dpViewSpotPage: 'View Spot Page',
    dpStyleScenic: 'Scenic Vistas',
    dpStyleBudget: 'Budget-Friendly',
    dpStyleAdventure: 'Adventure & Treks',
    dpStyleFamily: 'Family Comfort',

    srEyebrow: 'Search Results',
    srAllResultsTitle: 'All Searchable Destinations & Regions',
    srResultsForPrefix: 'Results for',
    srFoundPrefix: 'Found',
    srFoundSuffix: 'matching destinations, districts, and states across Maharashtra',
    srSwitchToDiscover: 'Switch to Personalized Discover Feed →',
    srSearchPlaceholder: 'Search another destination or district…',
    srNoMatchTitlePrefix: 'No destinations matched',
    srNoMatchDesc: 'Try searching for hill stations like "Matheran", coastal hubs like "Alibaug", or regional districts like "Raigad" and "Pune".',
    srBrowseAllBtn: 'Browse All Maharashtra Spots',
    srGoToDiscoverBtn: 'Go to Discover Feed',
    srDestinationsHeading: 'Destinations',
    srTier1Label: 'Tier 1 Direct Spots',
    srDistrictsHeading: 'Districts',
    srTier2Label: 'Tier 2 Exhaustive Listings',
    srStatesHeading: 'States',
    srTier3Label: 'Tier 3 Full State View',
    srViewSpot: 'View Spot',
    srExplore: 'Explore',
    srViewAllSpots: 'View All Spots',
    srStateCoverageLabel: 'State Corridor Coverage',
    srStatusLowCrowds: 'Low Crowds • Comfortable',
    srStatusModerateTraffic: 'Moderate Traffic',
    srStatusCriticalOvercrowding: 'Critical Overcrowding',

    tpHeaderEyebrow: 'Intelligent Multi-Day Travel Wizard (§4.4)',
    tpTitle: 'Plan an Eco-Balanced Holiday',
    tpSubtitle: 'Create flexible 1-day to 7-day holidays. Focus deeply on 1 destination or explore a multi-stop scenic corridor without peak highway congestion.',
    tpModeAiTab: 'AI Sustainable Itinerary & Carbon Reducer (Gemini 3.6 Flash)',
    tpModeCustomTab: 'Custom Multi-Step Form',
    tpLiveAiBadge: 'Live AI',
    tpStep1Title: 'Destination Strategy & Selection',
    tpDestModeSingle: '1 Destination (In-Depth)',
    tpDestModeMulti: 'Multi-Stop Corridor',
    tpYourDestinationLabel: 'Your Holiday Destination:',
    tpBaseDestinationLabel: 'Base Destination (Primary):',
    tpConnectingGemLabel: 'Connecting Corridor Gem (Secondary):',
    tpSingleModeTitle: 'Single Destination In-Depth Mode',
    tpStep2Title: 'Trip Duration & Travel Dates',
    tpSelectLengthLabel: 'Select Trip Length:',
    tpStartDateLabel: 'Start Date:',
    tpEndDateLabel: 'End Date',
    tpWeekendNote: 'Open-Meteo forward model sync active: Saturday arrivals expect +35% weekend surge; Friday departures or weekday trips enjoy clear corridors.',
    tpStep3Title: 'Daily Accommodation & Dining Band',
    tpStep4Title: 'Traveling Group Type',
    tpBudgetBudget: 'Budget Traveler', tpBudgetBudgetDesc: 'Govt forest lodges & home kitchens',
    tpBudgetBalanced: 'Balanced Explorer', tpBudgetBalancedDesc: 'MTDC resorts & lakeside villas',
    tpBudgetPremium: 'Premium Leisure', tpBudgetPremiumDesc: 'Luxury heritage estates & spas',
    tpGroupSolo: 'Solo Traveler',
    tpGroupCouple: 'Couple / Duo',
    tpGroupFamily: 'Family with Kids',
    tpGroupFriends: 'Group of Friends',
    tpGenerateBtnPrefix: 'Generate',
    tpGenerateBtnSuffix: '-Day Itinerary & Green Pass →',
    tpModalEyebrow: 'Save Trip Plan & Green Pass',
    tpModalTitle: 'Quick 2-Field Traveler Profile',
    tpModalSubtitle: 'Never a lengthy survey wall. Just 2 fields to personalize your return route and issue your official discount voucher.',
    tpModalField1Label: '1. Where are you traveling from? (Home City / State)',
    tpModalField2Label: '2. Your Primary Travel Style:',
    tpSkipBtn: 'Skip & View Plan',
    tpSaveClaimBtn: 'Save & Claim Pass',

    spNotFoundTitle: 'Destination Not Found',
    spNotFoundDesc: 'The requested destination is not part of the active Western Ghats & Maharashtra Corridor registry.',
    spExploreDiscoverBtn: 'Explore Discover Feed',
    spViewAllMhBtn: 'View All Maharashtra Destinations',
    spStatusOptimalHeadline: 'Low Crowds • Prime Time to Visit', spStatusOptimalSub: 'Carrying capacity is completely unhurried. Ample parking & zero highway bottleneck.',
    spStatusModerateHeadline: 'Moderate Influx • Steady Movement', spStatusModerateSub: 'Approaching peak weekend limits. Visit before 10 AM or after 4 PM for ideal comfort.',
    spStatusCriticalHeadline: 'Heavily Overcrowded • Severe Chokepoints', spStatusCriticalSub: 'Checkpoints saturated. Long parking queues. We strongly suggest taking a twin destination below.',
    spUnderVisitedBadge: '🌿 Under-visited Eco-Gem',
    spTravelTime: 'Travel Time:',
    spDistance: 'Distance:',
    spStatutoryCapacity: 'Statutory Capacity:',
    spLiveLocationGis: 'Live Location GIS',
    spPlanTripBtn: 'Plan a Trip',
    spShareStatusBtn: 'Share Status',
    spAuthorityGisLink: 'Open full regional GIS corridor command map',
    spDiscoverFeedLink: 'Explore more quiet spots on Discover Feed',
    spCarryingCapacityEyebrow: 'Carrying Capacity & Footfall Model',
    spCrowdPressureTitle: 'Dynamic Crowd Pressure Status',
    spBookingBannerTitle: 'Already have a Hotel or Activity Booking?',
    spBookingBannerBadge: '✓ 100% Guaranteed Access',
    spBookingBannerDesc: 'You will not be redirected or turned away at checkpoints. Highway redirection advisories are voluntary recommendations strictly aimed at spontaneous day-trippers. Keep your stay, and check our 12-Hour Forecast below to bypass local attraction lines!',
    spInflowVsCapacity: 'Estimated Inflow vs Capacity',
    spOperatingAtPrefix: 'Operating at',
    spOperatingAtSuffix: 'carrying capacity limit',
    spEstWaitQueue: 'Estimated Wait & Queue',
    spFreeFlowing: 'Free-flowing access road with zero checkpoint choke.',
    spWeatherHazard: 'Weather & Ghat Hazard',
    spCaution: 'Caution (Fog / Rain)',
    spSafe: 'Safe / Favorable',
    sp12hForecastTitle: '12-Hour Predictive Forecast Strip & Demand Graph',
    sp12hForecastDesc: 'Hourly arrival volume calibrated with Open-Meteo GFS weather sensors & road transit delays',
    spWeeklyTitle: 'Historical Crowd Analytics (Up to Current Date)',
    spWeeklyDesc: 'Aggregated turnstile & telemetry logs strictly up to the current date.',
    spProvenanceCollapseHint: 'collapse',
    spProvenanceExpandHint: 'audit',
    spProvenanceToggleLabel: 'Transparent Data Tier Provenance & Metric Audit (Click to',
    spProvenanceIntro: 'Every metric in EcoRoute Bharat is rigorously tagged with a genuine data tier. We do not claim an uninstalled live sensor network; estimates derive from real weather APIs, gazetted statutory arrivals, and a transparent formula.',
    spTwinsEyebrow: 'Peaceful Sister Spots (Queue-Free Alternatives)',
    spTwinsTitlePrefix: 'Escape the crowd at',
    spTwinsZeroTraffic: '✓ Zero Traffic & Easy Parking',
    spTwinsIntroPrefix: 'We match your preferred holiday vibe (',
    spTwinsIntroSuffix: ') with serene, uncrowded nearby sister destinations where you save hours in traffic, find ample parking, and enjoy tranquil nature.',
    spTwinsTipLabel: 'Tailored for Spontaneous & Pre-Booking Travelers:',
    spTwinsTipBody: 'Recommended for motorists driving in without lodging or visitors planning upcoming trips. If you already have hotel reservations, keep your stay — your entry is guaranteed!',
    spTwinsHighwayDelay: '~2.5 Hours Highway Delay Avoided',
    spTwinsExploreBtnPrefix: 'Explore',
    spPracticalInfoEyebrow: 'Local Practical Information',
    spPracticalInfoTitle: 'Major Attractions & Civic Amenities',
    spHighlightsWithinPrefix: 'Highlights within',
    spOsmVerified: 'OSM Overpass Verified Civic Points',
    spGettingThere: 'Getting There & Road Conditions',
    spPrimaryRoute: 'Primary Route:',
    spLiveEta: 'Live ETA:',
    spChokeAdvisoryLabel: 'Choke Advisory:',
    spHospitalityEyebrow: 'Hospitality & Stays',
    spVerifiedStaysTitle: 'Verified Stays & Homestays',
    spMtdcPrioritized: 'MTDC accredited eco-partners prioritized for sustainability',
    spMtdcPartnerBadge: 'MTDC Partner',
    spPerNight: '/ night',
    spBookItineraryBtn: 'Book Itinerary with Stays in Trip Planner →',
    spCheckInsEyebrow: 'Crowdsourced Ground Telemetry',
    spCheckInsTitlePrefix: 'Recent Visitor Check-Ins & Reports',
    spCheckInBtn: 'Check In Here (Report Crowd)',
    spNoCheckIns: 'No crowdsourced check-ins yet today. Be the first traveler to check in and verify ground conditions!',
    spCongestionLabel: 'Congestion:',
    spLightPleasant: 'Light / Pleasant',
    spModerateLevel: 'Moderate',
    spHeavyGridlock: 'Heavy Gridlock',
    spGeofenceVerified: 'Geofence Verified',
    spCheckInModalTitle: 'Community Check-In',
    spCheckInModalDescPrefix: 'Reporting from',
    spCheckInModalDescSuffix: '? Help fellow travelers by self-reporting current crowd congestion on ground.',
    spCongestionScaleLabel: 'Observed Congestion (1 = Empty, 5 = Severe Jam):',
    spOptionalNoteLabel: 'Optional note (e.g. parking status, road condition):',
    spNotePlaceholder: 'Clear trails, plenty of parking spaces near the lake…',
    spGeofenceNote: 'Geofence verification automatically applied for valid telemetry weighting.',
    spCancelBtn: 'Cancel',
    spSubmitCheckInBtn: 'Submit Check-In',
    spShareModalTitle: 'Share Live Destination Status',
    spShareCardDescPrefix: 'Currently running at',
    spShareCardDescMid: 'carrying capacity with an estimated wait of',
    spShareFooter: 'EcoRoute Bharat • Ministry of Tourism',
    spWhatsAppShareBtn: 'Share via WhatsApp',
    spCopyShareBtn: 'Copy Share Text & Link',
    spCopiedBtn: '✓ Link & Summary Copied!',

    ftpTitle: 'Future Trip & Decongested Itinerary Planner',
    ftpBadgeAiScheduler: 'AI Smart Scheduler',
    ftpBadgeBackendApi: '✅ Backend API',
    ftpBadgeOffline: '📵 Offline Mode',
    ftpSubtitle: 'Plan upcoming holidays with AI-predicted congestion curves and balanced multi-day itineraries to bypass 90% of corridor bottlenecks',
    ftpSaveBtn: '💾 Save to My Passes (+150 Karma)',
    ftpSavingBtn: 'Saving...',
    ftpReportBtn: '📄 AI Audit Report',
    ftpPrintBtn: 'Print / Export Plan',
    ftpViewInPasses: 'View in My Passes',
    ftpDestLabel: 'Destination Hub / Focus:',
    ftpDateLabel: 'Planned Travel Date:',
    ftpDurationLabel: 'Trip Duration:',
    ftpStyleLabel: 'Travel Preference:',
    ftpStyleScenic: 'Relaxed & Scenic', ftpStyleAdventure: 'Adventure & Trekking', ftpStyleFamily: 'Family Friendly', ftpStyleBudget: 'Budget & Sustainable',
    ftpMobilityLabel: 'Mobility Mode (30% Weight):',
    ftpMobilityGreen: '🌿 Green Trip: Bus/Train + Local Driver', ftpMobilityUltraGreen: '⚡ Ultra-Green: Electric Rail + E-Shuttle', ftpMobilityPersonalCar: '🚗 Personal Petrol / Diesel Car',
    ftpStayLabel: 'Stay Type (20% Weight):',
    ftpStayHomestay: '🏠 Accredited MTDC Rural Homestay', ftpStayHotel: '🏨 Commercial Resort / Chain Hotel',
    ftpConventionalHotspots: 'Conventional Hotspots (e.g. Lonavala)',
    ftpPredictedCrowdLoadPrefix: 'Predicted Crowd Load:',
    ftpHeavyTraffic: '🔴 Heavy Traffic Jams',
    ftpModerateCrowds: '🟡 Moderate Crowds',
    ftpDecongestedTwin: 'AI-Decongested Twin Route (e.g. Matheran & Bhandardara)',
    ftpComfortableSuffix: '(Comfortable)',
    ftpZeroDelays: '🟢 Zero Checkpoint Delays',
    ftpSustainabilityTitle: 'Trip Sustainability & Carbon Offset',
    ftpPillar1Badge: 'Pillar 1 Environmental Core',
    ftpSustainabilityDesc: 'Multi-factor sustainability index based on mobility choice, eco-homestays, waste discipline, and rural economic injection.',
    ftpEnvironmental: '🌱 Environmental',
    ftpSocialCultural: '👥 Social & Cultural',
    ftpLocalEconomic: '💰 Local Economic',
    ftpCarbonReductionTitle: 'Carbon Footprint Reduction By Following This Plan',
    ftpRoundTripDistance: 'Round-Trip Distance',
    ftpSoloCarBaseline: 'Conventional Solo Car Baseline:',
    ftpEcoRoutePlanned: '🌿 EcoRoute Planned:',
    ftpCarbonSavedSuffix: 'Carbon Saved',
    ftpTreesAbsorption: 'Trees Absorption',
    ftpTreesDesc: 'Native trees absorbing CO₂ for 1 year',
    ftpFuelSaved: 'Fossil Fuel Saved',
    ftpFuelDesc: 'Petrol / Diesel fuel conserved',
    ftpIdlingAvoided: 'Idling Avoided',
    ftpIdlingDesc: 'Ghat bottleneck idling prevented',
    ftpLocalInjection: 'Local Injection',
    ftpLocalInjectionDesc: 'To rural homestays & driver unions',
    ftpAiInsightsTitle: 'AI Eco-Curator Insights & Carbon Reduction Strategy',
    ftpAiCarbonWhyTitle: 'Why This Plan Reduces Carbon',
    ftpAiCommunityTitle: 'Community & Livelihood Benefit',
    ftpGreenModeTitle: '🌱 Green Trip Mode: Park & Ride Local Mobility Protocol',
    ftpGreenModeDesc: 'Instead of driving personal vehicles up winding elevation hairpins, park at designated expressway perimeter hubs (Valvan / Dasturi / Wai). Switch to verified local drivers, e-shuttles, or bicycles. This cuts ghat gridlocks by 40%, protects pristine hill air, and directly feeds income to local driver unions.',
    ftpOptimizedItineraryTitle: 'Optimized Smart Itinerary',
    ftpAvoidsDelayBadge: '🌿 Avoids ~2.5 Hours Traffic Delay • Easy Parking Guaranteed',
    ftpReportModalTitle: 'Official Sustainability & Carbon Audit Report',
    ftpReportModalSubtitle: 'Certified by EcoRoute Bharat Multi-Stakeholder Intelligence Engine',
    ftpGeneratingReport: 'Generating official audit report with Google Gemini 2.0 Flash...',
    ftpReportValidNote: 'Valid for Green Pass accreditation and MTDC carbon rebates',
    ftpPrintSaveBtn: 'Print / Save PDF',
    ftpCloseBtn: 'Close',
    ftpSocialSubLabel: 'Sacred devrais & native guides',
    ftpDecongestedSchedule: 'Decongested Schedule',

    ppEyebrow: 'Plan Your Journey',
    ppTitle: 'Trip Planner',
    ppSubtitle: "Pick your destinations, travel dates, and vibe — we'll generate a round-trip timeline plus a lower-crowd, eco-friendly alternative.",
    ppPreferencesLabel: 'Preferences',
    ppSpotsLabel: 'Collection of Spots',
    ppSpotsPlaceholder: 'Select destinations to visit...',
    ppSpotsSearchPlaceholder: 'Search destinations...',
    ppScheduleLabel: 'Schedule',
    ppStartDateLabel: 'Start Date',
    ppEndDateLabel: 'End Date',
    ppGenerateBtn: 'Generate Trip Plan',
    ppLocationRequesting: 'Detecting your location…',
    ppLocationGranted: 'Using your current location',
    ppLocationFallback: 'Using approximate hub distance (location unavailable)',
    ppSelectSpotsHint: 'Select at least one destination to continue',
    ppNoSpotsSelected: 'No destinations selected yet',
    ppAllDestinations: 'All Destinations',
    ppSelectedSuffix: 'selected',
    ppOutputEyebrow: 'Your Generated Plan',
    ppTripTimelineTitle: 'Trip Timeline',
    ppTripTimelineDesc: 'Your selected spots, ordered as a round trip from your location to minimize backtracking.',
    ppEcoTimelineTitle: 'Eco-Friendly Timeline',
    ppEcoTimelineDesc: 'Each spot swapped for its lower-crowd twin destination, re-ordered as a fresh round trip.',
    ppReplacesLabel: 'replaces',
    ppNoTwinFound: 'No lower-crowd alternative available — kept original spot',
    ppDayLabel: 'Day',
    ppFreeDayLabel: 'Free day / travel buffer',
    ppSummaryTitle: 'Summary of CO2 & Details',
    ppSummaryDistance: 'Total Distance',
    ppSummaryCo2: 'Estimated CO2e',
    ppSummaryCo2Saved: 'CO2 Saved with Eco Route',
    ppSummaryOriginalRoute: 'Standard Route',
    ppSummaryEcoRoute: 'Eco-Friendly Route',
    ppSummaryCrowdReduction: 'Avg. Crowd Reduction',
    ppSummaryDates: 'Travel Dates',
    ppSummaryPreferences: 'Preferences',
    ppSharePrintTitle: 'Sharable Print',
    ppPrintBtn: 'Print',
    ppCopyBtn: 'Copy Summary',
    ppCopiedBtn: 'Copied!',
    ppWhatsAppBtn: 'Share via WhatsApp',
    ppEditPlanBtn: 'Edit Plan',
    ppKmSuffix: 'km'
  },
  hi: {
    appName: 'ईकोरूट भारत (EcoRoute Bharat)',
    appSubtitle: 'गतिशील वहन क्षमता और जुड़वां पर्यटन स्थल पुनर्मार्गण इंजन',
    version: 'SIH26204 एआई भीड़-निवारण v2.4',
    westernGhatsLive: 'पश्चिमी घाट कॉरिडोर लाइव',
    activeVisitors: 'सक्रिय पर्यटक',
    overloadedZones: 'अत्यधिक भीड़ वाले क्षेत्र',
    diversionsActive: 'सक्रिय डायवर्जन',
    co2Avoided: 'CO₂ बचत',
    reset: 'रीसेट',
    touristPortal: 'पर्यटक अनुभव पोर्टल',
    authorityPortal: 'प्राधिकरण कमांड सेंटर',
    providerPortal: 'सेवा प्रदाता एवं अर्थव्यवस्था',
    liveSimulation: 'लाइव सिमुलेशन मोड',
    selectTargetDestination: 'गंतव्य स्थल चुनें',
    corridorFilter: 'कॉरिडोर श्रेणी फ़िल्टर',
    vibePreferences: 'पर्यटक प्राथमिकताएं',
    scenic: 'प्राकृतिक दृश्य',
    budget: 'किफायती / बजट',
    adventure: 'ट्रेकिंग और रोमांच',
    family: 'पारिवारिक अनुकूल',
    optimalCapacity: 'अनुकूल वहन क्षमता (हरा)',
    moderateCapacity: 'मध्यम भीड़ घनत्व (पीला)',
    criticalCapacity: 'गंभीर भीड़ चेतावनी (लाल)',
    dccScore: 'डीसीसी सूचकांक स्कोर',
    estWait: 'अनुमानित प्रवेश एवं प्रतीक्षा समय',
    queuesActive: 'जाम एवं कतारें सक्रिय',
    zeroDelay: 'बिना किसी देरी के प्रवेश',
    inflowVsCap: 'पर्यटक प्रवाह / कुल क्षमता',
    parkingLoad: 'पार्किंग लोड',
    weatherRisk: 'मौसम / भूस्खलन जोखिम',
    activeAdvisoryBadge: 'आधिकारिक सरकारी सलाह सक्रिय',
    twinTitle: 'समान विशेषताओं वाले "जुड़वां" वैकल्पिक स्थल',
    recommendedReroute: 'अनुशंसित पुनर्मार्ग',
    vibeMatch: 'समानता मैच',
    fewerTourists: 'कम पर्यटक भीड़',
    rerouteCta: 'यात्रा को पुनर्मार्गित करें और घूमें',
    hourlyCurveTitle: '12 घंटे का प्रति घंटा पूर्वानुमान चार्ट',
    optimalWindow: 'भ्रमण हेतु सर्वोत्तम समय स्लॉट',
    greenEcoPass: 'महाराष्ट्र ग्रीन कॉरिडोर इको-पास',
    authorityTitle: 'प्राधिकरण जीआईएस कमांड और आपातकालीन प्रेषण केंद्र',
    gisMapTitle: 'कॉरिडोर जीआईएस वहन क्षमता मानचित्र',
    thresholdTableTitle: 'कॉरिडोर गंतव्य सीमा निगरानी तालिका',
    communityImpactTitle: 'स्थानीय समुदाय प्रभाव एवं पर्यावरण स्वास्थ्य गेज',
    digitalDispatcherTitle: 'डिजिटल एडवाइजरी और आपातकालीन प्रेषक',
    broadcastBtn: 'एडवाइजरी प्रसारित करें',
    providerTitle: 'हॉस्पिटैलिटी सेवा प्रदाता कंसोल',
    occupancySlider: 'होटल अधिभोग (Occupancy) प्रतिशत समायोजित करें',
    inflowPredictorTitle: '3-दिवसीय पर्यटक प्रवाह पूर्वानुमान',
    publishDeal: 'छूट प्रोत्साहन प्रकाशित करें',
    demandDiffusionTitle: 'कॉरिडोर पर्यटक प्रवाह और मांग प्रसार विश्लेषण',
    timeSlotTitle: 'स्मार्ट समय-स्लॉट सिफारिश एवं प्रवेश प्रवाह',
    navExplore: 'अन्वेषण करें',
    navDiscover: 'खोजें',
    navTripPlanner: 'यात्रा योजनाकार',
    navMyTrips: 'मेरे ग्रीन पास',
    tripSustainabilityScore: 'यात्रा संधारणीयता (सस्टेनेबिलिटी) स्कोर',
    carbonFootprint: 'कार्बन पदचिह्न (फुटप्रिंट)',
    carbonSaved: 'बचाया गया कार्बन उत्सर्जन',
    greenTrips: 'हरित यात्रा गतिशीलता',
    transportation: 'परिवहन (30%)',
    accommodation: 'ठहरने की व्यवस्था (20%)',
    activities: 'गतिविधियां (15%)',
    wasteManagement: 'कचरा प्रबंधन (15%)',
    localEconomy: 'स्थानीय अर्थव्यवस्था (10%)',
    environmentalImpact: 'पर्यावरणीय प्रभाव (10%)',
    aiEcoGuide: 'एआई इको-गाइड और विस्तृत जानकारी',
    biodiversity: 'जैव विविधता एवं पारिस्थितिकी',
    heritageCulture: 'विरासत एवं संस्कृति',
    zeroWaste: 'शून्य-कचरा नियम व दिशानिर्देश',
    localLivelihoods: 'स्थानीय आजीविका एवं गाइड',
    lowImpactHours: 'सर्वोत्तम निम्न-प्रभाव समय',
    askAiGuide: 'इस स्थल के बारे में एआई इको-गाइड से पूछें',

    ldMinistryTicker: 'SIH-26204 • पर्यटन मंत्रालय एवं महाराष्ट्र सरकार',
    ldGhatsCorridorsLabel: 'पश्चिमी घाट जैव-कॉरिडोर:',
    ldMonitoredCount: '21 निगरानी में',
    ldLiveTelemetryLabel: 'लाइव टेलीमेट्री:',
    ldActiveStatus: 'सक्रिय',
    ldHeroTitleLine1: 'पर्यटन को बना रहे हैं',
    ldHeroTitleLine2: 'एक टिकाऊ, कम-प्रभाव वाली यात्रा',
    ldHeroSubtitlePart1: '"मुझे कहाँ जाना चाहिए?" पूछने के बजाय, ईकोरूट भारत जवाब देता है:',
    ldHeroSubtitlePart2: '"मैं उत्सर्जन घटाते हुए, ग्रामीण होमस्टे को सहयोग देते हुए, प्लास्टिक हटाते हुए और हाईवे जाम से बचते हुए कैसे यात्रा कर सकता हूँ?"',
    ldStatCo2: 'बचाया गया CO2e',
    ldStatDiverted: 'पुनर्निर्देशित यात्री',
    ldStatCapacity: 'कॉरिडोर क्षमता',
    ldStatBottlenecks: 'घाट अवरोध स्थल',
    ldSearchPlaceholder: 'स्थल का नाम, जिला या इको-श्रेणी खोजें (उदा. माथेरान, कास, पुणे)...',
    ldQuickThemes: 'त्वरित थीम:',
    ldThemeMistyGhats: 'धुंधले घाट',
    ldThemeCoastalForts: 'तटीय क्षेत्र व किले',
    ldThemeHeritageTreks: 'विरासत ट्रेक',
    ldThemeSacredGroves: 'पवित्र देवराई',
    ldBtnLaunchPlanner: 'ग्रीन यात्रा योजनाकार शुरू करें',
    ldBtnStakeholderDemo: '1-क्लिक हितधारक डेमो लॉगिन',
    ldBtnSampleCertificate: 'नमूना MTDC ग्रीन प्रमाणपत्र देखें',
    ldPillarsEyebrow: 'समग्र प्रभाव ढांचा',
    ldPillarsTitle: 'सतत पर्यटन के 3 स्तंभ',
    ldPillarsSubtitle: 'पर्यावरण संरक्षण, सांस्कृतिक विरासत सम्मान, और प्रत्यक्ष ग्रामीण आर्थिक सशक्तिकरण के बीच संतुलन।',
    ldWeight40: 'भार: 40%',
    ldWeight30: 'भार: 30%',
    ldPillar1Title: '🌱 पर्यावरणीय संरक्षण',
    ldPillar1Desc: 'कार्बन उत्सर्जन में तीव्र कमी, शून्य एकल-उपयोग प्लास्टिक, गतिशील वहन क्षमता (DCC), और पारिस्थितिक बफर संरक्षण।',
    ldPillar1B1: 'राउंड-ट्रिप एवं स्थानीय परिवहन CO2e गणना',
    ldPillar1B2: 'गतिशील वहन क्षमता (DCC) नियंत्रण',
    ldPillar1B3: 'शून्य-कचरा ट्रेल जियोटैगिंग एवं सफाई दस्ते',
    ldPillar2Title: '👥 सामाजिक एवं सांस्कृतिक विरासत',
    ldPillar2Desc: 'पवित्र देवराई का संरक्षण, सम्मानजनक तीर्थयात्री शिष्टाचार, स्थानीय कथाकार गाइड, एवं बाधा-मुक्त पगडंडियाँ।',
    ldPillar2B1: 'पवित्र देवराई संरक्षण एवं मौन गलियारे',
    ldPillar2B2: 'स्थानीय कथाकार व गाइड संघ बुकिंग',
    ldPillar2B3: 'बहुभाषी मराठी/हिंदी/अंग्रेज़ी ऑडियो टूर',
    ldPillar3Title: '💰 स्थानीय आर्थिक प्रतिधारण',
    ldPillar3Desc: 'ग्रामीण गांवों में सीधा पर्यटक खर्च, फार्म-टू-टेबल स्ट्रॉबेरी सहकारी समितियाँ, एवं वारली कारीगर संघ।',
    ldPillar3B1: 'ग्रामीण होमस्टे में 90%+ राजस्व प्रतिधारण',
    ldPillar3B2: 'प्रत्यक्ष किसान सहकारी समिति एवं FPO एकीकरण',
    ldPillar3B3: 'ग्रामीण जिलों में ऑफ-पीक यात्री विविधीकरण',
    ldLoopEyebrow: 'SIH-26204 समापित पारिस्थितिकी लूप',
    ldLoopTitle: '8-चरण सतत सुधार फीडबैक लूप',
    ldLoopSubtitle: 'यात्री द्वारा किसी स्थल की खोज से लेकर जिला कलेक्टरों द्वारा यात्रा-पश्चात डेटा विश्लेषण तक, हर चरण कॉरिडोर संरक्षण में योगदान देता है।',
    ldStage1Title: 'खोजें', ldStage1Desc: 'लाइव DCC टेलीमेट्री एवं एआई ट्विन सुझाव प्रस्थान से पहले भीड़ को मोड़ते हैं।',
    ldStage2Title: 'योजना बनाएं', ldStage2Desc: 'मल्टी-मॉडल परिवहन जनरेटर ट्रेन, ईवी व बायपास हब का उपयोग कर उत्सर्जन घटाता है।',
    ldStage3Title: 'मापें', ldStage3Desc: 'प्रत्येक यात्रा योजना के लिए रीयल-टाइम 3D संधारणीयता स्कोर (पर्यावरण, सामाजिक, आर्थिक) की गणना।',
    ldStage4Title: 'सतत यात्रा करें', ldStage4Desc: 'वलवण एवं दस्तूरी में इलेक्ट्रिक शटल का उपयोग करें, स्थानीय गांव गाइड नियुक्त करें।',
    ldStage5Title: 'पुरस्कार पाएं', ldStage5Desc: 'इको-कर्मा अंक अर्जित करें, MTDC क्रेडिट भुनाएं, एवं सत्यापित प्रमाणपत्र प्राप्त करें।',
    ldStage6Title: 'रिपोर्ट करें', ldStage6Desc: 'नागरिक जियो-टैग की गई तस्वीरों के माध्यम से ट्रेल कचरा व भीड़भाड़ की घटनाओं की रिपोर्ट करते हैं।',
    ldStage7Title: 'विश्लेषण करें', ldStage7Desc: 'जिला जीआईएस इंजन लाइव सेंसर फीड एवं पर्यटक कचरा रिपोर्टों को सहसंबद्ध करता है।',
    ldStage8Title: 'सुधार करें', ldStage8Desc: 'प्राधिकरण आपातकालीन क्षमता ओवरराइड एवं गतिशील मूल्य निर्धारण लागू करते हैं।',
    ldCatalogEyebrow: 'डिमांड-डिफ्यूज़न इंजन • सक्रिय रूप से बढ़ावा दिए गए स्थल',
    ldCatalogTitle: 'हमारे इंजन द्वारा बढ़ावा दिए गए कम-आबाद गंतव्य',
    ldCatAllSpots: 'सभी बढ़ावा प्राप्त स्थल',
    ldStatusComfortable: 'आरामदायक',
    ldStatusModerate: 'मध्यम',
    ldStatusOvercrowded: 'अत्यधिक भीड़',
    ldCapacitySuffix: 'क्षमता',
    ldViewFullCatalogBtn: 'डिस्कवर फ़ीड में सभी 21 गंतव्य देखें',
    ldRewardsEyebrow: 'स्तंभ 2 व 3 • नागरिक पुरस्कार',
    ldRewardsTitle: 'ग्रीन कर्मा अंक अर्जित करें व MTDC वाउचर भुनाएं',
    ldRewardsBtnLedger: 'मेरा पुरस्कार लेजर देखें',
    ldReward1Title: 'कचरा हॉटस्पॉट रिपोर्ट करें', ldReward1Desc: 'पहाड़ी दर्रों पर प्लास्टिक कचरे को जियो-टैग करें। प्राधिकरण की सफाई वैन स्वतः भेजी जाती हैं।',
    ldReward2Title: 'इलेक्ट्रिक व रेल परिवहन', ldReward2Desc: 'नेरल तक इलेक्ट्रिक ट्रेन लें या माथेरान में स्थानीय साझा ई-शटल का उपयोग करें, ताकि वाहन प्रदूषण रुके।',
    ldReward3Title: 'ग्रामीण होमस्टे में ठहरें', ldReward3Desc: 'MTDC-मान्यता प्राप्त ग्रामीण होमस्टे बुक करें ताकि आपके यात्रा खर्च का 85% स्थानीय किसान परिवारों के पास रहे।',

    dpEyebrow: 'विशेष रूप से आपके लिए चयनित',
    dpTitle: 'व्यक्तिगत एवं छिपे हुए रत्न स्थल',
    dpSubtitle: 'अपनी यात्रा पसंद से मेल खाते मनोरम, शांत स्थलों की खोज करें। हाईवे जाम छोड़ें और महाराष्ट्र भर में बिना कतार वाली छुट्टियों का आनंद लें।',
    dpPersonalizingFrom: 'यह व्यक्तिगत सुझाव इस स्थान से',
    dpStyleQuestion: 'आप किस तरह की छुट्टी की तलाश में हैं? (चुनने हेतु टैप करें):',
    dpPriorityHigh: 'प्राथमिकता (उच्च)',
    dpStandard: 'सामान्य',
    dpCategoryLabel: 'श्रेणी:',
    dpAllCategories: 'सभी श्रेणियाँ',
    dpDistanceLabel: 'दूरी:',
    dpDistanceAny: 'कोई भी',
    dpDistanceDayTrip: 'डे-ट्रिप (<110 किमी)',
    dpDistanceWeekend: 'वीकेंड (>110 किमी)',
    dpUnderVisitedOnly: '🌿 केवल कम-आबाद स्थल',
    dpFoundPrefix: 'आपकी यात्रा पसंद से मेल खाते',
    dpFoundSuffix: 'गंतव्य मिले',
    dpRankedBadge: '✨ सबसे शांत भीड़ व न्यूनतम प्रभाव के अनुसार क्रमबद्ध',
    dpGridView: 'ग्रिड दृश्य',
    dpMapView: 'कॉरिडोर जीआईएस मानचित्र',
    dpNoResultsTitle: 'कोई मेल खाता स्थल नहीं मिला',
    dpNoResultsDesc: 'आपके सटीक फ़िल्टर संयोजन से मेल खाता कोई गंतव्य नहीं मिला। अपनी श्रेणी या दूरी वरीयताएं समायोजित करने का प्रयास करें।',
    dpHiddenGemBadge: '🌿 छिपा रत्न • शांत',
    dpMatchSuffix: 'मैच',
    dpStatusOptimal: 'उपयुक्त क्षमता',
    dpStatusModerate: 'मध्यम भीड़',
    dpStatusCritical: 'अत्यधिक भीड़',
    dpWaitSuffix: 'मिनट प्रतीक्षा',
    dpKmFromHub: 'किमी हब से',
    dpQueueFree: 'बिना कतार प्रवेश',
    dpModerateInflow: 'मध्यम प्रवाह',
    dpPeakWaiting: 'पीक प्रतीक्षा समय',
    dpViewSpotPage: 'स्थल पृष्ठ देखें',
    dpStyleScenic: 'प्राकृतिक दृश्य',
    dpStyleBudget: 'किफायती',
    dpStyleAdventure: 'रोमांच व ट्रेक',
    dpStyleFamily: 'पारिवारिक आराम',

    srEyebrow: 'खोज परिणाम',
    srAllResultsTitle: 'सभी खोजने योग्य गंतव्य एवं क्षेत्र',
    srResultsForPrefix: 'के लिए परिणाम',
    srFoundPrefix: 'महाराष्ट्र भर में मेल खाते',
    srFoundSuffix: 'गंतव्य, जिले एवं राज्य मिले',
    srSwitchToDiscover: 'व्यक्तिगत डिस्कवर फ़ीड पर जाएं →',
    srSearchPlaceholder: 'कोई अन्य गंतव्य या जिला खोजें…',
    srNoMatchTitlePrefix: 'कोई गंतव्य मेल नहीं खाया',
    srNoMatchDesc: '"माथेरान" जैसे हिल स्टेशन, "अलीबाग" जैसे तटीय केंद्र, या "रायगढ़" और "पुणे" जैसे क्षेत्रीय जिलों की खोज करने का प्रयास करें।',
    srBrowseAllBtn: 'सभी महाराष्ट्र स्थल ब्राउज़ करें',
    srGoToDiscoverBtn: 'डिस्कवर फ़ीड पर जाएं',
    srDestinationsHeading: 'गंतव्य',
    srTier1Label: 'टियर 1 प्रत्यक्ष स्थल',
    srDistrictsHeading: 'जिले',
    srTier2Label: 'टियर 2 संपूर्ण सूचियाँ',
    srStatesHeading: 'राज्य',
    srTier3Label: 'टियर 3 पूर्ण राज्य दृश्य',
    srViewSpot: 'स्थल देखें',
    srExplore: 'अन्वेषण करें',
    srViewAllSpots: 'सभी स्थल देखें',
    srStateCoverageLabel: 'राज्य कॉरिडोर कवरेज',
    srStatusLowCrowds: 'कम भीड़ • आरामदायक',
    srStatusModerateTraffic: 'मध्यम यातायात',
    srStatusCriticalOvercrowding: 'गंभीर भीड़भाड़',

    tpHeaderEyebrow: 'बुद्धिमान बहु-दिवसीय यात्रा विज़ार्ड (§4.4)',
    tpTitle: 'एक इको-संतुलित छुट्टी की योजना बनाएं',
    tpSubtitle: '1-दिन से 7-दिन तक की लचीली छुट्टियाँ बनाएं। किसी 1 गंतव्य पर गहराई से ध्यान दें या बिना पीक हाईवे भीड़भाड़ के बहु-स्टॉप सुरम्य कॉरिडोर का अन्वेषण करें।',
    tpModeAiTab: 'एआई संधारणीय यात्रा-सूची व कार्बन कटौती (Gemini 3.6 Flash)',
    tpModeCustomTab: 'कस्टम बहु-चरण फ़ॉर्म',
    tpLiveAiBadge: 'लाइव एआई',
    tpStep1Title: 'गंतव्य रणनीति एवं चयन',
    tpDestModeSingle: '1 गंतव्य (गहन)',
    tpDestModeMulti: 'बहु-स्टॉप कॉरिडोर',
    tpYourDestinationLabel: 'आपका अवकाश गंतव्य:',
    tpBaseDestinationLabel: 'आधार गंतव्य (प्राथमिक):',
    tpConnectingGemLabel: 'जोड़ने वाला कॉरिडोर रत्न (द्वितीयक):',
    tpSingleModeTitle: 'एकल गंतव्य गहन मोड',
    tpStep2Title: 'यात्रा अवधि एवं यात्रा तिथियाँ',
    tpSelectLengthLabel: 'यात्रा की लंबाई चुनें:',
    tpStartDateLabel: 'प्रारंभ तिथि:',
    tpEndDateLabel: 'समाप्ति तिथि',
    tpWeekendNote: 'Open-Meteo पूर्वानुमान मॉडल सक्रिय: शनिवार आगमन पर +35% वीकेंड उछाल; शुक्रवार प्रस्थान या सप्ताह के दिनों की यात्राओं में स्पष्ट कॉरिडोर मिलते हैं।',
    tpStep3Title: 'दैनिक आवास एवं भोजन बैंड',
    tpStep4Title: 'यात्रा समूह प्रकार',
    tpBudgetBudget: 'बजट यात्री', tpBudgetBudgetDesc: 'सरकारी वन विश्रामगृह व घरेलू रसोई',
    tpBudgetBalanced: 'संतुलित अन्वेषक', tpBudgetBalancedDesc: 'MTDC रिसॉर्ट व झील किनारे विला',
    tpBudgetPremium: 'प्रीमियम आराम', tpBudgetPremiumDesc: 'लक्ज़री विरासत एस्टेट व स्पा',
    tpGroupSolo: 'एकल यात्री',
    tpGroupCouple: 'जोड़ा / युगल',
    tpGroupFamily: 'बच्चों सहित परिवार',
    tpGroupFriends: 'दोस्तों का समूह',
    tpGenerateBtnPrefix: 'बनाएं',
    tpGenerateBtnSuffix: '-दिवसीय यात्रा-सूची व ग्रीन पास →',
    tpModalEyebrow: 'यात्रा योजना व ग्रीन पास सहेजें',
    tpModalTitle: 'त्वरित 2-फ़ील्ड यात्री प्रोफ़ाइल',
    tpModalSubtitle: 'कभी लंबा सर्वेक्षण नहीं। आपके वापसी मार्ग को निजीकृत करने व आधिकारिक छूट वाउचर जारी करने हेतु बस 2 फ़ील्ड।',
    tpModalField1Label: '1. आप कहाँ से यात्रा कर रहे हैं? (गृह शहर / राज्य)',
    tpModalField2Label: '2. आपकी प्राथमिक यात्रा शैली:',
    tpSkipBtn: 'छोड़ें व योजना देखें',
    tpSaveClaimBtn: 'सहेजें व पास प्राप्त करें',

    spNotFoundTitle: 'गंतव्य नहीं मिला',
    spNotFoundDesc: 'अनुरोधित गंतव्य सक्रिय पश्चिमी घाट व महाराष्ट्र कॉरिडोर रजिस्ट्री का हिस्सा नहीं है।',
    spExploreDiscoverBtn: 'डिस्कवर फ़ीड देखें',
    spViewAllMhBtn: 'सभी महाराष्ट्र गंतव्य देखें',
    spStatusOptimalHeadline: 'कम भीड़ • भ्रमण हेतु उपयुक्त समय', spStatusOptimalSub: 'वहन क्षमता पूरी तरह आरामदायक है। पर्याप्त पार्किंग व शून्य हाईवे अवरोध।',
    spStatusModerateHeadline: 'मध्यम प्रवाह • स्थिर गतिविधि', spStatusModerateSub: 'पीक वीकेंड सीमा के करीब। आदर्श आराम हेतु सुबह 10 बजे से पहले या शाम 4 बजे के बाद जाएं।',
    spStatusCriticalHeadline: 'अत्यधिक भीड़ • गंभीर अवरोध', spStatusCriticalSub: 'चेकपॉइंट संतृप्त हैं। लंबी पार्किंग कतारें। हम नीचे दिए गए जुड़वां गंतव्य को अपनाने की दृढ़ता से सलाह देते हैं।',
    spUnderVisitedBadge: '🌿 कम-आबाद इको-रत्न',
    spTravelTime: 'यात्रा समय:',
    spDistance: 'दूरी:',
    spStatutoryCapacity: 'सांविधिक क्षमता:',
    spLiveLocationGis: 'लाइव लोकेशन जीआईएस',
    spPlanTripBtn: 'यात्रा योजना बनाएं',
    spShareStatusBtn: 'स्थिति साझा करें',
    spAuthorityGisLink: 'पूर्ण क्षेत्रीय जीआईएस कॉरिडोर कमांड मानचित्र खोलें',
    spDiscoverFeedLink: 'डिस्कवर फ़ीड पर अधिक शांत स्थल देखें',
    spCarryingCapacityEyebrow: 'वहन क्षमता एवं फुटफॉल मॉडल',
    spCrowdPressureTitle: 'गतिशील भीड़ दबाव स्थिति',
    spBookingBannerTitle: 'क्या आपके पास पहले से होटल या गतिविधि बुकिंग है?',
    spBookingBannerBadge: '✓ 100% गारंटीकृत प्रवेश',
    spBookingBannerDesc: 'आपको चेकपॉइंट पर पुनर्निर्देशित या वापस नहीं भेजा जाएगा। हाईवे पुनर्निर्देशन सलाह केवल स्वतःस्फूर्त दिन-यात्रियों के लिए स्वैच्छिक सिफारिशें हैं। अपना प्रवास जारी रखें, और स्थानीय आकर्षण कतारों से बचने के लिए नीचे हमारा 12-घंटे का पूर्वानुमान देखें!',
    spInflowVsCapacity: 'अनुमानित प्रवाह बनाम क्षमता',
    spOperatingAtPrefix: 'वर्तमान में',
    spOperatingAtSuffix: 'वहन क्षमता सीमा पर संचालन',
    spEstWaitQueue: 'अनुमानित प्रतीक्षा व कतार',
    spFreeFlowing: 'बिना किसी चेकपॉइंट अवरोध के निर्बाध पहुंच मार्ग।',
    spWeatherHazard: 'मौसम व घाट जोखिम',
    spCaution: 'सावधानी (कोहरा / बारिश)',
    spSafe: 'सुरक्षित / अनुकूल',
    sp12hForecastTitle: '12-घंटे पूर्वानुमान पट्टी एवं मांग ग्राफ़',
    sp12hForecastDesc: 'Open-Meteo GFS मौसम सेंसर व सड़क परिवहन देरी के साथ अंशांकित प्रति घंटा आगमन मात्रा',
    spWeeklyTitle: 'ऐतिहासिक भीड़ विश्लेषण (वर्तमान तिथि तक)',
    spWeeklyDesc: 'वर्तमान तिथि तक कड़ाई से एकत्रित टर्नस्टाइल व टेलीमेट्री लॉग।',
    spProvenanceCollapseHint: 'संक्षिप्त करें',
    spProvenanceExpandHint: 'ऑडिट करें',
    spProvenanceToggleLabel: 'पारदर्शी डेटा टियर उद्गम व मीट्रिक ऑडिट (क्लिक करें',
    spProvenanceIntro: 'ईकोरूट भारत में हर मीट्रिक को कठोरता से एक वास्तविक डेटा टियर के साथ टैग किया गया है। हम किसी अस्थापित लाइव सेंसर नेटवर्क का दावा नहीं करते; अनुमान वास्तविक मौसम API, राजपत्रित सांविधिक आगमन, एवं एक पारदर्शी सूत्र से लिए जाते हैं।',
    spTwinsEyebrow: 'शांत सहोदर स्थल (बिना कतार विकल्प)',
    spTwinsTitlePrefix: 'भीड़ से बचें',
    spTwinsZeroTraffic: '✓ शून्य ट्रैफ़िक व आसान पार्किंग',
    spTwinsIntroPrefix: 'हम आपकी पसंदीदा अवकाश शैली (',
    spTwinsIntroSuffix: ') को शांत, कम-भीड़ वाले निकटवर्ती सहोदर गंतव्यों से मिलाते हैं जहां आप ट्रैफ़िक में घंटों बचाते हैं, पर्याप्त पार्किंग पाते हैं, एवं शांत प्रकृति का आनंद लेते हैं।',
    spTwinsTipLabel: 'स्वतःस्फूर्त एवं पूर्व-बुकिंग यात्रियों हेतु विशेष रूप से तैयार:',
    spTwinsTipBody: 'बिना आवास के आने वाले वाहन चालकों या आगामी यात्राओं की योजना बना रहे यात्रियों के लिए अनुशंसित। यदि आपके पास पहले से होटल आरक्षण है, तो अपना प्रवास जारी रखें — आपका प्रवेश सुनिश्चित है!',
    spTwinsHighwayDelay: '~2.5 घंटे का हाईवे विलंब टाला गया',
    spTwinsExploreBtnPrefix: 'अन्वेषण करें',
    spPracticalInfoEyebrow: 'स्थानीय व्यावहारिक जानकारी',
    spPracticalInfoTitle: 'प्रमुख आकर्षण व नागरिक सुविधाएं',
    spHighlightsWithinPrefix: 'में मुख्य आकर्षण',
    spOsmVerified: 'OSM Overpass सत्यापित नागरिक बिंदु',
    spGettingThere: 'वहां कैसे पहुंचें व सड़क स्थिति',
    spPrimaryRoute: 'मुख्य मार्ग:',
    spLiveEta: 'लाइव अनुमानित समय:',
    spChokeAdvisoryLabel: 'अवरोध सलाह:',
    spHospitalityEyebrow: 'आतिथ्य एवं प्रवास',
    spVerifiedStaysTitle: 'सत्यापित प्रवास एवं होमस्टे',
    spMtdcPrioritized: 'MTDC मान्यता प्राप्त इको-साझेदारों को संधारणीयता के लिए प्राथमिकता',
    spMtdcPartnerBadge: 'MTDC साझेदार',
    spPerNight: '/ रात',
    spBookItineraryBtn: 'ट्रिप प्लानर में प्रवास सहित यात्रा-सूची बुक करें →',
    spCheckInsEyebrow: 'सामुदायिक ग्राउंड टेलीमेट्री',
    spCheckInsTitlePrefix: 'हाल की यात्री चेक-इन एवं रिपोर्ट',
    spCheckInBtn: 'यहां चेक-इन करें (भीड़ रिपोर्ट करें)',
    spNoCheckIns: 'आज अभी तक कोई सामुदायिक चेक-इन नहीं। ज़मीनी स्थिति सत्यापित करने वाले पहले यात्री बनें!',
    spCongestionLabel: 'भीड़भाड़:',
    spLightPleasant: 'हल्की / सुखद',
    spModerateLevel: 'मध्यम',
    spHeavyGridlock: 'भारी जाम',
    spGeofenceVerified: 'जियोफेंस सत्यापित',
    spCheckInModalTitle: 'सामुदायिक चेक-इन',
    spCheckInModalDescPrefix: 'से रिपोर्ट कर रहे हैं',
    spCheckInModalDescSuffix: '? ज़मीनी भीड़भाड़ की वर्तमान स्थिति स्वयं रिपोर्ट कर साथी यात्रियों की मदद करें।',
    spCongestionScaleLabel: 'देखी गई भीड़भाड़ (1 = खाली, 5 = गंभीर जाम):',
    spOptionalNoteLabel: 'वैकल्पिक टिप्पणी (उदा. पार्किंग स्थिति, सड़क हालत):',
    spNotePlaceholder: 'साफ पगडंडियाँ, झील के पास पर्याप्त पार्किंग स्थान…',
    spGeofenceNote: 'मान्य टेलीमेट्री भार के लिए जियोफेंस सत्यापन स्वचालित रूप से लागू।',
    spCancelBtn: 'रद्द करें',
    spSubmitCheckInBtn: 'चेक-इन सबमिट करें',
    spShareModalTitle: 'लाइव गंतव्य स्थिति साझा करें',
    spShareCardDescPrefix: 'वर्तमान में',
    spShareCardDescMid: 'वहन क्षमता पर चल रहा है, अनुमानित प्रतीक्षा समय',
    spShareFooter: 'ईकोरूट भारत • पर्यटन मंत्रालय',
    spWhatsAppShareBtn: 'व्हाट्सएप के माध्यम से साझा करें',
    spCopyShareBtn: 'साझा टेक्स्ट व लिंक कॉपी करें',
    spCopiedBtn: '✓ लिंक व सारांश कॉपी हो गया!',

    ftpTitle: 'भविष्य की यात्रा व भीड़मुक्त यात्रा-सूची योजनाकार',
    ftpBadgeAiScheduler: 'एआई स्मार्ट शेड्यूलर',
    ftpBadgeBackendApi: '✅ बैकएंड एपीआई',
    ftpBadgeOffline: '📵 ऑफलाइन मोड',
    ftpSubtitle: 'एआई-अनुमानित भीड़भाड़ वक्रों व संतुलित बहु-दिवसीय यात्रा-सूचियों के साथ आगामी छुट्टियों की योजना बनाएं, ताकि 90% कॉरिडोर अवरोधों से बचा जा सके',
    ftpSaveBtn: '💾 मेरे पास में सहेजें (+150 कर्मा)',
    ftpSavingBtn: 'सहेजा जा रहा है...',
    ftpReportBtn: '📄 एआई ऑडिट रिपोर्ट',
    ftpPrintBtn: 'प्रिंट / योजना निर्यात करें',
    ftpViewInPasses: 'मेरे पास में देखें',
    ftpDestLabel: 'गंतव्य केंद्र / फोकस:',
    ftpDateLabel: 'नियोजित यात्रा तिथि:',
    ftpDurationLabel: 'यात्रा अवधि:',
    ftpStyleLabel: 'यात्रा प्राथमिकता:',
    ftpStyleScenic: 'सुखद व प्राकृतिक', ftpStyleAdventure: 'रोमांच व ट्रेकिंग', ftpStyleFamily: 'पारिवारिक अनुकूल', ftpStyleBudget: 'किफायती व संधारणीय',
    ftpMobilityLabel: 'गतिशीलता मोड (30% भार):',
    ftpMobilityGreen: '🌿 ग्रीन ट्रिप: बस/ट्रेन + स्थानीय चालक', ftpMobilityUltraGreen: '⚡ अल्ट्रा-ग्रीन: इलेक्ट्रिक रेल + ई-शटल', ftpMobilityPersonalCar: '🚗 निजी पेट्रोल / डीज़ल कार',
    ftpStayLabel: 'प्रवास प्रकार (20% भार):',
    ftpStayHomestay: '🏠 मान्यता प्राप्त MTDC ग्रामीण होमस्टे', ftpStayHotel: '🏨 वाणिज्यिक रिसॉर्ट / चेन होटल',
    ftpConventionalHotspots: 'पारंपरिक हॉटस्पॉट (जैसे लोणावला)',
    ftpPredictedCrowdLoadPrefix: 'अनुमानित भीड़ भार:',
    ftpHeavyTraffic: '🔴 भारी ट्रैफ़िक जाम',
    ftpModerateCrowds: '🟡 मध्यम भीड़',
    ftpDecongestedTwin: 'एआई-भीड़मुक्त जुड़वां मार्ग (जैसे माथेरान व भंडारदरा)',
    ftpComfortableSuffix: '(आरामदायक)',
    ftpZeroDelays: '🟢 शून्य चेकपॉइंट देरी',
    ftpSustainabilityTitle: 'यात्रा संधारणीयता व कार्बन ऑफसेट',
    ftpPillar1Badge: 'स्तंभ 1 पर्यावरणीय कोर',
    ftpSustainabilityDesc: 'गतिशीलता विकल्प, इको-होमस्टे, कचरा अनुशासन, व ग्रामीण आर्थिक निवेश पर आधारित बहु-कारक संधारणीयता सूचकांक।',
    ftpEnvironmental: '🌱 पर्यावरणीय',
    ftpSocialCultural: '👥 सामाजिक व सांस्कृतिक',
    ftpLocalEconomic: '💰 स्थानीय आर्थिक',
    ftpCarbonReductionTitle: 'इस योजना का पालन करके कार्बन पदचिह्न में कमी',
    ftpRoundTripDistance: 'राउंड-ट्रिप दूरी',
    ftpSoloCarBaseline: 'पारंपरिक एकल कार आधार रेखा:',
    ftpEcoRoutePlanned: '🌿 ईकोरूट नियोजित:',
    ftpCarbonSavedSuffix: 'कार्बन बचाया',
    ftpTreesAbsorption: 'वृक्ष अवशोषण',
    ftpTreesDesc: '1 वर्ष तक CO₂ अवशोषित करने वाले देशी वृक्ष',
    ftpFuelSaved: 'जीवाश्म ईंधन बचत',
    ftpFuelDesc: 'पेट्रोल / डीज़ल ईंधन संरक्षित',
    ftpIdlingAvoided: 'निष्क्रिय समय टाला गया',
    ftpIdlingDesc: 'घाट अवरोध में निष्क्रिय समय रोका गया',
    ftpLocalInjection: 'स्थानीय निवेश',
    ftpLocalInjectionDesc: 'ग्रामीण होमस्टे व चालक संघों के लिए',
    ftpAiInsightsTitle: 'एआई इको-क्यूरेटर अंतर्दृष्टि व कार्बन कटौती रणनीति',
    ftpAiCarbonWhyTitle: 'यह योजना कार्बन क्यों घटाती है',
    ftpAiCommunityTitle: 'समुदाय व आजीविका लाभ',
    ftpGreenModeTitle: '🌱 ग्रीन ट्रिप मोड: पार्क एंड राइड स्थानीय गतिशीलता प्रोटोकॉल',
    ftpGreenModeDesc: 'घुमावदार ऊंचाई वाले मोड़ों पर निजी वाहन चलाने के बजाय, निर्दिष्ट एक्सप्रेसवे परिधि केंद्रों (वलवण / दस्तूरी / वाई) पर पार्क करें। सत्यापित स्थानीय चालकों, ई-शटल, या साइकिल पर स्विच करें। यह घाट जाम को 40% तक कम करता है, स्वच्छ पहाड़ी हवा की रक्षा करता है, और सीधे स्थानीय चालक संघों को आय पहुंचाता है।',
    ftpOptimizedItineraryTitle: 'अनुकूलित स्मार्ट यात्रा-सूची',
    ftpAvoidsDelayBadge: '🌿 ~2.5 घंटे का ट्रैफ़िक विलंब टालता है • आसान पार्किंग सुनिश्चित',
    ftpReportModalTitle: 'आधिकारिक संधारणीयता व कार्बन ऑडिट रिपोर्ट',
    ftpReportModalSubtitle: 'ईकोरूट भारत बहु-हितधारक इंटेलिजेंस इंजन द्वारा प्रमाणित',
    ftpGeneratingReport: 'Google Gemini 2.0 Flash के साथ आधिकारिक ऑडिट रिपोर्ट तैयार की जा रही है...',
    ftpReportValidNote: 'ग्रीन पास मान्यता एवं MTDC कार्बन छूट हेतु मान्य',
    ftpPrintSaveBtn: 'प्रिंट / पीडीएफ़ सहेजें',
    ftpCloseBtn: 'बंद करें',
    ftpSocialSubLabel: 'पवित्र देवराई व स्थानीय गाइड',
    ftpDecongestedSchedule: 'भीड़मुक्त कार्यक्रम',

    ppEyebrow: 'अपनी यात्रा की योजना बनाएं',
    ppTitle: 'यात्रा योजनाकार',
    ppSubtitle: 'अपने गंतव्य, यात्रा तिथियां और पसंद चुनें — हम एक राउंड-ट्रिप यात्रा-सूची और एक कम-भीड़ वाला इको-फ्रेंडली विकल्प तैयार करेंगे।',
    ppPreferencesLabel: 'प्राथमिकताएं',
    ppSpotsLabel: 'स्थलों का संग्रह',
    ppSpotsPlaceholder: 'घूमने के लिए गंतव्य चुनें...',
    ppSpotsSearchPlaceholder: 'गंतव्य खोजें...',
    ppScheduleLabel: 'समय-सारणी',
    ppStartDateLabel: 'प्रारंभ तिथि',
    ppEndDateLabel: 'समाप्ति तिथि',
    ppGenerateBtn: 'यात्रा योजना बनाएं',
    ppLocationRequesting: 'आपका स्थान पता लगाया जा रहा है…',
    ppLocationGranted: 'आपके वर्तमान स्थान का उपयोग किया जा रहा है',
    ppLocationFallback: 'अनुमानित हब दूरी का उपयोग किया जा रहा है (स्थान अनुपलब्ध)',
    ppSelectSpotsHint: 'जारी रखने के लिए कम से कम एक गंतव्य चुनें',
    ppNoSpotsSelected: 'अभी तक कोई गंतव्य नहीं चुना गया',
    ppAllDestinations: 'सभी गंतव्य',
    ppSelectedSuffix: 'चयनित',
    ppOutputEyebrow: 'आपकी तैयार योजना',
    ppTripTimelineTitle: 'यात्रा समय-रेखा',
    ppTripTimelineDesc: 'आपके चुने गए स्थल, आपके स्थान से न्यूनतम वापसी यात्रा हेतु राउंड-ट्रिप क्रम में व्यवस्थित।',
    ppEcoTimelineTitle: 'इको-फ्रेंडली समय-रेखा',
    ppEcoTimelineDesc: 'हर स्थल को उसके कम-भीड़ वाले जुड़वां गंतव्य से बदला गया, और एक नए राउंड-ट्रिप क्रम में पुनःव्यवस्थित।',
    ppReplacesLabel: 'की जगह',
    ppNoTwinFound: 'कोई कम-भीड़ वाला विकल्प उपलब्ध नहीं — मूल स्थल रखा गया',
    ppDayLabel: 'दिन',
    ppFreeDayLabel: 'खाली दिन / यात्रा बफर',
    ppSummaryTitle: 'CO2 व विवरण का सारांश',
    ppSummaryDistance: 'कुल दूरी',
    ppSummaryCo2: 'अनुमानित CO2e',
    ppSummaryCo2Saved: 'इको रूट से बचाया गया CO2',
    ppSummaryOriginalRoute: 'मानक मार्ग',
    ppSummaryEcoRoute: 'इको-फ्रेंडली मार्ग',
    ppSummaryCrowdReduction: 'औसत भीड़ में कमी',
    ppSummaryDates: 'यात्रा तिथियां',
    ppSummaryPreferences: 'प्राथमिकताएं',
    ppSharePrintTitle: 'साझा करने योग्य प्रिंट',
    ppPrintBtn: 'प्रिंट करें',
    ppCopyBtn: 'सारांश कॉपी करें',
    ppCopiedBtn: 'कॉपी हो गया!',
    ppWhatsAppBtn: 'व्हाट्सएप पर साझा करें',
    ppEditPlanBtn: 'योजना संपादित करें',
    ppKmSuffix: 'किमी'
  },
  mr: {
    appName: 'इकोरूट भारत (EcoRoute Bharat)',
    appSubtitle: 'गतिमान वहन क्षमता व जुळे पर्यटन स्थळ पुनर्निर्देशन प्रणाली',
    version: 'SIH26204 एआय गर्दी नियंत्रण v2.4',
    westernGhatsLive: 'पश्चिम घाट कॉरिडोर थेट ट्रॅकिंग',
    activeVisitors: 'सक्रिय पर्यटक',
    overloadedZones: 'अतिगर्दीचे झोन',
    diversionsActive: 'सक्रिय मार्गबदल',
    co2Avoided: 'CO₂ बचत',
    reset: 'पुनः सुरू करा',
    touristPortal: 'पर्यटक अनुभव पोर्टल',
    authorityPortal: 'प्रशासन कमांड सेंटर',
    providerPortal: 'हॉस्पिटॅलिटी व स्थानिक अर्थव्यवस्था',
    liveSimulation: 'थेट सिम्युलेशन मोड',
    selectTargetDestination: 'पर्यटन स्थळ निवडा',
    corridorFilter: 'कॉरिडोर श्रेणी निवडा',
    vibePreferences: 'पर्यटक आवड व पसंती',
    scenic: 'निसर्गरम्य दृश्ये',
    budget: 'कमी खर्च / बजेट',
    adventure: 'ट्रेकिंग आणि साहस',
    family: 'कौटुंबिक सहल',
    optimalCapacity: 'उत्कृष्ट वहन क्षमता (हिरवा)',
    moderateCapacity: 'मध्यम गर्दी प्रमाण (पिवळा)',
    criticalCapacity: 'अतिगर्दी धोक्याचा इशारा (लाल)',
    dccScore: 'डीसीसी निर्देशांक स्कोर',
    estWait: 'अपेक्षित थांबा व प्रतीक्षा वेळ',
    queuesActive: 'वाहतूक कोंडी सक्रिय',
    zeroDelay: 'विनाथांबा थेट प्रवेश',
    inflowVsCap: 'पर्यटक आवक / कमाल क्षमता',
    parkingLoad: 'पार्किंग क्षमता भार',
    weatherRisk: 'हवामान / दरड धोका',
    activeAdvisoryBadge: 'शासकीय सुरक्षा सूचना सक्रिय',
    twinTitle: 'समान वैशिष्ट्यांची पर्यायी "जुळी" पर्यटन स्थळे',
    recommendedReroute: 'शिफारस केलेला नवा मार्ग',
    vibeMatch: 'पसंती जुळवणी',
    fewerTourists: 'कमी गर्दीची शांत जागा',
    rerouteCta: 'मार्ग बदला आणि आनंद घ्या',
    hourlyCurveTitle: '१२ तासांचा गर्दी अंदाज आलेख',
    optimalWindow: 'भेट देण्यासाठी सर्वोत्तम वेळ',
    greenEcoPass: 'महाराष्ट्र हरित पर्यटन इको-पास',
    authorityTitle: 'प्रशासन जीआयएस नियंत्रण व आपत्कालीन केंद्र',
    gisMapTitle: 'कॉरिडोर जीआयएस वहन क्षमता नकाशा',
    thresholdTableTitle: 'पर्यटन स्थळ गर्दी मर्यादा निरीक्षण तक्ता',
    communityImpactTitle: 'स्थानिक पर्यावरण व समुदाय आरोग्य मापक',
    digitalDispatcherTitle: 'डिजिटल सूचना प्रसारण प्रणाली',
    broadcastBtn: 'सूचना प्रसारित करा',
    providerTitle: 'हॉटेलियर्स व स्थानिक व्यवसाय मंच',
    occupancySlider: 'हॉटेल ऑक्युपन्सी % नोंदवा',
    inflowPredictorTitle: '३ दिवसांचा पर्यटक आवक अंदाज',
    publishDeal: 'सवलत योजना जाहीर करा',
    demandDiffusionTitle: 'कॉरिडोर पर्यटक हालचाल व मागणी वितरण विश्लेषण',
    timeSlotTitle: 'स्मार्ट वेळ स्लॉट शिफारस व प्रवेश व्यवस्थापन',
    navExplore: 'पर्यटन स्थळे',
    navDiscover: 'शोध घ्या',
    navTripPlanner: 'सहल नियोजन',
    navMyTrips: 'माझे ग्रीन पास',
    tripSustainabilityScore: 'सहल शाश्वतता (सस्टेनेबिलिटी) गुण',
    carbonFootprint: 'कार्बन फूटप्रिंट',
    carbonSaved: 'वाचवलेले कार्बन उत्सर्जन',
    greenTrips: 'हरित सहल गतिशीलता',
    transportation: 'वाहतूक व प्रवास (३०%)',
    accommodation: 'निवास व्यवस्था (२०%)',
    activities: 'पर्यटन उपक्रम (१५%)',
    wasteManagement: 'कचरा व्यवस्थापन (१५%)',
    localEconomy: 'स्थानिक अर्थव्यवस्था (१०%)',
    environmentalImpact: 'पर्यावरण संवर्धन (१०%)',
    aiEcoGuide: 'एआई इको-मार्गदर्शक माहिती',
    biodiversity: 'जैवविविधता व निसर्ग संवर्धन',
    heritageCulture: 'ऐतिहासिक वारसा व संस्कृती',
    zeroWaste: 'शून्य-कचरा नियम व शिस्त',
    localLivelihoods: 'स्थानिक रोजगार व चालक',
    lowImpactHours: 'कमी गर्दीची सर्वोत्तम वेळ',
    askAiGuide: 'या पर्यटन स्थळाबाबत एआई मार्गदर्शकाला विचारा',

    ldMinistryTicker: 'SIH-26204 • पर्यटन मंत्रालय व महाराष्ट्र शासन',
    ldGhatsCorridorsLabel: 'पश्चिम घाट जैव-कॉरिडोर:',
    ldMonitoredCount: '२१ निरीक्षणाधीन',
    ldLiveTelemetryLabel: 'थेट टेलीमेट्री:',
    ldActiveStatus: 'सक्रिय',
    ldHeroTitleLine1: 'पर्यटनाचे रूपांतर करत आहोत',
    ldHeroTitleLine2: 'एका शाश्वत, कमी-प्रभावी प्रवासात',
    ldHeroSubtitlePart1: '"मी कुठे जावे?" असे विचारण्याऐवजी, इकोरूट भारत उत्तर देतो:',
    ldHeroSubtitlePart2: '"उत्सर्जन कमी करत, ग्रामीण होमस्टेला पाठिंबा देत, प्लास्टिक टाळत व महामार्गावरील कोंडी चुकवत मी कसा प्रवास करू शकतो?"',
    ldStatCo2: 'वाचवलेले CO2e',
    ldStatDiverted: 'मार्गबदल केलेले पर्यटक',
    ldStatCapacity: 'कॉरिडोर क्षमता',
    ldStatBottlenecks: 'घाट अडथळे',
    ldSearchPlaceholder: 'स्थळाचे नाव, जिल्हा किंवा इको-श्रेणी शोधा (उदा. माथेरान, कास, पुणे)...',
    ldQuickThemes: 'द्रुत थीम:',
    ldThemeMistyGhats: 'धुक्याने वेढलेले घाट',
    ldThemeCoastalForts: 'किनारपट्टी व किल्ले',
    ldThemeHeritageTreks: 'ऐतिहासिक ट्रेक',
    ldThemeSacredGroves: 'पवित्र देवराया',
    ldBtnLaunchPlanner: 'ग्रीन सहल नियोजक सुरू करा',
    ldBtnStakeholderDemo: '1-क्लिक भागधारक डेमो लॉगिन',
    ldBtnSampleCertificate: 'नमुना MTDC ग्रीन प्रमाणपत्र पहा',
    ldPillarsEyebrow: 'सर्वसमावेशक प्रभाव आराखडा',
    ldPillarsTitle: 'शाश्वत पर्यटनाचे ३ आधारस्तंभ',
    ldPillarsSubtitle: 'पर्यावरण संरक्षण, सांस्कृतिक वारसा आदर, आणि थेट ग्रामीण आर्थिक सक्षमीकरण यांच्यात समतोल.',
    ldWeight40: 'भार: ४०%',
    ldWeight30: 'भार: ३०%',
    ldPillar1Title: '🌱 पर्यावरणीय संवर्धन',
    ldPillar1Desc: 'कार्बन उत्सर्जनात मोठी घट, शून्य एकल-वापर प्लास्टिक, गतिमान वहन क्षमता (DCC), व पर्यावरणीय बफर संरक्षण.',
    ldPillar1B1: 'राउंड-ट्रिप व स्थानिक वाहतूक CO2e गणना',
    ldPillar1B2: 'गतिमान वहन क्षमता (DCC) नियंत्रण',
    ldPillar1B3: 'शून्य-कचरा ट्रेल जिओटॅगिंग व स्वच्छता पथके',
    ldPillar2Title: '👥 सामाजिक व सांस्कृतिक वारसा',
    ldPillar2Desc: 'पवित्र देवरायांचे जतन, आदरयुक्त यात्रेकरू शिष्टाचार, स्थानिक कथाकार मार्गदर्शक, व अडथळामुक्त पायवाटा.',
    ldPillar2B1: 'पवित्र देवराई संवर्धन व शांतता कॉरिडोर',
    ldPillar2B2: 'स्थानिक कथाकार व मार्गदर्शक संघ बुकिंग',
    ldPillar2B3: 'बहुभाषिक मराठी/हिंदी/इंग्रजी ऑडिओ टूर',
    ldPillar3Title: '💰 स्थानिक आर्थिक टिकवण',
    ldPillar3Desc: 'ग्रामीण गावांमध्ये थेट पर्यटक खर्च, फार्म-टू-टेबल स्ट्रॉबेरी सहकारी संस्था, व वारली कारागीर संघ.',
    ldPillar3B1: 'गाव होमस्टेमध्ये ९०%+ महसूल टिकवण',
    ldPillar3B2: 'थेट शेतकरी सहकारी संस्था व FPO एकीकरण',
    ldPillar3B3: 'ग्रामीण जिल्ह्यांमध्ये ऑफ-पीक पर्यटक विभाजन',
    ldLoopEyebrow: 'SIH-26204 संपूर्ण परिसंस्था लूप',
    ldLoopTitle: '८-टप्प्यांचा सतत सुधारणा फीडबॅक लूप',
    ldLoopSubtitle: 'पर्यटकाने एखादे स्थळ शोधण्यापासून ते जिल्हा जिल्हाधिकाऱ्यांच्या सहल-पश्चात डेटा विश्लेषणापर्यंत, प्रत्येक टप्पा कॉरिडोर संवर्धनास हातभार लावतो.',
    ldStage1Title: 'शोधा', ldStage1Desc: 'थेट DCC टेलीमेट्री व एआय जुळी सूचना प्रस्थानापूर्वी गर्दी वळवतात.',
    ldStage2Title: 'नियोजन करा', ldStage2Desc: 'बहु-मार्गी वाहतूक जनरेटर रेल्वे, ईव्ही व बायपास हबद्वारे उत्सर्जन कमी करतो.',
    ldStage3Title: 'मोजा', ldStage3Desc: 'प्रत्येक सहल योजनेसाठी रिअल-टाइम 3D शाश्वतता गुण (पर्यावरण, सामाजिक, आर्थिक) मोजले जातात.',
    ldStage4Title: 'शाश्वत प्रवास करा', ldStage4Desc: 'वलवण व दस्तुरी येथे इलेक्ट्रिक शटल वापरा, स्थानिक गाव मार्गदर्शक नेमा.',
    ldStage5Title: 'बक्षीस मिळवा', ldStage5Desc: 'इको-कर्मा गुण मिळवा, MTDC क्रेडिट वापरा, व प्रमाणित प्रमाणपत्रे मिळवा.',
    ldStage6Title: 'तक्रार करा', ldStage6Desc: 'नागरिक जिओ-टॅग केलेल्या छायाचित्रांद्वारे ट्रेल कचरा व गर्दीच्या घटनांची तक्रार करतात.',
    ldStage7Title: 'विश्लेषण करा', ldStage7Desc: 'जिल्हा जीआयएस प्रणाली थेट सेन्सर फीड व पर्यटक कचरा अहवाल एकत्रित करते.',
    ldStage8Title: 'सुधारणा करा', ldStage8Desc: 'प्रशासन आपत्कालीन क्षमता ओव्हरराइड व गतिमान किंमत अंमलात आणते.',
    ldCatalogEyebrow: 'डिमांड-डिफ्यूजन इंजिन • सक्रियपणे प्रोत्साहन दिलेली स्थळे',
    ldCatalogTitle: 'आमच्या इंजिनद्वारे प्रोत्साहन दिलेली कमी-भेट स्थळे',
    ldCatAllSpots: 'सर्व प्रोत्साहित स्थळे',
    ldStatusComfortable: 'आरामदायक',
    ldStatusModerate: 'मध्यम',
    ldStatusOvercrowded: 'अतिगर्दी',
    ldCapacitySuffix: 'क्षमता',
    ldViewFullCatalogBtn: 'डिस्कव्हर फीडमध्ये सर्व २१ स्थळे पहा',
    ldRewardsEyebrow: 'आधारस्तंभ २ व ३ • नागरिक बक्षिसे',
    ldRewardsTitle: 'ग्रीन कर्मा गुण मिळवा व MTDC व्हाउचर वापरा',
    ldRewardsBtnLedger: 'माझी बक्षीस नोंदवही पहा',
    ldReward1Title: 'कचरा हॉटस्पॉट कळवा', ldReward1Desc: 'डोंगरी घाटांवरील प्लास्टिक कचरा जिओ-टॅग करा. प्रशासनाच्या स्वच्छता व्हॅन आपोआप पाठवल्या जातात.',
    ldReward2Title: 'इलेक्ट्रिक व रेल्वे वाहतूक', ldReward2Desc: 'नेरळपर्यंत इलेक्ट्रिक ट्रेनने जा किंवा माथेरानमध्ये स्थानिक शेअर ई-शटल वापरा, वाहन प्रदूषण टाळण्यासाठी.',
    ldReward3Title: 'गाव होमस्टेमध्ये रहा', ldReward3Desc: 'MTDC-मान्यताप्राप्त ग्रामीण होमस्टे बुक करा जेणेकरून तुमच्या सहल खर्चाचा ८५% भाग स्थानिक शेतकरी कुटुंबांकडे राहील.',

    dpEyebrow: 'खास तुमच्यासाठी निवडलेले',
    dpTitle: 'वैयक्तिकृत व लपलेली रत्ने असलेली स्थळे',
    dpSubtitle: 'तुमच्या प्रवासाच्या आवडीशी जुळणारी विलोभनीय, शांत स्थळे शोधा. महामार्गावरील कोंडी टाळा व महाराष्ट्रभर रांगमुक्त सुट्टीचा आनंद घ्या.',
    dpPersonalizingFrom: 'हे वैयक्तिकरण या ठिकाणावरून',
    dpStyleQuestion: 'तुम्हाला कोणत्या प्रकारची सुट्टी हवी आहे? (निवडण्यासाठी टॅप करा):',
    dpPriorityHigh: 'प्राधान्य (उच्च)',
    dpStandard: 'नियमित',
    dpCategoryLabel: 'श्रेणी:',
    dpAllCategories: 'सर्व श्रेणी',
    dpDistanceLabel: 'अंतर:',
    dpDistanceAny: 'कोणतेही',
    dpDistanceDayTrip: 'एक-दिवसीय सहल (<११० किमी)',
    dpDistanceWeekend: 'वीकेंड (>११० किमी)',
    dpUnderVisitedOnly: '🌿 फक्त कमी-भेट दिलेली स्थळे',
    dpFoundPrefix: 'तुमच्या प्रवास आवडीशी जुळणारी',
    dpFoundSuffix: 'स्थळे सापडली',
    dpRankedBadge: '✨ सर्वात शांत गर्दी व कमीत कमी प्रभावानुसार क्रमवारी',
    dpGridView: 'ग्रिड दृश्य',
    dpMapView: 'कॉरिडोर जीआयएस नकाशा',
    dpNoResultsTitle: 'जुळणारी कोणतीही सहल सापडली नाही',
    dpNoResultsDesc: 'तुमच्या नेमक्या फिल्टर संयोजनाशी जुळणारे कोणतेही स्थळ सापडले नाही. तुमची श्रेणी किंवा अंतर पसंती बदलून पहा.',
    dpHiddenGemBadge: '🌿 लपलेले रत्न • शांत',
    dpMatchSuffix: 'जुळणी',
    dpStatusOptimal: 'उत्कृष्ट क्षमता',
    dpStatusModerate: 'मध्यम गर्दी',
    dpStatusCritical: 'अतिगर्दी',
    dpWaitSuffix: 'मिनिटे प्रतीक्षा',
    dpKmFromHub: 'किमी केंद्रापासून',
    dpQueueFree: 'रांगमुक्त प्रवेश',
    dpModerateInflow: 'मध्यम प्रवाह',
    dpPeakWaiting: 'सर्वाधिक प्रतीक्षा वेळ',
    dpViewSpotPage: 'स्थळ पान पहा',
    dpStyleScenic: 'निसर्गरम्य दृश्ये',
    dpStyleBudget: 'कमी खर्चिक',
    dpStyleAdventure: 'साहस व ट्रेक',
    dpStyleFamily: 'कौटुंबिक सुविधा',

    srEyebrow: 'शोध निकाल',
    srAllResultsTitle: 'सर्व शोधण्यायोग्य स्थळे व प्रदेश',
    srResultsForPrefix: 'साठी निकाल',
    srFoundPrefix: 'महाराष्ट्रभर जुळणारी',
    srFoundSuffix: 'स्थळे, जिल्हे व राज्ये सापडली',
    srSwitchToDiscover: 'वैयक्तिकृत डिस्कव्हर फीडवर जा →',
    srSearchPlaceholder: 'दुसरे स्थळ किंवा जिल्हा शोधा…',
    srNoMatchTitlePrefix: 'कोणतेही स्थळ जुळले नाही',
    srNoMatchDesc: '"माथेरान" सारखी थंड हवेची ठिकाणे, "अलिबाग" सारखी किनारी केंद्रे, किंवा "रायगड" व "पुणे" सारखे प्रादेशिक जिल्हे शोधून पहा.',
    srBrowseAllBtn: 'सर्व महाराष्ट्र स्थळे पहा',
    srGoToDiscoverBtn: 'डिस्कव्हर फीडवर जा',
    srDestinationsHeading: 'स्थळे',
    srTier1Label: 'टियर १ थेट स्थळे',
    srDistrictsHeading: 'जिल्हे',
    srTier2Label: 'टियर २ संपूर्ण याद्या',
    srStatesHeading: 'राज्ये',
    srTier3Label: 'टियर ३ संपूर्ण राज्य दृश्य',
    srViewSpot: 'स्थळ पहा',
    srExplore: 'पहा',
    srViewAllSpots: 'सर्व स्थळे पहा',
    srStateCoverageLabel: 'राज्य कॉरिडोर व्याप्ती',
    srStatusLowCrowds: 'कमी गर्दी • आरामदायक',
    srStatusModerateTraffic: 'मध्यम वाहतूक',
    srStatusCriticalOvercrowding: 'गंभीर अतिगर्दी',

    tpHeaderEyebrow: 'बुद्धिमान बहु-दिवसीय प्रवास विझार्ड (§4.4)',
    tpTitle: 'एक इको-संतुलित सुट्टी नियोजित करा',
    tpSubtitle: '१-दिवस ते ७-दिवसांच्या लवचिक सुट्ट्या तयार करा. एका स्थळावर सखोल लक्ष द्या किंवा पीक महामार्ग गर्दीशिवाय बहु-थांबा निसर्गरम्य कॉरिडोरचा शोध घ्या.',
    tpModeAiTab: 'एआय शाश्वत सहल-योजना व कार्बन घट (Gemini 3.6 Flash)',
    tpModeCustomTab: 'सानुकूल बहु-टप्पा फॉर्म',
    tpLiveAiBadge: 'थेट एआय',
    tpStep1Title: 'स्थळ रणनीती व निवड',
    tpDestModeSingle: '१ स्थळ (सखोल)',
    tpDestModeMulti: 'बहु-थांबा कॉरिडोर',
    tpYourDestinationLabel: 'तुमचे सुट्टीचे स्थळ:',
    tpBaseDestinationLabel: 'मूळ स्थळ (प्राथमिक):',
    tpConnectingGemLabel: 'जोडणारे कॉरिडोर रत्न (द्वितीयक):',
    tpSingleModeTitle: 'एकल स्थळ सखोल मोड',
    tpStep2Title: 'सहल कालावधी व प्रवास तारखा',
    tpSelectLengthLabel: 'सहलीची लांबी निवडा:',
    tpStartDateLabel: 'सुरुवात तारीख:',
    tpEndDateLabel: 'शेवट तारीख',
    tpWeekendNote: 'Open-Meteo पूर्वानुमान मॉडेल सक्रिय: शनिवारी आगमनासाठी +३५% वीकेंड वाढ अपेक्षित; शुक्रवारी प्रस्थान किंवा आठवड्याच्या दिवसांच्या सहलींना मोकळे कॉरिडोर मिळतात.',
    tpStep3Title: 'दैनिक निवास व जेवण बजेट',
    tpStep4Title: 'प्रवास गट प्रकार',
    tpBudgetBudget: 'बजेट प्रवासी', tpBudgetBudgetDesc: 'शासकीय वन विश्रामगृहे व घरगुती स्वयंपाकघरे',
    tpBudgetBalanced: 'संतुलित संशोधक', tpBudgetBalancedDesc: 'MTDC रिसॉर्ट व तलावकाठची व्हिला',
    tpBudgetPremium: 'प्रीमियम विश्रांती', tpBudgetPremiumDesc: 'लक्झरी वारसा वास्तू व स्पा',
    tpGroupSolo: 'एकल प्रवासी',
    tpGroupCouple: 'जोडपे',
    tpGroupFamily: 'मुलांसह कुटुंब',
    tpGroupFriends: 'मित्रांचा गट',
    tpGenerateBtnPrefix: 'तयार करा',
    tpGenerateBtnSuffix: '-दिवसीय सहल-योजना व ग्रीन पास →',
    tpModalEyebrow: 'सहल योजना व ग्रीन पास जतन करा',
    tpModalTitle: 'द्रुत २-फील्ड प्रवासी प्रोफाइल',
    tpModalSubtitle: 'कधीही लांबलचक सर्वेक्षण नाही. तुमचा परतीचा मार्ग वैयक्तिकृत करण्यासाठी व अधिकृत सवलत व्हाउचर जारी करण्यासाठी फक्त २ फील्ड.',
    tpModalField1Label: '१. तुम्ही कुठून प्रवास करत आहात? (मूळ शहर / राज्य)',
    tpModalField2Label: '२. तुमची प्राथमिक प्रवास शैली:',
    tpSkipBtn: 'वगळा व योजना पहा',
    tpSaveClaimBtn: 'जतन करा व पास मिळवा',

    spNotFoundTitle: 'स्थळ सापडले नाही',
    spNotFoundDesc: 'विनंती केलेले स्थळ सक्रिय पश्चिम घाट व महाराष्ट्र कॉरिडोर नोंदणीचा भाग नाही.',
    spExploreDiscoverBtn: 'डिस्कव्हर फीड पहा',
    spViewAllMhBtn: 'सर्व महाराष्ट्र स्थळे पहा',
    spStatusOptimalHeadline: 'कमी गर्दी • भेट देण्यासाठी उत्तम वेळ', spStatusOptimalSub: 'वहन क्षमता पूर्णपणे आरामदायक आहे. पुरेशी पार्किंग व शून्य महामार्ग अडथळा.',
    spStatusModerateHeadline: 'मध्यम प्रवाह • स्थिर हालचाल', spStatusModerateSub: 'सर्वाधिक वीकेंड मर्यादेजवळ. आदर्श आरामासाठी सकाळी १० आधी किंवा दुपारी ४ नंतर भेट द्या.',
    spStatusCriticalHeadline: 'अतिगर्दी • तीव्र अडथळे', spStatusCriticalSub: 'तपासणी नाके भरलेली आहेत. लांब पार्किंग रांगा. खाली दिलेले जुळे स्थळ निवडण्याची आम्ही जोरदार शिफारस करतो.',
    spUnderVisitedBadge: '🌿 कमी-भेट दिलेले इको-रत्न',
    spTravelTime: 'प्रवास वेळ:',
    spDistance: 'अंतर:',
    spStatutoryCapacity: 'वैधानिक क्षमता:',
    spLiveLocationGis: 'थेट स्थान जीआयएस',
    spPlanTripBtn: 'सहल नियोजित करा',
    spShareStatusBtn: 'स्थिती सामायिक करा',
    spAuthorityGisLink: 'पूर्ण प्रादेशिक जीआयएस कॉरिडोर कमांड नकाशा उघडा',
    spDiscoverFeedLink: 'डिस्कव्हर फीडवर अधिक शांत स्थळे पहा',
    spCarryingCapacityEyebrow: 'वहन क्षमता व फूटफॉल मॉडेल',
    spCrowdPressureTitle: 'गतिमान गर्दी दाब स्थिती',
    spBookingBannerTitle: 'तुमच्याकडे आधीच हॉटेल किंवा उपक्रम बुकिंग आहे का?',
    spBookingBannerBadge: '✓ १००% हमी प्रवेश',
    spBookingBannerDesc: 'तपासणी नाक्यांवर तुम्हाला वळवले किंवा परत पाठवले जाणार नाही. महामार्ग वळवण्याच्या सूचना केवळ अचानक येणाऱ्या दिवस-प्रवाशांसाठी ऐच्छिक शिफारसी आहेत. तुमचा मुक्काम कायम ठेवा, आणि स्थानिक आकर्षण रांगा टाळण्यासाठी खालील १२-तासांचा अंदाज पहा!',
    spInflowVsCapacity: 'अंदाजित प्रवाह विरुद्ध क्षमता',
    spOperatingAtPrefix: 'सध्या',
    spOperatingAtSuffix: 'वहन क्षमता मर्यादेवर कार्यरत',
    spEstWaitQueue: 'अंदाजित प्रतीक्षा व रांग',
    spFreeFlowing: 'शून्य तपासणी अडथळ्यासह निर्बाध प्रवेश मार्ग.',
    spWeatherHazard: 'हवामान व घाट धोका',
    spCaution: 'सावधगिरी (धुके / पाऊस)',
    spSafe: 'सुरक्षित / अनुकूल',
    sp12hForecastTitle: '१२-तास पूर्वानुमान पट्टी व मागणी आलेख',
    sp12hForecastDesc: 'Open-Meteo GFS हवामान सेन्सर व रस्ता वाहतूक विलंबासह अंशांकित तासागणिक आगमन प्रमाण',
    spWeeklyTitle: 'ऐतिहासिक गर्दी विश्लेषण (सद्य तारखेपर्यंत)',
    spWeeklyDesc: 'सद्य तारखेपर्यंत काटेकोरपणे संकलित टर्नस्टाइल व टेलीमेट्री नोंदी.',
    spProvenanceCollapseHint: 'संक्षिप्त करा',
    spProvenanceExpandHint: 'तपासा',
    spProvenanceToggleLabel: 'पारदर्शक डेटा टियर स्रोत व मेट्रिक तपासणी (क्लिक करा',
    spProvenanceIntro: 'इकोरूट भारतमधील प्रत्येक मेट्रिकला काटेकोरपणे खऱ्या डेटा टियरसह टॅग केले आहे. आम्ही कोणत्याही अस्थापित थेट सेन्सर नेटवर्कचा दावा करत नाही; अंदाज वास्तविक हवामान API, राजपत्रित वैधानिक आगमन, व पारदर्शक सूत्रावरून काढले जातात.',
    spTwinsEyebrow: 'शांत सहोदर स्थळे (रांगमुक्त पर्याय)',
    spTwinsTitlePrefix: 'गर्दीपासून दूर जा',
    spTwinsZeroTraffic: '✓ शून्य वाहतूक कोंडी व सोपी पार्किंग',
    spTwinsIntroPrefix: 'आम्ही तुमची आवडती सुट्टी शैली (',
    spTwinsIntroSuffix: ') शांत, कमी-गर्दीच्या जवळपासच्या सहोदर स्थळांशी जुळवतो, जिथे तुम्ही वाहतूक कोंडीत तास वाचवता, पुरेशी पार्किंग मिळवता, व शांत निसर्गाचा आनंद घेता.',
    spTwinsTipLabel: 'अचानक व आगाऊ बुकिंग करणाऱ्या प्रवाशांसाठी खास:',
    spTwinsTipBody: 'निवासाशिवाय गाडी चालवणाऱ्या किंवा आगामी सहलींचे नियोजन करणाऱ्या पर्यटकांसाठी शिफारस केलेले. जर तुमच्याकडे आधीच हॉटेल आरक्षण असेल, तर तुमचा मुक्काम कायम ठेवा — तुमचा प्रवेश निश्चित आहे!',
    spTwinsHighwayDelay: '~२.५ तासांचा महामार्ग विलंब टाळला',
    spTwinsExploreBtnPrefix: 'पहा',
    spPracticalInfoEyebrow: 'स्थानिक व्यावहारिक माहिती',
    spPracticalInfoTitle: 'प्रमुख आकर्षणे व नागरी सुविधा',
    spHighlightsWithinPrefix: 'मधील ठळक वैशिष्ट्ये',
    spOsmVerified: 'OSM Overpass सत्यापित नागरी ठिकाणे',
    spGettingThere: 'तिथे कसे पोहोचावे व रस्ता स्थिती',
    spPrimaryRoute: 'मुख्य मार्ग:',
    spLiveEta: 'थेट अंदाजित वेळ:',
    spChokeAdvisoryLabel: 'अडथळा सूचना:',
    spHospitalityEyebrow: 'आदरातिथ्य व मुक्काम',
    spVerifiedStaysTitle: 'सत्यापित मुक्काम व होमस्टे',
    spMtdcPrioritized: 'MTDC मान्यताप्राप्त इको-भागीदारांना शाश्वततेसाठी प्राधान्य',
    spMtdcPartnerBadge: 'MTDC भागीदार',
    spPerNight: '/ रात्र',
    spBookItineraryBtn: 'ट्रिप प्लॅनरमध्ये मुक्कामासह सहल-योजना बुक करा →',
    spCheckInsEyebrow: 'सामुदायिक ग्राउंड टेलीमेट्री',
    spCheckInsTitlePrefix: 'अलीकडील पर्यटक चेक-इन व अहवाल',
    spCheckInBtn: 'येथे चेक-इन करा (गर्दी कळवा)',
    spNoCheckIns: 'आज अजून कोणतेही सामुदायिक चेक-इन नाही. जमिनीवरील स्थिती सत्यापित करणारे पहिले प्रवासी व्हा!',
    spCongestionLabel: 'गर्दी:',
    spLightPleasant: 'हलकी / आल्हाददायक',
    spModerateLevel: 'मध्यम',
    spHeavyGridlock: 'तीव्र वाहतूक कोंडी',
    spGeofenceVerified: 'जिओफेन्स सत्यापित',
    spCheckInModalTitle: 'सामुदायिक चेक-इन',
    spCheckInModalDescPrefix: 'येथून कळवत आहात',
    spCheckInModalDescSuffix: '? जमिनीवरील सध्याची गर्दी स्वतः कळवून सहप्रवाशांना मदत करा.',
    spCongestionScaleLabel: 'दिसलेली गर्दी (१ = रिकामे, ५ = तीव्र कोंडी):',
    spOptionalNoteLabel: 'ऐच्छिक टीप (उदा. पार्किंग स्थिती, रस्ता स्थिती):',
    spNotePlaceholder: 'स्वच्छ पायवाटा, तलावाजवळ भरपूर पार्किंग जागा…',
    spGeofenceNote: 'वैध टेलीमेट्री भारासाठी जिओफेन्स सत्यापन आपोआप लागू.',
    spCancelBtn: 'रद्द करा',
    spSubmitCheckInBtn: 'चेक-इन सबमिट करा',
    spShareModalTitle: 'थेट स्थळ स्थिती सामायिक करा',
    spShareCardDescPrefix: 'सध्या',
    spShareCardDescMid: 'वहन क्षमतेवर सुरू आहे, अंदाजित प्रतीक्षा वेळ',
    spShareFooter: 'इकोरूट भारत • पर्यटन मंत्रालय',
    spWhatsAppShareBtn: 'व्हॉट्सअॅपद्वारे सामायिक करा',
    spCopyShareBtn: 'सामायिक मजकूर व लिंक कॉपी करा',
    spCopiedBtn: '✓ लिंक व सारांश कॉपी झाले!',

    ftpTitle: 'भविष्यातील सहल व गर्दीमुक्त सहल-योजना नियोजक',
    ftpBadgeAiScheduler: 'एआय स्मार्ट शेड्युलर',
    ftpBadgeBackendApi: '✅ बॅकएंड एपीआय',
    ftpBadgeOffline: '📵 ऑफलाइन मोड',
    ftpSubtitle: 'एआय-अंदाजित गर्दी आलेख व संतुलित बहु-दिवसीय सहल-योजनांसह आगामी सुट्ट्यांचे नियोजन करा, ९०% कॉरिडोर अडथळे टाळण्यासाठी',
    ftpSaveBtn: '💾 माझ्या पासमध्ये जतन करा (+१५० कर्मा)',
    ftpSavingBtn: 'जतन करत आहे...',
    ftpReportBtn: '📄 एआय तपासणी अहवाल',
    ftpPrintBtn: 'प्रिंट / योजना निर्यात करा',
    ftpViewInPasses: 'माझ्या पासमध्ये पहा',
    ftpDestLabel: 'स्थळ केंद्र / फोकस:',
    ftpDateLabel: 'नियोजित प्रवास तारीख:',
    ftpDurationLabel: 'सहल कालावधी:',
    ftpStyleLabel: 'प्रवास पसंती:',
    ftpStyleScenic: 'आरामदायी व निसर्गरम्य', ftpStyleAdventure: 'साहस व ट्रेकिंग', ftpStyleFamily: 'कौटुंबिक अनुकूल', ftpStyleBudget: 'किफायती व शाश्वत',
    ftpMobilityLabel: 'गतिशीलता मोड (३०% भार):',
    ftpMobilityGreen: '🌿 ग्रीन ट्रिप: बस/रेल्वे + स्थानिक चालक', ftpMobilityUltraGreen: '⚡ अल्ट्रा-ग्रीन: इलेक्ट्रिक रेल्वे + ई-शटल', ftpMobilityPersonalCar: '🚗 वैयक्तिक पेट्रोल / डिझेल कार',
    ftpStayLabel: 'मुक्काम प्रकार (२०% भार):',
    ftpStayHomestay: '🏠 मान्यताप्राप्त MTDC ग्रामीण होमस्टे', ftpStayHotel: '🏨 व्यावसायिक रिसॉर्ट / चेन हॉटेल',
    ftpConventionalHotspots: 'पारंपरिक हॉटस्पॉट (उदा. लोणावळा)',
    ftpPredictedCrowdLoadPrefix: 'अंदाजित गर्दी भार:',
    ftpHeavyTraffic: '🔴 तीव्र वाहतूक कोंडी',
    ftpModerateCrowds: '🟡 मध्यम गर्दी',
    ftpDecongestedTwin: 'एआय-गर्दीमुक्त जुळा मार्ग (उदा. माथेरान व भंडारदरा)',
    ftpComfortableSuffix: '(आरामदायक)',
    ftpZeroDelays: '🟢 शून्य तपासणी विलंब',
    ftpSustainabilityTitle: 'सहल शाश्वतता व कार्बन ऑफसेट',
    ftpPillar1Badge: 'आधारस्तंभ १ पर्यावरणीय गाभा',
    ftpSustainabilityDesc: 'गतिशीलता निवड, इको-होमस्टे, कचरा शिस्त, व ग्रामीण आर्थिक गुंतवणुकीवर आधारित बहु-घटक शाश्वतता निर्देशांक.',
    ftpEnvironmental: '🌱 पर्यावरणीय',
    ftpSocialCultural: '👥 सामाजिक व सांस्कृतिक',
    ftpLocalEconomic: '💰 स्थानिक आर्थिक',
    ftpCarbonReductionTitle: 'ही योजना पाळल्याने कार्बन फूटप्रिंटमध्ये घट',
    ftpRoundTripDistance: 'राउंड-ट्रिप अंतर',
    ftpSoloCarBaseline: 'पारंपरिक एकल कार आधाररेषा:',
    ftpEcoRoutePlanned: '🌿 इकोरूट नियोजित:',
    ftpCarbonSavedSuffix: 'कार्बन वाचवले',
    ftpTreesAbsorption: 'वृक्ष शोषण',
    ftpTreesDesc: '१ वर्षासाठी CO₂ शोषणारे देशी वृक्ष',
    ftpFuelSaved: 'जीवाश्म इंधन बचत',
    ftpFuelDesc: 'पेट्रोल / डिझेल इंधन जतन',
    ftpIdlingAvoided: 'निष्क्रिय वेळ टाळला',
    ftpIdlingDesc: 'घाट अडथळ्यातील निष्क्रिय वेळ रोखला',
    ftpLocalInjection: 'स्थानिक गुंतवणूक',
    ftpLocalInjectionDesc: 'ग्रामीण होमस्टे व चालक संघांसाठी',
    ftpAiInsightsTitle: 'एआय इको-क्युरेटर अंतर्दृष्टी व कार्बन घट रणनीती',
    ftpAiCarbonWhyTitle: 'ही योजना कार्बन का कमी करते',
    ftpAiCommunityTitle: 'समुदाय व उपजीविका लाभ',
    ftpGreenModeTitle: '🌱 ग्रीन ट्रिप मोड: पार्क अँड राइड स्थानिक गतिशीलता प्रोटोकॉल',
    ftpGreenModeDesc: 'वळणदार उंचावरील रस्त्यांवर वैयक्तिक वाहने चालवण्याऐवजी, नियुक्त एक्स्प्रेसवे परिघ केंद्रांवर (वलवण / दस्तुरी / वाई) पार्क करा. सत्यापित स्थानिक चालक, ई-शटल, किंवा सायकलवर स्विच करा. यामुळे घाट कोंडी ४०% कमी होते, स्वच्छ डोंगरी हवेचे रक्षण होते, व थेट स्थानिक चालक संघांना उत्पन्न मिळते.',
    ftpOptimizedItineraryTitle: 'अनुकूलित स्मार्ट सहल-योजना',
    ftpAvoidsDelayBadge: '🌿 ~२.५ तासांचा वाहतूक विलंब टाळतो • सोपी पार्किंग निश्चित',
    ftpReportModalTitle: 'अधिकृत शाश्वतता व कार्बन तपासणी अहवाल',
    ftpReportModalSubtitle: 'इकोरूट भारत बहु-भागधारक इंटेलिजन्स इंजिनद्वारे प्रमाणित',
    ftpGeneratingReport: 'Google Gemini 2.0 Flash सह अधिकृत तपासणी अहवाल तयार करत आहे...',
    ftpReportValidNote: 'ग्रीन पास मान्यता व MTDC कार्बन सवलतीसाठी वैध',
    ftpPrintSaveBtn: 'प्रिंट / पीडीएफ जतन करा',
    ftpCloseBtn: 'बंद करा',
    ftpSocialSubLabel: 'पवित्र देवराया व स्थानिक मार्गदर्शक',
    ftpDecongestedSchedule: 'गर्दीमुक्त वेळापत्रक',

    ppEyebrow: 'तुमच्या प्रवासाचे नियोजन करा',
    ppTitle: 'सहल नियोजक',
    ppSubtitle: 'तुमची स्थळे, प्रवास तारखा व आवड निवडा — आम्ही राउंड-ट्रिप वेळापत्रक व कमी-गर्दीचा इको-फ्रेंडली पर्याय तयार करू.',
    ppPreferencesLabel: 'पसंती',
    ppSpotsLabel: 'स्थळांचा संग्रह',
    ppSpotsPlaceholder: 'भेट देण्यासाठी स्थळे निवडा...',
    ppSpotsSearchPlaceholder: 'स्थळे शोधा...',
    ppScheduleLabel: 'वेळापत्रक',
    ppStartDateLabel: 'सुरुवात तारीख',
    ppEndDateLabel: 'शेवट तारीख',
    ppGenerateBtn: 'सहल योजना तयार करा',
    ppLocationRequesting: 'तुमचे स्थान शोधत आहे…',
    ppLocationGranted: 'तुमचे सध्याचे स्थान वापरत आहे',
    ppLocationFallback: 'अंदाजे हब अंतर वापरत आहे (स्थान अनुपलब्ध)',
    ppSelectSpotsHint: 'पुढे जाण्यासाठी किमान एक स्थळ निवडा',
    ppNoSpotsSelected: 'अजून कोणतेही स्थळ निवडलेले नाही',
    ppAllDestinations: 'सर्व स्थळे',
    ppSelectedSuffix: 'निवडले',
    ppOutputEyebrow: 'तुमची तयार योजना',
    ppTripTimelineTitle: 'सहल वेळरेषा',
    ppTripTimelineDesc: 'तुमची निवडलेली स्थळे, तुमच्या स्थानापासून कमीत कमी फेरफटका होण्यासाठी राउंड-ट्रिप क्रमाने मांडलेली.',
    ppEcoTimelineTitle: 'इको-फ्रेंडली वेळरेषा',
    ppEcoTimelineDesc: 'प्रत्येक स्थळ त्याच्या कमी-गर्दीच्या जुळ्या स्थळाने बदलले, व नव्या राउंड-ट्रिप क्रमाने पुन्हा मांडले.',
    ppReplacesLabel: 'च्या जागी',
    ppNoTwinFound: 'कमी-गर्दीचा पर्याय उपलब्ध नाही — मूळ स्थळ ठेवले',
    ppDayLabel: 'दिवस',
    ppFreeDayLabel: 'मोकळा दिवस / प्रवास कालावधी',
    ppSummaryTitle: 'CO2 व तपशीलांचा सारांश',
    ppSummaryDistance: 'एकूण अंतर',
    ppSummaryCo2: 'अंदाजित CO2e',
    ppSummaryCo2Saved: 'इको मार्गाने वाचवलेले CO2',
    ppSummaryOriginalRoute: 'मानक मार्ग',
    ppSummaryEcoRoute: 'इको-फ्रेंडली मार्ग',
    ppSummaryCrowdReduction: 'सरासरी गर्दी घट',
    ppSummaryDates: 'प्रवास तारखा',
    ppSummaryPreferences: 'पसंती',
    ppSharePrintTitle: 'सामायिक करण्यायोग्य प्रिंट',
    ppPrintBtn: 'प्रिंट करा',
    ppCopyBtn: 'सारांश कॉपी करा',
    ppCopiedBtn: 'कॉपी झाले!',
    ppWhatsAppBtn: 'व्हॉट्सअॅपवर सामायिक करा',
    ppEditPlanBtn: 'योजना संपादित करा',
    ppKmSuffix: 'किमी'
  }
};
