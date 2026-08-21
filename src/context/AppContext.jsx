import { createContext, useContext, useState, useCallback } from 'react'
import { mockUser } from '../data/users'
import { mockApplications } from '../data/applications'
import { mockTasks } from '../data/tasks'
import { mockNotifications } from '../data/notifications'
import { mockBenefits } from '../data/benefits'


const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(mockUser)
  const [applications, setApplications] = useState(mockApplications)
  const [tasks, setTasks] = useState(mockTasks)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [language, setLanguage] = useState('en')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiGuideOpen, setAiGuideOpen] = useState(false)
  const [aiGuideContext, setAiGuideContext] = useState(null)
  const [benefits, setBenefits] = useState(mockBenefits)
  const [searchQuery, setSearchQuery] = useState('')

  const completeTask = useCallback((taskId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ))
  }, [])

  const updateApplication = useCallback((appId, stepId) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app
      const updatedSteps = app.steps.map((step, i) => {
        if (step.id === stepId) return { ...step, status: 'completed', completedDate: new Date().toISOString() }
        return step
      })
      const completedCount = updatedSteps.filter(s => s.status === 'completed').length
      const progress = Math.round((completedCount / updatedSteps.length) * 100)
      return { ...app, steps: updatedSteps, progress }
    }))
  }, [])

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ))
  }, [])

  const openAiGuide = useCallback((context) => {
    setAiGuideContext(context)
    setAiGuideOpen(true)
  }, [])

  const value = {
    user, setUser,
    applications, setApplications,
    tasks, setTasks,
    notifications, setNotifications,
    language, setLanguage,
    sidebarOpen, setSidebarOpen,
    aiGuideOpen, setAiGuideOpen,
    aiGuideContext, setAiGuideContext,
    benefits, setBenefits,
    searchQuery, setSearchQuery,
    completeTask,
    updateApplication,
    markNotificationRead,
    openAiGuide,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
