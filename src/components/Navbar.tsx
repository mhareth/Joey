import React from 'react';
import { 
  Building2, 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Home, 
  Calculator, 
  FileText, 
  Heart, 
  Search,
  ShieldCheck,
  Bell
} from 'lucide-react';

export type NavTab = 'explore' | 'recommendations' | 'market' | 'sell' | 'mortgage' | 'documents';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedCount: number;
  onOpenSaved: () => void;
  priceAlertsCount: number;
  triggeredAlertsCount: number;
  onOpenPriceAlerts: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSaved,
  priceAlertsCount,
  triggeredAlertsCount,
  onOpenPriceAlerts,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Riyadh AI Beacon */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
              <Building2 className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono-num font-serif-display">
                  joey<span className="text-amber-400">.properties</span>
                </span>
                <span className="text-xs font-bold text-amber-300 font-sans tracking-wide">
                  جوي للعقارات
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-2.5 h-2.5" /> REGA فال
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                منصة الصفقات والذكاء العقاري السعودي • Saudi Real Estate Intelligence
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في حطين، الملقا، كافد، النخيل (Hittin, KAFD)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              خريطة الرياض
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              المطابقة الذكية
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'market'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              مؤشرات السوق
            </button>

            <button
              onClick={() => setActiveTab('sell')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sell'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              بيع وتقييم
            </button>

            <button
              onClick={() => setActiveTab('mortgage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'mortgage'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              التمويل العقاري
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'documents'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              العقود المعتمدة
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Price Alerts Bell Button */}
            <button
              onClick={onOpenPriceAlerts}
              className={`relative p-2.5 rounded-xl border transition-all ${
                triggeredAlertsCount > 0
                  ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30'
              }`}
              title="تنبيهات أسعار العقارات (Saved Price Alerts)"
            >
              <Bell className="w-4 h-4" />
              {priceAlertsCount > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow ${
                  triggeredAlertsCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
                }`}>
                  {priceAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenSaved}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition-all"
              title="Saved Properties (العقارات المحفوظة)"
            >
              <Heart className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sell')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/15 transition-all active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              إضافة عقار للبيع
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'explore' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            خريطة الرياض
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'recommendations' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            المطابقة الذكية
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'market' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            مؤشرات السوق
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'sell' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            تقييم وبيع
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'mortgage' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            تمويل عقاري
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'documents' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            العقود
          </button>
        </div>
      </div>
    </header>
  );
};
