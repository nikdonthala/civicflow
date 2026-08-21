import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import { ChevronRight, Clock, CheckCircle2 } from 'lucide-react'

export default function Applications() {
  const { applications, language } = useApp()

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('applicationsTitle', language)}</h1>
        <p className="text-slate-500 mt-1">Track the progress of your applications</p>
      </div>

      <div className="space-y-4">
        {applications.map(app => (
          <Link
            key={app.id}
            to={`/applications/${app.id}`}
            className="card-hover block"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{app.serviceName}</h3>
                <p className="text-sm text-slate-500">Submitted {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <span className="badge-civic">{app.progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar mb-3">
              <div className="progress-fill" style={{ width: `${app.progress}%` }} />
            </div>

            {/* Current Step */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <Clock className="w-4 h-4 text-civic-500" />
              <span className="text-slate-600">
                Current: <span className="font-medium text-slate-900">
                  {app.steps.find(s => s.status === 'current')?.title || 
                   app.timeline.find(t => t.status === 'in-progress')?.title || 'Processing'}
                </span>
              </span>
            </div>

            {/* Mini Timeline */}
            <div className="flex items-center gap-1">
              {app.timeline.slice(0, 4).map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${
                    step.status === 'completed' ? 'bg-emerald-500' :
                    step.status === 'in-progress' ? 'bg-civic-500' : 'bg-slate-200'
                  }`} />
                  {i < Math.min(app.timeline.length, 4) - 1 && (
                    <div className={`w-6 h-0.5 ${
                      step.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
              {app.timeline.length > 4 && (
                <span className="text-xs text-slate-400 ml-1">+{app.timeline.length - 4} more</span>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {app.steps.filter(s => s.status === 'completed').length} of {app.steps.length} {t('steps', language)} completed
              </span>
              <span className="text-sm text-civic-600 flex items-center gap-1">
                View details <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
