import React from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function StatusIndicator({ isOnline }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm border text-xs font-medium transition-all duration-200 ${
        isOnline 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400' 
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-400'
      }`}>
        {isOnline ? (
          <>
            <CheckCircle className="w-3 h-3" />
            <span>IBM Granite Online</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3 h-3" />
            <span>Connection Issue</span>
          </>
        )}
        
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </div>
    </div>
  )
}