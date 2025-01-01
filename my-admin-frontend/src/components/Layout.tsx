// src/components/Layout.tsx
import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Breadcrumbs from './ui/Breadcrumbs';  // Предполагается, что есть компонент Breadcrumbs
import { SearchContext } from '../context/SearchContext';  // Предполагается наличие контекста для глобального поиска
import Input from './ui/Input';

interface Crumb {
    label: string;
    href?: string;
}

interface LayoutProps {
    children: React.ReactNode;
    crumbs?: Crumb[];
}

const Layout: React.FC<LayoutProps> = ({ children, crumbs }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { query, setQuery } = useContext(SearchContext);

    return (
        <div className="bg-black min-h-screen flex flex-col text-white">
            {/* Navbar */}
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)}>
                {/* Внутри Navbar можно поместить глобальный поиск */}
                <div className="hidden md:block ml-4">
                    <Input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Глобальный поиск..."
                    />
                </div>
            </Navbar>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 p-4 overflow-auto">
                    {/* Хлебные крошки (если переданы) */}
                    {crumbs && crumbs.length > 0 && (
                        <Breadcrumbs crumbs={crumbs} />
                    )}
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
