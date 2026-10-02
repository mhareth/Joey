import React, { useState } from 'react';
import { Property } from '../types';
import { 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  PenTool, 
  Loader2, 
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DocumentPrepModalProps {
  property: Property;
  onClose: () => void;
}

export const DocumentPrepModal: React.FC<DocumentPrepModalProps> = ({
  property,
  onClose,
}) => {
  const [docType, setDocType] = useState<'rega_purchase_agreement' | 'araboon_deposit_receipt' | 'letter_of_intent' | 'structural_warranty_addendum'>('rega_purchase_agreement');
  const [buyerName, setBuyerName] = useState('سعود بن عبدالله العتيبي (Saud Al-Otaibi)');
  const [offerPriceSAR, setOfferPriceSAR] = useState(property.price);
  const [earnestMoneySAR, setEarnestMoneySAR] = useState(Math.round(property.price * 0.025));
  const [closingDays, setClosingDays] = useState(30);
  const [inspectionDays, setInspectionDays] = useState(10);
  const [financingType, setFinancingType] = useState('تمويل مرابحة إسلامي معتمد من مصرف الراجحي بنسبة 85%');
  const [specialProvisions, setSpecialProvisions] = useState('يشمل البيع المصعد الإيطالي راكباً والمطبخ المجهز مع التزام البائع بتسليم بوليصة تأمين ملاذ ضد العيوب الخفية لمدة 10 سنوات.');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureText, setSignatureText] = useState('سعود بن عبدالله العتيبي');

  const rettTaxSAR = Math.round(offerPriceSAR * 0.05);

  const handleGenerateDoc = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          property,
          buyerName,
          sellerName: property.agent.brokerage,
          offerPrice: offerPriceSAR,
          earnestMoney: earnestMoneySAR,
          closingDays,
          inspectionDays,
          financingType,
          specialProvisions,
        }),
      });

      const data = await res.json();
      setGeneratedDoc(data.documentContent);
    } catch (err) {
      console.error('Failed to generate document', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignDocument = () => {
    setIsSigned(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl" lang="ar">
          <head>
            <title>اتفاقية عقارية موحدة - ${property.title}</title>
            <style>
              body { font-family: 'Times New Roman', Tahoma, sans-serif; padding: 40px; line-height: 1.8; color: #111; direction: rtl; }
              h1 { text-align: center; font-size: 22px; border-bottom: 2px solid #222; padding-bottom: 12px; }
              pre { font-family: Tahoma, 'Times New Roman', sans-serif; white-space: pre-wrap; font-size: 13px; line-height: 1.8; }
            </style>
          </head>
          <body>
            <h1>joey.properties | جوي للعقارات — الهيئة العامة للعقار (REGA)</h1>
            <pre>${generatedDoc}</pre>
            ${isSigned ? `<p style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px;"><strong>التوقيع الإلكتروني الموثق عبر نفاذ:</strong> ${signatureText} بتاريخ ${new Date().toLocaleString('ar-SA')}</p>` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  عقود البيع والوساطة المعتمدة من الهيئة العامة للعقار
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                  REGA Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {property.title} • {property.district}، الرياض
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {generatedDoc && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                طباعة العقد (PDF)
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

        {/* Content Body: Split between Controls and Live Document View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Document Configuration (5 cols) */}
          <div className="lg:col-span-5 p-6 overflow-y-auto border-r border-slate-800 space-y-5 bg-slate-900/40 no-scrollbar">
            
            {/* Document Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                نوع النموذج المعتمد
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rega_purchase_agreement', label: 'عقد بيع عقاري موحد (REGA)' },
                  { id: 'araboon_deposit_receipt', label: 'اتفاقية وسند عربون' },
                  { id: 'letter_of_intent', label: 'خطاب رغبة شراء (LOI)' },
                  { id: 'structural_warranty_addendum', label: 'ملحق تأمين العيوب الخفية' },
                ].map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setDocType(doc.id as any);
                      setGeneratedDoc(null);
                      setIsSigned(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                      docType === doc.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buyer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم المشتري بالكامل (وفق الهوية الوطنية / الإقامة)
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Offer Price & Earnest Money */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  قيمة العرض بالريال (SAR)
                </label>
                <input
                  type="number"
                  value={offerPriceSAR}
                  onChange={(e) => setOfferPriceSAR(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono-num focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  مبلغ العربون (SAR)
                </label>
                <input
                  type="number"
                  value={earnestMoneySAR}
                  onChange={(e) => setEarnestMoneySAR(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono-num focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* RETT Tax Calculation Indicator */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">ضريبة التصرفات العقارية (5% RETT):</span>
              <span className="font-bold text-amber-400 font-mono-num">SAR {rettTaxSAR.toLocaleString()}</span>
            </div>

            {/* Inspection & Closing Days */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  مدة الفحص والمعاينة
                </label>
                <select
                  value={inspectionDays}
                  onChange={(e) => setInspectionDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={7}>7 أيام عمل</option>
                  <option value={10}>10 أيام عمل (قياسي)</option>
                  <option value={14}>14 يوماً للفحص الهندسي</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  موعد الإفراغ العقاري
                </label>
                <select
                  value={closingDays}
                  onChange={(e) => setClosingDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={15}>15 يوماً (كاش / إفراغ سريع)</option>
                  <option value={21}>21 يوماً</option>
                  <option value={30}>30 يوماً (تمويل بنكي)</option>
                </select>
              </div>
            </div>

            {/* Financing Structure */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                صيغة التمويل والسداد
              </label>
              <input
                type="text"
                value={financingType}
                onChange={(e) => setFinancingType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Special Provisions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                شروط إضافية ومرفقات
              </label>
              <textarea
                rows={2}
                value={specialProvisions}
                onChange={(e) => setSpecialProvisions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateDoc}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري صياغة العقد بالذكاء الاصطناعي...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {generatedDoc ? 'إعادة صياغة العقد' : 'توليد العقد المعتمد بنظام الهيئة'}
                </>
              )}
            </button>
          </div>

          {/* Right Column: Live Document Preview & E-Signature Pad (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto no-scrollbar">
            {generatedDoc ? (
              <div className="space-y-6">
                {/* Document Sheet */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 font-serif-display text-slate-200 text-xs shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono-num">
                      joey.properties | جوي للعقارات — العقود المعتمدة (REGA)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-num">
                      FAL: {property.agent.falLicense}
                    </span>
                  </div>

                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed mt-4" dir="rtl">
                    {generatedDoc}
                  </pre>

                  {/* Signatures Block */}
                  <div className="mt-8 pt-6 border-t border-slate-800 font-sans grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 block mb-2">توقيع المشتري</span>
                      {isSigned ? (
                        <div className="space-y-1">
                          <span className="text-base font-serif-display text-amber-300 font-bold block">
                            {signatureText}
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono-num">
                            <CheckCircle2 className="w-3 h-3" /> تم التوثيق عبر نفاذ الإلكتروني • {new Date().toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-xs italic">
                          في انتظار التوقيع الإلكتروني أدناه
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 block mb-2">الوسيط العقاري المرخص (فال)</span>
                      <span className="text-sm font-semibold text-slate-300 block">
                        {property.agent.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono-num">
                        رخصة فال: {property.agent.falLicense}
                      </span>
                    </div>
                  </div>
                </div>

                {/* E-Signature Control Bar */}
                {!isSigned ? (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">التوقيع الإلكتروني المعتمد</span>
                        <span className="text-[11px] text-slate-400">توقيع رقمي متوافق مع نظام التعاملات الإلكترونية ونفاذ</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSignDocument}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap"
                    >
                      توقيع وإرسال العقد
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <strong className="block text-sm">تم توقيع العقد وإرساله بنجاح!</strong>
                        <span>تم تزويد {property.agent.name} بنسخة موثقة لبدء إجراءات الإفراغ بالبورصة العقارية.</span>
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      تصدير العقد PDF
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="max-w-md">
                  <h4 className="text-base font-bold text-slate-300">
                    جاهز لتوليد العقد العقاري المعتمد
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    حدد شروط الشراء ومبلغ العربون وطريقة السداد على اليمين، ثم انقر على <strong>توليد العقد المعتمد</strong> لصياغة العقد وإتاحته للتوقيع الرقمي الفوري.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
