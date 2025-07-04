import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatRoom from './ChatRoom';
import { Routes, Route } from 'react-router-dom';
import ChatPage from './components/ChatPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ChatRoom roomId="general" username="shivam" />
     <Routes>
      <Route path="/chat/:roomId" element={<ChatPage />} />
    </Routes>
    </>
  )
}

export default App
