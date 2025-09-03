import React from 'react'
import { 
  GraduationCap, 
  FileText, 
  Award, 
  Calculator,
  Clock,
  MapPin,
  DollarSign,
  Users,
  BookOpen,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'

const quickActions = [
  { 
    id: 'admissions', 
    icon: GraduationCap, 
    label: 'Admission Requirements', 
    prompt: "What are the admission requirements for Computer Science programs?",
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
  },
  { 
    id: 'essays', 
    icon: FileText, 
    label: 'Essay Writing Help', 
    prompt: "Help me write a compelling personal statement for my college application.",
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
  },
  { 
    id: 'scholarships', 
    icon: Award, 
    label: 'Scholarship Search', 
    prompt: "What scholarship opportunities are available for international students?",
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
  },
  { 
    id: 'costs', 
    icon: Calculator, 
    label: 'Cost Calculator', 
    prompt: "Help me calculate the total cost of college including tuition, housing, and expenses.",
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
  },
  { 
    id: 'deadlines', 
    icon: Clock, 
    label: 'Application Deadlines', 
    prompt: "What are the important application deadlines I need to know?",
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
  },
  { 
    id: 'colleges', 
    icon: MapPin, 
    label: 'College Selection', 
    prompt: "Help me choose the right colleges based on my interests and qualifications.",
    color: 'from-teal-500 to-blue-500',
    bgColor: 'from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20'
  },
  { 
    id: 'financial', 
    icon: DollarSign, 
    label: 'Financial Aid', 
    prompt: "What financial aid options are available and how do I apply?",
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
  },
  { 
    id: 'preparation', 
    icon: BookOpen, 
    label: 'Test Preparation', 
    prompt: "How should I prepare for standardized tests like SAT, ACT, or GRE?",
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20'
  }
]

export default function QuickActions({ onSelect, disabled }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Quick Actions</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Get instant help with common admission topics
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onSelect(action.prompt)}
              disabled={disabled}
              className={`group relative p-4 rounded-2xl bg-gradient-to-br ${action.bgColor} border border-white/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/20 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
              
              <div className="relative flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                    {action.label}
                  </h4>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Popular Topics */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>Popular Topics</span>
        </h4>
        
        <div className="space-y-2">
          {[
            "How to write a strong personal statement",
            "Common application mistakes to avoid",
            "Tips for scholarship applications",
            "Understanding college rankings"
          ].map((topic, index) => (
            <button
              key={index}
              onClick={() => onSelect(topic)}
              disabled={disabled}
              className="w-full text-left p-3 rounded-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {topic}
                </span>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-slate-500">Popular</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h5 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
              Need personalized help?
            </h5>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
              Our AI assistant can provide detailed, personalized guidance for your specific situation. 
              Just ask any question about college admissions!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}