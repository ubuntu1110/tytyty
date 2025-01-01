// frontend/src/components/Sidebar.tsx

import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaTimes } from 'react-icons/fa';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
    const { role } = useContext(AuthContext);

    let homeLink = '/';
    if (role === 'admin') {
        homeLink = '/admin';
    } else if (role === 'moderator') {
        homeLink = '/moderator/new-chats';
    } else if (role === 'accountant') {
        homeLink = '/accountant';
    } else {
        homeLink = '/login';
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                className={`fixed left-0 top-0 h-full w-64 bg-black border-r border-yellow-500 z-50 flex flex-col transition-transform duration-300 transform
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
            >
                <div className="flex items-center justify-between p-4 border-b border-yellow-500">
                    <span className="text-yellow-500 text-lg font-bold">Меню</span>
                    <button className="text-white lg:hidden" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-4">
                    <Link to={homeLink} className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                        <FaHome />
                        <span>Главная</span>
                    </Link>

                    {role === 'admin' && (
                        <>
                            <Link to="/admin/users" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <FaUser />
                                <span>Пользователи</span>
                            </Link>
                            <Link to="/admin/chats" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Чаты и Аналитика</span>
                            </Link>
                            <Link to="/admin/expenses" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Общие Расходы</span>
                            </Link>
                            <Link to="/admin/proxies" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Прокси</span>
                            </Link>
                        </>
                    )}

                    {role === 'moderator' && (
                        <>
                            <Link to="/moderator/new-chats" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Новые чаты</span>
                            </Link>
                            <Link to="/moderator/chats" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Чаты</span>
                            </Link>
                        </>
                    )}

                    {role === 'accountant' && (
                        <>
                            <Link to="/accountant/chats" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Чаты по городу</span>
                            </Link>
                            <Link to="/accountant/expenses" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Расходы</span>
                            </Link>
                            <Link to="/accountant/proxies" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Мои Прокси</span>
                            </Link>
                            {/* Добавляем ссылку на калькулятор */}
                            <Link to="/accountant/calculator" className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                                <span>Калькулятор</span>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
