import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Gift
} from 'lucide-react';
import type { Destination, Promotion } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';

interface OffPeakIncentiveCardProps {
  destination: Destination;
  promotions: Promotion[];
}

export const OffPeakIncentiveCard: React.FC<OffPeakIncentiveCardProps> = ({
  destination,
  promotions
}) => {
  const { addPromotion, deletePromotion } = useCorridorStore();

  const [discountPct, setDiscountPct] = useState<number>(25);
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<Promotion['businessType']>('Homestay');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Filter promos for current destination
  const activeDestinationPromos = promotions.filter(p => p.destinationId === destination.id);

  const handleQuickPreset = (pct: number, badgeText: string, titleText: string, codeText: string) => {
    setDiscountPct(pct);
    setBadge(badgeText);
    setTitle(titleText);
    setCode(codeText);
    setDescription(`Special off-peak decongestion benefit: Save ${pct}% when booking direct this weekend.`);
    setBusinessName(`${destination.name.split(' ')[0]} Eco-Hospitality Guild`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    addPromotion({
      destinationId: destination.id,
      destinationName: destination.name,
      discountPct,
      title: title.trim(),
      badge: badge.trim() || `Flat ${discountPct}% Off`,
      description: description.trim() || `Special off-peak incentive in ${destination.name}.`,
      code: code.trim().toUpperCase(),
      validUntil: 'Valid this weekend',
      businessName: businessName.trim() || 'Verified Local Partner',
      businessType
    });

    setTitle('');
    setBadge('');
    setDescription('');
    setCode('');
    setBusinessName('');
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Off-Peak Incentive & Reroute Promotion Dispatcher
            </h3>
            <p className="text-xs text-slate-500">
              Publish seasonal discounts for <strong>{destination.name}</strong> to attract rerouted tourists from overloaded hotspots
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
          Twin Nudge Synchronized
        </span>
      </div>

      {/* Quick Fill Presets */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          One-Click Promotion Templates
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickPreset(25, 'Flat 25% Off Homestays', 'Lakeside Heritage Stay Promo', 'HOMESTAY25')}
            className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs transition"
          >
            <strong className="text-slate-800 block">🏡 25% Homestay Rebate</strong>
            <span className="text-[11px] text-slate-500">HOMESTAY25</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset(30, '30% Off Watersport Combo', 'Adventure & Kayak Special', 'ADVENTURE30')}
            className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs transition"
          >
            <strong className="text-slate-800 block">🚣 30% Adventure Pass</strong>
            <span className="text-[11px] text-slate-500">ADVENTURE30</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset(20, '20% Eco-Lodge Cashback', 'Green Forest Stay Voucher', 'ECOPASS20')}
            className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs transition"
          >
            <strong className="text-slate-800 block">🌿 20% Eco-Lodge Pass</strong>
            <span className="text-[11px] text-slate-500">ECOPASS20</span>
          </button>
        </div>
      </div>

      {/* Promotion Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Discount % */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Discount %
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={60}
                required
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-600">%</span>
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Service Category
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as Promotion['businessType'])}
              aria-label="Service Category"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Homestay">🏡 Local Homestay</option>
              <option value="Resort">🏨 Eco Resort & Spa</option>
              <option value="Adventure Trek">🧗 Trek & Watersports</option>
              <option value="Local Dining">🍲 Authentic Cuisine / Cafe</option>
              <option value="Eco-Pass">🎫 Government Eco-Pass</option>
            </select>
          </div>

          {/* Promo Code */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DECONGEST25"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-emerald-700 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Promotion Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Arthur Lake Homestay & Free Nature Trek"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Badge Tagline
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 25% Off + Free Firefly Walk"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
            Offer Description
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Escape the crowd! Book direct with verified local homestays with complimentary breakfast."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-1">
          {publishSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Promotion active & visible on Tourist Twin Cards!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Immediately appears on mobile reroute recommendation cards
            </span>
          )}

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Incentive Deal</span>
          </button>
        </div>
      </form>

      {/* Active Deals for this destination */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Active Published Deals for {destination.name} ({activeDestinationPromos.length})
        </h4>

        {activeDestinationPromos.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No custom promotions published for this destination yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeDestinationPromos.map((promo) => (
              <div
                key={promo.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs flex items-start justify-between gap-2 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <strong className="text-amber-950 font-bold">{promo.title}</strong>
                    <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                      {promo.code}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{promo.description}</p>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    {promo.badge} • {promo.businessName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => deletePromotion(promo.id)}
                  title="Remove Promotion"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
