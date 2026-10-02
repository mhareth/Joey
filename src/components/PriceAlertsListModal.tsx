import React, { useState } from 'react';
import { PriceAlert, Property } from '../types';
import { 
  Bell, 
  X, 
  TrendingDown, 
  CheckCircle2, 
  Trash2, 
  Play, 
  ShieldCheck,
  Eye, 
  FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PriceAlertsListModalProps {
  alerts: PriceAlert[];
  properties: Property[];
  onClose: () => void;
  onToggleActive: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
  onSimulatePriceDrop: (alertId: string) => void;
  onSelectProperty?: (property: Property) => void;
  onOpenDocumentPrep?: (property: Property) => void;
  onOpenSetAlertModal?: () => void;
}

export const PriceAlertsListModal: React.FC<PriceAlertsListModalProps> = ({
  alerts,
  properties,
  onClose,
  onToggleActive,
  onDeleteAlert,
  onSimulatePriceDrop,
  onSelectProperty,
  onOpenDocumentPrep,
  onOpenSetAlertModal,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'triggered' | 'monitoring'>('all');

  const triggeredCount = alerts.filter(a => a.isTriggered).length;
  const filteredAlerts = alerts.filter(a => {
    if (filterTab === 'triggered') return a.isTriggered;
    if (filterTab === 'monitoring') return !a.isTriggered && a.active;
    return true;
  });

  const totalSavingsSAR = alerts.reduce((acc, a) => {
    return acc + (a.triggeredDetails?.savingsSAR || 0);
  }, 0);

  const handleSimulate = (alertId: string) => {
    onSimulatePriceDrop(alertId);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header - Redfin Clean Style */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-[#C82021] border border-red-100">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 font-sans">
                  تنبيهات أسعار العقارات المحفوظة
                </h3>
                <span className="text-xs text-[#C82021] font-bold">
                  Saved Price Alerts
                </span>
                {triggeredCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-700 text-white animate-pulse">
                    {triggeredCount} New Drop{triggeredCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                متابعة فورية لتغيرات أسعار فلل وبنتهاوسات الرياض والتنبيه عند انخفاض السعر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSetAlertModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSetAlertModal();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold transition-colors shadow-xs"
              >
                + تنبيه جديد
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-gray-500 block">إجمالي التنبيهات</span>
              <span className="text-xl font-bold text-gray-900 font-mono-num">{alerts.length} Alerts</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <span className="text-[11px] text-gray-500 block">انخفاضات تم رصدها</span>
              <span className="text-xl font-bold text-emerald-700 font-mono-num">{triggeredCount} Triggered</span>
            </div>
            {totalSavingsSAR > 0 && (
              <>
                <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-[11px] text-gray-500 block">إجمالي التوفير المرصود</span>
                  <span className="text-xl font-bold text-[#C82021] font-mono-num">
                    SAR {totalSavingsSAR.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterTab === 'all'
                  ? 'bg-gray-900 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              الكل ({alerts.length})
            </button>
            <button
              onClick={() => setFilterTab('triggered')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterTab === 'triggered'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              انخفض السعر ({triggeredCount})
            </button>
            <button
              onClick={() => setFilterTab('monitoring')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterTab === 'monitoring'
                  ? 'bg-[#C82021] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              قيد المراقبة ({alerts.length - triggeredCount})
            </button>
          </div>
        </div>

        {/* Alerts List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar bg-white">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const matchedProp = properties.find(p => p.id === alert.propertyId);

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    alert.isTriggered
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {alert.propertyImage ? (
                        <img
                          src={alert.propertyImage}
                          alt={alert.propertyTitle || 'Property'}
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#C82021] shrink-0">
                          <Bell className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            {alert.propertyTitle || `تنبيه معايير: ${alert.district}`}
                          </h4>

                          {alert.isTriggered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-700 text-white">
                              <TrendingDown className="w-3 h-3" />
                              انخفاض السعر رُصد! (-{alert.triggeredDetails?.dropPercent || alert.targetDropPercent}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                              قيد المراقبة الفورية
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500">
                          {alert.district} • السعر المستهدف:{' '}
                          <strong className="text-gray-900 font-mono-num font-bold">
                            SAR {alert.targetPrice.toLocaleString()}
                          </strong>{' '}
                          (-{alert.targetDropPercent}%)
                        </p>

                        {/* Price Details Block */}
                        <div className="flex items-baseline gap-3 text-xs font-mono-num pt-1">
                          {alert.isTriggered && alert.triggeredDetails ? (
                            <>
                              <span className="line-through text-gray-400">
                                SAR {alert.triggeredDetails.oldPrice.toLocaleString()}
                              </span>
                              <span className="text-base font-black text-emerald-800">
                                SAR {alert.triggeredDetails.newPrice.toLocaleString()}
                              </span>
                              <span className="text-[#C82021] font-bold">
                                توفير: SAR {alert.triggeredDetails.savingsSAR.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-500">السعر الحالي:</span>
                              <span className="text-sm font-bold text-gray-900">
                                SAR {alert.currentPrice.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      
                      {/* Test Simulator Button */}
                      {!alert.isTriggered && (
                        <button
                          onClick={() => handleSimulate(alert.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#C82021] border border-red-200 text-[11px] font-bold transition-colors active:scale-95"
                          title="Simulate instant price drop to test notification"
                        >
                          <Play className="w-3 h-3 fill-[#C82021]" />
                          محاكاة انخفاض السعر
                        </button>
                      )}

                      {/* If Triggered */}
                      {alert.isTriggered && matchedProp && (
                        <div className="flex items-center gap-1.5">
                          {onSelectProperty && (
                            <button
                              onClick={() => {
                                onSelectProperty(matchedProp);
                                onClose();
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#C82021]" />
                              معاينة العقار
                            </button>
                          )}

                          {onOpenDocumentPrep && (
                            <button
                              onClick={() => {
                                onOpenDocumentPrep(matchedProp);
                                onClose();
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors active:scale-95 whitespace-nowrap"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              تقديم عرض الشراء
                            </button>
                          )}
                        </div>
                      )}

                      {/* Active toggle */}
                      <button
                        onClick={() => onToggleActive(alert.id)}
                        className={`p-1.5 rounded-xl border text-xs transition-colors ${
                          alert.active
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                        }`}
                        title={alert.active ? 'Disable Alert' : 'Enable Alert'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteAlert(alert.id)}
                        className="p-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>القنوات:</span>
                      {alert.channels.inApp && <span className="text-[#C82021] font-semibold">تطبيق</span>}
                      {alert.channels.email && <span>بريد: {alert.email}</span>}
                      {alert.channels.whatsapp && <span className="text-emerald-700 font-semibold">واتساب</span>}
                    </div>
                    <span>
                      {alert.isTriggered && alert.triggeredDetails
                        ? `انخفض: ${alert.triggeredDetails.date}`
                        : `تم الإنشاء: ${new Date(alert.createdAt).toLocaleDateString('ar-SA')}`}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-800 font-semibold">
                لا توجد تنبيهات في هذا القسم
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                يمكنك تفعيل تنبيه انخفاض السعر لأي فيلا أو بنتهاوس في الرياض لتصلك رسالة فورية عبر التطبيق والواتساب.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>تحديثات الأسعار متطابقة مع صفقات البورصة العقارية</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
