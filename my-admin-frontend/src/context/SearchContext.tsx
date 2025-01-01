// src/context/SearchContext.tsx
import React, { createContext, useState } from 'react';

interface SearchContextValue {
    query: string;
    setQuery: (q: string) => void;
}

export const SearchContext = createContext<SearchContextValue>({
    query: '',
    setQuery: () => {},
});

export const SearchProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
    const [query, setQuery] = useState('');
    return (
        <SearchContext.Provider value={{ query, setQuery }}>
            {children}
        </SearchContext.Provider>
    );
};
