import React, { useState, useEffect } from 'react'
import { Activity, Cpu, Wifi, Clock } from 'lucide-react'

export default function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    online: navigator.onLine,
    responseTime: 0
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId

    const updateFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(updateFPS)
    }

    const handleOnlineStatus = () => {
      setMetrics(prev => ({ ...prev, online: navigator.onLine }))
    }

    updateFPS()
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    // Show/hide with keyboard shortcut
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-slate-800/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-slate-700/80 transition-colors"
          title="Show Performance Monitor (Ctrl+Shift+P)"
        >
          <Activity className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900/95 backdrop-blur-sm text-white rounded-lg p-4 shadow-xl border border-slate-700 min-w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Performance
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            FPS
          </span>
          <span className={`font-mono ${metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
            {metrics.fps}
          </span>
        </div>
        
        {metrics.memory > 0 && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              Memory
            </span>
            <span className={`font-mono ${metrics.memory > 100 ? 'text-red-400' : metrics.memory > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
              {metrics.memory}MB
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            Network
          </span>
          <span className={`font-mono ${metrics.online ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-slate-700 text-xs text-slate-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}