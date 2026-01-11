
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getGeminiChatResponse } from '../services/geminiService';

const SUGGESTIONS = [
  { text: "I'm feeling anxious", icon: "fa-wind" },
  { text: "Help me sleep", icon: "fa-moon" },
  { text: "I need to vent", icon: "fa-mouth-open" },
  { text: "Good news!", icon: "fa-sun" }
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your AI Buddy. I'm here to listen, offer support, and help you find calm. How's everything going?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiChatResponse(messages, textToSend);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-[2.5rem] shadow-xl shadow-sky-50 border border-slate-100 overflow-hidden">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white text-xl">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">AI Buddy</h3>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Listening
            </span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl ${
              msg.role === 'user' 
                ? 'bg-sky-600 text-white rounded-tr-none shadow-lg shadow-sky-100' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 rounded-tl-none flex gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s.text)}
              className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors flex items-center gap-2"
            >
              <i className={`fas ${s.icon}`}></i>
              {s.text}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-sky-500 outline-none text-slate-800 text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="w-14 h-14 bg-sky-600 text-white rounded-2xl flex items-center justify-center hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 disabled:opacity-50 active:scale-95"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
