import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFoundPage: React.FC = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl mb-4 text-yellow-500">404 - Страница не найдена</h1>
                <Link to="/" className="text-yellow-500 hover:underline">Вернуться на главную</Link>
            </div>
        </Layout>
    );
};

export default NotFoundPage;
