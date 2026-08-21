import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import {
  Home, FileText, CheckSquare, ClipboardList, Gift,
  Inbox, Search, User, Menu, X, MessageCircle,
  Globe, Shield, Key, Bot
} from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, labelKey: 'home' },
  { path: '/services', icon: FileText, labelKey: 'services' },
  { path: '/tasks', icon: CheckSquare, labelKey: 'tasks' },
  { path: '/applications', icon: ClipboardList, labelKey: 'applications' },
  { path: '/benefits', icon: Gift, labelKey: 'benefits' },
  { path: '/inbox', icon: Inbox, labelKey: 'inbox' },
  { path: '/search', icon: Search, labelKey: 'search' },
  { path: '/profile', icon: User, labelKey: 'profile' },
]

export default function Layout({ children, onOpenAssistant, onOpenSettings }) {
  const { language, setLanguage, sidebarOpen, setSidebarOpen, notifications, openAiGuide } = useApp()
  const location = useLocation()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-civic-500 to-civic-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">CivicFlow</h1>
              <p className="text-xs text-slate-500">{t('tagline', language)}</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, labelKey }) => {
            const isActive = location.pathname === path || 
              (path !== '/' && location.pathname.startsWith(path))
            return (
              <Link
                key={path}
                to={path}
                className={isActive ? 'nav-link-active' : 'nav-link'}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{t(labelKey, language)}</span>
                {labelKey === 'inbox' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={onOpenAssistant}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-saffron-50 to-saffron-100 rounded-xl text-sm font-medium text-saffron-700 hover:from-saffron-100 hover:to-saffron-200 transition-all"
          >
            <Bot className="w-5 h-5" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => openAiGuide({ page: location.pathname })}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-civic-50 to-civic-100 rounded-xl text-sm font-medium text-civic-700 hover:from-civic-100 hover:to-civic-200 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t('askGuide', language)}</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
          >
            <Key className="w-4 h-4" />
            <span>API Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-in-right">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                <div className="w-10 h-10 bg-gradient-to-br from-civic-500 to-civic-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900">CivicFlow</h1>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(({ path, icon: Icon, labelKey }) => {
                const isActive = location.pathname === path ||
                  (path !== '/' && location.pathname.startsWith(path))
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={isActive ? 'nav-link-active' : 'nav-link'}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{t(labelKey, language)}</span>
                    {labelKey === 'inbox' && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
            {/* Mobile Actions */}
            <div className="p-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => { setSidebarOpen(false); onOpenAssistant(); }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-saffron-50 to-saffron-100 rounded-xl text-sm font-medium text-saffron-700"
              >
                <Bot className="w-5 h-5" />
                <span>AI Assistant</span>
              </button>
              <button
                onClick={() => { setSidebarOpen(false); onOpenSettings(); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                <Key className="w-4 h-4" />
                <span>API Settings</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (Mobile) */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-civic-500 to-civic-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">CivicFlow</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenAssistant}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <Bot className="w-5 h-5 text-saffron-500" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <Key className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex bg-white border-b border-slate-100 px-8 py-4 items-center justify-between">
          <div />
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'తె'}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-40">
                {[{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'te', label: 'తెలుగు' }].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'text-civic-600 bg-civic-50' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              {t('subtitle', language)} · {t('disclaimer', language)}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <Link to="/profile" className="hover:text-slate-600">{t('about', language)}</Link>
              <span>·</span>
              <span>Data is synthetic · Integrations are mocked</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
