import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import {
  AlertCircle, FileText, Calendar, Clock, Gift, CheckCheck,
  ChevronRight, Bell
} from 'lucide-react'

const typeConfig = {
  'action-required': { icon: AlertCircle, color: 'red', bgClass: 'bg-red-50 border-red-100' },
  'application-update': { icon: FileText, color: 'civic', bgClass: 'bg-civic-50 border-civic-100' },
  'appointment': { icon: Calendar, color: 'saffron', bgClass: 'bg-saffron-50 border-saffron-100' },
  'general': { icon: Bell, color: 'slate', bgClass: 'bg-slate-50 border-slate-100' },
}

const filterOptions = [
  { key: 'all', label: 'All' },
  { key: 'action-required', labelKey: 'actionRequired' },
  { key: 'application-update', labelKey: 'applicationUpdate' },
  { key: 'appointment', labelKey: 'appointment' },
  { key: 'general', labelKey: 'general' },
]

export default function Inbox() {
  const { notifications, language, markNotificationRead } = useApp()
  const [filter, setFilter] = useState('all')
  const [expandedNotif, setExpandedNotif] = useState(null)

  const filtered = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id)
    })
  }

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('inbox', language)}</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn-ghost text-sm flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            {t('markAllRead', language)}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === opt.key
                ? 'bg-civic-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {opt.labelKey ? t(opt.labelKey, language) : opt.label}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">{t('noNotifications', language)}</p>
          </div>
        ) : (
          filtered.map(notif => {
            const config = typeConfig[notif.type] || typeConfig.general
            const Icon = config.icon
            const isExpanded = expandedNotif === notif.id

            return (
              <div
                key={notif.id}
                className={`rounded-2xl border transition-all ${
                  !notif.read ? config.bgClass : 'bg-white border-slate-100'
                } ${isExpanded ? 'shadow-card' : ''}`}
              >
                <button
                  onClick={() => {
                    setExpandedNotif(isExpanded ? null : notif.id)
                    if (!notif.read) markNotificationRead(notif.id)
                  }}
                  className="w-full p-4 flex items-start gap-3 text-left"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !notif.read ? `bg-${config.color}-100` : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      !notif.read ? `text-${config.color}-600` : 'text-slate-400'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!notif.read && (
                        <div className="w-2 h-2 bg-civic-500 rounded-full flex-shrink-0" />
                      )}
                      <p className={`font-medium ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{notif.description}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(notif.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="p-4 bg-white rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-600 mb-3">{notif.description}</p>
                      {notif.actionLabel && notif.actionPath && (
                        <Link
                          to={notif.actionPath}
                          className="btn-primary text-sm py-2 px-4 inline-flex"
                        >
                          {notif.actionLabel}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
