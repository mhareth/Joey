import React, { useState } from 'react';
import { Property, BuyerProfile } from '../types';
import { 
  Sparkles, 
  Target, 
  MapPin, 
  Eye, 
  MessageSquare, 
  FileText,
  Loader2,
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
  'Saudi Building Code (كود البناء)'
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
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Header - Redfin Clean Style */}
      <div className="relative rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#C82021] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redfin Matchmaker • محرك المطابقة العقارية الذكي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-sans">
            Personalized Riyadh Property Matchmaker
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            حدد ميزانيتك بالريال السعودي، والحي المفضل (حطين، الملقا، كافد، النخيل)، واحتياجات أسرتك (مصعد، غرفة سائق، مسبح). يقوم النظام بمطابقة أفضل الفلل والبنتهاوسات في الرياض مع مؤشرات التقييم المالي.
          </p>
        </div>
      </div>

      {/* Questionnaire Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-1 space-y-5 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Target className="w-5 h-5 text-[#C82021]" />
            <h3 className="font-bold text-gray-900 text-sm">معايير البحث في الرياض</h3>
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
              <span>Budget Ceiling (سقف الميزانية)</span>
              <span className="text-[#C82021] font-mono-num font-black">
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
              className="w-full accent-[#C82021] bg-gray-200 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 font-mono-num mt-1">
              <span>SAR 2.5M</span>
              <span>SAR 8.5M</span>
              <span>SAR 15.0M+</span>
            </div>
          </div>

          {/* Target Monthly Payment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Target Monthly Installment (القسط الشهري المستهدف)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">SAR</span>
              <input
                type="number"
                value={profile.targetMonthlyPayment}
                onChange={(e) => setProfile({ ...profile, targetMonthlyPayment: Number(e.target.value) })}
                className="w-full pl-12 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 font-mono-num focus:border-[#C82021] focus:ring-1 focus:ring-red-100 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Priority Focus */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
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
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-colors ${
                    profile.priority === p.id
                      ? 'bg-[#C82021] text-white border-[#C82021] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Districts */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              الأحياء المفضلة بالرياض (Preferred Districts)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Hittin', 'Al Malqa', 'KAFD', 'Al Nakheel', 'Al Yasmin', 'Al Safarat'].map(dist => (
                <button
                  key={dist}
                  onClick={() => toggleDistrict(dist)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    profile.preferredDistricts.includes(dist)
                      ? 'bg-red-50 text-[#C82021] border-red-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Must Have Amenities */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              المواصفات الضرورية للعقار
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RIYADH_AMENITY_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    profile.mustHaveAmenities.includes(a)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
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
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C82021]" />
              {hasRun ? 'أعلى العقارات تطابقاً مع ملفك في الرياض' : 'عقارات مختارة في شمال الرياض'}
            </h3>
            {hasRun && (
              <span className="text-xs text-gray-500 font-mono-num font-semibold">
                Ranked by AI Score
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
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full md:w-56 h-48 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#C82021] border border-red-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 fill-[#C82021]" />
                            {score}% Match
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {property.propertyType}
                          </span>
                        </div>

                        <span className="text-xl font-black text-gray-900 font-mono-num">
                          SAR {property.price.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 mt-2">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {property.district}, {property.city}
                      </p>

                      {/* Specs */}
                      <div className="flex items-center gap-3 text-xs text-gray-700 font-semibold mt-2.5">
                        <span>{property.beds} beds</span>
                        <span className="text-gray-300">·</span>
                        <span>{property.baths} baths</span>
                        <span className="text-gray-300">·</span>
                        <span>{property.sqm} m²</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-emerald-700 font-bold font-mono-num">+{property.marketMetrics.forecast12mAppreciation}% Growth</span>
                      </div>

                      {/* AI Reason box */}
                      <div className="mt-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                        <p className="text-gray-800 font-medium">
                          <strong className="text-gray-900">سبب التوصية:</strong> {reason}
                        </p>
                        <p className="text-gray-500 mt-1 text-[11px]">
                          <strong>ملاحظة استراتيجية:</strong> {tradeoff}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                      {onOpenPriceAlert && (
                        <button
                          onClick={() => onOpenPriceAlert(property)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                          title="تفعيل تنبيه انخفاض السعر"
                        >
                          <Bell className="w-3.5 h-3.5 text-[#C82021]" />
                          تنبيه السعر
                        </button>
                      )}
                      <button
                        onClick={() => onOpenVirtualTour(property)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C82021]" />
                        Virtual Tour
                      </button>
                      <button
                        onClick={() => onOpenAgentChat(property)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat Broker
                      </button>
                      <button
                        onClick={() => onOpenDocumentPrep(property)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors active:scale-95"
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
