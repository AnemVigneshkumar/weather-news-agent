import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendMessage } from './api'
import './App.css'

const SKIES = ['dawn', 'day', 'dusk', 'night']

const SUGGESTIONS = [
  'What is the weather in Hyderabad?',
  'Latest news about AI',
  'Do I need an umbrella in Mumbai today?',
  'Weather and news for Delhi',
]

function skyForHour(hour) {
  if (hour >= 5 && hour < 8) return 'dawn'
  if (hour >= 8 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'dusk'
  return 'night'
}

function greetingForHour(hour) {
  if (hour >= 5 && hour < 12) return 'Good morning.'
  if (hour >= 12 && hour < 17) return 'Good afternoon.'
  if (hour >= 17 && hour < 21) return 'Good evening.'
  return 'Still up?'
}

const newId = () => crypto.randomUUID()

function friendlyError(message) {
  if (message === 'Failed to fetch') {
    return 'Cannot reach the server. Check that the backend is running on port 8000.'
  }
  return message
}

function SkyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

const markdownComponents = {
  // eslint-disable-next-line no-unused-vars
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
}

export default function App() {
  const [hour] = useState(() => new Date().getHours())
  const [sky, setSky] = useState(() => skyForHour(hour))
  const [threadId, setThreadId] = useState(newId)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.sky = sky
  }, [sky])

    useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: reduce ? 'auto' : 'smooth',
      })
    })
    return () => cancelAnimationFrame(id)
  }, [messages, loading, error])

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  async function ask(text) {
    setError(null)
    setLoading(true)
    try {
      const reply = await sendMessage(text, threadId)
      setMessages((prev) => [...prev, { id: newId(), role: 'assistant', text: reply }])
    } catch (err) {
      setError({ text: friendlyError(err.message), retry: text })
    } finally {
      setLoading(false)
    }
  }

  function send(text) {
    const message = text.trim()
    if (!message || loading) return
    setMessages((prev) => [...prev, { id: newId(), role: 'user', text: message }])
    setInput('')
    ask(message)
  }

  function handleSubmit(event) {
    event.preventDefault()
    send(input)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      send(input)
    }
  }

  function cycleSky() {
    setSky(SKIES[(SKIES.indexOf(sky) + 1) % SKIES.length])
  }

  function newChat() {
    setMessages([])
    setError(null)
    setInput('')
    setThreadId(newId())
    inputRef.current?.focus()
  }

  const isEmpty = messages.length === 0

  return (
    <div className="app">
      <div className="orb" aria-hidden="true" />

      <header className="bar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          DayScope
        </div>
        <div className="bar-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={cycleSky}
            aria-label={`Time of day: ${sky}. Switch to the next one`}
            title={`Time of day: ${sky}`}
          >
            <SkyIcon />
          </button>
          <button type="button" className="ghost-btn" onClick={newChat} disabled={loading}>
            New chat
          </button>
        </div>
      </header>

      <main className="stage">
        {isEmpty ? (
          <section className="hero">
            <h1>{greetingForHour(hour)}</h1>
            <p>Ask about the weather or the news, anywhere in the world.</p>
            <div className="chips">
              {SUGGESTIONS.map((text) => (
                <button key={text} type="button" className="chip" onClick={() => send(text)}>
                  {text}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="thread">
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="msg user">
                  {m.text}
                </div>
              ) : (
                <div key={m.id} className="msg assistant">
                  <span className="dot-orb" aria-hidden="true" />
                  <div className="reply">
                    <ReactMarkdown components={markdownComponents}>{m.text}</ReactMarkdown>
                  </div>
                </div>
              ),
            )}

            {loading && (
              <div className="msg assistant" role="status">
                <span className="dot-orb pulse" aria-hidden="true" />
                <div className="thinking">
                  Looking that up
                  <span className="dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="error" role="alert">
                <span>{error.text}</span>
                <button type="button" onClick={() => ask(error.retry)} disabled={loading}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <form className="composer" onSubmit={handleSubmit}>
        <div className="field">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about weather or news"
            aria-label="Message"
          />
          <button
            type="submit"
            className="send"
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
        <p className="hint">Enter sends. Shift+Enter adds a line.</p>
      </form>
    </div>
  )
}