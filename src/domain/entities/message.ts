/**
 * Базовые сущности домена для системы чата
 *
 * Этот файл содержит основные бизнес-сущности, которые представляют
 * ключевые концепции предметной области чата с AI.
 */

/**
 * Роль участника в диалоге
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Статус сообщения в процессе обработки
 */
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'error';

/**
 * Сущность сообщения - основная единица коммуникации в чате
 *
 * Представляет отдельное сообщение в диалоге между пользователем и AI.
 * Содержит всю необходимую информацию для отображения и обработки сообщения.
 */
export interface Message {
  /** Уникальный идентификатор сообщения */
  readonly id: string;

  /** Содержимое сообщения */
  readonly content: string;

  /** Роль отправителя сообщения */
  readonly role: MessageRole;

  /** Временная метка создания сообщения */
  readonly timestamp: Date;

  /** Идентификатор чата, к которому принадлежит сообщение */
  readonly chatId: string;

  /** Статус обработки сообщения */
  readonly status: MessageStatus;

  /** Дополнительные метаданные сообщения (опционально) */
  readonly metadata?: Record<string, unknown>;
}

/**
 * Тип для создания нового сообщения без системных полей
 */
export type CreateMessageData = Omit<Message, 'id' | 'timestamp' | 'status'>;

/**
 * Сущность чата - контейнер для коллекции сообщений
 *
 * Представляет отдельный диалог или сессию общения с AI.
 * Управляет жизненным циклом и метаданными разговора.
 */
export interface Chat {
  /** Уникальный идентификатор чата */
  readonly id: string;

  /** Заголовок чата (может генерироваться автоматически) */
  readonly title: string;

  /** Коллекция сообщений в хронологическом порядке */
  readonly messages: readonly Message[];

  /** Временная метка создания чата */
  readonly createdAt: Date;

  /** Временная метка последнего обновления чата */
  readonly updatedAt: Date;

  /** Флаг активности чата */
  readonly isActive: boolean;

  /** Настройки конкретного чата (опционально) */
  readonly settings?: ChatSettings;
}

/**
 * Настройки чата
 */
export interface ChatSettings {
  /** Модель AI для использования в чате */
  model?: string;

  /** Системный промпт для AI */
  systemPrompt?: string;

  /** Температура генерации (креативность) */
  temperature?: number;

  /** Максимальное количество токенов в ответе */
  maxTokens?: number;
}

/**
 * Тип для создания нового чата
 */
export type CreateChatData = Pick<Chat, 'title'> & {
  settings?: ChatSettings;
};

/**
 * Доменные ошибки
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class InvalidMessageError extends DomainError {
  constructor(reason: string) {
    super(`Invalid message: ${reason}`, 'INVALID_MESSAGE');
  }
}

export class InvalidChatError extends DomainError {
  constructor(reason: string) {
    super(`Invalid chat: ${reason}`, 'INVALID_CHAT');
  }
}

/**
 * Валидация сообщения
 */
export function validateMessage(data: CreateMessageData): void {
  if (!data.content?.trim()) {
    throw new InvalidMessageError('Content cannot be empty');
  }

  if (data.content.length > 10000) {
    throw new InvalidMessageError('Content too long (max 10000 characters)');
  }

  if (!data.chatId?.trim()) {
    throw new InvalidMessageError('Chat ID is required');
  }
}

/**
 * Валидация чата
 */
export function validateChat(data: CreateChatData): void {
  if (!data.title?.trim()) {
    throw new InvalidChatError('Title cannot be empty');
  }

  if (data.title.length > 100) {
    throw new InvalidChatError('Title too long (max 100 characters)');
  }
}
