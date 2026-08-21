import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import { flatServices } from '../data/services'
import {
  ArrowLeft, Clock, FileText, CheckCircle2, Wifi,
  AlertCircle, Users, ArrowRight, MessageCircle
} from 'lucide-react'

export default function ServiceDetail() {
  const { serviceId } = useParams()
  const { language, openAiGuide } = useApp()
  const navigate = useNavigate()
  
  const service = flatServices.find(s => s.id === serviceId)

  if (!service) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-slate-500">Service not found</p>
        <Link to="/services" className="btn-primary mt-4 inline-flex">
          {t('back', language)}
        </Link>
      </div>
    )
  }

  const handleStartApplication = () => {
    // In a real app, this would create a new application
    navigate('/applications')
  }

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back', language)}
      </button>

      {/* Service Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-civic-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7 text-civic-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{service.name}</h1>
              {service.online && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <Wifi className="w-3 h-3" />
                  {t('availableOnline', language)}
                </span>
              )}
            </div>
            <p className="text-slate-500 mt-1">{service.description}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              {t('services', language) === 'Services' ? 'Who it\'s for' : 'Target'}
            </div>
            <p className="font-medium text-slate-900 text-sm">{service.who}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Clock className="w-4 h-4" />
              Estimated time
            </div>
            <p className="font-medium text-slate-900 text-sm">~{service.estimatedTime} minutes</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Steps
            </div>
            <p className="font-medium text-slate-900 text-sm">{service.steps} steps to complete</p>
          </div>
        </div>

        <button
          onClick={handleStartApplication}
          className="w-full btn-primary py-3 text-base"
        >
          {t('startApplication', language)}
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Required Documents */}
      <div className="card mb-6">
        <h2 className="section-title">{t('documents', language)} required</h2>
        <div className="space-y-3">
          {service.documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-civic-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-civic-600" />
              </div>
              <p className="text-sm text-slate-700">{doc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="card bg-saffron-50 border-saffron-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-saffron-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-saffron-800 mb-1">Before you start</h3>
            <p className="text-sm text-saffron-700">
              Make sure you have all the required documents ready. You can save your progress 
              and come back later if needed. All data shown here is for demonstration purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Ask Guide */}
      <button
        onClick={() => openAiGuide({ page: 'service-detail', service })}
        className="mt-6 flex items-center gap-2 text-civic-600 hover:text-civic-700 text-sm font-medium"
      >
        <MessageCircle className="w-4 h-4" />
        {t('askGuide', language)}
      </button>
    </div>
  )
}
