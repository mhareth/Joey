import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { 
  Home, 
  Sparkles, 
  Wrench, 
  CheckCircle2, 
  Loader2, 
  PlusCircle, 
  Building2,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SellHubProps {
  onAddProperty: (newProperty: Property) => void;
  onViewExplore: () => void;
}

export const SellHub: React.FC<SellHubProps> = ({
  onAddProperty,
  onViewExplore,
}) => {
  const [formData, setFormData] = useState({
    address: 'شارع أنس بن مالك، حي الملقا',
    district: 'Al Malqa (الملقا)',
    city: 'Riyadh',
    zip: '13524',
    beds: 5,
    baths: 6.0,
    sqm: 480,
    landAreaSqm: 375,
    propertyType: 'Luxury Modern Villa' as PropertyType,
    yearBuilt: 2024,
    condition: 'جديدة - تشطيب سوبر ديلوكس وفق كود البناء السعودي',
    updates: 'مصعد إيطالي، مسبح خاص بنظام تدفئة وتبريد، حجر الرياض الطبيعي، تحكم ذكي بالكامل، غرفة سائق وخادمة',
  });

  const [isLoadingValuation, setIsLoadingValuation] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);

  const [isLoadingListing, setIsLoadingListing] = useState(false);
  const [listingCopy, setListingCopy] = useState<any>(null);

  const [published, setPublished] = useState(false);

  const handleRunValuation = async () => {
    setIsLoadingValuation(true);
    try {
      const res = await fetch('/api/ai/home-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setValuationResult(data);
    } catch (err) {
      console.error('Failed valuation', err);
    } finally {
      setIsLoadingValuation(false);
    }
  };

  const handleGenerateListing = async () => {
    setIsLoadingListing(true);
    try {
      const res = await fetch('/api/ai/listing-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyData: formData }),
      });
      const data = await res.json();
      setListingCopy(data);
    } catch (err) {
      console.error('Failed listing copy', err);
    } finally {
      setIsLoadingListing(false);
    }
  };

  const handlePublishProperty = () => {
    const price = valuationResult?.recommendedListPrice || 5200000;
    const newProp: Property = {
      id: `prop-riyadh-${Date.now()}`,
      title: listingCopy?.headline || `فيلا مودرن فاخرة في ${formData.district}`,
      tagline: `${formData.beds} أجنحة ماستر بمساحة بناء ${formData.sqm} م² مع مصعد وتأمين ملاذ ضد العيوب الخفية`,
      price,
      address: formData.address,
      district: formData.district,
      city: 'Riyadh',
      zip: formData.zip,
      coordinates: {
        lat: 24.8020,
        lng: 46.6110,
        mapX: 43,
        mapY: 24,
      },
      beds: formData.beds,
      baths: formData.baths,
      sqm: formData.sqm,
      landAreaSqm: formData.landAreaSqm,
      pricePerSqm: Math.round(price / formData.sqm),
      yearBuilt: formData.yearBuilt,
      propertyType: formData.propertyType,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      ],
      tags: ['Newly Listed (معروض حديثاً)', 'Saudi Building Code', 'Italian Lift', 'Private Pool'],
      description: listingCopy?.description || `فيلا فاخرة بتصميم معماري حديث وموقع استراتيجي في شمال الرياض.`,
      features: listingCopy?.keyBullets || [
        'واجهات حجر الرياض الطبيعي مع عزل حراري ومائي فائق',
        'مجلس ضيافة رئيسي منفصل بإطلالة على مسبح الفناء',
        'مصعد إيطالي بانورامي يخدم كافة الأدوار',
        'بوليصة تأمين العيوب الخفية لمدة 10 سنوات الصادرة من ملاذ'
      ],
      marketMetrics: {
        neighborhoodRating: 9.7,
        walkScore: 85,
        transitScore: 82,
        schoolsScore: 9.4,
        historicalAnnualAppreciation: 12.8,
        forecast12mAppreciation: 9.5,
        medianDaysOnMarket: valuationResult?.projectedDaysOnMarket || 16,
        saleToListRatio: 99.1,
        estimatedRentalIncome: 28000,
        capRate: 6.4,
        propertyTaxAnnual: 0,
        hoaMonthly: 0,
      },
      warranties: {
        structuralYears: 10,
        plumbingYears: 15,
        electricalYears: 25,
      },
      virtualTourRooms: [
        {
          id: 'v1',
          name: 'Main Majlis & Living (المجلس والصالة)',
          sqft: 85,
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          ambientSoundTitle: 'Riyadh Villa Ambience',
          narration: 'مجلس ضيافة متسع بأسقف مرتفعة وأرضيات رخام وتشطيبات حجر طبيعي.',
          hotspots: [
            { id: 'h1', x: 45, y: 50, title: 'Italian Marble Flooring', description: 'رخام ستاتوريو إيطالي فاخر' }
          ]
        }
      ],
      agent: {
        id: 'agent-self',
        name: 'joey.properties Certified Broker',
        title: 'Senior Transaction Director',
        brokerage: 'جوي للعقارات | joey.properties Riyadh',
        phone: '+966 800 124 9900',
        email: 'listings@joey.properties',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        rating: 4.99,
        reviewsCount: 240,
        salesVolume: 'SAR 500M+ Closed in Riyadh',
        activeListingsCount: 14,
        languages: ['Arabic (العربية)', 'English'],
        responseTime: 'Instant AI Co-Pilot',
        bio: 'Automated high-velocity listing network optimizing seller proceeds in Riyadh.',
        falLicense: 'FAL-1200009981'
      }
    };

    onAddProperty(newProp);
    setPublished(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold mb-3">
            <Home className="w-3.5 h-3.5" />
            Riyadh Property Seller Suite & AI Valuation (التقييم العقاري الذكي بالرياض)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif-display">
            Sell for Maximum Value in Riyadh with AI
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            احصل على تقييم فوري بالريال السعودي لعقارك بالرياض وفق مؤشرات الصفقات المعتمدة من الهيئة العامة للعقار، واكتشف أعلى التحسينات الإنشائية عائداً قبل طرح العقار للبيع.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Property Intake Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            بيانات العقار في الرياض
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">العنوان والشارع (Street Address)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الحي (District)</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Hittin (حي حطين)">Hittin (حطين)</option>
                <option value="Al Malqa (حي الملقا)">Al Malqa (الملقا)</option>
                <option value="KAFD (مركز الملك عبدالله المالي)">KAFD (كافد)</option>
                <option value="Al Nakheel (حي النخيل)">Al Nakheel (النخيل)</option>
                <option value="Al Yasmin (حي الياسمين)">Al Yasmin (الياسمين)</option>
                <option value="Al Safarat (حي السفارات)">Al Safarat (حي السفارات)</option>
                <option value="Al Narjis (حي النرجس)">Al Narjis (النرجس)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المدينة (City)</label>
              <input
                type="text"
                disabled
                value="الرياض (Riyadh)"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">مسطح البناء (م²)</label>
              <input
                type="number"
                value={formData.sqm}
                onChange={(e) => setFormData({ ...formData, sqm: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">مساحة الأرض (م²)</label>
              <input
                type="number"
                value={formData.landAreaSqm}
                onChange={(e) => setFormData({ ...formData, landAreaSqm: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">غرف النوم</label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">دورات المياه</label>
              <input
                type="number"
                step="0.5"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">نوع العقار</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Luxury Modern Villa">فيلا مودرن فاخرة</option>
                <option value="Contemporary Palace">قصر عصري</option>
                <option value="KAFD Sky Penthouse">بنتهاوس فاخر</option>
                <option value="Architectural Duplex">دوبلكس مستقل</option>
                <option value="Modern Townhome">تاون هاوس</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">سنة البناء</label>
              <input
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => setFormData({ ...formData, yearBuilt: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">المزايا والتشطيبات الخاصة</label>
            <textarea
              rows={2}
              value={formData.updates}
              onChange={(e) => setFormData({ ...formData, updates: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleRunValuation}
              disabled={isLoadingValuation}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl transition-all disabled:opacity-50"
            >
              {isLoadingValuation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري حساب التقييم الذكي بالرياض...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  حساب التقييم العقاري الذكي (AVM)
                </>
              )}
            </button>

            <button
              onClick={handleGenerateListing}
              disabled={isLoadingListing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
            >
              {isLoadingListing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري كتابة الوصف التسويقي...
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  توليد الوصف التسويقي المعتمد بالذكاء الاصطناعي
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Valuation Results & Listing Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {valuationResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Valuation Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono-num">
                    تقرير التقييم العقاري المعتمد • joey.properties (جوي للعقارات)
                  </span>
                  <span className="text-xs text-emerald-400 font-mono-num font-bold">
                    {valuationResult.confidenceScore}% دقة التقييم
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">السعر المقترح للطرح بالرياض</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-num">
                      SAR {valuationResult.recommendedListPrice?.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">النطاق التقديري للقيمة السوقية</span>
                    <span className="text-base sm:text-lg font-bold text-amber-300 font-mono-num">
                      SAR {valuationResult.estimatedValueMin?.toLocaleString()} - {valuationResult.estimatedValueMax?.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      متوسط مدة الإتمام: <strong>{valuationResult.projectedDaysOnMarket} يوماً</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  {valuationResult.marketAnalysis}
                </p>

                {/* Pre-Listing High-ROI Touchups */}
                {valuationResult.roiUpgrades && (
                  <div className="mt-5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      أعلى 3 تحسينات عقارية عائداً قبل الطرح بالرياض
                    </h4>
                    <div className="space-y-2">
                      {valuationResult.roiUpgrades.map((u: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <div>
                            <span className="font-semibold text-white block">{u.upgrade}</span>
                            <span className="text-[11px] text-slate-400">التكلفة التقديرية: {u.estimatedCost}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg text-emerald-400 bg-emerald-500/10 font-bold font-mono-num">
                            {u.valueAdd}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Listing Copy Box if generated */}
              {listingCopy && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">الوصف التسويقي الجاهز للنشر</h4>
                    <span className="text-[11px] text-amber-400 font-semibold">جاهز للربط مع منصة إيجار والبورصة العقارية</span>
                  </div>

                  <h3 className="text-base font-bold text-amber-300 font-serif-display">
                    "{listingCopy.headline}"
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {listingCopy.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {listingCopy.keyBullets?.map((bullet: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Publish Button */}
                  {!published ? (
                    <button
                      onClick={handlePublishProperty}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xl transition-all active:scale-95 mt-4"
                    >
                      <PlusCircle className="w-4 h-4" />
                      نشر العقار فوراً في خريطة وسوق عقارات الرياض
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <strong className="block text-sm">تم إدراج العقار بنجاح في سوق الرياض!</strong>
                          <span>أصبح العقار متاحاً الآن للمشترين والمستثمرين والجولات الافتراضية.</span>
                        </div>
                      </div>
                      <button
                        onClick={onViewExplore}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                      >
                        عرض على الخريطة
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 border border-slate-800 rounded-3xl text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h4 className="text-base font-bold text-slate-300">
                  محرك التقييم العقاري الذكي في الرياض
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  أدخل مواصفات عقارك في شمال الرياض واضغط على <strong>حساب التقييم العقاري الذكي</strong> للوصول إلى القيمة العادلة بالسوق، وتوصيات رفع القيمة قبل فتح باب المعاينات.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
