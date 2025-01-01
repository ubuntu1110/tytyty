// frontend/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary'; // Обработчик ошибок

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </AuthProvider>
        </Router>
    </React.StrictMode>,
);
