import React, { useState } from 'react';
import { Property, VirtualTourRoom, VirtualTourHotspot } from '../types';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Eye, 
  Maximize2, 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  FileText,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface VirtualTourModalProps {
  property: Property;
  onClose: () => void;
  onOpenAgentChat: (property: Property) => void;
  onOpenDocumentPrep: (property: Property) => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  property,
  onClose,
  onOpenAgentChat,
  onOpenDocumentPrep,
}) => {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<VirtualTourHotspot | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const currentRoom: VirtualTourRoom = property.virtualTourRooms[activeRoomIndex] || property.virtualTourRooms[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - panX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - startX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Header Bar - Redfin Style */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-[#C82021] border border-red-100">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">{property.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C82021] text-white uppercase tracking-wider">
                  3D Walkthrough
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {currentRoom.name} • {property.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isAudioPlaying
                  ? 'bg-red-50 text-[#C82021] border-red-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAudioPlaying ? 'Mute' : 'Play Narration'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 360 Viewing Canvas */}
        <div
          className={`relative flex-1 bg-black overflow-hidden select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Panoramic Image Container */}
          <div
            className="w-full h-full relative flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `translateX(${panX}px) scale(${zoomScale})`,
            }}
          >
            <img
              src={currentRoom.imageUrl}
              alt={currentRoom.name}
              className="w-full h-full object-cover min-w-[140%] max-w-none pointer-events-none"
            />

            {/* Interactive Feature Hotspots */}
            {currentRoom.hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(hotspot);
                }}
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-[#C82021] text-white flex items-center justify-center ring-4 ring-white/60 shadow-lg group-hover:scale-110 transition-transform">
                  <Info className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          {/* Hotspot Detail Card Popup */}
          {selectedHotspot && (
            <div className="absolute left-6 bottom-6 z-30 max-w-xs bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-xl text-gray-900 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#C82021]">ميزة معمارية موثقة</span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-bold text-gray-900 mt-2">{selectedHotspot.title}</h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                {selectedHotspot.description}
              </p>
            </div>
          )}

          {/* Quick Zoom Controls */}
          <div className="absolute right-4 bottom-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-gray-200 p-1 rounded-xl shadow-md">
            <button
              onClick={() => setZoomScale((z) => Math.min(2, z + 0.2))}
              className="p-1.5 text-gray-700 hover:text-[#C82021] rounded-lg"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale((z) => Math.max(0.8, z - 0.2))}
              className="p-1.5 text-gray-700 hover:text-[#C82021] rounded-lg"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoomScale(1); setPanX(0); }}
              className="px-2 py-1 text-xs text-gray-700 hover:text-[#C82021] rounded-lg font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Bottom Room Navigation & Action Strip */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 z-20 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Room Selector Strip */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 no-scrollbar">
            {property.virtualTourRooms.map((room, idx) => (
              <button
                key={room.id}
                onClick={() => {
                  setActiveRoomIndex(idx);
                  setSelectedHotspot(null);
                  setPanX(0);
                  setZoomScale(1);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  activeRoomIndex === idx
                    ? 'bg-[#C82021] text-white border-[#C82021] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{room.name}</span>
                <span className={`text-[10px] font-mono-num ${activeRoomIndex === idx ? 'text-white/80' : 'text-gray-400'}`}>
                  {room.sqft} sqft
                </span>
              </button>
            ))}
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onOpenAgentChat(property);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C82021]" />
              Book In-Person Showing
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenDocumentPrep(property);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold transition-colors shadow-xs active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              Prepare Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
