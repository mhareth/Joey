import React from 'react';
import { Property } from '../types';
import { X, Heart, Eye, FileText, MessageSquare, Trash2, ArrowRight } from 'lucide-react';

interface SavedPropertiesModalProps {
  savedProperties: Property[];
  onClose: () => void;
  onRemoveSaved: (property: Property) => void;
  onOpenVirtualTour: (property: Property) => void;
  onOpenDocumentPrep: (property: Property) => void;
}

export const SavedPropertiesModal: React.FC<SavedPropertiesModalProps> = ({
  savedProperties,
  onClose,
  onRemoveSaved,
  onOpenVirtualTour,
  onOpenDocumentPrep,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="font-bold text-white text-base">
              Saved Shortlist ({savedProperties.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
          {savedProperties.length > 0 ? (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/30 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{prop.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {prop.address}, {prop.city}
                    </p>
                    <span className="text-sm font-extrabold text-amber-400 font-mono-num">
                      ${prop.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVirtualTour(prop);
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs"
                    title="Virtual Tour"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDocumentPrep(prop);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Offer
                  </button>
                  <button
                    onClick={() => onRemoveSaved(prop)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No saved properties yet. Tap the heart icon on any listing card to add it to your shortlist.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
