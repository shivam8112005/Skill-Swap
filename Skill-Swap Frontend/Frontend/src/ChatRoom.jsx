import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000"); 

function ChatRoom({ roomId, username }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join_room', roomId);
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    const data = {
      roomId,
      sender: username,
      content: message,
      time: new Date().toLocaleTimeString()
    };
    socket.emit('send_message', data);
    setMessage('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Chat Room: {roomId}</h2>
      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        height: '400px',
        overflowY: 'scroll',
        marginBottom: '10px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.content} <span style={{ fontSize: '0.8em', color: '#888' }}>{msg.time}</span>
          </div>
        ))}
      </div>
      <div>
        <input
          style={{ width: '80%', padding: '5px' }}
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
        />
        <button style={{ width: '18%', padding: '5px' }} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
