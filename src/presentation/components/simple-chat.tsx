/**
 * Простой компонент чата без стилизации
 *
 * Минимальный UI для тестирования функциональности чата.
 * Без сложных стилей, только базовая разметка и логика.
 */

import type { Message } from '@domain/entities/message';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useQuickChat } from '../hooks/use-chat';

/**
 * Компонент отдельного сообщения
 */
function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('ru-RU');

  return (
    <div
      style={{
        marginBottom: '12px',
        padding: '8px 12px',
        backgroundColor: isUser ? '#e3f2fd' : '#f5f5f5',
        borderRadius: '8px',
        marginLeft: isUser ? '20px' : '0',
        marginRight: isUser ? '0' : '20px',
        border: '1px solid #ddd',
      }}
    >
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
        {isUser ? '👤 Пользователь' : '🤖 AI'} • {time}
      </div>
      <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
        {message.content}
      </div>
    </div>
  );
}

/**
 * Компонент списка сообщений
 */
function MessageList({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  if (messages.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#999',
          padding: '40px 20px',
          fontStyle: 'italic',
        }}
      >
        Начните диалог, отправив сообщение
      </div>
    );
  }

  return (
    <div>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

/**
 * Компонент статуса соединения
 */
function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <div
      style={{
        fontSize: '12px',
        color: isConnected ? '#4caf50' : '#f44336',
        padding: '4px 8px',
        backgroundColor: isConnected ? '#e8f5e8' : '#fce4e4',
        border: `1px solid ${isConnected ? '#4caf50' : '#f44336'}`,
        borderRadius: '4px',
        display: 'inline-block',
      }}
    >
      {isConnected ? '✅ Подключено' : '❌ Нет соединения'}
    </div>
  );
}

/**
 * Основной компонент чата
 */
export function SimpleChat() {
  const [input, setInput] = useState('');
  const {
    chat,
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
    clearError,
    hasMessages,
    messageCount,
  } = useQuickChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const success = await sendMessage(input.trim());
    if (success) {
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (error) {
      clearError();
    }
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '20px auto',
        border: '2px solid #ddd',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '16px 20px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#333' }}>
            AI Chat Demo - Clean Architecture
          </h2>
          {chat && (
            <div style={{ fontSize: '14px', color: '#666' }}>
              {chat.title} • {messageCount} сообщений
            </div>
          )}
        </div>
        <ConnectionStatus isConnected={isConnected} />
      </div>

      {/* Область сообщений */}
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#fafafa',
        }}
      >
        {isLoading && !hasMessages && (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            🔄 Инициализация чата...
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #ef5350',
            }}
          >
            ❌ {error}
            <button
              type="button"
              onClick={clearError}
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                color: '#c62828',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Закрыть
            </button>
          </div>
        )}

        <MessageList messages={messages} />
      </div>

      {/* Форма ввода */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #ddd',
          backgroundColor: '#fff',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Введите сообщение..."
              disabled={isLoading || !isConnected}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2196f3';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !isConnected}
              style={{
                padding: '10px 16px',
                backgroundColor: isLoading ? '#ccc' : '#2196f3',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {isLoading ? '...' : 'Отправить'}
            </button>
          </div>
        </form>

        {/* Подсказки */}
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#999',
          }}
        >
          💡 Попробуйте: "привет", "анекдот", "clean architecture", "помощь"
        </div>
      </div>
    </div>
  );
}
