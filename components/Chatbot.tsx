'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2, Loader2, ThumbsUp, ThumbsDown, Copy, RefreshCw, Phone, Mail } from 'lucide-react';
import { API_URL } from '@/lib/api';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  category?: string;
  helpful?: boolean;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messageRating, setMessageRating] = useState<{ [key: number]: boolean | null }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Ayubowan! 🙏 Welcome to Smart Citizen LK.", sender: 'bot' },
    { id: 2, text: "I'm your AI Assistant here 24/7. I can help you with Passports, NICs, Birth Certificates, Police Clearance, Payments, and much more! What do you need help with?", sender: 'bot', category: 'greeting' }
  ]);

  // Quick action suggestions
  const quickActions = [
    { icon: '🛂', text: 'Passport Info', query: 'How to apply for Passport?' },
    { icon: '🆔', text: 'Get NIC', query: 'Tell me about NIC application' },
    { icon: '👶', text: 'Birth Cert', query: 'How to get birth certificate?' },
    { icon: '🔍', text: 'Police Clear', query: 'Police clearance information' },
    { icon: '💳', text: 'Payment', query: 'What payment methods do you accept?' },
    { icon: '📊', text: 'Track Status', query: 'How do I check application status?' },
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userText = message;
    setInput('');
    setShowSuggestions(false);

    // 1. Add User Message
    const userMsg: Message = { id: Date.now(), text: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Call Python Backend
      const res = await fetch(`${API_URL}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();

      // 3. Add Bot Response with formatting
      const botMsg: Message = { 
        id: Date.now() + 1, 
        text: data.response, 
        sender: 'bot',
        category: data.category || 'general'
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        text: "Sorry, I'm having trouble connecting to the server. Please try again later or contact support.", 
        sender: 'bot',
        category: 'error'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendMessage(input);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const rateMessage = (msgId: number, helpful: boolean) => {
    setMessageRating(prev => ({ ...prev, [msgId]: helpful }));
    // Here you can send this feedback to your backend for analytics
  };

  const clearChat = () => {
    if (confirm('Clear all messages?')) {
      setMessages([
        { id: 1, text: "Ayubowan! 🙏 Welcome back to Smart Citizen LK.", sender: 'bot' },
        { id: 2, text: "How can I help you today?", sender: 'bot', category: 'greeting' }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 1. Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 border-4 border-white animate-bounce"
        >
          <MessageSquare size={28} />
          <span className="font-bold hidden md:block">Help</span>
        </button>
      )}

      {/* 2. Chat Window */}
      {isOpen && (
        <div className="bg-white w-[380px] md:w-[450px] h-[600px] rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full relative">
                <Bot size={24} />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Smart Assistant AI</h3>
                <p className="text-[10px] text-blue-200">🟢 Online | Always Available</p>
              </div>
            </div>
            <div className="flex gap-2">
                <button onClick={clearChat} className="text-blue-200 hover:text-white hover:bg-white/20 p-1 rounded" title="Clear chat">
                  <RefreshCw size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white hover:bg-white/20 p-1 rounded">
                  <Minimize2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white hover:bg-white/20 p-1 rounded">
                  <X size={18} />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}>
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
                
                {/* Message Actions for Bot Messages */}
                {msg.sender === 'bot' && (
                  <div className="flex justify-start gap-2 mt-2 px-2 ml-2">
                    <button 
                      onClick={() => copyToClipboard(msg.text)}
                      className="text-gray-400 hover:text-blue-600 transition"
                      title="Copy message"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => rateMessage(msg.id, true)}
                      className={`transition ${messageRating[msg.id] === true ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                      title="Helpful"
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button 
                      onClick={() => rateMessage(msg.id, false)}
                      className={`transition ${messageRating[msg.id] === false ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                      title="Not helpful"
                    >
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length < 3 && !showSuggestions && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-semibold">🎯 Popular Topics:</p>
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      sendMessage(action.query);
                      setShowSuggestions(true);
                    }}
                    className="text-xs px-2 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition text-center leading-tight"
                  >
                    {action.icon}<br/>{action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {showSuggestions && (
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => sendMessage('How much is a Passport?')} className="whitespace-nowrap px-3 py-2 bg-white border border-blue-300 text-blue-600 text-xs rounded-full hover:bg-blue-50 font-medium">🛂 Fees</button>
              <button onClick={() => sendMessage('What documents do I need?')} className="whitespace-nowrap px-3 py-2 bg-white border border-blue-300 text-blue-600 text-xs rounded-full hover:bg-blue-50 font-medium">📄 Documents</button>
              <button onClick={() => sendMessage('How long does it take?')} className="whitespace-nowrap px-3 py-2 bg-white border border-blue-300 text-blue-600 text-xs rounded-full hover:bg-blue-50 font-medium">⏱️ Timeline</button>
              <button onClick={() => sendMessage('Help')} className="whitespace-nowrap px-3 py-2 bg-white border border-blue-300 text-blue-600 text-xs rounded-full hover:bg-blue-50 font-medium">🆘 Support</button>
            </div>
          )}

          {/* Contact Info */}
          <div className="px-4 py-2 bg-blue-50 border-t border-gray-200 flex gap-3 justify-center text-xs">
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700" title="Call support">
              <Phone size={14} />
              <span className="hidden sm:inline">Call</span>
            </button>
            <div className="w-px bg-gray-300"></div>
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700" title="Email support">
              <Mail size={14} />
              <span className="hidden sm:inline">Email</span>
            </button>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-1 bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2.5 text-sm outline-none transition-all"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={isTyping || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}