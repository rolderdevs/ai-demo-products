/**
 * React hook для работы с чатом
 *
 * Инкапсулирует логику взаимодействия с Chat API и управление состоянием.
 * Следует принципам Clean Architecture - UI слой взаимодействует с API.
 */

import type { Chat, Message } from '@domain/entities/message';
import { useCallback, useEffect, useState } from 'react';

/**
 * Состояние чата
 */
interface ChatState {
  chat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * API ответы
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface SendMessageResponse {
  userMessage: Message;
  aiMessage: Message;
  total: number;
}

/**
 * Hook для работы с чатом
 */
export function useChat(chatId?: string) {
  const [state, setState] = useState<ChatState>({
    chat: null,
    messages: [],
    isLoading: false,
    error: null,
    isConnected: false,
  });

  const API_BASE =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/api/chat'
      : '/api/chat';

  /**
   * Обновление состояния с сохранением предыдущих значений
   */
  const updateState = useCallback((updates: Partial<ChatState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Обработка API ошибок
   */
  const handleApiError = useCallback(
    (error: unknown, context: string) => {
      console.error(`API Error (${context}):`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      updateState({ error: `${context}: ${message}`, isLoading: false });
    },
    [updateState],
  );

  /**
   * Проверка соединения с API
   */
  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data: ApiResponse = await response.json();
      updateState({ isConnected: data.success });
      return data.success;
    } catch {
      updateState({ isConnected: false });
      return false;
    }
  }, [updateState]);

  /**
   * Создание нового чата
   */
  const createChat = useCallback(
    async (title?: string): Promise<Chat | null> => {
      updateState({ isLoading: true, error: null });

      try {
        const url = title ? `${API_BASE}` : `${API_BASE}/auto`;

        const options: RequestInit = {
          method: 'POST',
          headers: title ? { 'Content-Type': 'application/json' } : undefined,
          body: title ? JSON.stringify({ title }) : undefined,
        };

        const response = await fetch(url, options);
        const data: ApiResponse<Chat> = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Failed to create chat');
        }

        updateState({
          chat: data.data,
          messages: [...data.data.messages],
          isLoading: false,
        });

        return data.data;
      } catch (error) {
        handleApiError(error, 'Create chat');
        return null;
      }
    },
    [updateState, handleApiError],
  );

  /**
   * Загрузка чата по ID
   */
  const loadChat = useCallback(
    async (id: string): Promise<void> => {
      updateState({ isLoading: true, error: null });

      try {
        const response = await fetch(`${API_BASE}/${id}`);
        const data: ApiResponse<Chat> = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Chat not found');
        }

        updateState({
          chat: data.data,
          messages: [...data.data.messages],
          isLoading: false,
        });
      } catch (error) {
        handleApiError(error, 'Load chat');
      }
    },
    [updateState, handleApiError],
  );

  /**
   * Отправка сообщения
   */
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!state.chat) {
        updateState({ error: 'No chat selected' });
        return false;
      }

      updateState({ isLoading: true, error: null });

      try {
        const response = await fetch(`${API_BASE}/${state.chat.id}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });

        const data: ApiResponse<SendMessageResponse> = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Failed to send message');
        }

        // Обновляем сообщения
        const newMessages = [
          ...state.messages,
          data.data.userMessage,
          data.data.aiMessage,
        ];

        updateState({
          messages: newMessages,
          chat: state.chat
            ? {
                ...state.chat,
                messages: newMessages,
                updatedAt: new Date(),
              }
            : null,
          isLoading: false,
        });

        return true;
      } catch (error) {
        handleApiError(error, 'Send message');
        return false;
      }
    },
    [state.chat, state.messages, updateState, handleApiError],
  );

  /**
   * Очистка ошибки
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Сброс состояния
   */
  const resetChat = useCallback(() => {
    setState({
      chat: null,
      messages: [],
      isLoading: false,
      error: null,
      isConnected: false,
    });
  }, []);

  /**
   * Проверка соединения при инициализации
   */
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  /**
   * Загрузка чата при изменении chatId
   */
  useEffect(() => {
    if (chatId && chatId !== state.chat?.id) {
      loadChat(chatId);
    }
  }, [chatId, state.chat?.id, loadChat]);

  return {
    // Состояние
    chat: state.chat,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,

    // Действия
    createChat,
    loadChat,
    sendMessage,
    clearError,
    resetChat,
    checkConnection,

    // Утилиты
    hasMessages: state.messages.length > 0,
    lastMessage: state.messages[state.messages.length - 1] || null,
    messageCount: state.messages.length,
  };
}

/**
 * Упрощенный hook для быстрого создания чата
 */
export function useQuickChat() {
  const chat = useChat();

  useEffect(() => {
    // Автоматически создаем чат при инициализации
    if (chat.isConnected && !chat.chat && !chat.isLoading) {
      chat.createChat();
    }
  }, [chat.isConnected, chat.chat, chat.isLoading, chat.createChat]);

  return chat;
}
