import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import {
  ArrowLeft, CheckCircle2, Clock, Circle, FileText,
  Download, MessageCircle, AlertCircle
} from 'lucide-react'

export default function ApplicationDetail() {
  const { appId } = useParams()
  const { applications, language, openAiGuide } = useApp()
  const navigate = useNavigate()

  const app = applications.find(a => a.id === appId)

  if (!app) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-slate-500">Application not found</p>
        <button onClick={() => navigate('/applications')} className="btn-primary mt-4">
          {t('back', language)}
        </button>
      </div>
    )
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

      {/* Application Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{app.serviceName}</h1>
            <p className="text-slate-500 mt-1">Application ID: {app.id}</p>
          </div>
          <span className="badge-civic text-lg px-4 py-1">{app.progress}%</span>
        </div>

        <div className="progress-bar mb-4">
          <div className="progress-fill" style={{ width: `${app.progress}%` }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Submitted</p>
            <p className="font-medium text-slate-900">
              {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Status</p>
            <p className="font-medium text-civic-600 capitalize">{app.status.replace('-', ' ')}</p>
          </div>
          <div>
            <p className="text-slate-400">Steps done</p>
            <p className="font-medium text-slate-900">
              {app.steps.filter(s => s.status === 'completed').length} / {app.steps.length}
            </p>
          </div>
          {app.deadline && (
            <div>
              <p className="text-slate-400">Deadline</p>
              <p className="font-medium text-saffron-600">
                {new Date(app.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="card mb-6">
        <h2 className="section-title">Application Timeline</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />
          
          <div className="space-y-0">
            {app.timeline.map((step, i) => (
              <div key={step.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                {/* Icon */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === 'completed' ? 'bg-emerald-100' :
                  step.status === 'in-progress' ? 'bg-civic-100' : 'bg-slate-100'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : step.status === 'in-progress' ? (
                    <div className="w-3 h-3 bg-civic-500 rounded-full animate-pulse" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${
                      step.status === 'completed' ? 'text-slate-500' :
                      step.status === 'in-progress' ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </p>
                    {step.status === 'completed' && step.completedDate && (
                      <span className="text-xs text-slate-400">
                        {new Date(step.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {step.status === 'in-progress' && step.lastUpdated && (
                      <span className="text-xs text-civic-500">
                        Updated {new Date(step.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{step.description}</p>
                  
                  {step.status === 'in-progress' && (
                    <div className="mt-2 bg-civic-50 rounded-lg px-3 py-2 border border-civic-100">
                      <p className="text-xs text-civic-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expected next step: {step.title}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps to Complete */}
      <div className="card mb-6">
        <h2 className="section-title">Application Steps</h2>
        <div className="space-y-3">
          {app.steps.map(step => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                step.status === 'current' ? 'bg-civic-50 border border-civic-200' :
                step.status === 'completed' ? 'bg-slate-50' : 'bg-white border border-slate-100'
              }`}
            >
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : step.status === 'current' ? (
                <div className="w-5 h-5 bg-civic-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'completed' ? 'text-slate-500 line-through' :
                  step.status === 'current' ? 'text-civic-700' : 'text-slate-500'
                }`}>
                  {step.title}
                </p>
                {step.completedDate && (
                  <p className="text-xs text-slate-400">
                    Completed {new Date(step.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
                {step.deadline && step.status !== 'completed' && (
                  <p className="text-xs text-saffron-600">
                    Due {new Date(step.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
              {step.status === 'current' && (
                <span className="badge-civic text-xs">Current</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="card mb-6">
        <h2 className="section-title">{t('documents', language)}</h2>
        <div className="space-y-2">
          {app.documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                {doc.date && (
                  <p className="text-xs text-slate-400">
                    Uploaded {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
              {doc.status === 'uploaded' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : doc.status === 'pending' ? (
                <AlertCircle className="w-4 h-4 text-saffron-500" />
              ) : (
                <span className="text-xs text-slate-400">Not required</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ask Guide */}
      <button
        onClick={() => openAiGuide({ page: 'application-detail', application: app })}
        className="flex items-center gap-2 text-civic-600 hover:text-civic-700 text-sm font-medium"
      >
        <MessageCircle className="w-4 h-4" />
        {t('askGuide', language)}
      </button>
    </div>
  )
}
