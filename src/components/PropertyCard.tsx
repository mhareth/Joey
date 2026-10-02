import React, { useState } from 'react';
import { Property } from '../types';
import { 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Eye, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  hasAlert?: boolean;
  onToggleSave: (property: Property) => void;
  onOpenPriceAlert?: (property: Property) => void;
  onOpenVirtualTour: (property: Property) => void;
  onOpenAgentChat: (property: Property) => void;
  onOpenDocumentPrep: (property: Property) => void;
  onSelectProperty?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  hasAlert,
  onToggleSave,
  onOpenPriceAlert,
  onOpenVirtualTour,
  onOpenAgentChat,
  onOpenDocumentPrep,
  onSelectProperty,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Estimated monthly Sharia Murabaha installment (assuming 15% down, 3.99% profit rate over 25 years)
  const loanSAR = property.price * 0.85;
  const monthlyRate = 0.0399 / 12;
  const n = 25 * 12;
  const estimatedMonthlyInstallment = Math.round(
    (loanSAR * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  );

  return (
    <div 
      onClick={() => onSelectProperty?.(property)}
      className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Carousel Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={property.images[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Carousel controls */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/30">
              {property.propertyType}
            </span>
            {property.status === 'Hot Deal' && (
              <span className="px-2 py-0.5 rounded-xl text-[10px] font-bold bg-rose-500/90 text-white shadow-md">
                🔥 Hot Deal
              </span>
            )}
            {property.status === 'Price Drop' && (
              <span className="px-2 py-0.5 rounded-xl text-[10px] font-bold bg-emerald-500/90 text-white shadow-md">
                📉 Price Reduced
              </span>
            )}
            {property.aiMatchScore && (
              <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 fill-slate-950" /> {property.aiMatchScore}% Match
              </span>
            )}
          </div>

          {/* Top-Right Action Buttons: Price Alert & Save */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onOpenPriceAlert && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPriceAlert(property);
                }}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                  hasAlert
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950/70 hover:bg-slate-900 border-white/10 text-white hover:text-amber-400'
                }`}
                title={hasAlert ? 'تنبيه انخفاض السعر مفعل (Alert Active)' : 'تفعيل تنبيه انخفاض السعر (Set Price Alert)'}
              >
                <Bell className={`w-4 h-4 ${hasAlert ? 'fill-slate-950 text-slate-950' : ''}`} />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(property);
              }}
              className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md border border-white/10 text-white hover:text-amber-400 transition-colors"
              title="Save Property"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Image index indicator dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none">
          {property.images.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentImgIndex ? 'bg-amber-400 w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Virtual Tour Pill Badge */}
        <div className="absolute bottom-3 left-3 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenVirtualTour(property);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/85 hover:bg-amber-500 text-slate-200 hover:text-slate-950 backdrop-blur-md border border-white/10 text-xs font-semibold transition-all shadow-lg active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400 group-hover:text-inherit" />
            360° Virtual Tour ({property.virtualTourRooms.length} Rooms)
          </button>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Monthly Estimate */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono-num">
                SAR {property.price.toLocaleString()}
              </span>
              {property.originalPrice && property.originalPrice > property.price && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-500 line-through font-mono-num">
                    SAR {property.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono-num border border-emerald-500/20">
                    -SAR {(property.originalPrice - property.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-amber-400 font-mono-num font-semibold">
              ~SAR {estimatedMonthlyInstallment.toLocaleString()}/mo
            </span>
          </div>

          {/* Title & District */}
          <h3 className="text-base font-bold text-slate-100 mt-1 line-clamp-1 group-hover:text-amber-300 transition-colors">
            {property.title}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            {property.district}, {property.city}
          </p>

          {/* Specs: Bed, Bath, Sqm */}
          <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-800 text-xs text-slate-300 font-mono-num">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-amber-400/80" />
              <span>{property.beds} <span className="text-slate-500 font-sans">Beds</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-amber-400/80" />
              <span>{property.baths} <span className="text-slate-500 font-sans">Baths</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-amber-400/80" />
              <span>{property.sqm} <span className="text-slate-500 font-sans">m²</span></span>
            </div>
          </div>

          {/* AI Match Reason if available */}
          {property.aiMatchReason && (
            <div className="mb-3 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
              <div className="flex items-center gap-1 font-semibold text-amber-300 mb-0.5">
                <Sparkles className="w-3 h-3" /> AI Riyadh Insight
              </div>
              <p className="line-clamp-2 leading-relaxed text-[11px] text-slate-300">{property.aiMatchReason}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 10-Yr Malath Insurance
            </span>
            {property.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-800 text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Agent Avatar / Name */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/30 shrink-0"
            />
            <div className="truncate">
              <p className="text-[11px] font-semibold text-slate-200 truncate">{property.agent.name}</p>
              <p className="text-[10px] text-amber-400/80 truncate">★ {property.agent.rating} • REGA Fal Verified</p>
            </div>
          </div>

          {/* Actions: Chat & Offer */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAgentChat(property);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-semibold"
              title="Chat with Certified Broker"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDocumentPrep(property);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              Make Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
