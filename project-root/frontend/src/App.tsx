import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AccountantData from './pages/AccountantData'
import AccountantAnalytics from './pages/AccountantAnalytics'
import AdminPanel from './pages/AdminPanel'
import AdminUsers from './pages/AdminUsers'
import AdminData from './pages/AdminData'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSettings from './pages/AdminSettings'
import ModeratorPanel from './pages/ModeratorPanel'
import ModeratorChats from './pages/ModeratorChats'
import { getToken, isAdmin, getRole } from './services/auth'
import Footer from './components/Footer'

function App() {
    const token = getToken();
    const admin = isAdmin();
    const role = getRole();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!token && location.pathname !== '/') {
            navigate('/', { replace: true });
        }
    }, [token, location, navigate]);

    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                {role === 'accountant' && token && !admin && (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-data" element={<AccountantData />} />
                        <Route path="/my-analytics" element={<AccountantAnalytics />} />
                    </>
                )}
                {admin && token && (
                    <>
                        <Route path="/admin-panel" element={<AdminPanel />} />
                        <Route path="/admin-panel/users" element={<AdminUsers />} />
                        <Route path="/admin-panel/data" element={<AdminData />} />
                        <Route path="/admin-panel/analytics" element={<AdminAnalytics />} />
                        <Route path="/admin-panel/settings" element={<AdminSettings />} />
                    </>
                )}
                {role === 'moderator' && token && !admin && (
                    <>
                        <Route path="/moderator-panel" element={<ModeratorPanel />} />
                        <Route path="/moderator-chats" element={<ModeratorChats />} />
                    </>
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App
