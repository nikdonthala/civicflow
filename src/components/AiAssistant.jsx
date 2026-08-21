import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { t } from '../data/translations'
import { groqChatStream, getAssistantApiKey } from '../utils/groqApi'
import { X, Send, Bot, AlertCircle, Settings, Sparkles, Trash2 } from 'lucide-react'

const SYSTEM_PROMPT = `You are the CivicFlow AI Assistant — a general-purpose helper inside a public-services prototype for Indian citizens.

You can help with:
- Explaining government services and processes in simple language
- Understanding what documents are needed
- Guiding users through forms and applications
- Answering questions about Indian government schemes
- Clarifying terminology (e.g. "self-attested", "domicile", "income certificate")

Rules:
- Be concise and clear. Use plain language.
- Never fabricate real government rules or data. This is a mock/prototype with synthetic data.
- Use bullet points for lists.
- If unsure, say so honestly.
- Be warm and supportive.`

export default function AiAssistant({ onClose }) {
  const { language } = useApp()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm the CivicFlow AI Assistant.\n\nI can help you with:\n• Understanding government services\n• What documents you need\n• Navigating applications\n• Explaining terms and processes\n\nHow can I help you today?`,
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
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const apiKey = getAssistantApiKey()
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

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...newMessages.slice(-12),
    ]

    try {
      let accumulated = ''
      await groqChatStream(apiKey, apiMessages, (chunk) => {
        accumulated += chunk
        setStreamingText(accumulated)
      })
      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
      setStreamingText('')
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I'm sorry, I couldn't connect to the AI service. Please check your Groq API key in Settings.\n\nError: ${err.message}`,
        },
      ])
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

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared. How can I help you?`,
      },
    ])
    setStreamingText('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Chat Window */}
      <div className="relative w-full max-w-lg h-[80vh] sm:h-[600px] bg-white rounded-2xl shadow-elevated border border-slate-200 flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-saffron-500 to-saffron-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <p className="text-saffron-100 text-xs">Powered by Groq · {streamingText ? 'typing...' : 'ready'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-saffron-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-saffron-500 text-white rounded-br-md'
                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {/* Streaming */}
          {streamingText && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-saffron-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
              </div>
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap animate-fade-in">
                {streamingText}
                <span className="inline-block w-1.5 h-4 bg-saffron-500 ml-0.5 animate-pulse rounded-sm" />
              </div>
            </div>
          )}
          {isTyping && !streamingText && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-saffron-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
              </div>
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
              <p className="text-xs text-saffron-600">
                Add your Groq API key in Settings to enable the AI Assistant.
              </p>
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
              placeholder="Ask me anything about government services..."
              className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 max-h-20"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-saffron-500 text-white rounded-xl hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
