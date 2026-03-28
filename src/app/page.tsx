'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './page.module.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  "How big is the observable universe?",
  "What happens inside a black hole?",
  "Is there life on other planets?",
  "How do stars die?",
  "What is dark matter?",
  "Tell me about the James Webb Telescope",
]

function StarField() {
  const [stars, setStars] = useState<Array<{
    left: number
    top: number
    width: number
    height: number
    delay: number
    duration: number
    opacity: number
  }> | null>(null)

  useEffect(() => {
    setStars(
      Array.from({ length: 120 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        width: Math.random() * 2 + 0.5,
        height: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.7 + 0.2,
      }))
    )
  }, [])

  if (!stars) return <div className={styles.starfield} aria-hidden="true" />

  return (
    <div className={styles.starfield} aria-hidden="true">
      {stars.map((star, i) => (
        <div
          key={i}
          className={styles.star}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width}px`,
            height: `${star.height}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  )
}

function TypingDots() {
  return (
    <div className={styles.typingDots}>
      <span /><span /><span />
    </div>
  )
}

function renderMarkdown(text: string) {
  // Simple markdown renderer
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
  return `<p>${html}</p>`
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setError('')
    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reach ORION. Check your connection.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [messages, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <main className={styles.main}>
      <StarField />

      {/* Nebula blobs */}
      <div className={styles.nebula1} aria-hidden="true" />
      <div className={styles.nebula2} aria-hidden="true" />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoOrb}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
              <ellipse cx="12" cy="12" rx="11" ry="5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6"/>
              <ellipse cx="12" cy="12" rx="11" ry="5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="11" ry="5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" transform="rotate(120 12 12)"/>
            </svg>
          </div>
          <span className={styles.logoText}>ORION</span>
        </div>
        <div className={styles.headerTag}>Space Intelligence</div>
      </header>

      {/* Chat area */}
      <div className={styles.chatArea}>
        {isEmpty ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyOrb}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="12" fill="rgba(79,163,232,0.3)" />
                <circle cx="32" cy="32" r="8" fill="rgba(79,163,232,0.6)" />
                <circle cx="32" cy="32" r="4" fill="#4fa3e8" />
                <ellipse cx="32" cy="32" rx="28" ry="12" stroke="#4fa3e8" strokeWidth="1.5" fill="none" opacity="0.5"/>
                <ellipse cx="32" cy="32" rx="28" ry="12" stroke="#4fa3e8" strokeWidth="1.5" fill="none" opacity="0.3" transform="rotate(60 32 32)"/>
                <ellipse cx="32" cy="32" rx="28" ry="12" stroke="#4fa3e8" strokeWidth="1.5" fill="none" opacity="0.3" transform="rotate(120 32 32)"/>
              </svg>
            </div>
            <h1 className={styles.emptyTitle}>Ask Me About the Cosmos</h1>
            <p className={styles.emptySubtitle}>
              From black holes to the Big Bang — I&apos;m your guide to everything beyond Earth.
            </p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className={styles.suggestion}
                  onClick={() => sendMessage(s)}
                >
                  <span className={styles.suggestionIcon}>✦</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.botRow}`}>
                {msg.role === 'assistant' && (
                  <div className={styles.botAvatar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="4" fill="currentColor"/>
                      <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7"/>
                    </svg>
                  </div>
                )}
                <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                  {msg.role === 'assistant' ? (
                    <div
                      className="msg-content"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`${styles.messageRow} ${styles.botRow}`}>
                <div className={styles.botAvatar}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4" fill="currentColor"/>
                    <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7"/>
                  </svg>
                </div>
                <div className={`${styles.bubble} ${styles.botBubble}`}>
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorBar}>
                <span>⚠ {error}</span>
                <button onClick={() => setError('')}>✕</button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        {!isEmpty && (
          <div className={styles.suggestionsRow}>
            {SUGGESTIONS.slice(0, 3).map((s, i) => (
              <button key={i} className={styles.chipSuggestion} onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div className={styles.inputBox}>
          <textarea
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about black holes, exoplanets, dark matter..."
            rows={1}
            disabled={loading}
          />
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className={styles.hint}>Shift+Enter for new line · Enter to send</p>
      </div>
    </main>
  )
}
