'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Status = 'idle' | 'loading' | 'error';

const QUICK_REPLIES_ID = [
  'Cari produk kayu / woodgrain',
  'Apa itu Protak Core?',
  'Cara minta sampel?',
  'Hubungi tim Varindo',
];

const QUICK_REPLIES_EN = [
  'Find a woodgrain product',
  'What is Protak Core?',
  'How to request a sample?',
  'Contact the Varindo team',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span key={i}
          className="w-1.5 h-1.5 rounded-full bg-varindo-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function formatMessage(text: string) {
  // Convert **bold** and basic line breaks
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function AiChat() {
  const { lang } = useLang();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [status, setStatus]     = useState<Status>('idle');
  const [hasOpened, setHasOpened] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  // Number of user messages already included in the last transcript sent — lets sendTranscript
  // skip re-sending an unchanged conversation when the chat is opened/closed more than once.
  const sentUserMessageCountRef = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (!hasOpened) {
        setHasOpened(true);
        // Greeting message
        setMessages([{
          role: 'assistant',
          content: lang === 'id'
            ? 'Halo! Saya VIA, asisten virtual Varindo. Saya bisa membantu Anda menemukan produk HPL Lamitak, informasi harga, atau menjawab pertanyaan umum. Apa yang bisa saya bantu?'
            : 'Hello! I\'m Varindo\'s virtual assistant. I can help you find Lamitak HPL products, pricing information, or answer general questions. How can I help you?'
        }]);
      }
    }
  }, [open, hasOpened, lang]);

  const quickReplies = lang === 'id' ? QUICK_REPLIES_ID : QUICK_REPLIES_EN;

  const sendMessage = async (text: string) => {
    const userMessage = text.trim();
    if (!userMessage || status === 'loading') return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setStatus('loading');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          lang,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const sendTranscript = () => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return;
    // Nothing new since the last send (e.g. user closed, reopened, closed again) — skip to
    // avoid emailing an identical transcript more than once.
    if (userMessages.length <= sentUserMessageCountRef.current) return;

    sentUserMessageCountRef.current = userMessages.length;
    fetch('/api/chat-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, lang }),
    }).catch(() => {});
  };

  const waUrl = `https://wa.me/6281288885224?text=${encodeURIComponent(
    lang === 'id' ? 'Halo Admin Varindo, saya ingin bertanya mengenai produk Lamitak.' : 'Hello Varindo team, I would like to ask about Lamitak products.'
  )}`;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[200] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-card bg-white shadow-luxury animate-fade-up"
          style={{ height: 'min(560px, calc(100vh - 120px))' }}>

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-varindo-canvas">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                    fill="#282828"/>
                  <circle cx="12" cy="12" r="10" stroke="#282828" strokeWidth="1.5" fill="none"/>
                  <path d="M8 10h8M8 14h5" stroke="#282828" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[17px] font-semibold leading-tight tracking-[-0.022em] text-varindo-ink">
                  VIA
                </p>
                <p className="text-[12px] tracking-[-0.012em] text-varindo-mid">
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* WhatsApp handoff */}
              <a href={waUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 rounded-pill bg-varindo-canvas px-3 py-1.5 text-[12px] tracking-[-0.012em] text-varindo-deep transition-colors hover:bg-varindo-wash">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6L0 24l6.19-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52z"/>
                </svg>
                WhatsApp
              </a>
              <button onClick={() => { sendTranscript(); setOpen(false); }}
                className="flex h-7 w-7 items-center justify-center rounded-pill text-varindo-mid transition-colors hover:bg-varindo-canvas hover:text-varindo-ink"
                aria-label="Close chat">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-varindo-canvas p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-varindo-ink">
                    <span className="text-[10px] font-semibold text-white">V</span>
                  </div>
                )}
                <div className={`max-w-[82%] rounded-[18px] px-4 py-2.5 text-[14px] leading-6 ${
                  msg.role === 'user'
                    ? 'bg-varindo-blue text-white'
                    : 'bg-white text-varindo-ink'
                }`}>
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {status === 'loading' && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-varindo-ink">
                  <span className="text-[10px] font-semibold text-white">V</span>
                </div>
                <div className="rounded-[18px] bg-white">
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="flex justify-start">
                <div className="rounded-[18px] bg-white px-4 py-2.5 text-[14px] text-varindo-ember">
                  {lang === 'id'
                    ? 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi tim kami.'
                    : 'Sorry, something went wrong. Please try again or contact our team.'}
                  <button onClick={() => setStatus('idle')} className="ml-2 underline">
                    {lang === 'id' ? 'Coba lagi' : 'Retry'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick replies — show only after first assistant message, no user messages yet */}
            {messages.length === 1 && messages[0].role === 'assistant' && status === 'idle' && (
              <div className="pt-1 flex flex-wrap gap-2">
                {quickReplies.map((qr) => (
                  <button key={qr} onClick={() => handleQuickReply(qr)}
                    className="rounded-pill bg-white px-3.5 py-2 text-left text-[12px] text-varindo-deep transition-colors hover:bg-varindo-wash">
                    {qr}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}
            className="flex shrink-0 items-center gap-2 bg-white px-3 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={lang === 'id' ? 'Ketik pertanyaan Anda…' : 'Type your question…'}
              disabled={status === 'loading'}
              className="h-11 flex-1 rounded-pill bg-varindo-canvas px-4 text-[14px] tracking-[-0.016em] text-varindo-ink outline-none placeholder:text-varindo-400 disabled:opacity-50"
            />
            <button type="submit" disabled={!input.trim() || status === 'loading'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-varindo-blue text-white transition-colors hover:bg-[#3d3d3d] disabled:cursor-not-allowed disabled:opacity-40">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M17.5 2.5L9.167 10.833M17.5 2.5L12.5 17.5l-3.333-6.667L2.5 7.5l15-5z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          {/* Footer note */}
          <div className="shrink-0 bg-white px-4 pb-3 shrink-0">
            <p className="text-center text-[12px] text-varindo-mid">
              {lang === 'id'
                ? 'AI dapat membuat kesalahan. Untuk konfirmasi resmi, hubungi tim kami.'
                : 'AI can make mistakes. For official confirmation, contact our team.'}
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => { if (open) sendTranscript(); setOpen(v => !v); }}
        aria-label={lang === 'id' ? 'Buka asisten AI' : 'Open AI assistant'}
        className={`fixed bottom-5 right-4 sm:right-6 z-[200] flex h-14 w-14 items-center justify-center rounded-pill shadow-luxury transition-colors duration-200 ${
          open ? 'bg-varindo-ink' : 'bg-varindo-blue hover:bg-[#3d3d3d]'
        }`}>
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              stroke="white" strokeWidth="1.5"/>
            <path d="M8 10h8M8 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="19" cy="5" r="4" fill="#282828"/>
            <path d="M17.5 5h3M19 3.5v3" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}

        {/* Pulse ring — only when closed */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-pill bg-varindo-blue opacity-20" />
        )}
      </button>
    </>
  );
}
