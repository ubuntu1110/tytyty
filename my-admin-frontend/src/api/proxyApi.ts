// frontend/src/api/proxyApi.ts
import axiosInstance from './axiosInstance';

interface Proxy {
    id: number;
    ip_address: string;
    port: number;
    username?: string;
    password?: string;
    assigned_to?: number | null;
    created_at: string;
}

interface ProxyCreate {
    ip_address: string;
    port: number;
    username?: string;
    password?: string;
}

interface ProxyUpdate {
    ip_address?: string;
    port?: number;
    username?: string;
    password?: string;
}

// Общая функция для проверки токена
function ensureToken(token?: string) {
    if (!token) {
        throw new Error("Токен не указан. Авторизация невозможна.");
    }
}

// Обертка для запросов с обработкой ошибок
async function safeRequest<T>(request: Promise<{data: T}>): Promise<T> {
    try {
        const res = await request;
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.detail) {
            throw new Error(`Ошибка запроса: ${error.response.data.detail}`);
        } else {
            throw new Error("Не удалось выполнить запрос. Проверьте подключение к серверу.");
        }
    }
}

// Получить все прокси (админ)
export async function fetchAllProxies(token?: string): Promise<Proxy[]> {
    ensureToken(token);
    return safeRequest(
        axiosInstance.get('/proxies/admin', {
            headers: { Authorization: `Bearer ${token}` }
        })
    );
}

// Создать прокси (админ)
export async function createProxy(data: ProxyCreate, token?: string): Promise<Proxy> {
    ensureToken(token);
    return safeRequest(
        axiosInstance.post('/proxies/admin', data, {
            headers: { Authorization: `Bearer ${token}` }
        })
    );
}

// Назначить прокси бухгалтеру (админ)
export async function assignProxy(proxyId: number, accountantId: number, token?: string): Promise<Proxy> {
    ensureToken(token);
    return safeRequest(
        axiosInstance.put(`/proxies/admin/assign/${proxyId}?accountant_id=${accountantId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        })
    );
}

// Обновить прокси (админ)
export async function updateProxy(proxyId: number, data: ProxyUpdate, token?: string): Promise<Proxy> {
    ensureToken(token);
    return safeRequest(
        axiosInstance.put(`/proxies/admin/${proxyId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
    );
}

// Получить прокси бухгалтера
export async function fetchAccountantProxies(token?: string): Promise<Proxy[]> {
    ensureToken(token);
    return safeRequest(
        axiosInstance.get('/proxies/accountant', {
            headers: { Authorization: `Bearer ${token}` }
        })
    );
}
