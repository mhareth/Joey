import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Scale, 
  Sparkles, 
  Loader2, 
  Building,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

interface MarketInsightsHubProps {
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const MarketInsightsHub: React.FC<MarketInsightsHubProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Hittin');
  const [isLoading, setIsLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const districtProperties = properties.filter(p => p.district.toLowerCase().includes(selectedDistrict.toLowerCase()));
  const sampleProp = districtProperties[0] || properties[0];

  const fetchInsights = async (district: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district,
          city: 'Riyadh',
          property: sampleProp,
        }),
      });
      const data = await res.json();
      setAiReport(data);
    } catch (err) {
      console.error('Failed to load market insights', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(selectedDistrict);
  }, [selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Riyadh Real Estate Intelligence • مؤشرات عقارات الرياض
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif-display">
            Real-Time Riyadh Market Insights
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Live transactional velocity, price per m² trends, and Vision 2030 appreciation analytics across Riyadh.
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
          {['Hittin', 'Al Malqa', 'KAFD', 'Al Nakheel', 'Al Yasmin', 'Al Safarat'].map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistrict(dist)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDistrict === dist
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Riyadh Demand Index</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num">
            {aiReport?.temperatureScore || 92}<span className="text-sm text-slate-500">/100</span>
          </div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-amber-300">
            {aiReport?.marketVerdict || 'High-Demand Expansion (سوق نشط)'}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Median Days to Sell (DOM)</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num">
            {sampleProp.marketMetrics.medianDaysOnMarket} <span className="text-sm text-slate-500">Days</span>
          </div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-400">
            Fastest turnaround in GCC
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Sale-to-List Ratio</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num">
            {sampleProp.marketMetrics.saleToListRatio}%
          </div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-blue-300">
            Near full asking price in {selectedDistrict}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">12M Forecast Growth</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-num text-purple-300">
            +{sampleProp.marketMetrics.forecast12mAppreciation}%
          </div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-purple-400">
            Vision 2030 Catalyst
          </span>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: AI Economist Briefing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  تقرير الخبير الاقتصادي العقاري • {selectedDistrict}, Riyadh
                </h3>
              </div>
              {isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Analysis...
                </div>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Strategic Executive Summary (الملخص التنفيذي)
                </h4>
                <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                  {aiReport?.summary || 'Analyzing current market fundamentals and capital inflows...'}
                </p>
              </div>

              {/* Key Drivers */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2.5">
                  محركات النمو الرئيسية في الرياض (Core Market Drivers)
                </h4>
                <div className="space-y-2">
                  {(aiReport?.keyDrivers || [
                    'Strategic Northern Riyadh expansion corridor anchored by KAFD, Boulevard, and New Murabba',
                    'Exemption on Real Estate Transaction Tax (RETT 5%) up to SAR 1,000,000 for first-time Saudi home buyers',
                    'Stringent Saudi Building Code and mandatory 10-year insurance against latent defects (تأمين ملاذ) bolstering buyer confidence'
                  ]).map((driver: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negotiation Power */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    Buyer Negotiation Leverage
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {aiReport?.buyerNegotiationPower || 'Competitive seller market. Focus negotiations on developer fixture warranties or flexible booking deposit terms.'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    Inventory & Absorption Rate
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {aiReport?.daysOnMarketTrend || 'Properties in prime northern Riyadh neighborhoods receive qualified buyer inquiries within 72 hours of REGA listing.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Trend Simulator Box (SAR / m²) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Median Price per SqM Growth in Northern Riyadh (تطور سعر المتر المربع)
            </h3>
            
            <div className="space-y-3">
              {[
                { year: '2022', price: 'SAR 7,800 / m²', width: '60%' },
                { year: '2023', price: 'SAR 9,200 / m²', width: '70%' },
                { year: '2024', price: 'SAR 11,400 / m²', width: '82%' },
                { year: '2025', price: 'SAR 13,088 / m²', width: '92%' },
                { year: '2026 (Projected)', price: 'SAR 14,800 / m²', width: '98%', isProjected: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="w-28 text-slate-400 font-mono-num">{item.year}</span>
                  <div className="flex-1 h-6 bg-slate-950 rounded-xl overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-mono-num font-bold ${
                        item.isProjected ? 'bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950' : 'bg-slate-700 text-white'
                      }`}
                      style={{ width: item.width }}
                    >
                      {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Inventory in this District */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              Active Listings in {selectedDistrict}
            </h3>

            <div className="space-y-3">
              {districtProperties.length > 0 ? (
                districtProperties.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProperty?.(p)}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/40 transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono-num">
                        SAR {(p.price / 1000000).toFixed(2)}M • {p.beds}bd / {p.baths}ba • {p.sqm}m²
                      </p>
                      <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        Est. Rent: SAR {p.marketMetrics.estimatedRentalIncome.toLocaleString()}/mo ({p.marketMetrics.capRate}% Cap)
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Showing benchmark data for {selectedDistrict}, Riyadh.
                </p>
              )}
            </div>
          </div>

          {/* Investment Cap Rate Guide */}
          <div className="bg-gradient-to-br from-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1">
              عائد الاستثمار العقاري في الرياض
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              تحقق الفلل السكنية الفاخرة والبنتهاوسات في شمال الرياض عوائد إيجارية صافية تتراوح بين <strong>5.6% و 7.7% سنوياً</strong> مع نمو رأسمالي استثنائي بدعم مشاريع الرياض الكبرى (كافد، البوليفارد، حديقة الملك سلمان، والمربع الجديد).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
