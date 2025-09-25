import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Practice from './pages/Practice'
import InsertWords from './pages/InsertWords'
import Nav from './components/Nav'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/insert" element={<InsertWords />} />
        <Route path="/practice" element={<Practice />} />

      </Routes>
    </>
  )
}

export default App
