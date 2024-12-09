// api.ts
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000", // убедитесь что на бекенде запущен сервер
});

export default api;
