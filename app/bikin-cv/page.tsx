'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CVPreview from '../components/CVPreview';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function BikinCVPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cvContent, setCvContent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
  scrollToBottom();
  
  // iOS: scroll input into view when needed
  if (inputRef.current) {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 300);
  }
}, [messages, isLoading, cvContent]);
// Auto-focus textarea setelah AI selesai balas
  useEffect(() => {
    if (!isLoading) {
      // Delay sedikit biar textarea udah enabled
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // iOS Safari keyboard fix - adjust viewport & auto-scroll
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const vh = window.visualViewport.height;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Force scroll to latest message when keyboard appears
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        }, 100);
      }
    };

    handleViewportChange();
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, []);
  // Function untuk extract CV content dari message AI
  const extractCV = (content: string): { cv: string | null; cleanMessage: string } => {
    const cvStartIdx = content.indexOf('[CV_START]');
    const cvEndIdx = content.indexOf('[CV_END]');

    if (cvStartIdx === -1 || cvEndIdx === -1) {
      return { cv: null, cleanMessage: content };
    }

    // Extract CV content (tanpa markers)
    const cv = content.substring(cvStartIdx + '[CV_START]'.length, cvEndIdx).trim();

    // Hapus markers + CV dari message, ganti dengan placeholder
    const beforeCV = content.substring(0, cvStartIdx).trim();
    const afterCV = content.substring(cvEndIdx + '[CV_END]'.length).trim();

    const cleanMessage = [beforeCV, afterCV]
      .filter(Boolean)
      .join('\n\n')
      .trim();

    return {
      cv,
      cleanMessage: cleanMessage || 'CV kamu udah jadi! Cek preview di bawah ↓',
    };
  };

  // Auto-trigger pesan pembuka dari AI
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
        inputRef.current?.focus();
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

      // Extract CV jika ada
      const { cv, cleanMessage } = extractCV(data.message);

      setMessages([
        ...newMessages,
        { role: 'assistant', content: cleanMessage },
      ]);

      if (cv) {
        setCvContent(cv);
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

  // Handler buttons di CVPreview
  const handleAnalyzeCV = async () => {
    if (!cvContent) return;

    try {
      // 1. Call API analyze-cv-text
      const response = await fetch('/api/analyze-cv-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: cvContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze CV');
      }

      const result = await response.json();

      // 2. Validasi hasil
      if (!result.summary || !result.recommendations) {
        throw new Error('Invalid AI response');
      }

      // 3. Save ke sessionStorage (sesuai format result page)
      sessionStorage.setItem('cvAnalysisResult', JSON.stringify(result));

      // 4. Redirect ke /result
      window.location.href = '/result';
    } catch (error) {
      console.error('Analyze CV error:', error);
      alert('Gagal menganalisis CV. Coba lagi ya!');
      throw error; // Re-throw biar CVPreview bisa reset loading state
    }
  };

  const handleEditCV = () => {
    // Reset CV, lanjut chat untuk revisi
    setCvContent(null);
    setMessages([
      ...messages,
      {
        role: 'assistant',
        content: 'Oke, mau revisi bagian mana? Cerita aja, aku bantu update CV-mu!',
      },
    ]);
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50" style={{ height: 'var(--vh, 100dvh)' }}>
      {/* HEADER */}
      <header className=" flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all">
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
      <main className="flex-1 overflow-y-auto">
  <div className="max-w-3xl mx-auto px-4 py-6">
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

          {/* CV PREVIEW (muncul setelah CV jadi) */}
          {cvContent && (
            <CVPreview
              cvContent={cvContent}
              onAnalyze={handleAnalyzeCV}
              onEdit={handleEditCV}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
        </div>
      </main>

      {/* INPUT AREA */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-indigo-400 focus-within:bg-white transition">
            <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setTimeout(() => {
                    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                  }, 350);
                }}
                placeholder={cvContent ? 'CV udah jadi! Mau revisi? Ketik di sini...' : 'Ketik jawaban kamu di sini...'}
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