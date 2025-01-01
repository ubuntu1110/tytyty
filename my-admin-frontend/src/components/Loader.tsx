import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white transition-opacity duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent border-l-transparent"></div>
        </div>
    );
};

export default Loader;
