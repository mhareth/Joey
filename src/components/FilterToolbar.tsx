import React from 'react';
import { PropertyType } from '../types';
import { Map, Grid, RotateCcw } from 'lucide-react';

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
  totalCount,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl mb-6 backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* District Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {RIYADH_DISTRICTS.map((district) => (
            <button
              key={district}
              onClick={() => setSelectedCity(district)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === district
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {district === 'All Districts' ? 'All Riyadh (الرياض)' : district}
            </button>
          ))}
        </div>

        {/* View Mode Switcher & Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <span className="text-xs text-slate-400 font-mono-num font-medium">
            Showing <strong className="text-white">{totalCount}</strong> verified Riyadh properties
          </span>

          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'split' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Split Map & Listings"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Cards Only"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'map' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Full Map View"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-800/80">
        
        {/* Property Type Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Property Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Max Price Range (SAR) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Max Price (SAR)</label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value={3500000}>Up to SAR 3.5M</option>
            <option value={5500000}>Up to SAR 5.5M</option>
            <option value={8000000}>Up to SAR 8.0M</option>
            <option value={12000000}>Up to SAR 12.0M</option>
            <option value={25000000}>Any Price (SAR 25M+)</option>
          </select>
        </div>

        {/* Minimum Bedrooms */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Bedrooms</label>
          <select
            value={minBeds}
            onChange={(e) => setMinBeds(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value={0}>Any Beds</option>
            <option value={4}>4+ Bedrooms</option>
            <option value={5}>5+ Bedrooms</option>
            <option value={6}>6+ Bedrooms (Palatial)</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="featured">Featured / AI Ranked</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="sqft-desc">Largest Area (m²)</option>
            <option value="appreciation-desc">Highest Appreciation</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-2 flex items-end">
          <button
            onClick={onResetFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
};
