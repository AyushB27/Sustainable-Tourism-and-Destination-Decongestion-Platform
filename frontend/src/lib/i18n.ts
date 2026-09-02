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
    timeSlotTitle: 'Smart Hourly Time-Slot Recommendation & Entry Flow'
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
    timeSlotTitle: 'स्मार्ट समय-स्लॉट सिफारिश एवं प्रवेश प्रवाह'
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
    timeSlotTitle: 'स्मार्ट वेळ स्लॉट शिफारस व प्रवेश व्यवस्थापन'
  }
};
