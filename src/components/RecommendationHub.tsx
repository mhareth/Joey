import React, { useState } from 'react';
import { Property, BuyerProfile } from '../types';
import { 
  Sparkles, 
  Target, 
  DollarSign, 
  MapPin, 
  Eye, 
  MessageSquare, 
  FileText,
  Loader2,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface RecommendationHubProps {
  properties: Property[];
  onOpenVirtualTour: (property: Property) => void;
  onOpenAgentChat: (property: Property) => void;
  onOpenDocumentPrep: (property: Property) => void;
  onOpenPriceAlert?: (property: Property) => void;
  onApplyRecommendations: (updatedProperties: Property[]) => void;
}

const RIYADH_AMENITY_OPTIONS = [
  'Private Elevator (مصعد إيطالي)',
  'Private Pool (مسبح خاص)',
  'Driver Room (غرفة سائق)',
  'Maid Quarter (غرفة خادمة)',
  'Rooftop Majlis (جلسة سطح فاخرة)',
  'Smart Home KNX (تحكم ذكي)',
  '10-Yr Malath Insurance (تأمين ملاذ)',
  'Sakani Subsidized (مدعوم سكني)',
  'Basement Cinema (قبو وسينما)',
  'Near KAFD & Metro (قريب من كافد والقطار)'
];

export const RecommendationHub: React.FC<RecommendationHubProps> = ({
  properties,
  onOpenVirtualTour,
  onOpenAgentChat,
  onOpenDocumentPrep,
  onOpenPriceAlert,
  onApplyRecommendations,
}) => {
  const [profile, setProfile] = useState<BuyerProfile>({
    budgetMin: 3000000,
    budgetMax: 8500000,
    downPaymentPercent: 15,
    preferredDistricts: ['Hittin', 'Al Malqa', 'KAFD'],
    minBeds: 5,
    minBaths: 5,
    propertyTypes: ['Contemporary Palace', 'Luxury Modern Villa', 'KAFD Sky Penthouse'],
    mustHaveAmenities: ['Private Elevator (مصعد إيطالي)', 'Driver Room (غرفة سائق)', '10-Yr Malath Insurance (تأمين ملاذ)'],
    purchaseTimeline: '1 - 3 months',
    targetMonthlyPayment: 32000,
    priority: 'luxury_lifestyle',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ propertyId: string; matchScore: number; matchReason: string; tradeoff: string }[] | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setProfile(prev => ({
      ...prev,
      mustHaveAmenities: prev.mustHaveAmenities.includes(amenity)
        ? prev.mustHaveAmenities.filter(a => a !== amenity)
        : [...prev.mustHaveAmenities, amenity]
    }));
  };

  const toggleDistrict = (district: string) => {
    setProfile(prev => ({
      ...prev,
      preferredDistricts: prev.preferredDistricts.includes(district)
        ? prev.preferredDistricts.filter(d => d !== district)
        : [...prev.preferredDistricts, district]
    }));
  };

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerProfile: profile,
          properties,
        }),
      });

      const data = await res.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setResults(data.recommendations);
        setHasRun(true);

        // Update properties list with match scores
        const updated = properties.map(p => {
          const rec = data.recommendations.find((r: any) => r.propertyId === p.id);
          if (rec) {
            return {
              ...p,
              aiMatchScore: rec.matchScore,
              aiMatchReason: rec.matchReason,
            };
          }
          return p;
        });

        // Sort by match score descending
        updated.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
        onApplyRecommendations(updated);
      }
    } catch (err) {
      console.error('Failed to get recommendations', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini 3.8 AI Recommendation Engine • محرك التوصيات العقارية الذكي
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif-display">
            Personalized Riyadh Property Matchmaker
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            حدد ميزانيتك بالريال السعودي، والحي المفضل (حطين، الملقا، كافد، النخيل)، واحتياجات أسرتك (مصعد، غرفة سائق، مسبح، كود البناء السعودي). يقوم الذكاء الاصطناعي بمطابقة أفضل الفلل والبنتهاوسات في الرياض مع مؤشرات التقييم المالي.
          </p>
        </div>
      </div>

      {/* Questionnaire Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-1 space-y-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <Target className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">معايير البحث في الرياض</h3>
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Budget Ceiling (سقف الميزانية)</span>
              <span className="text-amber-400 font-mono-num font-bold">
                SAR {(profile.budgetMax / 1000000).toFixed(1)}M
              </span>
            </div>
            <input
              type="range"
              min={2500000}
              max={15000000}
              step={250000}
              value={profile.budgetMax}
              onChange={(e) => setProfile({ ...profile, budgetMax: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono-num mt-1">
              <span>SAR 2.5M</span>
              <span>SAR 8.5M</span>
              <span>SAR 15.0M+</span>
            </div>
          </div>

          {/* Target Monthly Payment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Monthly Installment (القسط الشهري المستهدف)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">SAR</span>
              <input
                type="number"
                value={profile.targetMonthlyPayment}
                onChange={(e) => setProfile({ ...profile, targetMonthlyPayment: Number(e.target.value) })}
                className="w-full pl-12 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono-num focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Priority Focus */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              الأولوية الإستراتيجية (Strategic Priority)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'luxury_lifestyle', label: 'Luxury Villa Lifestyle' },
                { id: 'investment_roi', label: 'Max Rental Yield (عائد)' },
                { id: 'kafd_proximity', label: 'Near KAFD & Metro' },
                { id: 'family_schools', label: 'Schools & Privacy' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setProfile({ ...profile, priority: p.id as any })}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    profile.priority === p.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Districts */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              الأحياء المفضلة بالرياض (Preferred Districts)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Hittin', 'Al Malqa', 'KAFD', 'Al Nakheel', 'Al Yasmin', 'Al Safarat'].map(dist => (
                <button
                  key={dist}
                  onClick={() => toggleDistrict(dist)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    profile.preferredDistricts.includes(dist)
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Must Have Amenities */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              المواصفات الضرورية للعقار
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RIYADH_AMENITY_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all ${
                    profile.mustHaveAmenities.includes(a)
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleGenerateRecommendations}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري تحليل محفظة عقارات الرياض...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                تحليل ومطابقة العقارات بالذكاء الاصطناعي
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Matched Properties Display */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {hasRun ? 'أعلى العقارات تطابقاً مع ملفك في الرياض' : 'عقارات مختارة في شمال الرياض'}
            </h3>
            {hasRun && (
              <span className="text-xs text-amber-300 font-mono-num font-semibold">
                Ranked by AI Conviction
              </span>
            )}
          </div>

          <div className="space-y-4">
            {properties.map((property, idx) => {
              const rec = results?.find(r => r.propertyId === property.id);
              const score = property.aiMatchScore || (rec ? rec.matchScore : 95 - idx * 3);
              const reason = property.aiMatchReason || rec?.matchReason || `Matches your budget bracket, ${property.district} location preference, and luxury specifications.`;
              const tradeoff = rec?.tradeoff || 'High demand northern corridor with fast-moving inventory.';

              return (
                <div
                  key={property.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/40 rounded-3xl p-5 shadow-xl transition-all duration-200 flex flex-col md:flex-row gap-5"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full md:w-56 h-48 rounded-2xl object-cover ring-1 ring-white/10 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow">
                            <Sparkles className="w-3 h-3 fill-slate-950" />
                            {score}% AI Match
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {property.propertyType}
                          </span>
                        </div>

                        <span className="text-xl font-extrabold text-white font-mono-num">
                          SAR {property.price.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mt-2">
                        {property.title}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {property.district}, {property.city}
                      </p>

                      {/* Specs */}
                      <div className="flex items-center gap-4 text-xs text-slate-300 font-mono-num mt-3">
                        <span>{property.beds} Beds</span>
                        <span>•</span>
                        <span>{property.baths} Baths</span>
                        <span>•</span>
                        <span>{property.sqm} m²</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">+{property.marketMetrics.forecast12mAppreciation}% Growth</span>
                      </div>

                      {/* AI Reason box */}
                      <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <p className="text-amber-200 font-medium">
                          <strong>سبب التوصية:</strong> {reason}
                        </p>
                        <p className="text-slate-400 mt-1 text-[11px]">
                          <strong>ملاحظة استراتيجية:</strong> {tradeoff}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                      {onOpenPriceAlert && (
                        <button
                          onClick={() => onOpenPriceAlert(property)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                          title="تفعيل تنبيه انخفاض السعر"
                        >
                          <Bell className="w-3.5 h-3.5 text-amber-400" />
                          تنبيه السعر
                        </button>
                      )}
                      <button
                        onClick={() => onOpenVirtualTour(property)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        Virtual Tour
                      </button>
                      <button
                        onClick={() => onOpenAgentChat(property)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat Broker
                      </button>
                      <button
                        onClick={() => onOpenDocumentPrep(property)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Draft Offer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
