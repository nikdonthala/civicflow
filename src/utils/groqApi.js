// Groq API utility — uses REST directly (no SDK needed)
// Model: openai/gpt-oss-120b via Groq

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'openai/gpt-oss-120b'
const PROVIDED_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

// localStorage keys
const API_KEY_STORAGE = 'civicflow_groq_api_key'
const ASSISTANT_API_KEY_STORAGE = 'civicflow_assistant_api_key'

// Initialize with provided key if nothing stored
if (typeof window !== 'undefined') {
  if (!localStorage.getItem(API_KEY_STORAGE) && PROVIDED_API_KEY) {
    localStorage.setItem(API_KEY_STORAGE, PROVIDED_API_KEY)
  }
  if (!localStorage.getItem(ASSISTANT_API_KEY_STORAGE) && PROVIDED_API_KEY) {
    localStorage.setItem(ASSISTANT_API_KEY_STORAGE, PROVIDED_API_KEY)
  }
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || ''
}

export function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key)
}

export function getAssistantApiKey() {
  return localStorage.getItem(ASSISTANT_API_KEY_STORAGE) || ''
}

export function setAssistantApiKey(key) {
  localStorage.setItem(ASSISTANT_API_KEY_STORAGE, key)
}

export function clearApiKeys() {
  localStorage.removeItem(API_KEY_STORAGE)
  localStorage.removeItem(ASSISTANT_API_KEY_STORAGE)
}

/**
 * Call Groq API for chat completions
 * @param {string} apiKey - Groq API key
 * @param {Array} messages - [{ role: 'system'|'user'|'assistant', content: string }]
 * @param {object} opts - optional overrides
 * @returns {Promise<string>} assistant reply text
 */
export async function groqChat(apiKey, messages, opts = {}) {
  if (!apiKey) throw new Error('No API key provided. Add your Groq API key in Settings.')

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model || DEFAULT_MODEL,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.max_tokens ?? 1024,
      stream: false,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Groq API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

/**
 * Stream Groq API for chat completions
 * @param {string} apiKey - Groq API key
 * @param {Array} messages
 * @param {function} onChunk - called with each text chunk
 * @param {object} opts
 */
export async function groqChatStream(apiKey, messages, onChunk, opts = {}) {
  if (!apiKey) throw new Error('No API key provided. Add your Groq API key in Settings.')

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model || DEFAULT_MODEL,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.max_tokens ?? 1024,
      stream: true,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Groq API error ${res.status}: ${body}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') return
      try {
        const parsed = JSON.parse(payload)
        const token = parsed.choices?.[0]?.delta?.content
        if (token) onChunk(token)
      } catch {
        // skip malformed lines
      }
    }
  }
}
