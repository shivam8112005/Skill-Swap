import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatRoom from './ChatRoom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ChatRoom roomId="general" username="shivam" />
    </>
  )
}

export default App
