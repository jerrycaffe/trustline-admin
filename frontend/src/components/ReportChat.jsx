import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/ReportChat.css'

import { IoArrowBackOutline } from 'react-icons/io5'
import { IoMdSend } from 'react-icons/io'
import { BsCheck, BsCheckAll } from 'react-icons/bs'

const ReportChat = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const report = location.state?.report
  const returnTo = location.state?.from || '/reports/details'

  const recipientName =
    location.state?.recipient ||
    report?.reporterEmail ||
    report?.reportedEmail ||
    report?.email ||
    report?.reportedBy ||
    'Reported User'

  const adminTemplates =
    Array.isArray(location.state?.templates) && location.state.templates.length > 0
      ? location.state.templates
      : [
          'Hello, thank you for your report. Please share more context about the incident timeline.',
          'Could you confirm the exact location and approximate time of this incident?',
          'Please provide any additional evidence or attachments that support this case.',
          'Can you share names or descriptions of anyone involved or present at the scene?',
          'Has this happened before? If yes, please provide previous dates or references.',
          'For your safety, do you currently need urgent support or immediate intervention?',
        ]

  const [messageInput, setMessageInput] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(adminTemplates[0])
  const [messages, setMessages] = useState([])
  const [isUserTyping, setIsUserTyping] = useState(false)
  const threadBottomRef = useRef(null)

  useEffect(() => {
    threadBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isUserTyping])

  const caseLabel = report?.id || 'Not available'

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [messages])

  if (!report) {
    return <Navigate to="/reports" replace />
  }

  const formatTime = (value) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const sendMessage = (event) => {
    event.preventDefault()
    const trimmed = messageInput.trim()
    if (!trimmed) {
      return
    }

    const msgId = `m-${Date.now()}`
    const outgoing = {
      id: msgId,
      sender: 'admin',
      text: trimmed,
      createdAt: new Date().toISOString(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, outgoing])
    setMessageInput('')

    // Simulate delivered status after a short delay.
    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: 'delivered' } : m))
      )
    }, 600)

    // Simulate user typing indicator, then auto-reply.
    window.setTimeout(() => setIsUserTyping(true), 900)
    window.setTimeout(() => {
      setIsUserTyping(false)
      const autoReply = {
        id: `m-${Date.now()}-reply`,
        sender: 'user',
        text: 'Thank you. I have received your message and will provide the requested information shortly.',
        createdAt: new Date().toISOString(),
        status: null,
      }
      setMessages((prev) => [...prev, autoReply])
    }, 2800)
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setMessageInput(template)
  }

  return (
    <div className="report-chat-container">
      <Searchbar />
      <Sidebar />

      <main className="report-chat-page">
        <header className="report-chat-header">
          <button type="button" className="report-chat-back" onClick={() => navigate(returnTo, { state: { report } })}>
            <IoArrowBackOutline size={20} />
          </button>

          <div className="report-chat-title-wrap">
            <h1>Chat With Reported User</h1>
            <p>Case No: {caseLabel} • {recipientName}</p>
          </div>
        </header>

        <section className="report-chat-panel">
          <div className="report-chat-templates">
            <p>Message templates from admin dashboard</p>
            <div className="report-chat-template-list">
              {adminTemplates.map((template, index) => (
                <button
                  key={`${template}-${index}`}
                  type="button"
                  className={`report-chat-template-btn ${selectedTemplate === template ? 'is-selected' : ''}`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <div className="report-chat-thread">
            {sortedMessages.length === 0 && (
              <div className="report-chat-empty">
                <p>Select a template or write a custom message to start the conversation.</p>
              </div>
            )}
            {sortedMessages.map((message) => (
              <article
                key={message.id}
                className={`report-chat-bubble ${message.sender === 'admin' ? 'is-admin' : 'is-user'}`}
              >
                <p>{message.text}</p>
                <span className="report-chat-meta">
                  {formatTime(message.createdAt)}
                  {message.sender === 'admin' && (
                    <span className={`report-chat-status ${message.status === 'delivered' ? 'is-delivered' : 'is-sent'}`} aria-label={message.status}>
                      {message.status === 'delivered' ? <BsCheckAll size={14} /> : <BsCheck size={14} />}
                    </span>
                  )}
                </span>
              </article>
            ))}
            {isUserTyping && (
              <div className="report-chat-typing" aria-live="polite">
                <span></span><span></span><span></span>
                <p>{recipientName} is typing…</p>
              </div>
            )}
            <div ref={threadBottomRef} />
          </div>

          <form className="report-chat-input-row" onSubmit={sendMessage}>
            <textarea
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              placeholder="Ask for more information or send a follow-up message..."
              aria-label="Type a message"
              rows={3}
            />
            <button type="submit" aria-label="Send message">
              <IoMdSend size={18} />
              <span>Send</span>
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default ReportChat
