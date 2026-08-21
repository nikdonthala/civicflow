import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import {
  getApiKey, setApiKey, getAssistantApiKey, setAssistantApiKey,
  groqChat, clearApiKeys
} from '../utils/groqApi'
import { X, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Trash2, Bot, Sparkles } from 'lucide-react'

export default function SettingsPanel({ onClose }) {
  const { language } = useApp()
  const [guideKey, setGuideKey] = useState('')
  const [assistantKey, setAssistantKey] = useState('')
  const [showGuideKey, setShowGuideKey] = useState(false)
  const [showAssistantKey, setShowAssistantKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    setGuideKey(getApiKey())
    setAssistantKey(getAssistantApiKey())
  }, [])

  const handleSave = () => {
    if (guideKey.trim()) setApiKey(guideKey.trim())
    if (assistantKey.trim()) setAssistantApiKey(assistantKey.trim())
    setTestResult({ success: true, message: 'API keys saved!' })
    setTimeout(() => setTestResult(null), 3000)
  }

  const handleTestConnection = async () => {
    const keyToTest = guideKey.trim() || assistantKey.trim()
    if (!keyToTest) {
      setTestResult({ success: false, message: 'Enter an API key first.' })
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      const reply = await groqChat(keyToTest, [
        { role: 'user', content: 'Say "Connection successful!" in exactly those words.' },
      ], { max_tokens: 20 })
      setTestResult({ success: true, message: `Connected! Response: "${reply.trim()}"` })
    } catch (err) {
      setTestResult({ success: false, message: `Failed: ${err.message}` })
    } finally {
      setTesting(false)
    }
  }

  const handleClear = () => {
    clearApiKeys()
    setGuideKey('')
    setAssistantKey('')
    setTestResult({ success: true, message: 'All API keys cleared.' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-elevated border border-slate-200 animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-civic-500 to-civic-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-white" />
            <h2 className="text-white font-semibold text-lg">API Settings</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-civic-50 border border-civic-100 rounded-xl p-4">
            <p className="text-sm text-civic-800">
              <strong>How it works:</strong> Enter your Groq API key to enable AI-powered responses. 
              You can use the same key for both features, or different keys for each.
            </p>
            <p className="text-xs text-civic-600 mt-2">
              Get a free API key at{' '}
              <a href="https://console.groq.com" target="_blank" rel="noopener" className="underline">
                console.groq.com
              </a>
            </p>
          </div>

          {/* CivicGuide API Key */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Sparkles className="w-4 h-4 text-civic-500" />
              CivicGuide (AI Guide) API Key
            </label>
            <p className="text-xs text-slate-500 mb-2">Used for the floating AI guide button</p>
            <div className="relative">
              <input
                type={showGuideKey ? 'text' : 'password'}
                value={guideKey}
                onChange={(e) => setGuideKey(e.target.value)}
                placeholder="gsk_..."
                className="input-field pr-10"
              />
              <button
                onClick={() => setShowGuideKey(!showGuideKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showGuideKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* AI Assistant API Key */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Bot className="w-4 h-4 text-saffron-500" />
              AI Assistant API Key
            </label>
            <p className="text-xs text-slate-500 mb-2">Used for the separate AI Assistant chat</p>
            <div className="relative">
              <input
                type={showAssistantKey ? 'text' : 'password'}
                value={assistantKey}
                onChange={(e) => setAssistantKey(e.target.value)}
                placeholder="gsk_..."
                className="input-field pr-10"
              />
              <button
                onClick={() => setShowAssistantKey(!showAssistantKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showAssistantKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-3 rounded-xl flex items-start gap-2 ${
              testResult.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <p className={`text-sm ${testResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                {testResult.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-primary flex-1">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="btn-secondary flex-1"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          <button
            onClick={handleClear}
            className="w-full text-sm text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear all API keys
          </button>
        </div>
      </div>
    </div>
  )
}
