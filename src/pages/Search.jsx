import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import { searchServices } from '../data/services'
import {
  Search as SearchIcon, Sparkles, ArrowRight, Clock, FileText, Wifi, X
} from 'lucide-react'

const quickSearches = [
  { query: 'I lost my driving licence', intent: 'Driving Licence Replacement' },
  { query: 'I need financial help for college', intent: 'Scholarship Search' },
  { query: 'Where can I check my application?', intent: 'Application Status' },
  { query: 'I have an appointment tomorrow', intent: 'Appointment Info' },
]

export default function Search() {
  const { language, openAiGuide } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [interpretedIntent, setInterpretedIntent] = useState(null)

  const handleSearch = (searchQuery) => {
    const q = searchQuery || query
    if (!q.trim()) return

    const found = searchServices(q)
    setResults(found)
    setSearched(true)

    // Try to interpret intent for display
    const intentPatterns = [
      { pattern: /lost|replace|replacement/i, intent: 'Driving Licence Replacement' },
      { pattern: /financial help|money|scholarship|fund/i, intent: 'Scholarship Search' },
      { pattern: /check.*status|application.*status|where.*application/i, intent: 'Application Status Lookup' },
      { pattern: /appointment|test|exam/i, intent: 'Appointment Information' },
      { pattern: /renew|renewal/i, intent: 'Service Renewal' },
      { pattern: /register|registration/i, intent: 'Service Registration' },
    ]

    const matched = intentPatterns.find(p => p.pattern.test(q))
    setInterpretedIntent(matched ? matched.intent : null)
  }

  const handleQuickSearch = (searchQuery) => {
    setQuery(searchQuery)
    handleSearch(searchQuery)
  }

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('search', language)}</h1>
        <p className="text-slate-500 mt-1">{t('searchHint', language)}</p>
      </div>

      {/* Search Input */}
      <div className="card mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-civic-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <SearchIcon className="w-5 h-5 text-civic-600" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('searchPlaceholder', language)}
            className="flex-1 text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); setSearched(false); setInterpretedIntent(null); }}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Searches (shown when no search) */}
      {!searched && (
        <div className="mb-6">
          <h2 className="section-title flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-civic-500" />
            Try searching
          </h2>
          <div className="space-y-2">
            {quickSearches.map((item, i) => (
              <button
                key={i}
                onClick={() => handleQuickSearch(item.query)}
                className="w-full flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-civic-200 hover:bg-civic-50 transition-all text-left group"
              >
                <SearchIcon className="w-4 h-4 text-slate-300 group-hover:text-civic-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700 group-hover:text-civic-700">"{item.query}"</p>
                  <p className="text-xs text-slate-400">{item.intent}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-civic-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Intent Interpretation */}
      {searched && interpretedIntent && (
        <div className="mb-4 p-4 bg-civic-50 rounded-xl border border-civic-100">
          <p className="text-sm text-civic-600">
            <Sparkles className="w-4 h-4 inline mr-1" />
            You're looking for: <span className="font-semibold text-civic-700">{interpretedIntent}</span>
          </p>
        </div>
      )}

      {/* Search Results */}
      {searched && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            {results.length} {results.length === 1 ? 'service' : 'services'} found
          </p>
          
          {results.length === 0 ? (
            <div className="card text-center py-12">
              <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">{t('noResults', language)}</p>
              <p className="text-sm text-slate-400 mt-1">{t('tryDifferent', language)}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(service => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="card-hover block"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-civic-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-civic-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-civic-600">
                          {service.name}
                        </h3>
                        {service.online && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            <Wifi className="w-3 h-3" />
                            Online
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {service.documents.length} {t('documents', language)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ~{service.estimatedTime} {t('minutes', language)}
                        </span>
                        <span className="text-civic-600 font-medium">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-civic-500 flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
