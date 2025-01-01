// frontend/src/auth/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextValue {
    token: string | null;
    setToken: (token: string | null) => void;
    isAuthenticated: boolean;
    role: string | null;
    setRole: (role: string | null) => void;
    loading: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    token: null,
    setToken: () => {},
    isAuthenticated: false,
    role: null,
    setRole: () => {},
    loading: true,
    logout: () => {}
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setTokenState] = useState<string | null>(null);
    const [role, setRoleState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        const storedRole = localStorage.getItem('role');
        if (storedToken) {
            setTokenState(storedToken);
        }
        if (storedRole) {
            setRoleState(storedRole);
        }
        setLoading(false);
    }, []);

    const setToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem('access_token', newToken);
        } else {
            localStorage.removeItem('access_token');
        }
        setTokenState(newToken);
    };

    const setRole = (newRole: string | null) => {
        if (newRole) {
            localStorage.setItem('role', newRole);
        } else {
            localStorage.removeItem('role');
        }
        setRoleState(newRole);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        navigate('/login');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, setToken, isAuthenticated, role, setRole, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
