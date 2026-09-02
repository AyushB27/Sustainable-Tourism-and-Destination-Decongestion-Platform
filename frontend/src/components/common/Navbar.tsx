import React, { useState } from 'react';
import { 
  Compass, 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  RotateCcw,
  TrendingDown,
  Languages,
  Menu,
  X,
  PhoneCall,
  AlertTriangle
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { PresetScenario } from '../../store/useCorridorStore';
import { calculateCorridorMetrics } from '../../lib/engine';
import type { UserRole } from '../../types';
import type { Language } from '../../lib/i18n';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    destinations,
    advisories,
    activeScenario,
    applyPresetScenario,
    resetToDefault,
    divertedTripsCount,
    totalCarbonSavedKg,
    language,
    setLanguage
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState<'sm' | 'md' | 'lg'>('md');

  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const metrics = calculateCorridorMetrics(destinations, activeAdvisoriesCount);

  const scenarioLabels: Record<PresetScenario, string> = {
    monsoon_surge: '⛈️ Monsoon Weekend Surge (Lonavala Peak)',
    khandala_landslide: '⚠️ Rockfall Alert (Khandala Emergency)',
    normal_balanced: '🌱 Balanced Decongested Corridor',
    coastal_rush: '🏖️ Coastal Weekend Surge (Alibaug Rush)'
  };

  const languages: { key: Language; label: string; flag: string }[] = [
    { key: 'en', label: 'English', flag: '🇬🇧' },
    { key: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { key: 'mr', label: 'मराठी', flag: '🚩' },
  ];

  const handleFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSizeScale(size);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${size}`);
  };

  const navItems: { key: UserRole; labelEn: string; labelHi: string; labelMr: string; icon: React.ReactNode; badge?: string }[] = [
    {
      key: 'tourist',
      labelEn: 'Citizen & Tourist Portal',
      labelHi: 'नागरिक व पर्यटक सेवा',
      labelMr: 'नागरिक व पर्यटक सेवा',
      icon: <Compass className="w-4 h-4" />
    },
    {
      key: 'authority',
      labelEn: 'District GIS Command Center',
      labelHi: 'जिला आपदा व भीड़ नियंत्रण कक्ष',
      labelMr: 'जिल्हा आपत्ती व गर्दी नियंत्रण कक्ष',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: metrics.criticalCount > 0 ? `${metrics.criticalCount} Red Alert` : undefined
    },
    {
      key: 'provider',
      labelEn: 'Tourism Providers & Homestays',
      labelHi: 'पर्यटन सेवा प्रदाता केंद्र',
      labelMr: 'पर्यटन सेवा प्रदाता केंद्र',
      icon: <Building2 className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* 1. National Flag Top Accent Stripe */}
      <div className="tiranga-bar" />

      {/* 2. Top Accessibility & Official Helpline Strip */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 py-1 text-[11px] sm:text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Government Ownership Statement */}
        <div className="flex items-center gap-2 font-medium">
          <span className="text-gov-navy font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gov-green" />
            भारत सरकार | Government of India
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-600 hidden md:inline">
            पर्यटन मंत्रालय | Ministry of Tourism
          </span>
        </div>

        {/* Right: Accessibility Controls, Helpline & Language */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Emergency Helplines */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-semibold text-gov-maroon bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <PhoneCall className="w-3 h-3 text-rose-600" />
            <span>24x7 Tourist Helpline: <strong>1363</strong></span>
            <span className="text-rose-300">|</span>
            <span>Emergency: <strong>112</strong></span>
          </div>

          {/* Text Size Resizer (GIGW Compliant) */}
          <div className="flex items-center bg-white rounded border border-slate-300 overflow-hidden text-[10px] font-bold">
            <button
              onClick={() => handleFontSize('sm')}
              className={`px-1.5 py-0.5 hover:bg-slate-100 ${fontSizeScale === 'sm' ? 'bg-gov-navy text-white' : 'text-slate-700'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSize('md')}
              className={`px-1.5 py-0.5 border-x border-slate-200 hover:bg-slate-100 ${fontSizeScale === 'md' ? 'bg-gov-navy text-white' : 'text-slate-700'}`}
              title="Normal Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontSize('lg')}
              className={`px-1.5 py-0.5 hover:bg-slate-100 ${fontSizeScale === 'lg' ? 'bg-gov-navy text-white' : 'text-slate-700'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-300">
            <Languages className="w-3 h-3 text-gov-navy" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Language Selector"
              className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Baseline Button */}
          <button
            onClick={resetToDefault}
            title="Reset system to default corridor baseline"
            className="flex items-center gap-1 text-slate-500 hover:text-gov-navy px-1.5 py-0.5 rounded hover:bg-slate-200 transition text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 3. Main Indian Government Brand Header */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Official Emblem & Portal Title */}
          <div className="flex items-center gap-3">
            {/* Ashoka Lion Capital Representation */}
            <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 border border-slate-300 rounded-lg shadow-sm">
              <div className="w-8 h-8 flex items-center justify-center text-gov-navy font-serif font-black text-sm border-2 border-gov-navy rounded-full bg-amber-50">
                🏛️
              </div>
              <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5">
                सत्यमेव जयते
              </span>
            </div>

            {/* Bilingual Header Titles */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-xl text-gov-navy tracking-tight leading-tight">
                  {language === 'hi'
                    ? 'सुगम पर्यटन व गंतव्य भार प्रबंधन प्रणाली'
                    : language === 'mr'
                    ? 'सुगम पर्यटन व गर्दी नियंत्रण प्रणाली'
                    : 'EcoRoute Bharat — Sustainable Tourism Platform'}
                </h1>
                <span className="hidden sm:inline bg-gov-green/10 text-gov-green text-[10px] font-bold px-2 py-0.5 rounded border border-gov-green/30 uppercase">
                  Govt. of India
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                {language === 'hi'
                  ? 'पर्यटन मंत्रालय, भारत सरकार व महाराष्ट्र पर्यटन विकास महामंडळ (MTDC)'
                  : language === 'mr'
                  ? 'पर्यटन मंत्रालय, भारत सरकार व महाराष्ट्र पर्यटन (MTDC)'
                  : 'Ministry of Tourism, Govt. of India • Western Ghats Decongestion Initiative'}
              </p>
            </div>
          </div>

          {/* Right Badges & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-3">
            {/* National Initiative Badges (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <span className="text-[10px] font-bold text-amber-900 block leading-none">Incredible !ndia</span>
                <span className="text-[8px] text-amber-700">अतुल्य भारत</span>
              </div>
              <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <span className="text-[10px] font-bold text-emerald-900 block leading-none">Dekho Apna Desh</span>
                <span className="text-[8px] text-emerald-700">देखो अपना देश</span>
              </div>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gov-navy text-white hover:bg-gov-navy-light focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Deep Navy Primary Government Navigation Bar */}
      <nav className="bg-gov-navy text-white shadow-inner hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Main Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = role === item.key;
              const title = language === 'hi' ? item.labelHi : language === 'mr' ? item.labelMr : item.labelEn;
              return (
                <button
                  key={item.key}
                  onClick={() => setRole(item.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold transition border-b-2 ${
                    isActive
                      ? 'bg-gov-navy-dark text-amber-300 border-gov-gold shadow-sm'
                      : 'text-slate-200 border-transparent hover:bg-gov-navy-light hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{title}</span>
                  {item.badge && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Simulation & Corridor Status */}
          <div className="flex items-center gap-3 py-1.5">
            {/* Quick Simulation Scenario */}
            <div className="flex items-center gap-1.5 bg-gov-navy-dark/90 px-2.5 py-1 rounded border border-slate-700 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-gov-gold shrink-0" />
              <span className="text-slate-300 text-[11px] font-medium hidden xl:inline">Scenario:</span>
              <select
                value={activeScenario}
                onChange={(e) => applyPresetScenario(e.target.value as PresetScenario)}
                aria-label="Corridor Simulation Scenario"
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {Object.entries(scenarioLabels).map(([key, label]) => (
                  <option key={key} value={key} className="bg-gov-navy text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Carbon & Diversions Counter */}
            <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded text-xs font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>{divertedTripsCount}</strong> Diversions ({totalCarbonSavedKg.toFixed(0)} kg CO₂ Saved)</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Live Public Broadcast Gazette / Corridor Status Ticker */}
      <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-6 py-1.5 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-4xl overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            राजपत्र बुलेटिन | LIVE GAZETTE
          </span>
          <span className="text-slate-700 font-medium truncate">
            {metrics.criticalCount > 0
              ? `⚠️ Western Ghats Corridor Alert: ${metrics.criticalCount} destinations exceeding physical carrying capacity (DCC > 0.85). Diversions active for Lonavala & Mahabaleshwar.`
              : `✅ Corridor Traffic Flow Optimal. Green corridors open with no checkpoint queuing delays across Western Ghats.`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>Active Influx: <strong className="text-gov-navy">{metrics.totalInflow.toLocaleString()}</strong></span>
          <span>Red Zones: <strong className={metrics.criticalCount > 0 ? 'text-rose-600 font-bold' : 'text-gov-green'}>{metrics.criticalCount} ({metrics.redPercentage}%)</strong></span>
        </div>
      </div>

      {/* 6. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gov-navy border-b border-gov-navy-dark px-4 py-4 space-y-3 text-white animate-in slide-in-from-top duration-200">
          <div className="text-xs font-bold text-gov-gold uppercase tracking-wider pb-1 border-b border-slate-700">
            पोर्टल सेवा चयन | Select Portal
          </div>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = role === item.key;
              const title = language === 'hi' ? item.labelHi : language === 'mr' ? item.labelMr : item.labelEn;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setRole(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-gov-navy-dark text-amber-300 border border-gov-gold'
                      : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{title}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Scenario Selector */}
          <div className="pt-3 border-t border-slate-700 space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              सिमुलेशन मोड | Simulation Mode:
            </label>
            <select
              value={activeScenario}
              onChange={(e) => {
                applyPresetScenario(e.target.value as PresetScenario);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-medium"
            >
              {Object.entries(scenarioLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Emergency Contacts in Drawer */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
            <span>Helpline: <strong className="text-white">1363</strong></span>
            <span>Emergency: <strong className="text-rose-400">112</strong></span>
            <button
              onClick={resetToDefault}
              className="text-amber-300 underline font-semibold"
            >
              Reset Baseline
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
