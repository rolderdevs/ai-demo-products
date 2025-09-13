/**
 * Use Case: создание нового чата
 *
 * Инкапсулирует бизнес-логику создания нового чата.
 */

import type { Chat, CreateChatData } from '@domain/entities/message';
import type { ChatRepository } from '@domain/repositories/chat-repository';

/**
 * Use Case для создания нового чата
 */
export class CreateChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  /**
   * Создает новый чат
   *
   * @param title - заголовок чата
   * @returns Promise с созданным чатом
   */
  async execute(title: string): Promise<Chat> {
    // Валидация входных данных
    if (!title?.trim()) {
      throw new Error('Chat title is required');
    }

    const chatData: CreateChatData = {
      title: title.trim(),
    };

    // Валидация на уровне домена
    const { validateChat } = await import('@domain/entities/message');
    validateChat(chatData);

    // Создаем чат через репозиторий
    return await this.chatRepository.createChat(chatData);
  }

  /**
   * Создает чат с автоматически сгенерированным заголовком
   *
   * @returns Promise с созданным чатом
   */
  async createWithAutoTitle(): Promise<Chat> {
    const timestamp = new Date().toLocaleString('ru-RU');
    const title = `Новый чат - ${timestamp}`;

    return await this.execute(title);
  }
}
