import React from 'react';
import { PriceAlert, Property } from '../types';
import { TrendingDown, X, Eye, FileText, Bell } from 'lucide-react';

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
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-4 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <TrendingDown className="w-5 h-5 animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                Price Drop Alert!
              </span>
              <span className="text-xs font-bold text-white font-serif-display">
                تنبيه انخفاض السعر
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
              {alert.propertyTitle || `عقارات ${alert.district}`}
            </h4>

            {details && (
              <div className="flex items-baseline gap-2 text-xs font-mono-num pt-0.5">
                <span className="line-through text-slate-500">
                  SAR {details.oldPrice.toLocaleString()}
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  SAR {details.newPrice.toLocaleString()}
                </span>
                <span className="text-amber-300 font-bold text-[11px]">
                  (وفرت SAR {details.savingsSAR.toLocaleString()})
                </span>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              تم إرسال إشعار فوري إلى واتساب وبريدك {alert.email}.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-800">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              معاينة العقار
            </button>

            {onOpenDocumentPrep && (
              <button
                onClick={() => {
                  onOpenDocumentPrep(property);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
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
