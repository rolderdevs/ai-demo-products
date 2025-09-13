/**
 * Use Case: отправка сообщения и получение ответа от AI
 *
 * Инкапсулирует бизнес-логику отправки сообщения пользователя
 * и получения ответа от AI-ассистента.
 */

import type { CreateMessageData, Message } from '@domain/entities/message';
import type { ChatRepository } from '@domain/repositories/chat-repository';

/**
 * Интерфейс AI сервиса для генерации ответов
 *
 * Определяется в application слое как порт,
 * реализуется в infrastructure слое
 */
export interface AIService {
  /**
   * Генерирует ответ на основе истории сообщений чата
   */
  generateResponse(chatId: string, userMessage: string): Promise<string>;
}

/**
 * Use Case для отправки сообщения пользователя и получения ответа AI
 */
export class SendMessageUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly aiService: AIService,
  ) {}

  /**
   * Выполняет отправку сообщения пользователя и получение ответа AI
   *
   * @param chatId - ID чата
   * @param content - содержимое сообщения пользователя
   * @returns Promise с массивом из двух сообщений: пользователя и AI
   */
  async execute(chatId: string, content: string): Promise<[Message, Message]> {
    // Создаем данные для сообщения пользователя
    const userMessageData: CreateMessageData = {
      content,
      role: 'user',
      chatId,
    };

    // Валидация на уровне домена
    const { validateMessage } = await import('@domain/entities/message');
    validateMessage(userMessageData);

    // Проверяем существование чата
    const chat = await this.chatRepository.getChat(chatId);
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    // Добавляем сообщение пользователя
    const userMessage = await this.chatRepository.addMessage(userMessageData);

    // Получаем ответ от AI
    const aiResponse = await this.aiService.generateResponse(chatId, content);

    // Создаем сообщение AI
    const aiMessageData: CreateMessageData = {
      content: aiResponse,
      role: 'assistant',
      chatId,
    };

    // Добавляем ответ AI в чат
    const aiMessage = await this.chatRepository.addMessage(aiMessageData);

    return [userMessage, aiMessage];
  }
}
