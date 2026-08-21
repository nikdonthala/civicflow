import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { Sparkles } from 'lucide-react'

export default function HighlightAsk() {
  const { openAiGuide } = useApp()
  const [showButton, setShowButton] = useState(false)
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState('')

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    
    if (text && text.length > 2) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      
      setSelectedText(text)
      setButtonPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      })
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  const handleClick = () => {
    openAiGuide({ highlightedText: selectedText })
    setShowButton(false)
    window.getSelection()?.removeAllRanges()
  }

  if (!showButton) return null

  return (
    <button
      onClick={handleClick}
      className="fixed z-50 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-civic-500 to-saffron-500 text-white text-xs font-medium rounded-full shadow-lg hover:shadow-xl transition-all animate-fade-in"
      style={{
        left: `${buttonPos.x}px`,
        top: `${buttonPos.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Sparkles className="w-3 h-3" />
      Ask
    </button>
  )
}
