import React from 'react';
import { PropertyType } from '../types';
import { Map, Grid, RotateCcw, Bell } from 'lucide-react';

interface FilterToolbarProps {
  viewMode: 'split' | 'grid' | 'map';
  setViewMode: (mode: 'split' | 'grid' | 'map') => void;
  selectedCity: string; // District in Riyadh
  setSelectedCity: (city: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minBeds: number;
  setMinBeds: (beds: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onResetFilters: () => void;
  onOpenSearchPriceAlert?: () => void;
  totalCount: number;
}

const RIYADH_DISTRICTS = [
  'All Districts',
  'Hittin',
  'Al Malqa',
  'KAFD',
  'Al Nakheel',
  'Al Yasmin',
  'Al Safarat'
];

const PROPERTY_TYPES: ('All Types' | PropertyType)[] = [
  'All Types',
  'Contemporary Palace',
  'Luxury Modern Villa',
  'KAFD Sky Penthouse',
  'Architectural Duplex',
  'Modern Townhome'
];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  viewMode,
  setViewMode,
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minBeds,
  setMinBeds,
  sortBy,
  setSortBy,
  onResetFilters,
  onOpenSearchPriceAlert,
  totalCount,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* District Filter Pills - Redfin Style */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {RIYADH_DISTRICTS.map((district) => (
            <button
              key={district}
              onClick={() => setSelectedCity(district)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === district
                  ? 'bg-[#C82021] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {district === 'All Districts' ? 'All Riyadh (الرياض)' : district}
            </button>
          ))}
        </div>

        {/* View Mode Switcher & Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <span className="text-xs text-gray-600 font-mono-num font-medium">
            Showing <strong className="text-gray-900 font-bold">{totalCount}</strong> homes for sale
          </span>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'split' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Split Map & Listings"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid of Listings"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table / Grid</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Full Map View"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Filter Controls Grid - Redfin Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-3 mt-4 pt-4 border-t border-gray-100 items-end">
        
        {/* Property Type Dropdown */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-3">
          <label className="block text-[11px] font-bold text-gray-600 mb-1">نوع العقار (Property Type)</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] focus:ring-1 focus:ring-red-100 shadow-2xs"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type} className="bg-white text-gray-900">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Max Budget Slider */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-3">
          <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-1">
            <span>الحد الأقصى للميزانية</span>
            <span className="text-[#C82021] font-mono-num font-extrabold">
              SAR {(maxPrice / 1000000).toFixed(1)}M
            </span>
          </div>
          <input
            type="range"
            min={2000000}
            max={25000000}
            step={500000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#C82021] bg-gray-200 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Minimum Bedrooms */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-[11px] font-bold text-gray-600 mb-1">غرف النوم (Beds)</label>
          <select
            value={minBeds}
            onChange={(e) => setMinBeds(Number(e.target.value))}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] focus:ring-1 focus:ring-red-100 shadow-2xs"
          >
            <option value={0}>Any Beds</option>
            <option value={4}>4+ Bedrooms</option>
            <option value={5}>5+ Bedrooms</option>
            <option value={6}>6+ Bedrooms (Palatial)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-[11px] font-bold text-gray-600 mb-1">الترتيب (Sort By)</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] focus:ring-1 focus:ring-red-100 shadow-2xs"
          >
            <option value="featured">Featured / AI Ranked</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="sqft-desc">Largest Area (m²)</option>
            <option value="appreciation-desc">Highest Appreciation</option>
          </select>
        </div>

        {/* Actions: Search Alert & Reset Filters - Redfin Style */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-2 flex items-end gap-2">
          {onOpenSearchPriceAlert && (
            <button
              onClick={onOpenSearchPriceAlert}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold transition-colors shadow-xs whitespace-nowrap"
              title="تفعيل تنبيه لنتائج البحث وانخفاض الأسعار"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>تنبيه البحث</span>
            </button>
          )}

          <button
            onClick={onResetFilters}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors border border-gray-300 shadow-2xs whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>
    </div>
  );
};
