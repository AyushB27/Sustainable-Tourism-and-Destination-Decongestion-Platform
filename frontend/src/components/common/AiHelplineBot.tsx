import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateDCCMetrics } from '../../lib/engine';
import { apiPost } from '../../lib/api';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AiHelplineBot: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const { destinations, language } = useCorridorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! 🙏 I am 'Sahyadri Guide', your 24x7 AI Tourism Assistant for the Western Ghats corridor. Ask me about live crowds, traffic bottlenecks, weather hazards, zero-waste rules, or scenic twin destinations!",
      timestamp: 'Just now'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = language === 'mr' ? [
    { label: '🔥 लोणावळ्यात आज गर्दी आहे का?', query: 'लोणावळ्यात आज गर्दी आहे का?' },
    { label: '🏖️ अलिबागसाठी शांत जुळे ठिकाण?', query: 'अलिबागसाठी शांत जुळे ठिकाण कोणते?' },
    { label: '⛈️ थेट हवामान व पाऊस अंदाज', query: 'पश्चिम घाटात आज हवामान कसे आहे?' },
    { label: '♻️ कास पठाराचे कचरा नियम काय?', query: 'कास पठाराचे कचरा नियम काय आहेत?' }
  ] : language === 'hi' ? [
    { label: '🔥 क्या लोनावला में भीड़ है?', query: 'क्या आज लोनावला में भीड़ है?' },
    { label: '🏖️ अलीबाग का शांत विकल्प क्या है?', query: 'अलीबाग का शांत विकल्प क्या है?' },
    { label: '⛈️ लाइव मौसम एवं बारिश अलर्ट', query: 'पश्चिमी घाट का मौसम कैसा है?' },
    { label: '♻️ कचरा नियम एवं प्लास्टिक प्रतिबंध', query: 'कचरा नियम एवं प्लास्टिक प्रतिबंध क्या हैं?' }
  ] : [
    { label: '🔥 Is Lonavala crowded right now?', query: 'Is Lonavala crowded right now?' },
    { label: '🏖️ Alternative to Alibaug beaches?', query: 'What is a good less crowded alternative to Alibaug?' },
    { label: '⛈️ Live Weather & Rain Alert', query: 'What is the live weather and hazard risk today?' },
    { label: '♻️ Plastic Rules & Waste Fines', query: 'What are the waste management rules and plastic fines?' }
  ];

  const generateClientFallback = (text: string): string => {
    const lower = text.toLowerCase();
    const lonavala = destinations.find(d => d.id === 'LON');
    const alibaug = destinations.find(d => d.id === 'ALB');
    const kashid = destinations.find(d => d.id === 'KAS');
    const mahabaleshwar = destinations.find(d => d.id === 'MAH');

    if (lower.includes('lonavala') || lower.includes('khandala')) {
      if (lonavala) {
        const metrics = calculateDCCMetrics(lonavala);
        return `📍 **Lonavala & Khandala Live Status:**\n• Crowd Status: **${metrics.status === 'CRITICAL' ? '🔴 Heavily Crowded' : '🟡 Moderate'}**\n• Tourist Inflow: **${lonavala.currentInflow.toLocaleString()} visitors** (Limit: ${lonavala.physicalCapacity.toLocaleString()})\n• Estimated Checkpoint Delay: **${metrics.waitTimeMinutes} minutes** on ghat road.\n\n🌿 **Recommendation:** We suggest rerouting to **Matheran Eco-Zone** or **Bhandardara** to save over 1 hour of traffic delays.`;
      }
    } else if (lower.includes('alibaug') || lower.includes('beach')) {
      if (alibaug && kashid) {
        const kashidMetrics = calculateDCCMetrics(kashid);
        return `🏖️ **Coastal Corridor Recommendation:**\nAlibaug currently has heavy footfall on Varsoli and Nagaon beaches.\n\n✨ **Certified Twin:** We recommend **Kashid & Murud Waters** (Crowd: ${kashidMetrics.status === 'OPTIMAL' ? '🟢 Low / Comfortable' : '🟡 Moderate'}). It features clean white sands, the historic Murud-Janjira sea fort, and 75% fewer tourist crowds!`;
      }
    } else if (lower.includes('weather') || lower.includes('rain') || lower.includes('landslide')) {
      if (lonavala) {
        return `⛈️ **Live Weather & Road Condition:**\n• Current Western Ghats Rainfall: **${lonavala.weatherHazardScore > 0.5 ? 'Heavy Rain (>15mm/hr)' : 'Light pleasant showers'}**\n• Landslide / Road Hazard Risk: **${(lonavala.weatherHazardScore * 100).toFixed(0)}%**\n• Temperature: **~21.5°C** (Misty & cool)\n\n⚠️ **Advisory:** Drive cautiously along NH-48 Khandala curves and ghat roads.`;
      }
    } else if (lower.includes('green') || lower.includes('pass') || lower.includes('eco')) {
      return `🌿 **Digital Green Travel Pass:**\nWhen you select any certified under-visited twin destination on this portal, a free Green Travel Pass is generated with a Fast-Track QR code for highway toll checkpoints, helping reduce highway congestion and carbon footprint!`;
    } else if (lower.includes('mahabaleshwar')) {
      if (mahabaleshwar) {
        return `🍓 **Mahabaleshwar Plateau Live Status:**\n• Current Visitors: **${mahabaleshwar.currentInflow.toLocaleString()}**\n• Parking Status: **${mahabaleshwar.localPressure.parkingSaturationPct}% full**.\n\n✨ **Twin Alternative:** Visit **Tapola Backwaters (Mini Kashmir)** located 25 km away, offering pristine lake boating with minimal crowds.`;
      }
    }
    return `🏛️ **Tourism 24x7 AI Assistant:**\nI am tracking live signals from 7 Western Ghats destinations using Open-Meteo, TomTom Traffic, and Open Government Data (data.gov.in).\n\nFeel free to ask me:\n• "Is Lonavala crowded?"\n• "Which destination has zero queues today?"\n• "Weather in Mahabaleshwar?"\n• "How to get a green travel pass?"`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    let botResponse = '';
    try {
      const data = await apiPost('/api/ai/chat', { message: text, destination_id: spotId || 'LON', language });
      botResponse = data?.response || generateClientFallback(text);
    } catch {
      botResponse = generateClientFallback(text);
    }

    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botResponse,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Action Button in Bottom Right */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gov-navy text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl border-2 border-gov-gold flex items-center gap-2.5 font-bold text-xs sm:text-sm hover:bg-gov-navy-light transition group"
          aria-label="Open 24x7 AI Tourism Helpline"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-gov-navy animate-pulse" />
          </div>
          <span className="hidden sm:inline">24x7 AI Travel Helpline</span>
          <span className="bg-amber-300 text-gov-navy text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
            1363
          </span>
        </motion.button>
      </div>

      {/* Expandable Chatbot Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            className="fixed bottom-24 right-3 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-2xl border-2 border-slate-300 shadow-2xl overflow-hidden flex flex-col h-[400px] max-h-[70vh]"
          >
            {/* Chatbot Header */}
            <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-md shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base leading-tight text-white flex items-center gap-1.5">
                    <span>EcoRoute AI Travel Assistant</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Real-time crowd & detour guidance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([{ id: 'welcome', sender: 'bot', text: "Hello! 🙏 I am 'Sahyadri Guide', your 24x7 AI Tourism Assistant for the Western Ghats corridor. Ask me about live crowds, traffic bottlenecks, weather hazards, or scenic twin destinations!", timestamp: 'Just now' }])}
                  title="Clear chat history"
                  className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                  aria-label="Close Chatbot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gov-navy text-white rounded-tr-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs font-medium prose prose-xs prose-slate max-w-none">
                      {msg.sender === 'bot' ? (
                        <Markdown>{msg.text}</Markdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-2xl rounded-tl-none border border-slate-200 text-slate-500 w-24">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.query)}
                  className="bg-white hover:bg-amber-50 text-slate-700 hover:text-gov-navy text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-300 shrink-0 transition"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Ask about crowds, weather, twin spots..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gov-navy font-medium"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="bg-gov-navy hover:bg-gov-navy-light disabled:opacity-40 text-amber-300 p-2 rounded-xl transition shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
