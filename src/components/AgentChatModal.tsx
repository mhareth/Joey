import React, { useState, useRef, useEffect } from 'react';
import { Property, Agent, AgentChatMessage } from '../types';
import { 
  X, 
  Send, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  ShieldCheck, 
  Loader2,
  FileCheck,
  User
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
      text: `Hello! I'm ${agent.name} with ${agent.brokerage}. I represent ${property.title} on ${property.address}. How can I assist you today? Would you like to schedule a private walkthrough, or review HOA and seller disclosures?`,
      timestamp: 'Just now',
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTourType, setSelectedTourType] = useState<'in_person' | 'virtual'>('in_person');
  const [selectedSlot, setSelectedSlot] = useState('Saturday, 2:00 PM');
  const [tourBooked, setTourBooked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    const userMsg: AgentChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: messageContent,
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
          userMessage: messageContent,
          agent,
          property,
          history: [...messages, userMsg],
        }),
      });

      const data = await res.json();
      const replyMsg: AgentChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: data.reply || `Thank you for your message. I am preparing the information for ${property.title} right now.`,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.error('Agent chat error', err);
      const fallbackMsg: AgentChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: `Thank you for reaching out! I've noted your question regarding ${property.title}. I can also host you for an in-person or virtual walkthrough this weekend.`,
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
      text: `Appointment Confirmed! ${selectedTourType === 'in_person' ? 'Private In-Person Showing' : '1-on-1 Virtual Guided Tour'} scheduled for ${selectedSlot} at ${property.address}. Calendar invite and agent contact details sent to your email.`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[88vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400/40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-400/20 text-amber-300">
                  Verified Broker
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {agent.brokerage} • {agent.responseTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule Tour
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Property Context Strip */}
        <div className="px-6 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate">Listing: <strong className="text-slate-200">{property.title}</strong></span>
          <span className="font-mono-num text-amber-400 font-bold shrink-0 ml-2">
            ${property.price.toLocaleString()}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="font-bold block mb-0.5">Tour Confirmation</span>
                    <p className="text-emerald-200 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
                  />
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] mt-1 block text-right ${isUser ? 'text-slate-900/70' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-75" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-150" />
                <span className="text-[11px] text-slate-400 ml-1">{agent.name} is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'Can I schedule a private tour?',
            'Is the price negotiable?',
            'Request HOA rules & disclosures',
            'Are short-term rentals allowed?'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${agent.name}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Booking Overlay Modal */}
        {showBookingModal && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl z-40 p-6 flex flex-col justify-center animate-in fade-in duration-150">
            <div className="max-w-md mx-auto w-full space-y-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-white text-base">Schedule Showing</h4>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tour Type */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTourType('in_person')}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    selectedTourType === 'in_person'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  🚶 In-Person Showing
                </button>
                <button
                  onClick={() => setSelectedTourType('virtual')}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    selectedTourType === 'virtual'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  💻 1-on-1 Virtual Tour
                </button>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Preferred Date & Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Tomorrow, 10:30 AM',
                    'Tomorrow, 3:00 PM',
                    'Saturday, 11:00 AM',
                    'Saturday, 2:00 PM',
                    'Sunday, 1:30 PM',
                    'Monday, 4:00 PM',
                  ].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs border text-left transition-all ${
                        selectedSlot === slot
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 font-semibold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
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
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl transition-all"
              >
                {tourBooked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    Appointment Confirmed!
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Confirm Reservation with {agent.name}
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
