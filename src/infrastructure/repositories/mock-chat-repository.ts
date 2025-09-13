/**
 * Mock реализация ChatRepository для тестирования
 *
 * Хранит данные в памяти и возвращает предсказуемые результаты.
 * Используется для быстрого тестирования use cases без внешних зависимостей.
 */

import type {
  Chat,
  CreateChatData,
  CreateMessageData,
  Message,
} from '@domain/entities/message';
import type { ChatRepository } from '@domain/repositories/chat-repository';

export class MockChatRepository implements ChatRepository {
  private chats = new Map<string, Chat>();
  private messages = new Map<string, Message[]>();
  private messageIdCounter = 1;
  private chatIdCounter = 1;

  constructor() {
    // Инициализируем с тестовыми данными
    this.initializeTestData();
  }

  async createChat(data: CreateChatData): Promise<Chat> {
    // Валидация данных
    const { validateChat } = await import('@domain/entities/message');
    validateChat(data);

    const chatId = `chat-${this.chatIdCounter++}`;
    const now = new Date();

    const chat: Chat = {
      id: chatId,
      title: data.title,
      messages: [],
      createdAt: now,
      updatedAt: now,
      isActive: true,
      settings: data.settings,
    };

    this.chats.set(chatId, chat);
    this.messages.set(chatId, []);

    return chat;
  }

  async getChat(id: string): Promise<Chat | null> {
    const chat = this.chats.get(id);
    if (!chat) return null;

    // Возвращаем чат с актуальными сообщениями
    const messages = this.messages.get(id) || [];
    return {
      ...chat,
      messages,
    };
  }

  async addMessage(data: CreateMessageData): Promise<Message> {
    // Валидация данных
    const { validateMessage } = await import('@domain/entities/message');
    validateMessage(data);

    // Проверяем существование чата
    if (!this.chats.has(data.chatId)) {
      throw new Error(`Chat with ID ${data.chatId} not found`);
    }

    const messageId = `msg-${this.messageIdCounter++}`;
    const now = new Date();

    const message: Message = {
      id: messageId,
      content: data.content,
      role: data.role,
      timestamp: now,
      chatId: data.chatId,
      status: 'sent',
      metadata: data.metadata,
    };

    // Добавляем сообщение в список
    const chatMessages = this.messages.get(data.chatId) || [];
    chatMessages.push(message);
    this.messages.set(data.chatId, chatMessages);

    // Обновляем timestamp чата
    const chat = this.chats.get(data.chatId);
    if (chat) {
      this.chats.set(data.chatId, {
        ...chat,
        updatedAt: now,
      });
    }

    return message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messages.get(chatId) || [];
  }

  /**
   * Инициализирует репозиторий тестовыми данными
   */
  private initializeTestData(): void {
    // Создаем тестовый чат
    const testChatId = 'test-chat-1';
    const testChat: Chat = {
      id: testChatId,
      title: 'Тестовый чат',
      messages: [],
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-01T10:30:00Z'),
      isActive: true,
    };

    // Создаем тестовые сообщения
    const testMessages: Message[] = [
      {
        id: 'msg-1',
        content: 'Привет! Как дела?',
        role: 'user',
        timestamp: new Date('2024-01-01T10:00:00Z'),
        chatId: testChatId,
        status: 'sent',
      },
      {
        id: 'msg-2',
        content: 'Привет! Дела отлично, спасибо за вопрос! Чем могу помочь?',
        role: 'assistant',
        timestamp: new Date('2024-01-01T10:01:00Z'),
        chatId: testChatId,
        status: 'sent',
      },
      {
        id: 'msg-3',
        content: 'Расскажи анекдот',
        role: 'user',
        timestamp: new Date('2024-01-01T10:05:00Z'),
        chatId: testChatId,
        status: 'sent',
      },
      {
        id: 'msg-4',
        content:
          'Программист приходит домой, а жена говорит: "Дорогой, сходи в магазин за хлебом. И если будут яйца - купи десяток." Программист пришёл с десятью буханками хлеба. "Зачем столько?" - спрашивает жена. "Яйца были!"',
        role: 'assistant',
        timestamp: new Date('2024-01-01T10:06:00Z'),
        chatId: testChatId,
        status: 'sent',
      },
    ];

    // Сохраняем тестовые данные
    this.chats.set(testChatId, {
      ...testChat,
      messages: testMessages,
    });
    this.messages.set(testChatId, testMessages);

    // Устанавливаем счетчики после тестовых данных
    this.chatIdCounter = 2;
    this.messageIdCounter = 5;
  }

  /**
   * Утилиты для тестирования
   */

  /**
   * Очищает все данные (для тестов)
   */
  clear(): void {
    this.chats.clear();
    this.messages.clear();
    this.chatIdCounter = 1;
    this.messageIdCounter = 1;
  }

  /**
   * Получает все чаты (для отладки)
   */
  getAllChats(): Chat[] {
    return Array.from(this.chats.values());
  }

  /**
   * Получает статистику (для отладки)
   */
  getStats() {
    return {
      totalChats: this.chats.size,
      totalMessages: Array.from(this.messages.values()).reduce(
        (sum, msgs) => sum + msgs.length,
        0,
      ),
      averageMessagesPerChat:
        this.chats.size > 0
          ? Array.from(this.messages.values()).reduce(
              (sum, msgs) => sum + msgs.length,
              0,
            ) / this.chats.size
          : 0,
    };
  }
}
