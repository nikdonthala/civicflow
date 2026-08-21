import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import { getAiGuideResponse } from '../data/aiGuide'
import { groqChatStream, getApiKey } from '../utils/groqApi'
import { X, Send, Sparkles, Settings, AlertCircle } from 'lucide-react'

const SYSTEM_PROMPT = `You are CivicGuide, a helpful assistant inside CivicFlow — a unified citizen-facing public-service prototype for Indian government services. 

Key rules:
- Give concise, plain-language answers (2-4 sentences max).
- Never fabricate real government rules. This is a mock/prototype.
- If the user asks about a specific page or task, use the page context provided.
- When explaining jargon, use simple examples.
- You can mention that data is synthetic/mock when relevant.
- Be warm and supportive — citizens often find government services confusing.`

export default function AiGuide() {
  const { language, aiGuideOpen, setAiGuideOpen, aiGuideContext } = useApp()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm CivicGuide. I can help you understand services, explain terms, and guide you through your tasks. What would you like to know?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  useEffect(() => {
    if (aiGuideOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [aiGuideOpen])

  // Reset messages when opening fresh
  useEffect(() => {
    if (aiGuideOpen && messages.length <= 1) {
      // fresh open
    }
  }, [aiGuideOpen])

  const buildContextPrompt = () => {
    if (!aiGuideContext) return ''
    let ctx = `Current page: ${aiGuideContext.page || 'unknown'}`
    if (aiGuideContext.highlightedText) {
      ctx += `\nThe user highlighted this text: "${aiGuideContext.highlightedText}"`
    }
    if (aiGuideContext.application) {
      const app = aiGuideContext.application
      ctx += `\nApplication: ${app.serviceName}, Progress: ${app.progress}%, Status: ${app.status}`
      ctx += `\nSteps: ${app.steps.map(s => `${s.title} (${s.status})`).join(', ')}`
    }
    if (aiGuideContext.service) {
      ctx += `\nService: ${aiGuideContext.service.name} — ${aiGuideContext.service.description}`
      ctx += `\nDocuments needed: ${aiGuideContext.service.documents?.join(', ')}`
    }
    return ctx
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const apiKey = getApiKey()
    if (!apiKey) {
      setApiKeyMissing(true)
      return
    }
    setApiKeyMissing(false)

    const userMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)
    setStreamingText('')

    const contextPrompt = buildContextPrompt()
    const systemMessage = {
      role: 'system',
      content: SYSTEM_PROMPT + (contextPrompt ? `\n\nContext:\n${contextPrompt}` : ''),
    }

    const apiMessages = [systemMessage, ...newMessages.slice(-10)]

    try {
      let accumulated = ''
      await groqChatStream(apiKey, apiMessages, (chunk) => {
        accumulated += chunk
        setStreamingText(accumulated)
      })
      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
      setStreamingText('')
    } catch (err) {
      // Fallback to local mock responses on error
      const fallback = getAiGuideResponse(input.trim(), aiGuideContext)
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }])
      setStreamingText('')
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!aiGuideOpen) return null

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <div className="mb-3 w-[calc(100vw-2rem)] sm:w-96 h-[70vh] sm:h-[520px] bg-white rounded-2xl shadow-elevated border border-slate-200 flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-civic-500 to-civic-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{t('civicGuide', language)}</h3>
              <p className="text-civic-100 text-xs">Powered by Groq · {streamingText ? 'typing...' : 'online'}</p>
            </div>
          </div>
          <button
            onClick={() => setAiGuideOpen(false)}
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-civic-600 text-white rounded-br-md'
                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {/* Streaming indicator */}
          {streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap animate-fade-in">
                {streamingText}
                <span className="inline-block w-1.5 h-4 bg-civic-500 ml-0.5 animate-pulse rounded-sm" />
              </div>
            </div>
          )}
          {isTyping && !streamingText && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* API Key Warning */}
        {apiKeyMissing && (
          <div className="mx-4 mb-2 p-3 bg-saffron-50 border border-saffron-200 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-saffron-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-saffron-800">API key required</p>
              <p className="text-xs text-saffron-600">Add your Groq API key in Settings to enable AI responses.</p>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-100 p-4 flex-shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('guidePlaceholder', language)}
              className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-500 focus:border-civic-500 max-h-20"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-civic-600 text-white rounded-xl hover:bg-civic-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
