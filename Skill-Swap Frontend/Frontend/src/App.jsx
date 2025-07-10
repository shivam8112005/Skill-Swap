import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Pages/Home'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import Auth from './Pages/Auth'
// import ChatRoom from './components/ChatRoom';
// import { Routes, Route } from 'react-router-dom';
// import ChatPage from './components/ChatPage';

function App() {
  const [count, setCount] = useState(0)
 const [user, setUser] = useState(null); 
  return (
    <>
     <BrowserRouter>
      {/* <Routes>
        <Route 
          path="/"
          element={
            user ? <Navigate to="/home" /> : <Auth onAuth={setUser} />
          }
        />
        <Route 
          path="/home"
          element={
            user ? <Home user={user} /> : <Navigate to="/" />
          }
        />
      </Routes> */}
    </BrowserRouter>
    <Home/>
    </>
  )
}

export default App

