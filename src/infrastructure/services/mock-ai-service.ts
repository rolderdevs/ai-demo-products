/**
 * Mock реализация AIService для тестирования
 *
 * Возвращает предсказуемые ответы без обращения к реальным AI моделям.
 * Используется для быстрого тестирования use cases.
 */

import type { AIService } from '@application/use-cases/send-message';

export class MockAIService implements AIService {
  private responseCounter = 0;

  // Предустановленные ответы для разнообразия
  private readonly responses = [
    'Это тестовый ответ от Mock AI Service. Я понял ваше сообщение!',
    'Интересно! Расскажите больше об этом.',
    'Я согласен с вашей точкой зрения. Что думаете по этому поводу?',
    'Хороший вопрос! Позвольте мне подумать над этим.',
    'Понятно. А как вы к этому пришли?',
    'Это напоминает мне о... А что вы думаете?',
    'Отличная идея! Можете развить эту мысль?',
    'Спасибо за информацию. Это очень полезно!',
  ];

  // Специальные ответы на конкретные ключевые слова
  private readonly keywordResponses = new Map([
    ['привет', 'Привет! Как дела? Чем могу помочь?'],
    [
      'анекдот',
      'Программист заходит в бар и заказывает 1.000000119 пива. "Почему так точно?" - спрашивает бармен. "Я работаю с float!"',
    ],
    [
      'погода',
      'К сожалению, я не могу узнать актуальную погоду, но надеюсь, что у вас хорошая погода!',
    ],
    ['время', 'Сейчас самое время для интересной беседы!'],
    [
      'помощь',
      'Конечно помогу! Просто задайте мне вопрос, и я постараюсь ответить.',
    ],
    ['спасибо', 'Всегда пожалуйста! Рад был помочь.'],
    [
      'тест',
      'Это действительно тестовое сообщение. Mock AI Service работает корректно!',
    ],
    [
      'ошибка',
      'Не волнуйтесь, ошибки - это часть процесса обучения. Давайте разберемся!',
    ],
    ['код', 'Программирование - это искусство! Какую задачу решаем?'],
    [
      'clean architecture',
      'Clean Architecture - отличный подход! Разделение на слои делает код более тестируемым и поддерживаемым.',
    ],
  ]);

  async generateResponse(chatId: string, userMessage: string): Promise<string> {
    // Имитируем задержку реального AI сервиса
    await this.simulateDelay();

    // Проверяем ключевые слова
    const lowerMessage = userMessage.toLowerCase();
    for (const [keyword, response] of this.keywordResponses) {
      if (lowerMessage.includes(keyword)) {
        this.responseCounter++; // Увеличиваем счетчик для ключевых слов
        return this.addChatContext(response, chatId);
      }
    }

    // Возвращаем циклический ответ из предустановленных
    const response =
      this.responses[this.responseCounter % this.responses.length];
    this.responseCounter++;

    return this.addChatContext(response, chatId);
  }

  /**
   * Добавляет контекст чата к ответу
   */
  private addChatContext(response: string, chatId: string): string {
    // Можно добавить информацию о чате для отладки
    if (chatId === 'test-chat-1') {
      return `${response} [Тестовый чат]`;
    }
    return response;
  }

  /**
   * Имитирует задержку реального AI сервиса
   */
  private async simulateDelay(): Promise<void> {
    // Случайная задержка от 100 до 500 мс
    const delay = Math.random() * 400 + 100;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Утилиты для тестирования
   */

  /**
   * Сбрасывает счетчик ответов (для предсказуемых тестов)
   */
  resetCounter(): void {
    this.responseCounter = 0;
  }

  /**
   * Устанавливает конкретный ответ для следующего вызова
   */
  setNextResponse(response: string): void {
    // Временно добавляем ответ в начало массива
    this.responses.unshift(response);
    this.responseCounter = 0;
  }

  /**
   * Добавляет новое ключевое слово с ответом
   */
  addKeywordResponse(keyword: string, response: string): void {
    this.keywordResponses.set(keyword.toLowerCase(), response);
  }

  /**
   * Получает статистику использования
   */
  getStats() {
    return {
      totalResponses: this.responseCounter,
      availableResponses: this.responses.length,
      keywordResponses: this.keywordResponses.size,
    };
  }
}
