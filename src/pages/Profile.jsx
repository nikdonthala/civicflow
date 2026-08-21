import { useApp } from '../context/AppContext'
import { t, languageNames } from '../data/translations'
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Shield, Globe, LogOut, Edit2, CheckCircle2, FileText, Info
} from 'lucide-react'

export default function Profile() {
  const { user, language, setLanguage } = useApp()

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('profile', language)}</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-civic-400 to-civic-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Phone className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="text-sm text-slate-700">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <MapPin className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p className="text-sm text-slate-700">{user.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Briefcase className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Occupation</p>
              <p className="text-sm text-slate-700">{user.occupation}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <GraduationCap className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Education</p>
              <p className="text-sm text-slate-700">{user.education}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card mb-6">
        <h2 className="section-title">{t('personalInfo', language)}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Name</p>
                <p className="text-xs text-slate-500">{user.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Email</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Annual Income</p>
                <p className="text-xs text-slate-500">{user.profile.annualIncome}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="card mb-6">
        <h2 className="section-title">{t('linkedAccounts', language)}</h2>
        <p className="text-sm text-slate-500 mb-4">Mock accounts for demonstration purposes</p>
        <div className="space-y-2">
          {user.linkedAccounts.map(account => (
            <div key={account.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{account.label}</p>
                <p className="text-xs text-slate-500 font-mono">{account.id}</p>
              </div>
              {account.verified && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Language Settings */}
      <div className="card mb-6">
        <h2 className="section-title flex items-center gap-2">
          <Globe className="w-5 h-5 text-civic-500" />
          {t('language', language)}
        </h2>
        <div className="space-y-2">
          {[{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'te', label: 'తెలుగు' }].map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                language === lang.code
                  ? 'bg-civic-50 border border-civic-200'
                  : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                language === lang.code ? 'border-civic-500' : 'border-slate-300'
              }`}>
                {language === lang.code && (
                  <div className="w-2.5 h-2.5 bg-civic-500 rounded-full" />
                )}
              </div>
              <span className={`text-sm font-medium ${language === lang.code ? 'text-civic-700' : 'text-slate-700'}`}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* About / Disclaimer */}
      <div className="card mb-6 bg-slate-50 border-slate-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-slate-700 mb-2">About this prototype</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• All data is synthetic and fictional</li>
              <li>• Government integrations are mocked/simulated</li>
              <li>• No real citizen information is used</li>
              <li>• AI assistance is demonstrative</li>
              <li>• Designed as a prototype for improving public-service UX</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <button className="w-full btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700 justify-center py-3">
        <LogOut className="w-5 h-5 mr-2" />
        {t('signOut', language)}
      </button>
    </div>
  )
}
