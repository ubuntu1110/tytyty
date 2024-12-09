export function getToken() {
    return localStorage.getItem('token');
}

export function setToken(token: string) {
    localStorage.setItem('token', token);
}

export function clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('role');
}

export function setIsAdmin(isAdmin: boolean) {
    localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');
}

export function isAdmin() {
    return localStorage.getItem('is_admin') === 'true';
}

export function setRole(role: string) {
    localStorage.setItem('role', role);
}

export function getRole(): string | null {
    return localStorage.getItem('role');
}
