import React, { useState } from 'react';
import { Property, MortgageQuote } from '../types';
import { MOCK_MORTGAGE_QUOTES } from '../data/mockProperties';
import { 
  Calculator, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MortgageHubProps {
  selectedProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
}

export const MortgageHub: React.FC<MortgageHubProps> = ({
  selectedProperty,
}) => {
  const [homePriceSAR, setHomePriceSAR] = useState<number>(
    selectedProperty ? selectedProperty.price : 4950000
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(15);
  const [financeType, setFinanceType] = useState<string>('Murabaha (مرابحة متوافقة مع الشريعة)');
  const [termYears, setTermYears] = useState<number>(25);
  const [showPreApprovalModal, setShowPreApprovalModal] = useState<boolean>(false);
  const [applicantName, setApplicantName] = useState<string>('سعود بن عبدالله العتيبي (Saud Al-Otaibi)');
  const [preApprovalGenerated, setPreApprovalGenerated] = useState<boolean>(false);

  const downPaymentAmountSAR = Math.round(homePriceSAR * (downPaymentPercent / 100));
  const loanAmountSAR = homePriceSAR - downPaymentAmountSAR;

  // Real Estate Transaction Tax (RETT 5%) with First-time Homebuyer exemption up to SAR 1M
  const rettExemption = Math.min(1000000, homePriceSAR);
  const taxableRETTAmount = Math.max(0, homePriceSAR - rettExemption);
  const estimatedRETT = Math.round(taxableRETTAmount * 0.05);

  const quotes: MortgageQuote[] = MOCK_MORTGAGE_QUOTES(loanAmountSAR);
  const activeQuote = quotes[0];
  const monthlyInstallment = activeQuote.monthlyInstallment;
  const estimatedInsuranceMonthly = Math.round((loanAmountSAR * 0.0035) / 12);
  const totalMonthlySAR = monthlyInstallment + estimatedInsuranceMonthly;

  const handleGeneratePreApproval = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setPreApprovalGenerated(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Saudi Sharia Home Financing & Mortgage Hub (التمويل العقاري في الرياض)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif-display">
            Compare Today's Best Saudi Mortgage Rates
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Real-time profit rates across leading Saudi Islamic banks (Al Rajhi, SNB, Riyad Bank, Alinma) and government-subsidized Sakani / REDF programs. Model 5% RETT tax exemptions and generate instant pre-qualification.
          </p>
        </div>
      </div>

      {/* Calculator Inputs & Monthly Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Interactive Loan Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Saudi Home Loan Simulator (حاسبة التمويل)</span>
              {selectedProperty && (
                <span className="text-xs text-amber-400 font-normal">
                  Locked to {selectedProperty.title}
                </span>
              )}
            </h3>

            {/* Home Price Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-slate-300">Property Price (سعر العقار بالريال السعودي)</span>
                <span className="text-xl font-extrabold text-white font-mono-num">
                  SAR {homePriceSAR.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={1500000}
                max={15000000}
                step={50000}
                value={homePriceSAR}
                onChange={(e) => setHomePriceSAR(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono-num mt-1">
                <span>SAR 1.5M</span>
                <span>SAR 7.5M</span>
                <span>SAR 15.0M+</span>
              </div>
            </div>

            {/* Down Payment Picker */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Down Payment / الدفعة الأولى ({downPaymentPercent}%)
                </span>
                <span className="text-sm font-bold text-amber-400 font-mono-num">
                  SAR {downPaymentAmountSAR.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDownPaymentPercent(pct)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      downPaymentPercent === pct
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {pct}% {pct === 5 ? '(Sakani)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Program & Repayment Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Financing Structure (صيغة التمويل الإسلامي)
                </label>
                <select
                  value={financeType}
                  onChange={(e) => setFinanceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option>Murabaha (مرابحة متوافقة مع الشريعة)</option>
                  <option>Ijara with Ownership (إجارة موصوفة بالذمة تنتهي بالتمليك)</option>
                  <option>Subsidized Sakani Program (تمويل مدعوم من صندوق التنمية)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tenor / مدة التمويل
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTermYears(25)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      termYears === 25
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    25 Years (25 سنة)
                  </button>
                  <button
                    onClick={() => setTermYears(20)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      termYears === 20
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    20 Years (20 سنة)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Saudi Bank Quotes */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Verified Saudi Islamic Bank Quotes (SAR {loanAmountSAR.toLocaleString()} Financing)
            </h3>

            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/40 rounded-3xl p-5 shadow-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                    {quote.lenderLogo}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{quote.lenderName}</h4>
                      <span className="text-xs text-slate-400 font-sans">({quote.lenderNameAr})</span>
                      {quote.recommendedTag && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow">
                          {quote.recommendedTag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {quote.financeType} • Tenor: {quote.termYears} Years • Min Down: {quote.downPaymentRequiredPercent}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-lg font-extrabold text-amber-300 font-mono-num">
                      {quote.profitRate.toFixed(2)}%
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono-num">
                      APR: {quote.apr.toFixed(2)}%
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-extrabold text-white font-mono-num">
                      SAR {quote.monthlyInstallment.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      /month (قسط شهري)
                    </span>
                  </div>

                  <button
                    onClick={() => setShowPreApprovalModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
                  >
                    Apply & Lock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Monthly Payment & Saudi Tax Breakdown */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Estimated Monthly Installment (القسط الإجمالي)
              </span>
              <div className="text-3xl font-extrabold text-white font-mono-num mt-1">
                SAR {totalMonthlySAR.toLocaleString()}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </div>
            </div>

            {/* Breakdown Item List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Monthly Bank Installment (قسط المرابحة)
                </span>
                <span className="font-mono-num font-bold text-white">SAR {monthlyInstallment.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Takaful Life & Property Insurance (التأمين التكافلي)
                </span>
                <span className="font-mono-num font-bold text-white">SAR {estimatedInsuranceMonthly.toLocaleString()}</span>
              </div>

              {/* RETT Tax Calculation */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-300">
                  <span>ضريبة التصرفات العقارية (RETT 5%)</span>
                  <span className="font-mono-num">SAR {estimatedRETT.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  * للمواطن المسكن الأول: إعفاء رسمي من الضريبة حتى SAR 1,000,000 من قيمة المسكن.
                </p>
              </div>
            </div>

            {/* Pre-Approval Trigger Button */}
            <button
              onClick={() => setShowPreApprovalModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/15 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Generate Saudi Bank Pre-Approval Letter
            </button>
          </div>

          {/* Sakani Insight */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sakani & REDF Subsidies
            </h4>
            <p className="leading-relaxed">
              Saudi citizens eligible for Sakani benefit from up to <strong>SAR 150,000</strong> in non-refundable direct matrix support or subsidized profit rate matrix through REDF.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Approval Letter Modal */}
      {showPreApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">شهادة الموافقة المبدئية على التمويل العقاري</h3>
              </div>
              <button onClick={() => setShowPreApprovalModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {!preApprovalGenerated ? (
              <div className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">اسم مقدم الطلب (Applicant Name)</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono-num text-slate-300">
                  <p>مبلغ التمويل المعتمد مبدئياً: <strong className="text-amber-400">SAR {loanAmountSAR.toLocaleString()}</strong></p>
                  <p>الحد الأقصى لسعر العقار: <strong className="text-white">SAR {homePriceSAR.toLocaleString()}</strong></p>
                  <p>الدفعة الأولى المدفوعة: <strong className="text-emerald-400">SAR {downPaymentAmountSAR.toLocaleString()} ({downPaymentPercent}%)</strong></p>
                  <p>هامش الربح المقفل: <strong>{activeQuote.profitRate}% مرابحة إسلامية لمدة 25 سنة</strong></p>
                </div>
                <button
                  onClick={handleGeneratePreApproval}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xl transition-all"
                >
                  إصدار خطاب الموافقة الموثق إلكترونياً
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs space-y-3 font-serif-display text-slate-200">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white tracking-wider font-mono-num">JOEY.PROPERTIES | جوي للعقارات</span>
                    <span className="text-[10px] text-emerald-400 font-mono-num">موثق عبر نفاذ • ID #JOEY-KSA-2026</span>
                  </div>
                  <p className="text-xs font-sans leading-relaxed text-slate-300">
                    تشهد منصة <strong>جوي للعقارات (joey.properties)</strong> بأن المستفيد: <strong>{applicantName}</strong> قد استوفى متطلبات الملاءة المالية والحصول على موافقة تمويل مبدئية لشراء عقار سكني بقيمة تصل إلى <strong>{homePriceSAR.toLocaleString()} ريال سعودي</strong> بتمويل معتمد قدره <strong>{loanAmountSAR.toLocaleString()} ريال سعودي</strong>.
                  </p>
                  <p className="text-xs font-sans text-slate-400">
                    تم التحقق من الالتزامات والقدرة الائتمانية عبر سمة (SIMAH). يقدم هذا الخطاب لتعزيز جدية العرض والشراء عبر البورصة العقارية.
                  </p>
                </div>
                <button
                  onClick={() => setShowPreApprovalModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
