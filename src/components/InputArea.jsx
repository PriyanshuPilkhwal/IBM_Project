import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Mic, Paperclip } from 'lucide-react'

export default function InputArea({ onSend, loading }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [value, adjustTextareaHeight])

  const submit = useCallback(async () => {
    const trimmedValue = value.trim()
    if (!trimmedValue || loading) return
    
    await onSend(trimmedValue)
    setValue('')
    
    // Focus back to input after sending
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }, [value, loading, onSend])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }, [submit])

  const onChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])

  const quickSuggestions = [
    "What are the admission requirements?",
    "Help me with my essay",
    "Scholarship opportunities",
    "Application deadlines"
  ]

  const handleSuggestionClick = useCallback((suggestion) => {
    setValue(suggestion)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }, [])

  return (
    <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      {/* Quick Suggestions - Only show when empty and not loading */}
      {!value && !loading && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <div className="flex items-end space-x-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Ask about admissions, essays, scholarships, or anything else..."
                className="w-full resize-none rounded-xl px-4 py-3 pr-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                disabled={loading}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                maxLength={2000}
              />
              
              {/* Attach Button */}
              <button 
                className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-md disabled:opacity-50"
                disabled={loading}
                type="button"
                aria-label="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
            
            {/* Character Counter */}
            <div className="absolute -bottom-6 right-2 text-xs text-slate-400">
              <span className={value.length > 1800 ? 'text-orange-500' : value.length > 1900 ? 'text-red-500' : ''}>
                {value.length}
              </span>
              /2000
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end space-x-2">
            {/* Voice Input */}
            <button 
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
              disabled={loading}
              type="button"
              aria-label="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              onClick={submit}
              disabled={!value.trim() || loading || value.length > 2000}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-lg disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
              type="button"
              aria-label="Send message"
            >
              {loading ? (
                <div className="w-5 h-5">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono text-xs">
                Enter
              </kbd>
              <span>to send</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono text-xs">
                Shift+Enter
              </kbd>
              <span>for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}