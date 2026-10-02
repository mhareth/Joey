import React, { useState } from 'react';
import { Property } from '../types';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Eye, 
  MessageSquare,
  Flame,
  ShieldCheck,
  Building
} from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenVirtualTour: (property: Property) => void;
  onOpenAgentChat: (property: Property) => void;
}

type MapLayer = 'blueprint' | 'heatmap' | 'schools' | 'metro';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenVirtualTour,
  onOpenAgentChat,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('blueprint');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.2, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.75, z - 0.25));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl select-none">
      
      {/* Map Header Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Layer Selector */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl pointer-events-auto">
          <button
            onClick={() => setActiveLayer('blueprint')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'blueprint'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Riyadh Map (الرياض)
          </button>
          <button
            onClick={() => setActiveLayer('heatmap')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'heatmap'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Price Heatmap (حرارة الأسعار)
          </button>
          <button
            onClick={() => setActiveLayer('metro')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'metro'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            KAFD & Metro (كافد والقطار)
          </button>
          <button
            onClick={() => setActiveLayer('schools')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'schools'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Schools & Diplomatic
          </button>
        </div>

        {/* Legend / Status */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-xs text-slate-300 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>REGA Verified ({properties.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>Riyadh Northern Hub</span>
          </div>
        </div>
      </div>

      {/* Floating Zoom & Control Dock */}
      <div className="absolute right-4 bottom-6 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-1.5 rounded-2xl shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all border-t border-slate-800/80"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map Canvas Container */}
      <div
        className={`w-full h-full relative cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* Custom SVG Map Base of Riyadh (King Fahd Rd, Northern Ring, KAFD, Wadi Hanifa) */}
          <svg className="w-full h-full min-w-[800px] min-h-[500px]" viewBox="0 0 1000 650" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="riyadhMapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#080c14" />
                <stop offset="50%" stopColor="#0d1424" />
                <stop offset="100%" stopColor="#090e1a" />
              </linearGradient>

              {/* Wadi Hanifa lush greenery/waterway */}
              <linearGradient id="wadiHanifaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#065f46" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.25" />
              </linearGradient>

              {/* Price Heatmaps */}
              <radialGradient id="heatHittin" cx="38%" cy="36%" r="22%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heatKAFD" cx="52%" cy="34%" r="24%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heatMalqa" cx="42%" cy="22%" r="20%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background */}
            <rect width="1000" height="650" fill="url(#riyadhMapBg)" />

            {/* Architectural Grid */}
            <g stroke="rgba(255,255,255,0.025)" strokeWidth="1">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="650" />
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
              ))}
            </g>

            {/* Heatmap Layer */}
            {activeLayer === 'heatmap' && (
              <g>
                <circle cx="380" cy="235" r="210" fill="url(#heatHittin)" />
                <circle cx="520" cy="220" r="230" fill="url(#heatKAFD)" />
                <circle cx="420" cy="140" r="200" fill="url(#heatMalqa)" />
              </g>
            )}

            {/* Wadi Hanifa Natural Valley Path */}
            <path
              d="M 120 0 Q 220 220 280 340 T 360 650"
              stroke="url(#wadiHanifaGrad)"
              strokeWidth="28"
              fill="none"
              strokeLinecap="round"
            />
            <text x="220" y="320" fill="#34d399" opacity="0.4" fontSize="11" fontWeight="bold" letterSpacing="1">WADI HANIFA (وادي حنيفة)</text>

            {/* Major Arteries / Ring Roads */}
            {/* 1. King Fahd Road (North-South Axis) */}
            <line x1="520" y1="0" x2="520" y2="650" stroke="#475569" strokeWidth="4" opacity="0.8" />
            <text x="526" y="80" fill="#94a3b8" fontSize="10" fontWeight="bold">KING FAHD ROAD (طريق الملك فهد)</text>

            {/* 2. Northern Ring Road (East-West Axis) */}
            <line x1="0" y1="310" x2="1000" y2="310" stroke="#475569" strokeWidth="4" opacity="0.8" />
            <text x="40" y="302" fill="#94a3b8" fontSize="10" fontWeight="bold">NORTHERN RING ROAD (الطريق الدائري الشمالي)</text>

            {/* 3. King Salman Road (North East-West) */}
            <line x1="0" y1="90" x2="1000" y2="90" stroke="#334155" strokeWidth="3" opacity="0.7" />
            <text x="40" y="82" fill="#64748b" fontSize="10" fontWeight="bold">KING SALMAN ROAD (طريق الملك سلمان)</text>

            {/* 4. Prince Turki Al Awwal Rd */}
            <line x1="380" y1="0" x2="380" y2="650" stroke="#334155" strokeWidth="2.5" opacity="0.7" />
            <text x="386" y="520" fill="#64748b" fontSize="10" fontWeight="bold">PRINCE TURKI AL AWWAL</text>

            {/* 5. Olaya Street */}
            <line x1="600" y1="0" x2="600" y2="650" stroke="#1e293b" strokeWidth="2" opacity="0.8" />

            {/* 6. Anas Ibn Malik Rd */}
            <line x1="0" y1="180" x2="1000" y2="180" stroke="#1e293b" strokeWidth="2" opacity="0.8" />
            <text x="40" y="172" fill="#64748b" fontSize="9">ANAS IBN MALIK RD (طريق أنس بن مالك)</text>

            {/* Riyadh Metro Blue & Yellow Lines Overlay if active */}
            {activeLayer === 'metro' && (
              <g>
                <line x1="520" y1="20" x2="520" y2="630" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
                <circle cx="520" cy="220" r="14" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="2" />
                <text x="540" y="225" fill="#fbbf24" fontSize="11" fontWeight="bold">KAFD Metro Hub (محطة كافد الرئيسية)</text>

                <circle cx="520" cy="310" r="10" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="540" y="315" fill="#fcd34d" fontSize="10">Northern Ring Metro</text>
              </g>
            )}

            {/* District Titles */}
            <g fill="#94a3b8" fontSize="13" fontWeight="bold" letterSpacing="1">
              <text x="310" y="220" fill="#e2e8f0" opacity="0.5">HITTIN (حي حطين)</text>
              <text x="340" y="130" fill="#e2e8f0" opacity="0.5">AL MALQA (حي الملقا)</text>
              <text x="540" y="200" fill="#e2e8f0" opacity="0.6">KAFD (كافد)</text>
              <text x="410" y="380" fill="#e2e8f0" opacity="0.5">AL NAKHEEL (النخيل)</text>
              <text x="630" y="120" fill="#e2e8f0" opacity="0.5">AL YASMIN (الياسمين)</text>
              <text x="380" y="560" fill="#e2e8f0" opacity="0.5">DIPLOMATIC QUARTER (حي السفارات)</text>
              <text x="680" y="80" fill="#cbd5e1" opacity="0.4">AL NARJIS (النرجس)</text>
            </g>

            {/* Boulevard Riyadh City & Iconic Landmarks */}
            <rect x="290" y="240" width="60" height="30" rx="6" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" />
            <text x="320" y="259" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">BOULEVARD CITY</text>
          </svg>

          {/* Interactive Property Map Pins with SAR Prices */}
          {properties.map((property) => {
            const isSelected = selectedProperty?.id === property.id;
            return (
              <div
                key={property.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200"
                style={{
                  left: `${property.coordinates.mapX}%`,
                  top: `${property.coordinates.mapY}%`,
                }}
              >
                {/* Radar pulse for active/selected */}
                {isSelected && (
                  <div className="absolute inset-0 w-12 h-12 -left-3 -top-3 rounded-full bg-amber-500/20 pulse-radar pointer-events-none" />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProperty(property);
                  }}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-2xl transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-110'
                      : 'bg-slate-900/95 text-white border border-slate-700/80 hover:border-amber-400/60 hover:bg-slate-800 hover:scale-105'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950 fill-slate-950' : 'text-amber-400'}`} />
                  <span className="font-mono-num tracking-tight font-semibold">
                    SAR {(property.price / 1000000).toFixed(2)}M
                  </span>

                  {property.status === 'Hot Deal' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Selected Property Quick-Card Overlay */}
      {selectedProperty && (
        <div className="absolute left-4 right-4 sm:left-6 sm:right-auto sm:w-96 bottom-4 z-30 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start gap-3.5">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-24 h-24 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase tracking-wide">
                  {selectedProperty.propertyType}
                </span>
                <span className="text-sm font-bold text-white font-mono-num">
                  SAR {selectedProperty.price.toLocaleString()}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white truncate mt-1">
                {selectedProperty.title}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {selectedProperty.district}, {selectedProperty.city}
              </p>

              <div className="flex items-center gap-2.5 text-xs text-slate-300 mt-2 font-mono-num">
                <span>{selectedProperty.beds} Beds</span>
                <span>•</span>
                <span>{selectedProperty.baths} Baths</span>
                <span>•</span>
                <span>{selectedProperty.sqm} m²</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => onOpenVirtualTour(selectedProperty)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              Virtual Tour (جولة 360)
            </button>
            <button
              onClick={() => onOpenAgentChat(selectedProperty)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat Broker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
