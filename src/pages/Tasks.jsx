import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import {
  CheckCircle2, Circle, Clock, AlertCircle, Calendar,
  ChevronDown, ChevronRight, ArrowRight
} from 'lucide-react'

const filterOptions = [
  { key: 'all', labelKey: 'allTasks' },
  { key: 'pending', labelKey: 'pending' },
  { key: 'completed', labelKey: 'completed' },
]

export default function Tasks() {
  const { tasks, language, completeTask } = useApp()
  const [filter, setFilter] = useState('all')
  const [expandedTask, setExpandedTask] = useState(null)

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const handleComplete = (taskId) => {
    completeTask(taskId)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600'
      case 'medium': return 'bg-saffron-100 text-saffron-600'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('tasksTitle', language)}</h1>
        <p className="text-slate-500 mt-1">Track and complete your pending tasks</p>
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
            {t(opt.labelKey, language)}
            {opt.key === 'pending' && (
              <span className="ml-2 bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">
                {tasks.filter(t => !t.completed).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-500">No tasks to show</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="card overflow-hidden">
              {/* Task Header */}
              <button
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                className="w-full flex items-center gap-4 p-2 -m-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                ) : task.priority === 'high' ? (
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                ) : task.category === 'appointment' ? (
                  <Calendar className="w-6 h-6 text-saffron-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
                )}
                
                <div className="flex-1 text-left min-w-0">
                  <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{task.serviceName}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedTask === task.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Task Details */}
              {expandedTask === task.id && (
                <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">
                  <p className="text-sm text-slate-600">{task.description}</p>

                  {task.deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">{t('deadline', language)}:</span>
                      <span className={`font-medium ${task.priority === 'high' ? 'text-red-600' : 'text-slate-700'}`}>
                        {new Date(task.deadline).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {task.appointment && (
                    <div className="bg-civic-50 rounded-xl p-4 border border-civic-100">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-civic-600" />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{task.appointment.type}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(task.appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {task.appointment.time}
                          </p>
                          <p className="text-xs text-civic-600">{task.appointment.location}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {task.steps && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">Steps:</p>
                      <div className="space-y-2">
                        {task.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {step.done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                            <span className={`text-sm ${step.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!task.completed && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="btn-primary w-full"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as complete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
