import React, { useState } from 'react';
import { MessageSquare, Send, Search, Phone, CheckCheck, User, ShieldCheck } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';

export function MessagesPage() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Ramesh Patel (Suryoday FPO)',
      role: 'FPO Coordinator',
      lastMessage: 'Tomato loading is underway at Varanasi Collection Center 2.',
      time: '11:45 AM',
      unread: 1,
      active: true,
      phone: '+91 98765 43210',
    },
    {
      id: 2,
      name: 'Dubagga Mandi Dispatcher',
      role: 'Wholesale Buyer',
      lastMessage: 'Gate 4 is designated for refrigerated trucks today.',
      time: '09:20 AM',
      unread: 0,
      active: false,
      phone: '+91 98111 22334',
    },
    {
      id: 3,
      name: 'Varanasi Fleet Support',
      role: 'KrishiSetu Control Tower',
      lastMessage: 'NH 731 clear of toll congestion. ETA remains on schedule.',
      time: 'Yesterday',
      unread: 0,
      active: false,
      phone: '1800-KRISHI-HELP',
    },
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'them', text: 'Namaste Suresh ji. Is vehicle UP65XX1234 on schedule for the 6-ton tomato pickup?', time: '11:30 AM' },
    { sender: 'me', text: 'Namaste Ramesh ji. Yes, vehicle has entered the bypass and will reach Hub in 15 minutes.', time: '11:38 AM' },
    { sender: 'them', text: 'Tomato loading is underway at Varanasi Collection Center 2. Bay 3 is cleared for you.', time: '11:45 AM' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages([...messages, { sender: 'me', text: inputText, time: 'Just now' }]);
    setInputText('');
  };

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Direct Dispatch Messaging</h1>
              <p className="text-xs text-stone-500">Real-time coordination with FPO coordinators, farmers, and Mandi reception desks</p>
            </div>
          </div>
        </div>

        {/* Messaging Two-Panel Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
          {/* Conversation List (4 cols) */}
          <div className="lg:col-span-4 border-r border-stone-100 flex flex-col">
            <div className="p-4 border-b border-stone-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 divide-y divide-stone-100 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                    activeChat.id === c.id ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {String(c.name || 'User').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900 truncate">{c.name}</span>
                      <span className="text-[10px] text-stone-400">{c.time}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 block">{c.role}</span>
                    <p className="text-xs text-stone-500 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Panel (8 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Chat Top Bar */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {String(activeChat?.name || 'User').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">{activeChat.name}</div>
                  <div className="text-[11px] text-stone-500">{activeChat.role} • {activeChat.phone}</div>
                </div>
              </div>
              <a
                href={`tel:${activeChat.phone}`}
                className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-5 space-y-3 overflow-y-auto bg-[#fafbfa]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'me'
                        ? 'bg-emerald-600 text-white rounded-br-2xs'
                        : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-2xs shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type dispatch update or arrival time..."
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </LogisticsLayout>
  );
}

export default MessagesPage;
