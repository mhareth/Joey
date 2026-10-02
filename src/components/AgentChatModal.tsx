import React, { useState, useRef, useEffect } from 'react';
import { Property, Agent, AgentChatMessage } from '../types';
import { 
  X, 
  Send, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Loader2,
  FileCheck
} from 'lucide-react';

interface AgentChatModalProps {
  property: Property;
  onClose: () => void;
  onOpenDocumentPrep: (property: Property) => void;
}

export const AgentChatModal: React.FC<AgentChatModalProps> = ({
  property,
  onClose,
  onOpenDocumentPrep,
}) => {
  const agent: Agent = property.agent;

  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: `مرحباً بك! أنا ${agent.name}، وسيطك العقاري المرخص برخصة فال في ${property.district} بالرياض. يسعدني الإجابة عن مواصفات ${property.title}، أو ترتيب موعد معاينة ميدانية أو جولة افتراضية خاصة.`,
      timestamp: 'Just now',
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTourType, setSelectedTourType] = useState<'in_person' | 'virtual'>('in_person');
  const [selectedSlot, setSelectedSlot] = useState('السبت، 4:00 عصراً');
  const [tourBooked, setTourBooked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: AgentChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          agent,
          property,
          history: [...messages, userMsg],
        }),
      });

      const data = await res.json();
      const replyMsg: AgentChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: data.reply || `شكراً لتواصلك! قمت بتسجيل استفسارك بخصوص ${property.title} وجاهز للمساعدة.`,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.error('Agent chat error', err);
      const fallbackMsg: AgentChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: `شكراً لاهتمامك بـ ${property.title}! يسعدني الإجابة عن كافة استفساراتك أو حجز موعد معاينة هذا الأسبوع.`,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBookTour = () => {
    setTourBooked(true);
    const confirmationMsg: AgentChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      text: `تم تأكيد الموعد بنجاح! ${selectedTourType === 'in_person' ? 'معاينة ميدانية خاصة' : 'جولة افتراضية مباشرة'} محددة بتاريخ ${selectedSlot} في ${property.address}. تم إرسال تفاصيل الموعد إلى بريدك الإلكتروني ورقم هاتفك.`,
      timestamp: 'Just now',
      actionPayload: {
        type: 'tour_booked',
        data: { slot: selectedSlot, type: selectedTourType }
      }
    };
    setMessages(prev => [...prev, confirmationMsg]);
    setTimeout(() => {
      setShowBookingModal(false);
      setTourBooked(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[88vh] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header Bar - Redfin Style */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-200"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-gray-900">{agent.name}</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  REGA Fal Verified
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {agent.brokerage} • {agent.responseTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule Tour
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Property Context Strip */}
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <span className="truncate">العقار: <strong className="text-gray-900 font-bold">{property.title}</strong></span>
          <span className="font-mono-num text-[#C82021] font-bold shrink-0 ml-2">
            SAR {property.price.toLocaleString()}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar bg-white">
          {messages.map((msg) => {
            const isAgent = msg.sender === 'agent';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم تأكيد الموعد في التقويم</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isAgent ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'
                }`}
              >
                {isAgent && (
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                )}
                <div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isAgent
                        ? 'bg-gray-100 text-gray-800 rounded-tl-xs'
                        : 'bg-[#C82021] text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C82021]" />
              <span>الوسيط يكتب رداً الآن...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Suggested Prompts */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            'هل السعر قابل للتفاوض البسيط؟',
            'هل يوجد شهادة إتمام بناء وكود سعودي؟',
            'ما هي الضمانات الإنشائية المتوفرة؟',
            'أرغب بتقديم عرض رسمي بالعربون'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(prompt)}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#C82021] text-[11px] font-medium whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استفسارك للوسيط المرخص..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Booking Overlay Modal */}
        {showBookingModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-40 p-6 flex flex-col justify-center animate-in fade-in duration-150">
            <div className="max-w-md mx-auto w-full space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#C82021]" />
                  <h4 className="font-bold text-gray-900 text-sm">حجز موعد معاينة</h4>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tour Type */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTourType('in_person')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors ${
                    selectedTourType === 'in_person'
                      ? 'bg-[#C82021] text-white border-[#C82021] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  🚶 معاينة ميدانية
                </button>
                <button
                  onClick={() => setSelectedTourType('virtual')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors ${
                    selectedTourType === 'virtual'
                      ? 'bg-[#C82021] text-white border-[#C82021] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  💻 جولة افتراضية مباشرة
                </button>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  اختر اليوم والوقت المناسب
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'غداً، 10:30 صباحاً',
                    'غداً، 4:00 عصراً',
                    'السبت، 11:00 صباحاً',
                    'السبت، 4:00 عصراً',
                    'الأحد، 5:00 مساءً',
                    'الإثنين، 4:30 عصراً',
                  ].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs border text-center transition-colors ${
                        selectedSlot === slot
                          ? 'bg-red-50 text-[#C82021] border-red-200 font-bold'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleBookTour}
                disabled={tourBooked}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors"
              >
                {tourBooked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    تم تأكيد الحجز!
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    تأكيد الموعد مع {agent.name}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
