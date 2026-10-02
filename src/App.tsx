import React, { useState, useMemo } from 'react';
import { Property, PropertyType } from './types';
import { INITIAL_PROPERTIES } from './data/mockProperties';
import { Navbar, NavTab } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyCard } from './components/PropertyCard';
import { FilterToolbar } from './components/FilterToolbar';
import { VirtualTourModal } from './components/VirtualTourModal';
import { AgentChatModal } from './components/AgentChatModal';
import { RecommendationHub } from './components/RecommendationHub';
import { MarketInsightsHub } from './components/MarketInsightsHub';
import { MortgageHub } from './components/MortgageHub';
import { DocumentPrepModal } from './components/DocumentPrepModal';
import { SellHub } from './components/SellHub';
import { SavedPropertiesModal } from './components/SavedPropertiesModal';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  FileText,
  Eye,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-austin-skyline']);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(INITIAL_PROPERTIES[0]);

  // Modal States
  const [virtualTourProperty, setVirtualTourProperty] = useState<Property | null>(null);
  const [agentChatProperty, setAgentChatProperty] = useState<Property | null>(null);
  const [documentPrepProperty, setDocumentPrepProperty] = useState<Property | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All Districts');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000000);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');

  // Filter & Search Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Search query (title, address, district, zip, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          p.title.toLowerCase().includes(q) ||
          (p.titleAr && p.titleAr.toLowerCase().includes(q)) ||
          p.address.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // District filter in Riyadh
      if (selectedCity !== 'All Districts' && !p.district.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }

      // Property type filter
      if (selectedType !== 'All Types' && p.propertyType !== selectedType) {
        return false;
      }

      // Price filter
      if (p.price > maxPrice) return false;

      // Beds filter
      if (minBeds > 0 && p.beds < minBeds) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sqft-desc') return b.sqm - a.sqm;
      if (sortBy === 'appreciation-desc') {
        return (b.marketMetrics.forecast12mAppreciation || 0) - (a.marketMetrics.forecast12mAppreciation || 0);
      }
      // Default: AI Match score or featured
      return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
    });
  }, [properties, searchQuery, selectedCity, selectedType, maxPrice, minBeds, sortBy]);

  const handleToggleSave = (prop: Property) => {
    setSavedPropertyIds((prev) =>
      prev.includes(prop.id) ? prev.filter((id) => id !== prop.id) : [...prev, prop.id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSelectedType('All Types');
    setMinPrice(0);
    setMaxPrice(10000000);
    setMinBeds(0);
    setSortBy('featured');
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    setSelectedProperty(newProp);
  };

  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => savedPropertyIds.includes(p.id));
  }, [properties, savedPropertyIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPropertyIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Rendered Based on Active Tab */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: EXPLORE & MAP VIEW */}
        {activeTab === 'explore' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter and View Mode Switcher */}
            <FilterToolbar
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minBeds={minBeds}
              setMinBeds={setMinBeds}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={handleResetFilters}
              totalCount={filteredProperties.length}
            />

            {/* View Mode Layouts */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 6 Columns: Interactive Map */}
                <div className="lg:col-span-6 lg:sticky lg:top-28">
                  <InteractiveMap
                    properties={filteredProperties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                    onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                    onOpenAgentChat={(p) => setAgentChatProperty(p)}
                  />
                </div>

                {/* Right 6 Columns: Property Listings Grid */}
                <div className="lg:col-span-6 space-y-6">
                  {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                      {filteredProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isSaved={savedPropertyIds.includes(property.id)}
                          onToggleSave={handleToggleSave}
                          onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                          onOpenAgentChat={(p) => setAgentChatProperty(p)}
                          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
                          onSelectProperty={(p) => setSelectedProperty(p)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                      <p className="text-sm text-slate-400">No properties matched your current filter criteria.</p>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              <div>
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isSaved={savedPropertyIds.includes(property.id)}
                        onToggleSave={handleToggleSave}
                        onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                        onOpenAgentChat={(p) => setAgentChatProperty(p)}
                        onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
                        onSelectProperty={(p) => setSelectedProperty(p)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                    <p className="text-sm text-slate-400">No properties found.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="w-full">
                <InteractiveMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={(p) => setSelectedProperty(p)}
                  onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                  onOpenAgentChat={(p) => setAgentChatProperty(p)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI RECOMMENDATIONS & BUYER MATCHMAKER */}
        {activeTab === 'recommendations' && (
          <RecommendationHub
            properties={properties}
            onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
            onOpenAgentChat={(p) => setAgentChatProperty(p)}
            onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
            onApplyRecommendations={(ranked) => {
              setProperties(ranked);
              setActiveTab('explore');
            }}
          />
        )}

        {/* TAB 3: REAL-TIME MARKET INSIGHTS */}
        {activeTab === 'market' && (
          <MarketInsightsHub
            properties={properties}
            onSelectProperty={(p) => {
              setSelectedProperty(p);
              setActiveTab('explore');
            }}
          />
        )}

        {/* TAB 4: SELL WITH AI HUB */}
        {activeTab === 'sell' && (
          <SellHub
            onAddProperty={handleAddProperty}
            onViewExplore={() => setActiveTab('explore')}
          />
        )}

        {/* TAB 5: MORTGAGE RATES & FINANCING */}
        {activeTab === 'mortgage' && (
          <MortgageHub
            selectedProperty={selectedProperty}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}

        {/* TAB 6: AUTOMATED LEGAL DOCUMENTS & CLOSING */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Automated Legal Suite
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-display">
                  Transaction & Closing Documents
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Draft legally structured purchase agreements, LOIs, and earnest money escrow instructions with instant electronic signatures.
                </p>
              </div>

              <button
                onClick={() => setDocumentPrepProperty(selectedProperty || properties[0])}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xl transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
              >
                + Draft New Offer Agreement
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'عقد وساطة واتفاقية شراء عقار موحد (REGA)',
                  type: 'Saudi REGA Standard Contract',
                  desc: 'عقد بيع وشراء عقاري موحد معتمد من الهيئة العامة للعقار يتضمن تحديد السعر والعربون وضريبة التصرفات العقارية (RETT 5%) وضمانات كود البناء السعودي.',
                  prop: properties[0],
                },
                {
                  title: 'اتفاقية وسند لأمر عربون (Araboon Agreement)',
                  type: 'Escrow Verification & Promissory Note',
                  desc: 'سند إيداع عربون وتوثيق التزام الشراء لضمان جدية الصفقة وحجز العقار لدى الوسيط العقاري المرخص برخصة فال.',
                  prop: properties[1],
                },
                {
                  title: 'ملحق تأمين العيوب الخفية (10-Yr Structural Warranty)',
                  type: 'Malath Insurance & Engineering Inspection',
                  desc: 'بوليصة تأمين ضد العيوب الخفية صادرة من شركة ملاذ للتأمين لمدة 10 سنوات متوافقة مع شهادة إتمام البناء وكود البناء السعودي.',
                  prop: properties[2],
                }
              ].map((doc, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit mb-4 border border-amber-500/20">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {doc.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {doc.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => setDocumentPrepProperty(doc.prop)}
                    className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    فتح نموذج العقد المعتمد
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      {virtualTourProperty && (
        <VirtualTourModal
          property={virtualTourProperty}
          onClose={() => setVirtualTourProperty(null)}
          onOpenAgentChat={(p) => setAgentChatProperty(p)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
        />
      )}

      {agentChatProperty && (
        <AgentChatModal
          property={agentChatProperty}
          onClose={() => setAgentChatProperty(null)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
        />
      )}

      {documentPrepProperty && (
        <DocumentPrepModal
          property={documentPrepProperty}
          onClose={() => setDocumentPrepProperty(null)}
        />
      )}

      {isSavedModalOpen && (
        <SavedPropertiesModal
          savedProperties={savedPropertiesList}
          onClose={() => setIsSavedModalOpen(false)}
          onRemoveSaved={handleToggleSave}
          onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-bold text-slate-200 font-mono-num font-serif-display">joey.properties</span>
            <span className="font-bold text-amber-300">جوي للعقارات</span>
            <span className="text-slate-500">— منصة الصفقات والذكاء العقاري السعودي • Saudi Real Estate Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
