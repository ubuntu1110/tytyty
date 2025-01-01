// src/components/ui/Tooltip.tsx
import React from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip:React.FC<TooltipProps> = ({ text, children }) => {
    return (
        <span className="relative group">
      {children}
            <span className="invisible group-hover:visible absolute bottom-full mb-1 bg-gray-700 text-white text-xs p-1 rounded">
        {text}
      </span>
    </span>
    );
};

export default Tooltip;
