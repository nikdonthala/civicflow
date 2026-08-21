import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import { getBenefitsForProfile } from '../data/benefits'
import {
  Search, CheckCircle2, XCircle, HelpCircle, ArrowRight,
  GraduationCap, Heart, Briefcase, Home, Sparkles, MessageCircle
} from 'lucide-react'

const occupationOptions = [
  { key: 'student', icon: GraduationCap, labelKey: 'student', color: 'civic' },
  { key: 'worker', icon: Briefcase, labelKey: 'worker', color: 'saffron' },
  { key: 'farmer', icon: Home, labelKey: 'farmer', color: 'emerald' },
  { key: 'senior-citizen', icon: Heart, labelKey: 'seniorCitizen', color: 'civic' },
  { key: 'job-seeker', icon: Search, labelKey: 'jobSeeker', color: 'saffron' },
]

const goalOptions = [
  { key: 'education', labelKey: 'educationFunding' },
  { key: 'health', labelKey: 'healthInsurance' },
  { key: 'employment', labelKey: 'employmentHelp' },
  { key: 'housing', labelKey: 'housingAssistance' },
]

export default function Benefits() {
  const { language, openAiGuide } = useApp()
  const [selectedOccupation, setSelectedOccupation] = useState(null)
  const [selectedGoals, setSelectedGoals] = useState([])
  const [naturalQuery, setNaturalQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [benefits, setBenefits] = useState([])

  const handleFindBenefits = () => {
    const profile = {
      occupation: selectedOccupation,
      goals: selectedGoals,
    }
    const results = getBenefitsForProfile(profile)
    setBenefits(results)
    setShowResults(true)
  }

  const handleNaturalSearch = () => {
    if (!naturalQuery.trim()) return
    const profile = {
      occupation: selectedOccupation || 'student',
      goals: [...selectedGoals, naturalQuery.toLowerCase()],
    }
    const results = getBenefitsForProfile(profile)
    // Boost results that match the natural query
    const boosted = results.map(b => ({
      ...b,
      matchScore: b.name.toLowerCase().includes(naturalQuery.toLowerCase()) || 
                   b.description.toLowerCase().includes(naturalQuery.toLowerCase())
        ? Math.min(b.matchScore + 20, 100) : b.matchScore,
    })).sort((a, b) => b.matchScore - a.matchScore)
    setBenefits(boosted)
  }

  const getMatchLabel = (score) => {
    if (score >= 80) return { text: t('highMatch', language), class: 'badge-success' }
    if (score >= 50) return { text: t('mediumMatch', language), class: 'badge-warning' }
    return { text: t('lowMatch', language), class: 'bg-slate-100 text-slate-600' }
  }

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('benefitsTitle', language)}</h1>
        <p className="text-slate-500 mt-1">Find government schemes and benefits you may qualify for</p>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {/* Step 1: Select Occupation */}
          <div className="card">
            <h2 className="section-title">{t('selectOccupation', language)}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {occupationOptions.map(opt => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedOccupation(opt.key)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedOccupation === opt.key
                        ? `border-${opt.color}-400 bg-${opt.color}-50`
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      selectedOccupation === opt.key ? `text-${opt.color}-600` : 'text-slate-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      selectedOccupation === opt.key ? 'text-slate-900' : 'text-slate-600'
                    }`}>
                      {t(opt.labelKey, language)}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Select Goals */}
          <div className="card">
            <h2 className="section-title">{t('lookingFor', language)}</h2>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSelectedGoals(prev => 
                      prev.includes(opt.key) 
                        ? prev.filter(g => g !== opt.key)
                        : [...prev, opt.key]
                    )
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedGoals.includes(opt.key)
                      ? 'border-civic-400 bg-civic-50'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    selectedGoals.includes(opt.key) ? 'text-civic-700' : 'text-slate-600'
                  }`}>
                    {t(opt.labelKey, language)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Search */}
          <div className="card">
            <h2 className="section-title flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-civic-500" />
              Or describe what you need
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                placeholder="e.g., Engineering student interested in AI"
                className="input-field flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleNaturalSearch()}
              />
              <button
                onClick={handleNaturalSearch}
                className="btn-primary px-4"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Find Button */}
          <button
            onClick={handleFindBenefits}
            disabled={!selectedOccupation}
            className="w-full btn-primary py-3 text-base disabled:opacity-50"
          >
            {t('findBenefits', language)}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      ) : (
        <div>
          {/* Back to Search */}
          <button
            onClick={() => setShowResults(false)}
            className="text-sm text-civic-600 hover:text-civic-700 font-medium mb-6"
          >
            ← Change preferences
          </button>

          {/* Results */}
          <div className="space-y-4">
            {benefits.length === 0 ? (
              <div className="card text-center py-12">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No matching benefits found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your preferences</p>
              </div>
            ) : (
              benefits.map(benefit => {
                const match = getMatchLabel(benefit.matchScore)
                return (
                  <div key={benefit.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{benefit.name}</h3>
                        <p className="text-sm text-slate-500">{benefit.category}</p>
                      </div>
                      <span className={`badge ${match.class}`}>{match.text}</span>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{benefit.description}</p>

                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-lg font-bold text-emerald-600">{benefit.amount}</span>
                      {benefit.deadline && (
                        <span className="text-xs text-slate-500">
                          Deadline: {new Date(benefit.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Match Reasons */}
                    {benefit.matchReasons.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">Why this matches:</p>
                        <div className="flex flex-wrap gap-1">
                          {benefit.matchReasons.map((reason, i) => (
                            <span key={i} className="text-xs bg-civic-50 text-civic-700 px-2 py-1 rounded-full">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        ~{benefit.estimatedTime} {t('minutes', language)} · {benefit.documents.length} {t('documents', language)}
                      </span>
                      {benefit.applied ? (
                        <span className="badge-success">Applied</span>
                      ) : benefit.status === 'eligible' ? (
                        <button className="btn-primary text-sm py-1.5 px-3">
                          {t('checkEligibility', language)}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Not eligible</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Natural Language Refinement */}
          <div className="card mt-6">
            <h3 className="section-title flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-civic-500" />
              Looking for something more specific?
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                placeholder="e.g., Find scholarships for engineering students interested in AI"
                className="input-field flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleNaturalSearch()}
              />
              <button onClick={handleNaturalSearch} className="btn-primary px-4">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Guide */}
      <button
        onClick={() => openAiGuide({ page: 'benefits' })}
        className="mt-6 flex items-center gap-2 text-civic-600 hover:text-civic-700 text-sm font-medium"
      >
        <MessageCircle className="w-4 h-4" />
        {t('askGuide', language)}
      </button>
    </div>
  )
}
