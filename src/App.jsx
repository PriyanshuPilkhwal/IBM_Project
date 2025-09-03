import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header'
import MessageList from './components/MessageList'
import InputArea from './components/InputArea'
import Footer from './components/Footer'
import StatusIndicator from './components/StatusIndicator'
import AICanvas from './components/AICanvas'
import PerformanceMonitor from './components/PerformanceMonitor'

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastResponse, setLastResponse] = useState(null);
  const abortControllerRef = useRef(null);
  const healthCheckIntervalRef = useRef(null);

  // Auto-detect backend URL if not set in env
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/chat";

  // Optimized health check with debouncing
  const checkHealth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const res = await fetch(import.meta.env.VITE_HEALTH_URL || 'http://localhost:5000/api/health', {
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      setIsOnline(res.ok);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn('Health check failed:', error);
      }
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    // Initial health check
    checkHealth();
    
    // Set up periodic health check with longer interval to reduce load
    healthCheckIntervalRef.current = setInterval(checkHealth, 45000); // Every 45s instead of 30s
    
    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, [checkHealth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    // Abort previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const newMessage = { 
      id: `user-${Date.now()}`,
      sender: "user", 
      text, 
      timestamp: Date.now() 
    };

    setMessages(prev => [...prev, newMessage]);
    setLoading(true);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, 30000); // 30 second timeout

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({ message: text }),
        signal: abortControllerRef.current.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      // Flexible response handling
      let aiText = data.response;
      if (!aiText && Array.isArray(data.results) && data.results.length > 0) {
        aiText = data.results[0]?.generated_text || "";
      }

      if (!aiText) {
        aiText = "I apologize, but I couldn't generate a response at the moment. Please try again or rephrase your question.";
      }

      const assistantMessage = { 
        id: `assistant-${Date.now()}`,
        sender: "assistant", 
        text: aiText.trim(),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastResponse(aiText.trim());
      setIsOnline(true);
      
      // Clear last response after showing it briefly
      setTimeout(() => setLastResponse(null), 3000);

    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err.name === 'AbortError') {
        console.log('Request was aborted');
        return; // Don't show error for aborted requests
      }

      console.error("Error sending message:", err);
      setIsOnline(false);
      
      const errorMessage = { 
        id: `error-${Date.now()}`,
        sender: "assistant", 
        text: "I'm experiencing technical difficulties connecting to the IBM Granite AI model. Please try again in a moment or contact our admissions office directly.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [API_URL, loading]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'dark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AICanvas 
        isActive={messages.length > 0}
        isLoading={loading}
        response={lastResponse}
      />
      <div className="flex flex-col h-screen relative z-20">
        <StatusIndicator isOnline={isOnline} />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto px-4 py-6 flex flex-col">
            {/* Chat Area - Full Width */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden flex flex-col">
                <MessageList messages={messages} loading={loading} />
                <InputArea onSend={sendMessage} loading={loading} />
              </div>
            </div>
          </div>
        </main>
        
        <Footer className="lg:hidden" />
      </div>
      
      {/* Development Performance Monitor */}
      {import.meta.env.DEV && <PerformanceMonitor />}
    </div>
  );
}