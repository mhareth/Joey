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
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Redfin-style Logo & Riyadh AI Beacon */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl bg-[#C82021] flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-gray-900 font-sans">
                  joey<span className="text-[#C82021]">.properties</span>
                </span>
                <span className="text-xs font-bold text-gray-700 font-sans tracking-wide">
                  جوي للعقارات
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-2.5 h-2.5" /> REGA فال
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                منصة الصفقات والذكاء العقاري السعودي • Saudi Real Estate Intelligence
              </p>
            </div>
          </div>

          {/* Redfin-style Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full flex items-center border border-gray-300 focus-within:border-[#C82021] focus-within:ring-2 focus-within:ring-red-100 rounded-xl overflow-hidden transition-all bg-white shadow-2xs">
              <Search className="ml-3 w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالحي، المدينة، أو الرمز (حطين، الملقا، كافد)..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  مسح
                </button>
              ) : null}
              <button
                type="button"
                className="bg-[#C82021] hover:bg-[#b01c1d] text-white p-2.5 px-3 transition-colors shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs - Redfin Clean Typography Style */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'explore'
                  ? 'text-[#C82021] bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              خريطة العقارات
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'recommendations'
                  ? 'text-[#C82021] bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              المطابقة الذكية
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'market'
                  ? 'text-[#C82021] bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              مؤشرات السوق
            </button>

            <button
              onClick={() => setActiveTab('mortgage')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'mortgage'
                  ? 'text-[#C82021] bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              حاسبة التمويل
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'documents'
                  ? 'text-[#C82021] bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                  ? 'bg-red-50 border-red-200 text-[#C82021]'
                  : 'bg-white border-gray-200 text-gray-700 hover:text-[#C82021] hover:border-red-200'
              }`}
              title="تنبيهات أسعار العقارات (Saved Price Alerts)"
            >
              <Bell className="w-4 h-4" />
              {priceAlertsCount > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs ${
                  triggeredAlertsCount > 0 ? 'bg-emerald-600 animate-pulse' : 'bg-[#C82021]'
                }`}>
                  {priceAlertsCount}
                </span>
              )}
            </button>

            {/* Saved Properties */}
            <button
              onClick={onOpenSaved}
              className="relative p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#C82021] hover:border-red-200 transition-all"
              title="Saved Properties (العقارات المحفوظة)"
            >
              <Heart className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C82021] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Redfin Sell / List Home Button */}
            <button
              onClick={() => setActiveTab('sell')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-[#C82021] text-[#C82021] hover:bg-red-50 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              أعلن عن عقارك
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-gray-200 no-scrollbar">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'explore' ? 'bg-[#C82021] text-white' : 'text-gray-600 bg-gray-100'
            }`}
          >
            خريطة العقارات
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'recommendations' ? 'bg-[#C82021] text-white' : 'text-gray-600 bg-gray-100'
            }`}
          >
            المطابقة الذكية
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'market' ? 'bg-[#C82021] text-white' : 'text-gray-600 bg-gray-100'
            }`}
          >
            مؤشرات السوق
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'sell' ? 'bg-[#C82021] text-white' : 'text-gray-600 bg-gray-100'
            }`}
          >
            تقييم وبيع
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'mortgage' ? 'bg-[#C82021] text-white' : 'text-gray-600 bg-gray-100'
            }`}
          >
            تمويل عقاري
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'documents' ? 'bg-[#C82021] text-white' : 'text-gray-600 bg-gray-100'
            }`}
          >
            العقود
          </button>
        </div>
      </div>
    </header>
  );
};
