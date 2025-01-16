import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Explore from './pages/Explore'
import NewUser from './pages/NewUser'
import LoginPage from './pages/Login'

function App() {
  return (
    <div className='viewport'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/new_user" element={<NewUser />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
