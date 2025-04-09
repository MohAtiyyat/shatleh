// src/lib/websocket.ts
interface ProfileUpdateMessage {
  type: 'profileUpdate'; // Specific literal type
  user?: {
    id: number;
    email: string;
    phone: string;
    country_code: string;
    location: string;
    profile_photo: string | null;
  };
}

interface NewPostMessage {
  type: 'newPost';
  post: {
    id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: string;
    user_email: string;
  };
}

interface NewCommentMessage {
  type: 'newComment';
  comment: {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    parent_comment_id: number | null;
    created_at: string;
    user_email: string;
  };
}

interface NewShareMessage {
  type: 'newShare';
  share: {
    post_id: number;
  };
}

type WebSocketMessage = ProfileUpdateMessage | NewPostMessage | NewCommentMessage | NewShareMessage;

let ws: WebSocket | null = null;
let listeners: ((data: WebSocketMessage) => void)[] = [];

export const connectWebSocket = (): WebSocket | null => {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return ws;
  }
  ws = new WebSocket('ws://localhost:5000');
  ws.onopen = () => console.log('WebSocket connected');
  ws.onmessage = (event: MessageEvent) => {
    const data: WebSocketMessage = JSON.parse(event.data);
    listeners.forEach((listener) => listener(data));
  };
  ws.onerror = (error: Event) => console.error('WebSocket error:', error);
  ws.onclose = (event: CloseEvent) => {
    console.log('WebSocket disconnected:', event.code, event.reason);
    ws = null;
    if (listeners.length > 0) setTimeout(connectWebSocket, 2000);
  };
  return ws;
};

export const disconnectWebSocket = (): void => {
  if (ws && ws.readyState === WebSocket.OPEN) ws.close();
};

export const addListener = (callback: (data: WebSocketMessage) => void): void => {
  listeners.push(callback);
};

export const removeListener = (callback: (data: WebSocketMessage) => void): void => {
  listeners = listeners.filter((listener) => listener !== callback);
};