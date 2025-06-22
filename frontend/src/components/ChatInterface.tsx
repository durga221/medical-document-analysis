import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setIsTyping(true);
      onSendMessage(input.trim());
      setInput('');
      setIsTyping(false);
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-[800px] bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-100/50 rounded-2xl border border-white/40 shadow-xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
            <p className="text-lg text-gray-500">Ask me anything about your medical document</p>
          </div>
        </div>
      </div>

      {/* Messages Area - Fixed height with scroll */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ minHeight: '550px', maxHeight: '550px' }}>
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome to MediAI</h3>
            <p className="text-xl text-gray-500 max-w-md mx-auto leading-relaxed">
              Upload a medical document and start asking questions. I'll help you understand and analyze your medical content with AI-powered insights.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Smart Analysis</h4>
                <p className="text-base text-gray-600">AI-powered document understanding</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Multi-language</h4>
                <p className="text-base text-gray-600">Support for multiple languages</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-4 max-w-[85%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  {message.isUser ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-5 shadow-sm ${
                    message.isUser
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                      : 'bg-white/80 backdrop-blur-sm border border-white/40'
                  }`}
                >
                  <p className={`text-lg leading-relaxed ${
                    message.isUser ? 'text-white' : 'text-gray-900'
                  }`}>
                    {message.content}
                  </p>
                  <p className={`text-sm mt-3 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="p-6 border-t border-white/20 bg-white/40 backdrop-blur-sm rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight(e);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your medical document..."
              className="w-full border border-white/40 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[56px] max-h-[120px] text-lg placeholder-gray-500"
              rows={1}
            />
            {isTyping && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className={`px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 ${
              isTyping || !input.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="mt-3 text-sm text-gray-500 text-center font-medium">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}