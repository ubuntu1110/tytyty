// src/components/ui/Breadcrumbs.tsx
import React from 'react';

interface Crumb {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    crumbs: Crumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
    return (
        <nav className="text-sm mb-4">
            {crumbs.map((crumb, index) => (
                <span key={index}>
          {index > 0 && <span className="mx-1 text-yellow-500">/</span>}
                    {crumb.href
                        ? <a href={crumb.href} className="text-yellow-500 hover:underline">{crumb.label}</a>
                        : <span className="text-gray-300">{crumb.label}</span>
                    }
        </span>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
