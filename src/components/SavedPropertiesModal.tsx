import React from 'react';
import { Property } from '../types';
import { X, Heart, Eye, FileText, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C82021] fill-[#C82021]" />
            <h3 className="font-bold text-gray-900 text-base">
              العقارات المحفوظة • Saved Homes ({savedProperties.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
          {savedProperties.length > 0 ? (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{prop.title}</h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {prop.address}, {prop.district}
                    </p>
                    <span className="text-sm font-black text-gray-900 font-mono-num">
                      SAR {prop.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onOpenVirtualTour(prop);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold"
                    title="Virtual Tour"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C82021]" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenDocumentPrep(prop);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Make Offer</span>
                  </button>

                  <button
                    onClick={() => onRemoveSaved(prop)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50"
                    title="Remove from Saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <Heart className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">لم تقم بحفظ أي عقارات بعد</p>
              <p className="text-xs">اضغط على أيقونة القلب في أي بطاقة عقار لحفظها في قائمتك.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
