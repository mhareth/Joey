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
      if (data.documentContent) {
        setGeneratedDoc(data.documentContent);
      }
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
              h1 { text-align: center; font-size: 20px; border-bottom: 2px solid #222; padding-bottom: 12px; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header - Redfin Style */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-[#C82021] border border-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  عقود البيع والوساطة المعتمدة من الهيئة العامة للعقار
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  REGA Compliant
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {property.title} • {property.district}، الرياض
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {generatedDoc && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#C82021]" />
                طباعة العقد (PDF)
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Split between Controls and Live Document View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Document Configuration (5 cols) */}
          <div className="lg:col-span-5 p-6 overflow-y-auto border-r border-gray-200 space-y-4 bg-gray-50/50 no-scrollbar">
            
            {/* Document Type Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                نوع النموذج المعتمد
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rega_purchase_agreement', label: 'عقد وساطة وشراء موحد (REGA)' },
                  { id: 'araboon_deposit_receipt', label: 'سند استلام عربون رسمي' },
                  { id: 'letter_of_intent', label: 'خطاب إبداء رغبة جاد (LOI)' },
                  { id: 'structural_warranty_addendum', label: 'ملحق تأمين ملاذ للعيوب' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setDocType(type.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-colors ${
                      docType === type.id
                        ? 'bg-[#C82021] text-white border-[#C82021] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buyer Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                اسم المشتري رباعياً (وفق الهوية الوطنية / الإقامة)
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
              />
            </div>

            {/* Offer Price & Earnest Money */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  قيمة العرض المالي (SAR)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={offerPriceSAR}
                  onChange={(e) => setOfferPriceSAR(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono-num font-bold focus:border-[#C82021] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  مبلغ العربون (2.5%)
                </label>
                <input
                  type="number"
                  value={earnestMoneySAR}
                  onChange={(e) => setEarnestMoneySAR(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono-num focus:border-[#C82021] shadow-2xs"
                />
              </div>
            </div>

            {/* Tax Notice Card */}
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 text-xs space-y-1">
              <div className="flex justify-between font-bold text-[#C82021]">
                <span>ضريبة التصرفات العقارية التقديرية (RETT 5%):</span>
                <span className="font-mono-num">SAR {rettTaxSAR.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                * تطبق ضريبة التصرفات العقارية بنسبة 5% من القيمة الإجمالية وتدفع قبل الإفراغ الإلكتروني لدى وزارة العدل.
              </p>
            </div>

            {/* Timelines */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">مهلة المعاينة والفحص</label>
                <select
                  value={inspectionDays}
                  onChange={(e) => setInspectionDays(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
                >
                  <option value={7}>7 أيام عمل</option>
                  <option value={10}>10 أيام عمل</option>
                  <option value={14}>14 يوماً</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">مهلة الإفراغ النهائي</label>
                <select
                  value={closingDays}
                  onChange={(e) => setClosingDays(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
                >
                  <option value={15}>15 يوماً (كاش / إفراغ سريع)</option>
                  <option value={21}>21 يوماً</option>
                  <option value={30}>30 يوماً (تمويل بنكي)</option>
                </select>
              </div>
            </div>

            {/* Financing Structure */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                صيغة التمويل والسداد
              </label>
              <input
                type="text"
                value={financingType}
                onChange={(e) => setFinancingType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
              />
            </div>

            {/* Special Provisions */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                شروط إضافية ومرفقات
              </label>
              <textarea
                rows={2}
                value={specialProvisions}
                onChange={(e) => setSpecialProvisions(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateDoc}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors active:scale-95 disabled:opacity-50"
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
          <div className="lg:col-span-7 bg-white p-6 flex flex-col justify-between overflow-y-auto no-scrollbar">
            {generatedDoc ? (
              <div className="space-y-6">
                {/* Document Sheet */}
                <div className="p-6 sm:p-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-xs shadow-xs relative">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 font-sans">
                    <span className="text-[11px] font-bold text-[#C82021] uppercase tracking-widest font-mono-num">
                      joey.properties | جوي للعقارات — العقود المعتمدة (REGA)
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono-num">
                      FAL: {property.agent.falLicense}
                    </span>
                  </div>

                  <pre className="whitespace-pre-wrap font-sans text-xs text-gray-800 leading-relaxed mt-4" dir="rtl">
                    {generatedDoc}
                  </pre>

                  {/* Signatures Block */}
                  <div className="mt-8 pt-6 border-t border-gray-200 font-sans grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <span className="text-[11px] font-bold text-gray-600 block mb-2">توقيع المشتري</span>
                      {isSigned ? (
                        <div className="space-y-1">
                          <span className="text-base text-[#C82021] font-bold block">
                            {signatureText}
                          </span>
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-mono-num font-bold">
                            <CheckCircle2 className="w-3 h-3" /> تم التوثيق عبر نفاذ الإلكتروني • {new Date().toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs italic">
                          في انتظار التوقيع الإلكتروني أدناه
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <span className="text-[11px] font-bold text-gray-600 block mb-2">الوسيط العقاري المرخص (فال)</span>
                      <span className="text-sm font-bold text-gray-900 block">
                        {property.agent.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono-num block">
                        رخصة فال: {property.agent.falLicense}
                      </span>
                    </div>
                  </div>
                </div>

                {/* E-Signature Action Pad */}
                {!isSigned ? (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="p-2 rounded-xl bg-red-50 text-[#C82021]">
                        <PenTool className="w-5 h-5" />
                      </div>
                      <div className="w-full sm:w-auto">
                        <span className="text-xs font-bold text-gray-900 block">التوقيع الرقمي الفوري</span>
                        <input
                          type="text"
                          value={signatureText}
                          onChange={(e) => setSignatureText(e.target.value)}
                          placeholder="اكتب اسمك الثلاثي للتوقيع"
                          className="mt-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 w-full sm:w-60"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSignDocument}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      توقيع وتوثيق العقد عبر نفاذ
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>العقد موقع وموثق إلكترونياً. جاهز للإرسال للوسيط العقاري والبائع.</span>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                    >
                      تنزيل نسخة PDF
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-3">
                <FileText className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-bold text-gray-700">
                  قم باختيار نوع العقد وتعبئة الشروط ثم اضغط على "توليد العقد"
                </p>
                <p className="text-xs max-w-sm text-gray-500">
                  يتم استدعاء نموذج الذكاء الاصطناعي لتضمين رقم رخصة فال وكود البناء السعودي وبنود الهيئة العامة للعقار.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
