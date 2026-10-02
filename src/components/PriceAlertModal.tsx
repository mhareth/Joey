import React, { useState } from 'react';
import { Property, PriceAlert } from '../types';
import { 
  Bell, 
  X, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  Mail, 
  MessageSquare, 
  Smartphone,
  ShieldCheck,
  TrendingDown,
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PriceAlertModalProps {
  property?: Property | null;
  searchCriteria?: {
    district: string;
    propertyType: string;
    maxBudget: number;
  } | null;
  onClose: () => void;
  onSaveAlert: (alert: PriceAlert) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  property,
  searchCriteria,
  onClose,
  onSaveAlert,
}) => {
  const isPropertySpecific = Boolean(property);
  const currentPrice = property ? property.price : (searchCriteria?.maxBudget || 6000000);
  
  const [selectedDropPercent, setSelectedDropPercent] = useState<number>(5);
  const [customTargetPrice, setCustomTargetPrice] = useState<number>(
    Math.round(currentPrice * 0.95)
  );
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('m.hareth@gmail.com');
  const [phone, setPhone] = useState<string>('+966 50 123 4567');
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    whatsapp: true,
  });
  const [frequency, setFrequency] = useState<'instant' | 'daily'>('instant');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectPreset = (percent: number) => {
    setSelectedDropPercent(percent);
    setIsCustom(false);
    setCustomTargetPrice(Math.round(currentPrice * (1 - percent / 100)));
  };

  const handleCustomPriceChange = (val: number) => {
    setCustomTargetPrice(val);
    setIsCustom(true);
    const drop = Math.max(0, ((currentPrice - val) / currentPrice) * 100);
    setSelectedDropPercent(Math.round(drop * 10) / 10);
  };

  const calculatedSavings = Math.max(0, currentPrice - customTargetPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      type: isPropertySpecific ? 'property' : 'criteria',
      propertyId: property?.id,
      propertyTitle: property?.title,
      propertyImage: property?.images[0],
      district: property?.district || searchCriteria?.district || 'Riyadh',
      propertyType: property?.propertyType || searchCriteria?.propertyType || 'All Types',
      initialPrice: currentPrice,
      currentPrice: currentPrice,
      targetPrice: customTargetPrice,
      targetDropPercent: selectedDropPercent,
      email,
      channels,
      frequency,
      active: true,
      createdAt: new Date().toISOString(),
      isTriggered: false,
    };

    onSaveAlert(newAlert);
    setSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>تنبيه انخفاض السعر</span>
                <span className="text-xs text-amber-400 font-mono-num font-normal">Set Price Alert</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isPropertySpecific 
                  ? property?.title 
                  : `عقارات ${searchCriteria?.district || 'شمال الرياض'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Property summary or Criteria banner */}
            {isPropertySpecific && property && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{property.title}</h4>
                  <p className="text-[11px] text-slate-400">{property.district} • {property.sqm} m²</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs text-slate-400">Current Price:</span>
                    <span className="text-sm font-extrabold text-amber-300 font-mono-num">
                      SAR {property.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isPropertySpecific && searchCriteria && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Search Criteria Alert (تنبيه معايير البحث)
                </span>
                <p className="text-slate-200">
                  حي: <strong>{searchCriteria.district}</strong> • نوع العقار: <strong>{searchCriteria.propertyType}</strong>
                </p>
                <p className="text-slate-400">
                  سقف الميزانية الحالي: <strong className="text-white font-mono-num">SAR {searchCriteria.maxBudget.toLocaleString()}</strong>
                </p>
              </div>
            )}

            {/* Threshold Selector: Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                اختر نسبة أو قيمة انخفاض السعر المطلوبة:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 8, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleSelectPreset(pct)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                      !isCustom && selectedDropPercent === pct
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div>-{pct}%</div>
                    <div className="text-[10px] font-mono-num font-normal opacity-85">
                      SAR {Math.round((currentPrice * pct) / 100 / 1000)}k
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Price in SAR */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs font-semibold text-slate-300">
                  السعر المستهدف للتنبيه (Target Price)
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono-num">
                  توفير SAR {calculatedSavings.toLocaleString()} (-{selectedDropPercent}%)
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  SAR
                </span>
                <input
                  type="number"
                  step={25000}
                  value={customTargetPrice}
                  onChange={(e) => handleCustomPriceChange(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white font-mono-num focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Channels & Notifications */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-300">
                قنوات التنبيه الفوري:
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  channels.inApp ? 'bg-amber-500/10 border-amber-500/40 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={channels.inApp}
                    onChange={(e) => setChannels({ ...channels, inApp: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>في التطبيق</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  channels.email ? 'bg-amber-500/10 border-amber-500/40 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>بريد إلكتروني</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  channels.whatsapp ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span>واتساب / SMS</span>
                </label>
              </div>
            </div>

            {/* Contact Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Notification Frequency */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                توقيت الإشعار:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFrequency('instant')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    frequency === 'instant'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فوري (موصى به)
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('daily')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    frequency === 'daily'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ملخص صباحي
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all active:scale-95"
            >
              <Bell className="w-4 h-4" />
              تفعيل تنبيه انخفاض السعر • Set Alert
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-5 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">
                تم تفعيل تنبيه السعر بنجاح!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                سنقوم بإشعارك فوراً عبر التطبيق، والبريد الإلكتروني <strong>{email}</strong>، والواتساب بمجرد قيام البائع أو الوسيط بتحديث السعر إلى <strong>SAR {customTargetPrice.toLocaleString()}</strong> أو أقل.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono-num text-slate-400">
              <div className="flex justify-between">
                <span>السعر الأصلي:</span>
                <span className="text-white">SAR {currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>السعر المستهدف:</span>
                <span className="text-emerald-400 font-bold">SAR {customTargetPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>مقدار التوفير:</span>
                <span className="text-amber-300 font-bold">SAR {calculatedSavings.toLocaleString()} (-{selectedDropPercent}%)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            >
              تم وإغلاق
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
