import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { MessageSquare, Send, Search, User, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export function FpoMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContact, setActiveContact] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getMessages();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setMessages(list);
      if (list.length > 0 && !activeContact) {
        setActiveContact(list[0]);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSending(true);
      await fpoService.sendMessage({
        subject: `Re: ${activeContact?.subject || 'Message'}`,
        content: replyText,
        senderId: 'ANIL-SINGH-MGR',
        senderName: 'Anil Singh',
        senderRole: 'FPO_MANAGER',
        recipientId: activeContact?.senderId,
        recipientName: activeContact?.senderName,
        recipientRole: activeContact?.senderRole,
      });
      setReplyText('');
      await loadMessages();
    } catch (err) {
      alert('Failed to send message: ' + (err.response?.data?.message || err.message));
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter((m) =>
    (m.senderName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Operational Messaging & Communication Hub
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Direct communication channels with institutional buyers, field procurement officers, and member farmers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              {messages.length} Active Threads
            </span>
          </div>
        </div>

        {/* Messaging 2-Column Pane */}
        <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs grid grid-cols-1 md:grid-cols-12 h-[640px]">
          {/* Contacts / Conversations List (4 cols) */}
          <div className="md:col-span-4 border-r border-stone-200/80 flex flex-col h-full bg-[#fcfdfc]">
            <div className="p-3.5 border-b border-stone-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#f8faf9] border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-stone-100 custom-scrollbar">
              {loading ? (
                <div className="p-6 text-center text-xs text-stone-400">Loading messages...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400">No conversations found.</div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = activeContact?.id === msg.id;
                  return (
                    <button
                      key={msg.id}
                      onClick={() => setActiveContact(msg)}
                      className={`w-full p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/70 border-l-4 border-[#107c41]'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="h-9 w-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                        {(msg.senderName || 'U').charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-black text-stone-900 truncate">
                            {msg.senderName || 'Institutional Contact'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium shrink-0 ml-1">
                            {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-stone-700 truncate mt-0.5">{msg.subject}</p>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">{msg.content}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Conversation Detail & Thread (8 cols) */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {activeContact ? (
              <>
                {/* Contact Header */}
                <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                      {(activeContact.senderName || 'U').charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                        <span>{activeContact.senderName || 'Institutional Partner'}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-50" />
                      </div>
                      <p className="text-[10px] text-stone-500 font-semibold">{activeContact.senderRole || 'Procurement Manager'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    Verified Channel
                  </span>
                </div>

                {/* Message Bubble Thread Area */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fbfdfc] custom-scrollbar">
                  {/* Subject pill */}
                  <div className="text-center my-2">
                    <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-[11px] font-bold text-stone-600 shadow-2xs">
                      Subject: {activeContact.subject}
                    </span>
                  </div>

                  {/* Incoming Message Bubble */}
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <div className="h-7 w-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                      {(activeContact.senderName || 'U').charAt(0)}
                    </div>
                    <div className="bg-white border border-stone-200/80 p-4 rounded-2xl rounded-tl-sm shadow-2xs space-y-1">
                      <p className="text-xs font-black text-stone-900">{activeContact.senderName}</p>
                      <p className="text-xs text-stone-700 leading-relaxed">{activeContact.content}</p>
                      <span className="text-[9px] text-stone-400 block text-right mt-1 font-medium">
                        {new Date(activeContact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendReply} className="p-3.5 border-t border-stone-100 bg-white flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official reply or note..."
                    className="flex-1 px-4 py-2 bg-[#f8faf9] border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="px-4 py-2 bg-[#107c41] hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-stone-400 text-xs">
                Select a message thread to start reading
              </div>
            )}
          </div>
        </div>
      </div>
    </FpoLayout>
  );
}

export default FpoMessagesPage;
