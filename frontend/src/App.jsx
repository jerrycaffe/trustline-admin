import React from 'react'
import { Routes, Router, Route } from 'react-router-dom'
import Welcome from './components/Welcome'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Dashboard from './components/Dashboard'
import Reports from './components/Reports'
import Incidents from './components/Incidents'
import Users from './components/Users'
import Resources from './components/Resources'
import Analytics from './components/Analytics'
import Zen from './components/Zen'
import Support from './components/Support'
import Settings from './components/Settings'
import UserProfile from './components/UserProfile'
import Notification from './components/Notification'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path='/notification' element={<Notification />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/incidents' element={<Incidents />} />
        <Route path='/users' element={<Users />} />
        <Route path='/resources' element={<Resources />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/zen' element={<Zen />} />
        <Route path='/support' element={<Support />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </>
  )
}

export default App

