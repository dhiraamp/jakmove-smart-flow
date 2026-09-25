import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  HelpCircle,
  Truck,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface AiOperationalCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiOperationalCopilotModal: React.FC<AiOperationalCopilotModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Halo Manajer Operasional! Saya adalah JakMove AI Co-Pilot. Ada yang bisa saya bantu terkait status armada, pengalihan rute kemacetan, audit kepatuhan pengemudi, atau pemeliharaan prediktif hari ini?',
      time: '14:00 WIB',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Ringkas status armada aktif & On-Time Delivery hari ini',
    'Apakah ada peringatan kritis pada mesin kendaraan?',
    'Sopir mana yang mendekati batas maksimal 8 jam mengemudi?',
    'Bagaimana kondisi kemacetan di Tol Jakarta-Cikampek dan Tomang?',
  ];

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/operational-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const json = await response.json();
      if (json.success && json.answer) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: json.answer,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Maaf, terjadi kendala saat menghubungi modul analitik AI. Silakan coba kembali sesaat lagi.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                JakMove AI Operational Co-Pilot
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-semibold">
                  ONLINE
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Didukung model Gemini 3.8 Flash • Terhubung ke telemetri 28 armada
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                  m.sender === 'user' ? 'bg-cyan-600' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                <span
                  className={`text-[9px] block text-right font-mono ${
                    m.sender === 'user' ? 'text-cyan-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AI sedang menganalisis data telemetri armada...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Tanyakan analisis operasional, kargo, atau efisiensi rute..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
