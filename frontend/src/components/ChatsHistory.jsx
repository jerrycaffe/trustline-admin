import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/ChatsHistory.css'
import { IoArrowBackOutline } from 'react-icons/io5'
import { IoMdSend } from 'react-icons/io'
import { BsCheck, BsCheckAll } from 'react-icons/bs'

const CHAT_HISTORY_BY_ID = {
  1: [
    { id: '1-a', sender: 'user', text: 'Hello admin, thank you for the update on my report.', time: '11:35 AM' },
    { id: '1-b', sender: 'admin', text: 'You are welcome. Your case has reached the VC office for review.', time: '11:50 AM', status: 'read' },
    { id: '1-c', sender: 'user', text: 'Thanks. Please let me know the next step.', time: '12:08 PM' },
  ],
  2: [
    { id: '2-a', sender: 'admin', text: 'You have successfully completed your sleep exercise.', time: '11:15 AM', status: 'delivered' },
    { id: '2-b', sender: 'user', text: 'Great, I feel better today.', time: '11:23 AM' },
    { id: '2-c', sender: 'admin', text: 'Keep maintaining your rest routine.', time: '12:08 PM', status: 'read' },
  ],
  3: [
    { id: '3-a', sender: 'user', text: 'Can I get an update on my report status?', time: '10:55 AM' },
    { id: '3-b', sender: 'admin', text: 'It has moved to the next review stage.', time: '11:05 AM', status: 'delivered' },
    { id: '3-c', sender: 'user', text: 'Thank you for confirming.', time: '11:48 AM' },
  ],
  4: [
    { id: '4-a', sender: 'user', text: 'I submitted additional details yesterday.', time: '9:40 PM' },
    { id: '4-b', sender: 'admin', text: 'Received. The review team has been notified.', time: '10:10 PM', status: 'read' },
    { id: '4-c', sender: 'user', text: 'Okay, I appreciate it.', time: '10:35 PM' },
  ],
}

const ChatsHistory = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { chatId } = useParams()

  const selectedChat = state?.chat

  const initialMessages = useMemo(() => CHAT_HISTORY_BY_ID[Number(chatId)] || [], [chatId])
  const [messages, setMessages] = useState(initialMessages)
  const [draftMessage, setDraftMessage] = useState('')
  const threadBottomRef = useRef(null)
  const statusTimersRef = useRef([])

  if (!selectedChat) {
    return <Navigate to='/chats' replace />
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleSendMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = draftMessage.trim()
    if (!trimmedMessage) return

    const now = new Date()
    const newMessage = {
      id: `${chatId}-${Date.now()}`,
      sender: 'admin',
      text: trimmedMessage,
      time: formatTime(now),
      status: 'sent',
    }

    setMessages((prev) => [...prev, newMessage])
    setDraftMessage('')

    const deliveredTimer = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg))
      )
    }, 700)

    const readTimer = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: 'read' } : msg))
      )
    }, 1800)

    statusTimersRef.current.push(deliveredTimer, readTimer)
  }

  useEffect(() => {
    threadBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  useEffect(() => {
    return () => {
      statusTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      statusTimersRef.current = []
    }
  }, [])

  const renderStatusTick = (status) => {
    if (status === 'read') {
      return (
        <span className='history-status is-read' aria-label='Read'>
          <BsCheckAll size={14} />
        </span>
      )
    }

    if (status === 'delivered') {
      return (
        <span className='history-status is-delivered' aria-label='Delivered'>
          <BsCheckAll size={14} />
        </span>
      )
    }

    if (status === 'sent') {
      return (
        <span className='history-status is-sent' aria-label='Sent'>
          <BsCheck size={14} />
        </span>
      )
    }

    return null
  }

  return (
    <div className='chat-history-container'>
      <Searchbar />
      <Sidebar />

      <div className='chat-history-page'>
        <div className='chat-history-header'>
          <button type='button' className='chat-history-back' onClick={() => navigate('/chats')}>
            <IoArrowBackOutline size={20} />
          </button>
          <div>
            <p>{selectedChat.user}</p>
            <span>Chat history</span>
          </div>
        </div>

        <section className='chat-history-thread'>
          {messages.map((message) => (
            <article
              key={message.id}
              className={message.sender === 'admin' ? 'history-bubble admin' : 'history-bubble user'}
            >
              <p>{message.text}</p>
              <span className='history-meta'>
                {message.time}
                {message.sender === 'admin' ? renderStatusTick(message.status) : null}
              </span>
            </article>
          ))}
          <div ref={threadBottomRef} />
        </section>

        <form className='chat-history-composer' onSubmit={handleSendMessage}>
          <textarea
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder='Communicate with this user'
            aria-label='Type a message'
            rows={3}
          />
          <button type='submit' aria-label='Send message' disabled={!draftMessage.trim()}>
            <IoMdSend size={18} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatsHistory
