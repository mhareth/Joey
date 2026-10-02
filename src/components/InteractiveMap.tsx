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
  Building,
  X
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
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden border border-gray-200 bg-[#f4f6f8] shadow-xs select-none">
      
      {/* Map Header Toolbar - Redfin Style */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Layer Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-sm pointer-events-auto">
          <button
            onClick={() => setActiveLayer('blueprint')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'blueprint'
                ? 'bg-[#C82021] text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>خريطة الرياض</span>
          </button>
          <button
            onClick={() => setActiveLayer('heatmap')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'heatmap'
                ? 'bg-[#C82021] text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>حرارة الأسعار</span>
          </button>
          <button
            onClick={() => setActiveLayer('metro')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'metro'
                ? 'bg-[#C82021] text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>كافد ومسار المترو</span>
          </button>
        </div>

        {/* Live Market Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 text-xs font-bold text-gray-700 shadow-sm pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>REGA Verified · صفقات حية</span>
        </div>
      </div>

      {/* Floating Zoom & Control Dock */}
      <div className="absolute right-4 bottom-6 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md border border-gray-200 p-1 rounded-xl shadow-md">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-gray-700 hover:text-[#C82021] hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-gray-700 hover:text-[#C82021] hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg text-gray-700 hover:text-[#C82021] hover:bg-gray-50 transition-colors border-t border-gray-100"
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
          {/* Custom Clean Light Redfin Map Base of Riyadh */}
          <svg className="w-full h-full min-w-[800px] min-h-[500px]" viewBox="0 0 1000 650" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Light Map Background */}
              <linearGradient id="lightMapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>

              {/* Wadi Hanifa lush greenery */}
              <linearGradient id="wadiHanifaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="100%" stopColor="#a7f3d0" />
              </linearGradient>

              {/* Price Heatmaps in soft pastel glows */}
              <radialGradient id="heatHittin" cx="38%" cy="36%" r="22%">
                <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#fef2f2" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heatKAFD" cx="52%" cy="34%" r="24%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#eff6ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heatMalqa" cx="42%" cy="22%" r="20%">
                <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#eef2ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base Canvas Fill */}
            <rect width="1000" height="650" fill="url(#lightMapBg)" />

            {/* Subtle Urban Grid */}
            <g stroke="#e2e8f0" strokeWidth="0.75" strokeDasharray="3 3">
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
            <text x="220" y="320" fill="#059669" opacity="0.6" fontSize="11" fontWeight="bold" letterSpacing="1">WADI HANIFA (وادي حنيفة)</text>

            {/* Major Arteries / Ring Roads */}
            {/* 1. King Fahd Road */}
            <line x1="520" y1="0" x2="520" y2="650" stroke="#cbd5e1" strokeWidth="5" />
            <text x="528" y="80" fill="#64748b" fontSize="10" fontWeight="bold">KING FAHD ROAD (طريق الملك فهد)</text>

            {/* 2. Northern Ring Road */}
            <line x1="0" y1="310" x2="1000" y2="310" stroke="#cbd5e1" strokeWidth="5" />
            <text x="40" y="302" fill="#64748b" fontSize="10" fontWeight="bold">NORTHERN RING ROAD (الطريق الدائري الشمالي)</text>

            {/* 3. King Salman Road */}
            <line x1="0" y1="90" x2="1000" y2="90" stroke="#e2e8f0" strokeWidth="4" />
            <text x="40" y="82" fill="#94a3b8" fontSize="10" fontWeight="bold">KING SALMAN ROAD (طريق الملك سلمان)</text>

            {/* 4. Prince Turki Al Awwal Rd */}
            <line x1="380" y1="0" x2="380" y2="650" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="6 4" />
            <text x="385" y="160" fill="#94a3b8" fontSize="9" fontWeight="semibold">Prince Turki Al Awwal Rd</text>

            {/* 5. Anas Ibn Malik Rd */}
            <line x1="0" y1="210" x2="1000" y2="210" stroke="#e2e8f0" strokeWidth="3" />
            <text x="700" y="202" fill="#94a3b8" fontSize="9" fontWeight="semibold">Anas Ibn Malik Rd (طريق أنس بن مالك)</text>

            {/* District Enclosures & Labels */}
            <g opacity="0.85">
              {/* Hittin */}
              <rect x="300" y="220" width="160" height="80" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <text x="340" y="255" fill="#1e293b" fontSize="12" fontWeight="bold">HITTIN (حطين)</text>
              <text x="325" y="275" fill="#64748b" fontSize="9">Avg: SAR 13,200/m²</text>

              {/* Al Malqa */}
              <rect x="300" y="100" width="160" height="90" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <text x="330" y="138" fill="#1e293b" fontSize="12" fontWeight="bold">AL MALQA (الملقا)</text>
              <text x="325" y="158" fill="#64748b" fontSize="9">Avg: SAR 11,500/m²</text>

              {/* KAFD Hub */}
              <rect x="470" y="210" width="150" height="90" rx="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
              <text x="500" y="245" fill="#1e40af" fontSize="13" fontWeight="bold">KAFD (كافد)</text>
              <text x="485" y="265" fill="#3b82f6" fontSize="9">Financial District · Metro</text>

              {/* Al Nakheel */}
              <rect x="300" y="325" width="160" height="80" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <text x="325" y="360" fill="#1e293b" fontSize="12" fontWeight="bold">AL NAKHEEL (النخيل)</text>

              {/* Al Yasmin */}
              <rect x="470" y="100" width="150" height="90" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <text x="495" y="140" fill="#1e293b" fontSize="12" fontWeight="bold">AL YASMIN (الياسمين)</text>
            </g>

            {/* Riyadh Landmarks / Points of Interest */}
            {/* KAFD Landmark */}
            <g transform="translate(540, 230)">
              <rect x="-15" y="-15" width="30" height="30" rx="6" fill="#1e3a8a" />
              <text x="-8" y="5" fill="#ffffff" fontSize="10" fontWeight="bold">🏙️</text>
            </g>

            {/* Boulevard Riyadh City */}
            <g transform="translate(340, 290)">
              <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#be185d" />
              <text x="-6" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">🎡</text>
              <text x="16" y="4" fill="#be185d" fontSize="9" fontWeight="bold">Boulevard City</text>
            </g>
          </svg>

          {/* Interactive Property Map Pins - Redfin Signature Price Badges */}
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
                {/* Redfin Radar pulse for active/selected */}
                {isSelected && (
                  <div className="absolute inset-0 w-12 h-12 -left-3 -top-3 rounded-full bg-red-500/20 pulse-radar pointer-events-none" />
                )}

                {/* Redfin Pill Pin */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProperty(property);
                  }}
                  className={`group relative flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs shadow-md transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#C82021] text-white ring-3 ring-red-200 scale-110'
                      : 'bg-white text-gray-900 border border-gray-300 hover:border-[#C82021] hover:text-[#C82021] hover:scale-105'
                  }`}
                >
                  <span className="font-mono-num font-bold tracking-tight">
                    SAR {(property.price / 1000000).toFixed(1)}M
                  </span>

                  {property.status === 'Hot Deal' && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#C82021]'}`}></span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Selected Property Quick-Card Overlay - Redfin Style */}
      {selectedProperty && (
        <div className="absolute left-4 right-4 sm:left-6 sm:right-auto sm:w-96 bottom-4 z-30 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start gap-3.5">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-24 h-24 rounded-xl object-cover ring-1 ring-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 uppercase tracking-wide">
                  {selectedProperty.propertyType}
                </span>
                <span className="text-base font-black text-gray-900 font-mono-num">
                  SAR {selectedProperty.price.toLocaleString()}
                </span>
              </div>

              <h4 className="text-xs font-bold text-gray-900 truncate mt-1">
                {selectedProperty.title}
              </h4>
              <p className="text-[11px] text-gray-500 truncate">
                {selectedProperty.address}, {selectedProperty.district}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-700 mt-2 font-semibold">
                <span>{selectedProperty.beds} beds</span>
                <span className="text-gray-300">·</span>
                <span>{selectedProperty.baths} baths</span>
                <span className="text-gray-300">·</span>
                <span>{selectedProperty.sqm} m²</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => onOpenVirtualTour(selectedProperty)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#C82021]" />
              <span>3D Tour</span>
            </button>
            <button
              onClick={() => onOpenAgentChat(selectedProperty)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat Broker</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
