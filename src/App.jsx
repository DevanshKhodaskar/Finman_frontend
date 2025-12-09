import {Link, Route, Routes} from 'react-router-dom';
import { useState } from 'react'
import Signup from './component/Signup.jsx';
import Login from './component/Login.jsx';
import Dashboard from './component/Dashboard.jsx';
import Landing from './component/Landing.jsx';
import AIFeatures from './component/AIFeatures.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<h1 className="text-3xl text-red-500 font-bold underline">About Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ai-features" element={<AIFeatures />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        

        

      </Routes>
    </>
  )
}

export default App
