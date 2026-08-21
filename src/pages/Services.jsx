import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import { serviceCategories } from '../data/services'
import {
  Shield, Car, Wallet, GraduationCap, Heart, Home, Gift,
  ChevronDown, ChevronRight, Clock, FileText, Wifi
} from 'lucide-react'

const iconMap = {
  Shield, Car, Wallet, GraduationCap, Heart, Home, Gift,
}

const colorMap = {
  civic: { bg: 'bg-civic-100', text: 'text-civic-600', border: 'border-civic-200' },
  saffron: { bg: 'bg-saffron-100', text: 'text-saffron-600', border: 'border-saffron-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
}

export default function Services() {
  const { language } = useApp()
  const [expandedCategory, setExpandedCategory] = useState('identity')

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('services', language)}</h1>
        <p className="text-slate-500 mt-1">Browse government services by category</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {serviceCategories.map(category => {
          const Icon = iconMap[category.icon] || FileText
          const colors = colorMap[category.color] || colorMap.civic
          const isExpanded = expandedCategory === category.id

          return (
            <div key={category.id} className="card overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full flex items-center gap-4 p-2 -m-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  <p className="text-sm text-slate-500">{category.services.length} services</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Services List */}
              {isExpanded && (
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {category.services.map(service => (
                    <Link
                      key={service.id}
                      to={`/services/${service.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900 group-hover:text-civic-600 transition-colors">
                            {service.name}
                          </p>
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
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-civic-500 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
