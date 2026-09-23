import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerMessages, useSendMessage } from '../hooks/useFarmerData.js';
import { MessageSquare, Send, User, CheckCheck, Clock, AlertCircle } from 'lucide-react';

export function MessagesPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Messages | KrishiSetu';
  }, []);

  const { data: conversations = [], isLoading, error, refetch } = useFarmerMessages();
  const sendMessageMutation = useSendMessage();

  const [activeConvId, setActiveConvId] = useState(conversationId || 'CONV-001');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Sync activeConvId with URL param if changed
  useEffect(() => {
    if (conversationId) {
      setActiveConvId(conversationId);
    } else if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversationId, conversations]);

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const textToSend = inputText.trim();
    setInputText('');

    await sendMessageMutation.mutateAsync({
      conversationId: activeConversation.id,
      data: { text: textToSend },
    });
  };

  const handleSelectConversation = (id) => {
    setActiveConvId(id);
    navigate(`/farmer/messages/${id}`);
  };

  return (
    <DashboardLayout title="Messages" subtitle="Communicate directly with procurement buyers, assigned logistics drivers, and FPO officers" fullWidth={true}>
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col md:flex-row h-[calc(100vh-190px)] min-h-[500px]">
        {/* Left Pane: Conversations List */}
        <div className="w-full md:w-80 border-r border-stone-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#107c41]" />
              <h2 className="text-sm font-black text-slate-900">Conversations</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#107c41]">
              {conversations.length} Active
            </span>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-50">
            {isLoading && (
              <div className="p-4 space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-stone-100 rounded-xl" />
                ))}
              </div>
            )}

            {!isLoading && conversations.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-400">
                No active conversations yet.
              </div>
            )}

            {!isLoading &&
              conversations.map((conv) => {
                const isActive = conv.id === activeConversation?.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      isActive ? 'bg-emerald-50/70 border-l-4 border-l-[#107c41]' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0">
                      {conv.participantName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {conv.participantName}
                        </h4>
                        <span className="text-[10px] text-stone-400 shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#107c41] font-semibold truncate">
                        {conv.cropContext}
                      </p>
                      <p className="text-xs text-stone-500 truncate mt-0.5 font-medium">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Pane: Active Chat Room */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
            {/* Chat Room Header */}
            <div className="h-16 px-5 bg-white border-b border-stone-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-[#107c41] flex items-center justify-center font-black text-xs">
                  {activeConversation.participantName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">
                    {activeConversation.participantName}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-stone-500">
                    <span className="font-semibold text-emerald-700">{activeConversation.participantRole}</span>
                    <span>•</span>
                    <span>{activeConversation.cropContext}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Bubble Thread */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
              {activeConversation.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isFarmer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                      msg.isFarmer
                        ? 'bg-[#107c41] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-stone-200/80 rounded-bl-xs'
                    }`}
                  >
                    {!msg.isFarmer && (
                      <span className="block text-[10px] font-bold text-stone-400 mb-0.5">
                        {msg.senderName}
                      </span>
                    )}
                    <p className="font-medium">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1 flex items-center gap-1 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.isFarmer && <CheckCheck className="h-3 w-3 text-emerald-600" />}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-stone-100 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder={`Message ${activeConversation.participantName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200/80 rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sendMessageMutation.isPending}
                className="p-2 bg-[#107c41] hover:bg-[#0c6233] text-white rounded-full transition-all disabled:opacity-40 cursor-pointer shadow-xs"
                title="Send Message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-stone-400">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MessagesPage;
