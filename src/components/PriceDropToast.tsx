import React from 'react';
import { PriceAlert, Property } from '../types';
import { TrendingDown, X, Eye, FileText } from 'lucide-react';

interface PriceDropToastProps {
  alert: PriceAlert;
  property?: Property;
  onClose: () => void;
  onViewProperty: (property: Property) => void;
  onOpenDocumentPrep?: (property: Property) => void;
}

export const PriceDropToast: React.FC<PriceDropToastProps> = ({
  alert,
  property,
  onClose,
  onViewProperty,
  onOpenDocumentPrep,
}) => {
  const details = alert.triggeredDetails;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <TrendingDown className="w-5 h-5 animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-700 text-white">
                Price Drop Alert!
              </span>
              <span className="text-xs font-bold text-gray-900">
                تنبيه انخفاض السعر
              </span>
            </div>

            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">
              {alert.propertyTitle || `عقارات ${alert.district}`}
            </h4>

            {details && (
              <div className="flex items-baseline gap-2 text-xs font-mono-num pt-0.5">
                <span className="line-through text-gray-400">
                  SAR {details.oldPrice.toLocaleString()}
                </span>
                <span className="text-sm font-black text-emerald-700">
                  SAR {details.newPrice.toLocaleString()}
                </span>
                <span className="text-[#C82021] font-bold text-[11px]">
                  (وفرت SAR {details.savingsSAR.toLocaleString()})
                </span>
              </div>
            )}

            <p className="text-[11px] text-gray-500">
              تم إرسال إشعار فوري إلى واتساب وبريدك {alert.email}.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 p-1 rounded-lg bg-gray-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-gray-100">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
        >
          لاحقاً
        </button>

        {property && (
          <>
            <button
              onClick={() => {
                onViewProperty(property);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5 text-[#C82021]" />
              معاينة العقار
            </button>

            {onOpenDocumentPrep && (
              <button
                onClick={() => {
                  onOpenDocumentPrep(property);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                تقديم عرض بالسعر المخفض
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
