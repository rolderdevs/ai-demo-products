/**
 * Use Case: получение чата с историей сообщений
 *
 * Инкапсулирует бизнес-логику получения чата и его сообщений.
 */

import type { Chat } from '@domain/entities/message';
import type { ChatRepository } from '@domain/repositories/chat-repository';

/**
 * Use Case для получения чата с его сообщениями
 */
export class GetChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  /**
   * Получает чат по ID
   *
   * @param chatId - ID чата
   * @returns Promise с чатом или null если не найден
   */
  async execute(chatId: string): Promise<Chat | null> {
    if (!chatId?.trim()) {
      throw new Error('Chat ID is required');
    }

    return await this.chatRepository.getChat(chatId);
  }

  /**
   * Получает только сообщения чата (без метаданных чата)
   *
   * @param chatId - ID чата
   * @returns Promise с массивом сообщений
   */
  async getMessages(chatId: string) {
    if (!chatId?.trim()) {
      throw new Error('Chat ID is required');
    }

    const chat = await this.chatRepository.getChat(chatId);
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    return await this.chatRepository.getMessages(chatId);
  }
}
