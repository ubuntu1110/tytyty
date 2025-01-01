import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black bg-opacity-80"
                onClick={onClose}
            ></div>

            <div className="relative bg-black border border-yellow-500 rounded p-6 z-60 max-w-md w-full">
                {title && <h2 className="text-yellow-500 text-xl font-bold mb-4">{title}</h2>}
                {children}
                <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={onClose}
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default Modal;
