// src/components/Navbar.tsx
import React, { useContext } from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../auth/AuthContext';
import Tooltip from './ui/Tooltip';
import Input from './ui/Input';

// Импортируем ваш PNG-логотип
import logo from '../assets/logo.png';

interface NavbarProps {
    onMenuClick: () => void;
    showGlobalSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showGlobalSearch = true }) => {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="flex items-center justify-between px-4 py-3 bg-black border-b border-yellow-500">
            <div className="flex items-center space-x-4">
                <button
                    className="text-white lg:hidden"
                    onClick={onMenuClick}
                    aria-label="Open sidebar"
                >
                    <FaBars size={20} />
                </button>
                <div className="flex items-center space-x-2">
                    {/* Используем ваш PNG логотип */}
                    <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
                    <span className="text-xl font-bold text-yellow-500">
                        Sakura Admin Panel
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {showGlobalSearch && (
                    <div className="hidden md:block w-64">
                        <Input placeholder="Глобальный поиск..." />
                    </div>
                )}

                <Tooltip text="Выйти из аккаунта">
                    <button
                        className="text-white hover:text-pink-300 transition-colors flex items-center space-x-2"
                        onClick={handleLogout}
                        aria-label="Logout"
                    >
                        <FaSignOutAlt size={20} />
                        <span>Выход</span>
                    </button>
                </Tooltip>
            </div>
        </nav>
    );
};

export default Navbar;
