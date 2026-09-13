import React, { useRef, useEffect } from 'react';
import { Award, ShieldCheck, Download, Printer, X, Trees, Leaf, CheckCircle2 } from 'lucide-react';

interface GreenCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelerName?: string;
  destinationName?: string;
  carbonSavedKg?: number;
  dateStr?: string;
  certificateId?: string;
}

export const GreenCertificateModal: React.FC<GreenCertificateModalProps> = ({
  isOpen,
  onClose,
  travelerName = 'Eco-Conscious Traveler',
  destinationName = 'Western Ghats Eco-Corridor',
  carbonSavedKg = 18.5,
  dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  certificateId = `CERT-MH-${Math.floor(100000 + Math.random() * 900000)}`
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Equivalent trees planted metric
  const treesEquiv = Math.max(1, Math.round(carbonSavedKg / 2.2));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400/80 print:border-none print:shadow-none print:max-w-none"
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span id="cert-modal-title" className="font-bold text-sm">Official MTDC Green Yatra Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div ref={printRef} className="p-8 sm:p-12 space-y-6 text-center bg-gradient-to-b from-amber-50/50 via-white to-emerald-50/40 relative">
          {/* Watermark Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <Trees className="w-96 h-96 text-emerald-950" />
          </div>

          {/* Header Logos & Government Emblem */}
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Government of Maharashtra • Directorate of Tourism</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 pt-2">
              GREEN YATRA RECOGNITION
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Sahyadri Ecological Stewardship Citation
            </p>
          </div>

          {/* Certificate Citation */}
          <div className="space-y-3 relative z-10 max-w-lg mx-auto">
            <p className="text-xs text-slate-600 italic">This is officially presented to</p>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 border-b-2 border-dashed border-amber-400 pb-2">
              {travelerName}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              for actively choosing low-emission public transit, zero-waste discipline, and accredited community homestays while traveling through the fragile Western Ghats corridor of{' '}
              <strong className="text-slate-900 font-extrabold">{destinationName}</strong>.
            </p>
          </div>

          {/* Environmental Impact Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10 max-w-lg mx-auto pt-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="text-xl font-black text-emerald-800">
                {carbonSavedKg} <span className="text-xs font-normal">kg</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-emerald-900">
                CO2e Avoided
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="text-xl font-black text-amber-800">
                {treesEquiv} <span className="text-xs font-normal">trees</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-amber-900">
                Forest Offset Equiv
              </div>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl col-span-2 sm:col-span-1">
              <div className="text-xl font-black text-sky-800">
                100%
              </div>
              <div className="text-[10px] uppercase font-bold text-sky-900">
                Zero-Waste Verified
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 items-end relative z-10 text-left">
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-slate-500">
                Issued Date: <strong className="text-slate-800">{dateStr}</strong>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Verification Hash: <strong className="text-slate-800">{certificateId}</strong>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Digitally Authenticated on MTDC Registry</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block border-b border-slate-400 pb-1 px-4 text-xs font-serif italic text-slate-700">
                Virendra Singh, IAS
              </div>
              <div className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                Director of Tourism
              </div>
              <div className="text-[9px] text-slate-500">
                Maharashtra Tourism Development Corporation
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (hidden in print) */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 print:hidden flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eligible for 20% Rebate at MTDC Partner Lodges</span>
          </span>
          <button
            onClick={handlePrint}
            className="text-amber-800 font-bold hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download High-Res PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
