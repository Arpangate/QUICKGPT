import React, { useState} from 'react'
import Slidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import { useLocation } from 'react-router-dom'
import Login from './pages/Login'

const App = () => {

  const {user} = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation()

  if(pathname === '/loading') return <loading />

  return (
    <>

    {!isMenuOpen && 
      <img 
        src={assets.menu_icon} 
        className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' 
        onClick={() => setIsMenuOpen(true)} 
      />
    }

    {user ? (
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#393838] dark:text-white'>
        <div className='flex h-screen w-screen'>
          <Slidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
    ) : (
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#393838] dark:text-white h-screen w-screen flex items-center justify-center'>
        <Login />
      </div>
    )}

      
    </>
  )
}

export default App
