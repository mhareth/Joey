import React, { useState } from 'react';
import { Property, VirtualTourRoom, VirtualTourHotspot } from '../types';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Eye, 
  Compass, 
  Maximize2, 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  MessageSquare, 
  FileText,
  Sparkles,
  Layers,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  360° Virtual Tour
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                  Interactive Room Experience
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {property.title} • {property.address}, {property.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio narration toggle */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isAudioPlaying 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isAudioPlaying ? 'Narration Active' : 'Listen to Tour Guide'}
              </span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main 360 Viewing Stage */}
        <div className="relative flex-1 overflow-hidden bg-slate-950 select-none">
          
          {/* Pan / Drag Surface */}
          <div
            className={`w-full h-full relative overflow-hidden flex items-center justify-center cursor-grab ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="w-full h-full transition-transform duration-100 ease-out"
              style={{
                transform: `translateX(${panX}px) scale(${zoomScale})`,
              }}
            >
              <img
                src={currentRoom.imageUrl}
                alt={currentRoom.name}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Interactive Hotspots Overlay */}
              {currentRoom.hotspots.map((hotspot) => {
                const isSelected = selectedHotspot?.id === hotspot.id;
                return (
                  <div
                    key={hotspot.id}
                    className="absolute z-20 pointer-events-auto -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspot(isSelected ? null : hotspot);
                      }}
                      className={`group relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-2xl transition-transform active:scale-90 ${
                        isSelected
                          ? 'bg-amber-400 border-white text-slate-950 scale-125'
                          : 'bg-slate-950/85 border-amber-400 text-amber-300 hover:scale-110 hover:bg-amber-500 hover:text-slate-950'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating Hotspot Detail Modal / Popover */}
          {selectedHotspot && (
            <div className="absolute top-6 left-6 max-w-sm bg-slate-900/95 backdrop-blur-2xl border border-amber-400/40 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300">
                    <Info className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {selectedHotspot.title}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedHotspot.description}
              </p>

              {selectedHotspot.spec && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Architectural Spec:</span>
                  <span className="font-semibold text-amber-300 font-mono-num">{selectedHotspot.spec}</span>
                </div>
              )}
            </div>
          )}

          {/* Audio Narration Subtitle Banner */}
          {isAudioPlaying && (
            <div className="absolute top-6 right-6 max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-3.5 shadow-2xl z-20 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-3 bg-amber-400 animate-pulse rounded-full" />
                  <span className="w-1.5 h-5 bg-amber-400 animate-pulse delay-75 rounded-full" />
                  <span className="w-1.5 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
                </div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Tour Guide Narration • {currentRoom.name}
                </span>
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{currentRoom.narration}"
              </p>
              {currentRoom.ambientSoundTitle && (
                <p className="text-[10px] text-slate-500 mt-1 font-mono-num">
                  Ambient Audio: {currentRoom.ambientSoundTitle}
                </p>
              )}
            </div>
          )}

          {/* Floating Drag Instruction Hint */}
          <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Click and drag to pan 360° • Click glowing hotspots for details
          </div>

          {/* Zoom dock */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-1 rounded-xl shadow-xl">
            <button
              onClick={() => setZoomScale((z) => Math.min(1.8, z + 0.2))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale((z) => Math.max(1, z - 0.2))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoomScale(1); setPanX(0); }}
              className="px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Bottom Room Navigation & Action Strip */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 z-20 flex flex-col md:flex-row items-center justify-between gap-4">
          
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
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeRoomIndex === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{room.name}</span>
                <span className={`text-[10px] font-mono-num ${activeRoomIndex === idx ? 'text-slate-950/70' : 'text-slate-500'}`}>
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
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Book In-Person Showing
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenDocumentPrep(property);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
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
