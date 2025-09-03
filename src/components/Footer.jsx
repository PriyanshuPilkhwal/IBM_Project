import React from 'react'
import { Shield, Globe, Users } from 'lucide-react'

export default function Footer(props) {
  return (
    <div {...props}>
      <div className="text-center space-y-4">
        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <Shield className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Secure</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Privacy First</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <Globe className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Global</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Worldwide</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <Users className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Community</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">50k+ Students</div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-500">
            © 2024 AdmissionAI Pro. AI-powered college admission guidance.
          </div>
        </div>
      </div>
    </div>
  )
}