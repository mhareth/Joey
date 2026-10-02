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
  Bell,
  Camera
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

  // Estimated monthly Sharia Murabaha installment
  const loanSAR = property.price * 0.85;
  const monthlyRate = 0.0399 / 12;
  const n = 25 * 12;
  const estimatedMonthlyInstallment = Math.round(
    (loanSAR * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  );

  const isPriceDropped = Boolean(property.originalPrice && property.originalPrice > property.price);
  const priceDropAmount = isPriceDropped ? property.originalPrice! - property.price : 0;

  return (
    <div 
      onClick={() => onSelectProperty?.(property)}
      className="group bg-white border border-gray-200 hover:border-gray-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Redfin Image Carousel Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={property.images[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Carousel arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Badges - Redfin Style */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isPriceDropped && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white shadow-2xs">
                Price Drop
              </span>
            )}
            {property.status === 'Hot Deal' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C82021] text-white shadow-2xs">
                Hot Deal
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-900/80 text-white backdrop-blur-xs">
              {property.propertyType}
            </span>
          </div>

          {/* Top-Right Action Buttons: Price Alert & Save */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onOpenPriceAlert && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPriceAlert(property);
                }}
                className={`p-2 rounded-full backdrop-blur-xs transition-colors shadow-2xs ${
                  hasAlert
                    ? 'bg-[#C82021] text-white font-bold'
                    : 'bg-white/90 hover:bg-white text-gray-700 hover:text-[#C82021]'
                }`}
                title={hasAlert ? 'تنبيه السعر مفعّل (Alert Active)' : 'تفعيل تنبيه انخفاض السعر (Set Price Alert)'}
              >
                <Bell className={`w-3.5 h-3.5 ${hasAlert ? 'fill-white text-white' : ''}`} />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(property);
              }}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#C82021] transition-colors shadow-2xs"
              title="Save Property (حفظ العقار)"
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#C82021] text-[#C82021]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Photo count indicator - Redfin Style */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/65 text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 pointer-events-none">
          <Camera className="w-3 h-3" />
          <span>{currentImgIndex + 1}/{property.images.length}</span>
        </div>

        {/* Virtual Tour Pill */}
        <div className="absolute bottom-2.5 left-2.5 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenVirtualTour(property);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/95 hover:bg-white text-gray-900 text-[11px] font-bold shadow-2xs transition-colors"
          >
            <Eye className="w-3 h-3 text-[#C82021]" />
            <span>3D Tour</span>
          </button>
        </div>
      </div>

      {/* Property Details Body - Redfin Clean Typography */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Monthly Estimate */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-black text-gray-900 font-mono-num">
                SAR {property.price.toLocaleString()}
              </span>
              {isPriceDropped && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-400 line-through font-mono-num">
                    SAR {property.originalPrice!.toLocaleString()}
                  </span>
                  <span className="text-emerald-700 font-bold font-mono-num text-[11px]">
                    (-SAR {priceDropAmount.toLocaleString()})
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 font-mono-num">
              ~SAR {estimatedMonthlyInstallment.toLocaleString()}/mo
            </span>
          </div>

          {/* Specs inline row: beds · baths · sqm */}
          <div className="flex items-center gap-2 mt-1.5 text-sm font-semibold text-gray-800">
            <span>{property.beds} <span className="font-normal text-gray-500 text-xs">beds</span></span>
            <span className="text-gray-300">·</span>
            <span>{property.baths} <span className="font-normal text-gray-500 text-xs">baths</span></span>
            <span className="text-gray-300">·</span>
            <span>{property.sqm} <span className="font-normal text-gray-500 text-xs">sq m</span></span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="text-xs text-gray-500 hidden sm:inline font-mono-num">
              SAR {property.pricePerSqm.toLocaleString()}/m²
            </span>
          </div>

          {/* Address Line */}
          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
            {property.address}, {property.district}
          </p>

          {/* AI Match Reason if available */}
          {property.aiMatchReason && (
            <p className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2 line-clamp-2">
              <strong className="text-gray-900">AI Note:</strong> {property.aiMatchReason}
            </p>
          )}
        </div>

        {/* Bottom Brokerage Bar - Redfin Certified Agent */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
            />
            <div className="truncate">
              <p className="text-[11px] font-bold text-gray-800 truncate">{property.agent.name}</p>
              <p className="text-[10px] text-gray-500 truncate">REGA Fal Verified · {property.agent.company}</p>
            </div>
          </div>

          {/* Actions: Chat & Offer */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAgentChat(property);
              }}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Chat with Certified Broker"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDocumentPrep(property);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-2xs transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>Make Offer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
