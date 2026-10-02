import React, { useState } from 'react';
import { PriceAlert, Property } from '../types';
import { 
  Bell, 
  X, 
  TrendingDown, 
  CheckCircle2, 
  Trash2, 
  ExternalLink, 
  Play, 
  Sparkles,
  ShieldCheck,
  Mail,
  Smartphone,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-serif-display">
                  تنبيهات أسعار العقارات المحفوظة
                </h3>
                <span className="text-xs text-amber-400 font-mono-num font-semibold">
                  Saved Price Alerts
                </span>
                {triggeredCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 animate-pulse">
                    {triggeredCount} New Drop{triggeredCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                + تنبيه جديد
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-slate-400 block">إجمالي التنبيهات المراقبة</span>
              <span className="text-xl font-extrabold text-white font-mono-num">{alerts.length} Alerts</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[11px] text-slate-400 block">فرص تم رصد انخفاضها</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono-num">{triggeredCount} Triggered</span>
            </div>
            {totalSavingsSAR > 0 && (
              <>
                <div className="h-8 w-px bg-slate-800 hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-[11px] text-slate-400 block">إجمالي التوفير المرصود</span>
                  <span className="text-xl font-extrabold text-amber-300 font-mono-num">
                    SAR {totalSavingsSAR.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterTab === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({alerts.length})
            </button>
            <button
              onClick={() => setFilterTab('triggered')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterTab === 'triggered'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              فرص انخفضت ({triggeredCount})
            </button>
            <button
              onClick={() => setFilterTab('monitoring')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterTab === 'monitoring'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              قيد المراقبة ({alerts.length - triggeredCount})
            </button>
          </div>
        </div>

        {/* Alerts List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const matchedProp = properties.find(p => p.id === alert.propertyId);

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    alert.isTriggered
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {alert.propertyImage ? (
                        <img
                          src={alert.propertyImage}
                          alt={alert.propertyTitle || 'Property'}
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                          <Bell className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">
                            {alert.propertyTitle || `تنبيه معايير: ${alert.district}`}
                          </h4>

                          {alert.isTriggered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <TrendingDown className="w-3 h-3 text-emerald-400" />
                              انخفاض السعر رُصد! (-{alert.triggeredDetails?.dropPercent || alert.targetDropPercent}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                              قيد المراقبة الفورية
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400">
                          {alert.district} • السعر المستهدف:{' '}
                          <strong className="text-white font-mono-num">
                            SAR {alert.targetPrice.toLocaleString()}
                          </strong>{' '}
                          (-{alert.targetDropPercent}%)
                        </p>

                        {/* Price Details Block */}
                        <div className="flex items-baseline gap-3 text-xs font-mono-num pt-1">
                          {alert.isTriggered && alert.triggeredDetails ? (
                            <>
                              <span className="line-through text-slate-500">
                                SAR {alert.triggeredDetails.oldPrice.toLocaleString()}
                              </span>
                              <span className="text-base font-extrabold text-emerald-400">
                                SAR {alert.triggeredDetails.newPrice.toLocaleString()}
                              </span>
                              <span className="text-amber-300 font-bold">
                                توفير: SAR {alert.triggeredDetails.savingsSAR.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-slate-400">السعر الحالي:</span>
                              <span className="text-sm font-bold text-white">
                                SAR {alert.currentPrice.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      
                      {/* Test Simulator Button if not triggered yet */}
                      {!alert.isTriggered && (
                        <button
                          onClick={() => handleSimulate(alert.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-all active:scale-95"
                          title="Simulate instant price drop to test notification"
                        >
                          <Play className="w-3 h-3 fill-amber-300" />
                          محاكاة انخفاض السعر
                        </button>
                      )}

                      {/* If Triggered, show action to view or draft offer */}
                      {alert.isTriggered && matchedProp && (
                        <div className="flex items-center gap-1.5">
                          {onSelectProperty && (
                            <button
                              onClick={() => {
                                onSelectProperty(matchedProp);
                                onClose();
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              معاينة العقار
                            </button>
                          )}

                          {onOpenDocumentPrep && (
                            <button
                              onClick={() => {
                                onOpenDocumentPrep(matchedProp);
                                onClose();
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
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
                        className={`p-1.5 rounded-xl border text-xs transition-all ${
                          alert.active
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}
                        title={alert.active ? 'Disable Alert' : 'Enable Alert'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteAlert(alert.id)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-all"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Footer details: Channels & Timestamp */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>القنوات:</span>
                      {alert.channels.inApp && <span className="text-amber-400">تطبيق</span>}
                      {alert.channels.email && <span>بريد: {alert.email}</span>}
                      {alert.channels.whatsapp && <span className="text-emerald-400">واتساب</span>}
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
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-300 font-semibold">
                لا توجد تنبيهات في هذا القسم
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                يمكنك تفعيل تنبيه انخفاض السعر لأي فيلا أو بنتهاوس في الرياض لتصلك رسالة فورية عبر التطبيق والواتساب.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تحديثات الأسعار متطابقة مع صفقات البورصة العقارية</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
