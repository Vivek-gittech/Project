import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home'
import Menu from './pages/Menu'
import ManagerDashBoard from './pages/ManagerDashBoard'
import Navbar from './Nav.jsx'
import Register from './pages/Register'
import Login from './pages/Login'
import CustomerDashboard from './pages/CustomerDashabord.jsx'
import Chef from './pages/ChefOrderUpdate.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Navbar stays outside Routes so it is visible on all pages */}
        {/* <Navbar /> */}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Menu" element={<Menu />} />
            <Route path="/ManagerDashboard" element={<ManagerDashBoard />} />
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Register" element={<Register/>}/>
            <Route path="/CustomerDashboard" element={<CustomerDashboard/>}/>
          </Routes>
        </main>

        <footer className="bg-white py-6 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Café Nova — Built with ❤️
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}