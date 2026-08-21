import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import {
  Search, ChevronRight, Clock, AlertCircle, CheckCircle2,
  Calendar, FileText, Gift, ArrowRight, Bell
} from 'lucide-react'

export default function Home() {
  const { user, applications, tasks, notifications, benefits, language } = useApp()
  const navigate = useNavigate()
  const unreadNotifs = notifications.filter(n => !n.read)
  const activeTasks = tasks.filter(t => !t.completed)
  const eligibleBenefits = benefits.filter(b => b.status === 'eligible')

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('welcome', language)}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Search Bar */}
      <button
        onClick={() => navigate('/search')}
        className="w-full mb-8 flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-left hover:border-civic-300 hover:shadow-soft transition-all group"
      >
        <Search className="w-5 h-5 text-slate-400 group-hover:text-civic-500 transition-colors" />
        <div className="flex-1">
          <p className="text-slate-400 text-sm sm:text-base">{t('searchPlaceholder', language)}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-civic-500 transition-colors" />
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/tasks" className="card-hover group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-saffron-100 rounded-xl flex items-center justify-center group-hover:bg-saffron-200 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-saffron-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeTasks.length}</p>
              <p className="text-xs text-slate-500">{t('tasks', language)}</p>
            </div>
          </div>
        </Link>

        <Link to="/applications" className="card-hover group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-civic-100 rounded-xl flex items-center justify-center group-hover:bg-civic-200 transition-colors">
              <FileText className="w-5 h-5 text-civic-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
              <p className="text-xs text-slate-500">{t('applications', language)}</p>
            </div>
          </div>
        </Link>

        <Link to="/inbox" className="card-hover group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{unreadNotifs.length}</p>
              <p className="text-xs text-slate-500">{t('inbox', language)}</p>
            </div>
          </div>
        </Link>

        <Link to="/benefits" className="card-hover group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Gift className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{eligibleBenefits.length}</p>
              <p className="text-xs text-slate-500">{t('benefits', language)}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Tasks */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">{t('currentTasks', language)}</h2>
              <Link to="/tasks" className="text-sm text-civic-600 hover:text-civic-700 font-medium flex items-center gap-1">
                {t('viewAll', language)} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {activeTasks.slice(0, 3).map(task => (
                <Link
                  key={task.id}
                  to="/tasks"
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-100' : 
                    task.priority === 'medium' ? 'bg-saffron-100' : 'bg-civic-100'
                  }`}>
                    {task.priority === 'high' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : task.category === 'appointment' ? (
                      <Calendar className="w-5 h-5 text-saffron-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-civic-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{task.title}</p>
                    <p className="text-sm text-slate-500 truncate">{task.description}</p>
                  </div>
                  {task.deadline && (
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-medium ${task.priority === 'high' ? 'text-red-600' : 'text-slate-500'}`}>
                        {t('deadline', language)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Active Applications */}
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">{t('activeApplications', language)}</h2>
              <Link to="/applications" className="text-sm text-civic-600 hover:text-civic-700 font-medium flex items-center gap-1">
                {t('viewAll', language)} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {applications.map(app => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="block p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900">{app.serviceName}</p>
                    <span className="badge-civic">{app.progress}%</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <div className="progress-fill" style={{ width: `${app.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {app.steps.filter(s => s.status === 'completed').length} of {app.steps.length} {t('steps', language)}
                    </span>
                    <span>{t('submitted', language)} {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Important Updates */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">{t('importantUpdates', language)}</h2>
              <Link to="/inbox" className="text-sm text-civic-600 hover:text-civic-700">
                {t('viewAll', language)}
              </Link>
            </div>
            <div className="space-y-3">
              {unreadNotifs.slice(0, 3).map(notif => (
                <div key={notif.id} className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="card">
            <h2 className="section-title">{t('upcomingAppointments', language)}</h2>
            <div className="p-4 bg-civic-50 rounded-xl border border-civic-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-civic-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-civic-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Driving Licence Test</p>
                  <p className="text-xs text-slate-500">Sep 3 · 10:30 AM</p>
                  <p className="text-xs text-civic-600">RTO Pune, Sangamwadi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Benefits */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">{t('recommendedBenefits', language)}</h2>
              <Link to="/benefits" className="text-sm text-civic-600 hover:text-civic-700">
                {t('viewAll', language)}
              </Link>
            </div>
            <div className="space-y-3">
              {eligibleBenefits.slice(0, 2).map(benefit => (
                <Link
                  key={benefit.id}
                  to="/benefits"
                  className="block p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{benefit.name}</p>
                      <p className="text-xs text-emerald-600 font-medium">{benefit.amount}</p>
                    </div>
                    <span className="badge-success text-[10px]">{benefit.matchScore}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
