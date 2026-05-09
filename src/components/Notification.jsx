import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Notification.css';
import Sidebar from './Sidebar';
import Searchbar from './Searchbar';

import messageplaceholder from '../assets/messageplaceholder.png';

const CHAT_THREADS = [
  {
    id: 1,
    user: 'Aina Modupe',
    lastMessage: 'Please be informed that your report has been submitted to the VC’s office. Your case has taken another step towards resolution, congratulations!',
    lastMessageAt: '2026-05-09T12:08:00',
    unread: true,
    avatar: messageplaceholder,
  },
  {
    id: 2,
    user: 'Jane Doe',
    lastMessage: 'You have successfully completed your sleep exercise. We hope you had a good night’s rest',
    lastMessageAt: '2026-05-09T12:08:00',
    unread: true,
    avatar: messageplaceholder,
  },
  {
    id: 3,
    user: 'Wade Warren',
    lastMessage: 'Please be informed that your report has been submitted to the VC’s office. Your case has taken another step towards resolution, congratulations!',
    lastMessageAt: '2026-05-09T11:48:00',
    unread: false,
    avatar: messageplaceholder,
  },
  {
    id: 4,
    user: 'Jenny Wilson',
    lastMessage: 'Please be informed that your report has been submitted to the VC’s office. Your case has taken another step towards resolution, congratulations!',
    lastMessageAt: '2026-05-08T22:35:00',
    unread: false,
    avatar: messageplaceholder,
  },
];

const Notification = () => {
  const navigate = useNavigate();

  const recentChats = useMemo(() => {
    return [...CHAT_THREADS].sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  }, []);

  const formatTime = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  };

  return (
    <div className='notification-container'>
      <Searchbar />
      <Sidebar />
      <div className='notifi-cation'>
        <div className='notification'>
          <div className='notification-header'>
            <p>Chats</p>
          </div>

          <div className='chat-list'>
            {recentChats.map((chat) => (
              <article
                key={chat.id}
                className='chat-item'
                onClick={() => navigate(`/chats/${chat.id}`, { state: { chat } })}
                role='button'
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/chats/${chat.id}`, { state: { chat } });
                  }
                }}
              >
                <div className='chat-avatar-wrap'>
                  <img src={chat.avatar} alt='' />
                  {chat.unread && <span className='chat-unread-dot' aria-label='Unread chat' />}
                </div>

                <div className='chat-content'>
                  <p className='chat-title-row'>
                    <span>{chat.user}</span>
                    <span>{formatTime(chat.lastMessageAt)}</span>
                  </p>
                  <p className='chat-preview'>{chat.lastMessage}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
