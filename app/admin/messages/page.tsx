'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Loader2, Search, Send, Plus, X, User } from 'lucide-react';
import { getConversations, getConversationMessages, sendMessage, getUsersForMessaging } from '@/lib/api';

interface Conversation {
  partner_nic: string;
  partner_name: string;
  partner_role: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_nic: string;
  sender_name: string;
  content: string;
  created_at: string;
  is_own: boolean;
}

interface User {
  nic: string;
  fullname: string;
  role: string;
  email: string;
  gs_section?: string;
  ds_division?: string;
}

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [newMessageData, setNewMessageData] = useState({
    recipient_nic: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (partnerNic: string) => {
    try {
      const data = await getConversationMessages(partnerNic);
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load messages');
      setMessages([]);
    }
  };

  const handleSelectChat = async (conversation: Conversation) => {
    setSelectedChat(conversation);
    await loadMessages(conversation.partner_nic);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      setSendingMessage(true);
      await sendMessage({
        recipient_nic: selectedChat.partner_nic,
        subject: 'Message',
        content: newMessage,
        message_type: 'general'
      });

      setNewMessage('');
      await loadMessages(selectedChat.partner_nic);
      await loadConversations();
    } catch (err: any) {
      setError(err?.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStartNewConversation = async () => {
    try {
      const users = await getUsersForMessaging();
      setAvailableUsers(Array.isArray(users) ? users : []);
      setShowNewMessageModal(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to load users');
    }
  };

  const handleSendNewMessage = async () => {
    if (!newMessageData.recipient_nic || !newMessageData.content.trim()) return;

    try {
      setSendingMessage(true);
      await sendMessage({
        recipient_nic: newMessageData.recipient_nic,
        subject: newMessageData.subject || 'New Message',
        content: newMessageData.content,
        message_type: 'general'
      });

      setShowNewMessageModal(false);
      setNewMessageData({ recipient_nic: '', subject: '', content: '' });
      await loadConversations();

      // Select the new conversation
      const newConv = conversations.find(c => c.partner_nic === newMessageData.recipient_nic);
      if (newConv) {
        handleSelectChat(newConv);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.partner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ds': return 'bg-purple-100 text-purple-700';
      case 'gs': return 'bg-blue-100 text-blue-700';
      case 'citizen': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-red-600" />
            Messages
          </h1>
          <p className="text-gray-600 text-sm mt-1">Communicate with all users - Citizens, GS officers, and DS officers</p>
        </div>
        <button
          onClick={handleStartNewConversation}
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-red-700 font-medium transition-colors shadow-md"
        >
          <Plus size={20} /> New Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="bg-transparent w-full outline-none text-gray-900"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm border-b border-red-200">{error}</div>
          )}

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="mx-auto mb-2 text-gray-300" size={48} />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Click "New Message" to start</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <button
                    key={conv.partner_nic}
                    onClick={() => handleSelectChat(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedChat?.partner_nic === conv.partner_nic ? 'bg-red-50 border-l-4 border-l-red-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{conv.partner_name}</p>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getRoleBadgeColor(conv.partner_role)}`}>
                          {conv.partner_role.toUpperCase()}
                        </span>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-1">{conv.last_message}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <User className="text-red-600" size={24} />
                <div>
                  <p className="font-bold text-gray-900">{selectedChat.partner_name}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(selectedChat.partner_role)}`}>
                    {selectedChat.partner_role.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          msg.is_own
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        {!msg.is_own && (
                          <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender_name}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.is_own ? 'text-red-100' : 'text-gray-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    disabled={sendingMessage}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    {sendingMessage ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-3 text-gray-300" size={64} />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">New Message</h2>
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setNewMessageData({ recipient_nic: '', subject: '', content: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient *</label>
                <select
                  value={newMessageData.recipient_nic}
                  onChange={e => setNewMessageData({ ...newMessageData, recipient_nic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">-- Select recipient --</option>
                  {availableUsers.map(user => (
                    <option key={user.nic} value={user.nic}>
                      {user.fullname} ({user.role.toUpperCase()}) {user.gs_section && `- ${user.gs_section}`} {user.ds_division && `- ${user.ds_division}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newMessageData.subject}
                  onChange={e => setNewMessageData({ ...newMessageData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Message subject (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={newMessageData.content}
                  onChange={e => setNewMessageData({ ...newMessageData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={5}
                  placeholder="Type your message here..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setNewMessageData({ recipient_nic: '', subject: '', content: '' });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNewMessage}
                disabled={!newMessageData.recipient_nic || !newMessageData.content.trim() || sendingMessage}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sendingMessage ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
