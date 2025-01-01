// src/utils/notify.ts
import { toast } from 'react-toastify';

// Общие настройки для всех уведомлений
const defaultOptions = {
    position: "bottom-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark' as const,
};

export const notifySuccess = (message: string) => {
    toast.success(message, defaultOptions);
};

export const notifyError = (message: string) => {
    toast.error(message, defaultOptions);
};

export const notifyInfo = (message: string) => {
    toast.info(message, defaultOptions);
};

export const notifyWarning = (message: string) => {
    toast.warn(message, defaultOptions);
};
