import React, { useState } from 'react';
import '../css/Notification.css';
import Sidebar from './Sidebar';
import Searchbar from './Searchbar';

import messageplaceholder from '../assets/messageplaceholder.png';
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";

const Notification = () => {
  const messagesToday = [
    {
      id: 1,
      title: "Your report has reached the VC’s office!",
      text: "Please be informed that your report has been submitted to the VC’s office. Your case has taken another step towards resolution, congratulations!",
      read: false
    },
    {
      id: 2,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: false
    },
    {
      id: 3,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: true
    },
    {
      id: 4,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: true
    },
    {
      id: 5,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: true
    }
  ];

  const messagesYesterday = [
    {
      id: 6,
      title: "Your report has reached the VC’s office!",
      text: "Please be informed that your report has been submitted to the VC’s office. Your case has taken another step towards resolution, congratulations!",
      read: false
    },
    {
      id: 7,
      title: "Your report has reached the VC’s office!",
      text: "Please be informed that your report has been submitted to the VC’s office. Your case has taken another step towards resolution, congratulations!",
      read: false
    },
    {
      id: 8,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: true
    },
    {
      id: 9,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: true
    },
    {
      id: 10,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: true
    },
    {
      id: 11,
      title: "Exercise complete!",
      text: "You have successfully completed your sleep exercise. We hope you had a good night’s rest",
      read: true
    }
  ];

  const [todayMsgs, setTodayMsgs] = useState(messagesToday);
  const [yesterdayMsgs, setYesterdayMsgs] = useState(messagesYesterday);


  
  const handleMarkRead = (id, day) => {
    if (day === "today") {
      setTodayMsgs(prev =>
        prev.map(msg =>
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
    } else {
      setYesterdayMsgs(prev =>
        prev.map(msg =>
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
    }
  };

  return (
    <div className='notification-container'>
      <Searchbar />
      <Sidebar />
      <div className='notifi-cation'>
        <div className='notification'>
          <div className='notification-header'>
            <p>Notifications</p>
            <div className='buttons'>
              <button><RiDeleteBin6Line size={22.5}/>Delete</button>
              <button><HiOutlineAdjustmentsVertical size={22.5}/>Filter</button>
            </div> 
          </div>

          {/* TODAY */}
          <div className='today'>
            <div className='header'>
              <p>Today</p>
              <button>Mark all as read</button>
            </div>
            {todayMsgs.map(msg => (
              <Message
                key={msg.id}
                title={msg.title}
                text={msg.text}
                read={msg.read}
                onClick={() => handleMarkRead(msg.id, "today")}
              />
            ))}
          </div>

          {/* YESTERDAY */}
          <div className='yesterday'>
            <div className='header'>
              <p>Yesterday</p>
            </div>
            {yesterdayMsgs.map(msg => (
              <Message
                key={msg.id}
                title={msg.title}
                text={msg.text}
                read={msg.read}
                onClick={() => handleMarkRead(msg.id, "yesterday")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function Message({ title, text, read, onClick }) {
  return (
    <div
      className='message'
      onClick={onClick}
      style={{
        cursor: "pointer",
        backgroundColor: read ? "#f0f0f0" : "white",
        color: read ? "#828282" : "black"
      }}
    >
      <div className="message-image-wrapper" style={{ position: "relative" }}>
        <img src={messageplaceholder} alt="" />
        {!read && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "blue",
              borderRadius: "50%"
            }}
          ></span>
        )}
      </div>
      <div className='message-content'>
        <p>{title} <span>12:09pm</span></p>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Notification;
