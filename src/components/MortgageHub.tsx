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
  Building2,
  X
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
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header - Redfin Style */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#C82021] text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Redfin Mortgage • حاسبة التمويل العقاري المتوافقة مع الشريعة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-sans">
            Compare Today's Best Saudi Mortgage Rates
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Real-time profit rates across leading Saudi Islamic banks (Al Rajhi, SNB, Riyad Bank, Alinma) and government-subsidized Sakani / REDF programs. Model 5% RETT tax exemptions and generate instant pre-qualification.
          </p>
        </div>
      </div>

      {/* Calculator Inputs & Monthly Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Loan Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>Saudi Home Loan Simulator (حاسبة التمويل)</span>
              {selectedProperty && (
                <span className="text-xs text-[#C82021] font-semibold">
                  Locked to {selectedProperty.title}
                </span>
              )}
            </h3>

            {/* Home Price Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-gray-700">Property Price (سعر العقار بالريال السعودي)</span>
                <span className="text-xl font-black text-gray-900 font-mono-num">
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
                className="w-full accent-[#C82021] bg-gray-200 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-mono-num mt-1">
                <span>SAR 1.5M</span>
                <span>SAR 7.5M</span>
                <span>SAR 15.0M+</span>
              </div>
            </div>

            {/* Down Payment Picker */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-gray-700">
                  Down Payment / الدفعة الأولى ({downPaymentPercent}%)
                </span>
                <span className="text-sm font-black text-[#C82021] font-mono-num">
                  SAR {downPaymentAmountSAR.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDownPaymentPercent(pct)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      downPaymentPercent === pct
                        ? 'bg-[#C82021] text-white border-[#C82021] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {pct}% {pct === 5 ? '(Sakani)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Financing Structure Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  نوع الهيكل التمويلي (Sharia Structure)
                </label>
                <select
                  value={financeType}
                  onChange={(e) => setFinanceType(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
                >
                  <option>Murabaha (مرابحة متوافقة مع الشريعة)</option>
                  <option>Ijara Forward Lease (إجارة موصوفة بالذمة)</option>
                  <option>Sakani Subsidized Matrix (دعم سكني)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Loan Term (مدة التمويل)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 25].map((yrs) => (
                    <button
                      key={yrs}
                      onClick={() => setTermYears(yrs)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        termYears === yrs
                          ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {yrs} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Bank Rate Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C82021]" />
                عروض البنوك السعودية المعتمدة اليوم (Verified Lenders)
              </h4>

              <div className="space-y-2.5">
                {quotes.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-white border border-gray-200">{q.lenderLogo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-gray-900">{q.lenderName}</h5>
                          <span className="text-[11px] text-gray-500">{q.lenderNameAr}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{q.financeType} • {q.recommendedTag}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 text-xs font-mono-num">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Annual Profit</span>
                        <span className="text-sm font-bold text-gray-900">{q.profitRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Est. Monthly</span>
                        <span className="text-sm font-black text-[#C82021]">SAR {q.monthlyInstallment.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Monthly Payment & Saudi Tax Breakdown */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Estimated Monthly Installment (القسط الإجمالي)
              </span>
              <div className="text-3xl font-black text-gray-900 font-mono-num mt-1">
                SAR {totalMonthlySAR.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </div>
            </div>

            {/* Breakdown Item List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-700">
                  Monthly Bank Installment (قسط المرابحة)
                </span>
                <span className="font-mono-num font-bold text-gray-900">SAR {monthlyInstallment.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-700">
                  Takaful Life & Property Insurance (التأمين التكافلي)
                </span>
                <span className="font-mono-num font-bold text-gray-900">SAR {estimatedInsuranceMonthly.toLocaleString()}</span>
              </div>

              {/* RETT Tax Calculation */}
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 space-y-1">
                <div className="flex items-center justify-between font-bold text-[#C82021]">
                  <span>ضريبة التصرفات العقارية (RETT 5%)</span>
                  <span className="font-mono-num">SAR {estimatedRETT.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  * للمواطن المسكن الأول: إعفاء رسمي من الضريبة حتى SAR 1,000,000 من قيمة المسكن.
                </p>
              </div>
            </div>

            {/* Pre-Approval Trigger Button */}
            <button
              onClick={() => setShowPreApprovalModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Saudi Bank Pre-Approval Letter
            </button>
          </div>

          {/* Sakani Insight */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs text-gray-700 space-y-2 shadow-xs">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sakani & REDF Subsidies
            </h4>
            <p className="leading-relaxed text-gray-600">
              Saudi citizens eligible for Sakani benefit from up to <strong>SAR 150,000</strong> in non-refundable direct matrix support or subsidized profit rate matrix through REDF.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Approval Letter Modal */}
      {showPreApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C82021]" />
                <h3 className="font-bold text-gray-900 text-base">شهادة الموافقة المبدئية على التمويل العقاري</h3>
              </div>
              <button onClick={() => setShowPreApprovalModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!preApprovalGenerated ? (
              <div className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">اسم مقدم الطلب (Applicant Name)</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:border-[#C82021] focus:ring-1 focus:ring-red-100 shadow-2xs"
                  />
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1 font-mono-num text-gray-700">
                  <p>مبلغ التمويل المعتمد مبدئياً: <strong className="text-[#C82021]">SAR {loanAmountSAR.toLocaleString()}</strong></p>
                  <p>الحد الأقصى لسعر العقار: <strong className="text-gray-900">SAR {homePriceSAR.toLocaleString()}</strong></p>
                  <p>الدفعة الأولى المدفوعة: <strong className="text-emerald-700">SAR {downPaymentAmountSAR.toLocaleString()} ({downPaymentPercent}%)</strong></p>
                  <p>هامش الربح المقفل: <strong>{activeQuote.profitRate}% مرابحة إسلامية لمدة 25 سنة</strong></p>
                </div>
                <button
                  onClick={handleGeneratePreApproval}
                  className="w-full py-3 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  إصدار خطاب الموافقة الموثق إلكترونياً
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="p-5 rounded-xl bg-gray-50 border border-emerald-300 text-xs space-y-3 text-gray-800">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-bold text-gray-900 tracking-wider font-mono-num">JOEY.PROPERTIES | جوي للعقارات</span>
                    <span className="text-[10px] text-emerald-700 font-bold font-mono-num">موثق عبر نفاذ • ID #JOEY-KSA-2026</span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-700">
                    تشهد منصة <strong>جوي للعقارات (joey.properties)</strong> بأن المستفيد: <strong>{applicantName}</strong> قد استوفى متطلبات الملاءة المالية والحصول على موافقة تمويل مبدئية لشراء عقار سكني بقيمة تصل إلى <strong>{homePriceSAR.toLocaleString()} ريال سعودي</strong> بتمويل معتمد قدره <strong>{loanAmountSAR.toLocaleString()} ريال سعودي</strong>.
                  </p>
                  <p className="text-xs text-gray-500">
                    تم التحقق من الالتزامات والقدرة الائتمانية عبر سمة (SIMAH). يقدم هذا الخطاب لتعزيز جدية العرض والشراء عبر البورصة العقارية.
                  </p>
                </div>
                <button
                  onClick={() => setShowPreApprovalModal(false)}
                  className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold"
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
