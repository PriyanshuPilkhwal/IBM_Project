import React, { useEffect, useRef, useCallback } from 'react';
import { Bot, User, Clock, CheckCircle2 } from 'lucide-react';

export default function MessageList({ messages, loading }) {
  const endRef = useRef(null);
  const containerRef = useRef(null);
  const isUserScrolledUpRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Optimized scroll to bottom function
  const scrollToBottom = useCallback((force = false) => {
    if (!endRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // Only auto-scroll if user is near bottom or force is true
    if (force || (!isUserScrolledUpRef.current && (isNearBottom || messages.length === 1))) {
      endRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages.length]);

  // Handle user scrolling detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const currentScrollTop = container.scrollTop;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;

    // User scrolled up
    if (currentScrollTop < lastScrollTopRef.current && !isAtBottom) {
      isUserScrolledUpRef.current = true;
    }
    // User scrolled to bottom
    else if (isAtBottom) {
      isUserScrolledUpRef.current = false;
    }

    lastScrollTopRef.current = currentScrollTop;
  }, []);

  // Throttled scroll event handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledScroll, { passive: true });
    return () => container.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Auto-scroll on new messages or loading state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Small delay to ensure DOM is updated

    return () => clearTimeout(timer);
  }, [messages, loading, scrollToBottom]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to AdmissionAI Pro
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Your intelligent college admission assistant powered by IBM Granite AI. 
            Get personalized guidance for applications, essays, and scholarships.
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Instant Answers</div>
              <div className="text-slate-600 dark:text-slate-400">Real-time AI responses</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Expert Guidance</div>
              <div className="text-slate-600 dark:text-slate-400">Admission strategies</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">24/7 Available</div>
              <div className="text-slate-600 dark:text-slate-400">Always here to help</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Personalized</div>
              <div className="text-slate-600 dark:text-slate-400">Tailored advice</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      style={{
        scrollBehavior: 'smooth',
        overscrollBehavior: 'contain',
      }}
    >
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex items-start space-x-4 opacity-0 animate-fadeInUp ${
            message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
          style={{
            animationDelay: `${Math.min(index * 50, 500)}ms`,
            animationFillMode: 'forwards',
          }}
        >
          {/* Avatar */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
            message.sender === 'user'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
              : 'bg-gradient-to-br from-slate-600 to-slate-700'
          }`}>
            {message.sender === 'user' ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`flex-1 max-w-3xl ${message.sender === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm border transition-all duration-200 ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 ml-auto rounded-br-md'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 rounded-bl-md'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed break-words text-sm">
                {message.text}
              </div>
            </div>

            {/* Message Meta */}
            <div className={`flex items-center mt-2 space-x-2 text-xs text-slate-500 dark:text-slate-400 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{formatTime(message.timestamp)}</span>
              {message.sender === 'assistant' && (
                <>
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">IBM Granite AI</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Loading State */}
      {loading && (
        <div className="flex items-start space-x-4 opacity-0 animate-fadeInUp" style={{ animationFillMode: 'forwards' }}>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1">
            <div className="inline-block px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                  AI is thinking...
                </span>
              </div>
            </div>

            <div className="flex items-center mt-2 space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Processing with IBM Granite AI</span>
            </div>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
