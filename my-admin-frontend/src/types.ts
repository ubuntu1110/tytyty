// frontend/src/types.ts

export interface Client {
    id: number;
    chat_id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    created_at: string;
}

export interface BroadcastStatus {
    success: number;
    failed: number;
}

export interface BroadcastHistoryItem {
    id: number;
    text: string;
    created_at: string;
}

export interface BotClient {
    id: number;
    chat_id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    created_at: string;
}

export interface BroadcastRequest {
    text: string;
    image_url?: string;
    datetime?: string;
}

export interface FullBroadcastHistoryItem {
    id: number;
    text: string;
    image_url?: string;
    scheduled_for: string | null;
    status: string; // "scheduled", "completed", "partially_failed", "failed"
    created_at: string;
    success_count: number;
    failed_count: number;
}

export interface BroadcastError {
    id: number;
    broadcast_id: number;
    chat_id: string;
    error_type: string;
    error_message: string;
    timestamp: string;
}

// Типы для ботов и сообщений

export interface Bot {
    id: number;
    name: string;
    is_running: boolean;
    // Добавьте другие поля, если необходимо
}

export interface MessagePayload {
    message: string;
    image?: File;
}

export interface MessageOut {
    id: number;
    bot_id: number;
    message: string;
    image?: string;
    timestamp: string;
}
