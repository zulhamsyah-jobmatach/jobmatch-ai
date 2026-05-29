'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function BikinCVPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCVReady, setIsCVReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-trigger pesan pembuka dari AI saat halaman dibuka
  useEffect(() => {
    const startChat = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'Halo, aku mau bikin CV' }],
          }),
        });
        const data = await response.json();
        setMessages([{ role: 'assistant', content: data.message }]);
      } catch (error) {
        console.error('Start chat error:', error);
        setMessages([
          {
            role: 'assistant',
            content: 'Halo! Aku Job, AI assistant yang bakal bantu kamu bikin CV. Boleh aku tahu nama lengkap kamu?',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    startChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.message },
      ]);

      if (data.isCVGenerated) {
        setIsCVReady(true);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Maaf, ada error nih. Coba kirim lagi ya!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Kembali</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
              J
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Job</h1>
              <p className="text-xs text-gray-500">AI Career Assistant</p>
            </div>
          </div>

          <div className="w-20"></div>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm mr-2 flex-shrink-0">
                  J
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {/* TYPING INDICATOR */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm mr-2 flex-shrink-0">
                J
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* CV READY BANNER */}
        {isCVReady && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900">CV kamu udah jadi! 🎉</h3>
                <p className="text-sm text-green-700 mt-1">
                  Lanjut analisis karir cocok berdasarkan CV-mu?
                </p>
                <button
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  onClick={() => alert('Coming soon: integration ke career analyzer!')}
                >
                  Analisis Karir Sekarang →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* INPUT AREA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-indigo-400 focus-within:bg-white transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik jawaban kamu di sini..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none outline-none px-2 py-2 text-sm text-gray-800 max-h-32 disabled:opacity-50"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-2 rounded-xl hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Tekan Enter untuk kirim • Shift+Enter untuk newline
          </p>
        </div>
      </div>
    </div>
  );
}