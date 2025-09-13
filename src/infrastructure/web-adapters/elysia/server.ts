/**
 * HTTP сервер с ElysiaJS
 *
 * Интегрирует все слои Clean Architecture и предоставляет REST API.
 * Демонстрирует правильную настройку сервера с dependency injection.
 */

// Application Layer - use cases
import { CreateChatUseCase } from '@application/use-cases/create-chat';
import { GetChatUseCase } from '@application/use-cases/get-chat';
import { SendMessageUseCase } from '@application/use-cases/send-message';
import { cors } from '@elysiajs/cors';
import { MockChatRepository } from '@infrastructure/repositories/mock-chat-repository';
import { MockAIService } from '@infrastructure/services/mock-ai-service';
import { Elysia } from 'elysia';
// Infrastructure Layer
import { createChatController } from './chat-controller';

/**
 * Настройка HTTP сервера
 */
async function createServer() {
  console.log('🚀 Настройка HTTP сервера...');

  // Dependency Injection
  const chatRepository = new MockChatRepository();
  const aiService = new MockAIService();

  const createChatUseCase = new CreateChatUseCase(chatRepository);
  const getChatUseCase = new GetChatUseCase(chatRepository);
  const sendMessageUseCase = new SendMessageUseCase(chatRepository, aiService);

  // Создаем Elysia приложение
  const app = new Elysia()
    // Добавляем CORS для работы с фронтендом
    .use(
      cors({
        origin: true, // Разрешаем все источники в dev режиме
        credentials: true,
      }),
    )
    // Основная информация
    .get('/', () => ({
      name: 'AI Chat Demo API',
      description: 'Clean Architecture example with ElysiaJS',
      version: '1.0.0',
      endpoints: [
        'GET / - API info',
        'POST /api/chat - Create chat',
        'POST /api/chat/auto - Create chat with auto title',
        'GET /api/chat/:id - Get chat by ID',
        'GET /api/chat/:id/messages - Get chat messages',
        'POST /api/chat/:id/message - Send message',
        'GET /api/chat/health - Health check',
      ],
      documentation: 'Visit /swagger for OpenAPI documentation',
    }))

    // Интеграция Chat Controller
    .use(
      createChatController(
        createChatUseCase,
        getChatUseCase,
        sendMessageUseCase,
      ),
    )

    // Глобальная обработка ошибок
    .onError(({ code, error, set }) => {
      console.error(`❌ Server Error [${code}]:`, error);

      switch (code) {
        case 'VALIDATION':
          set.status = 400;
          return {
            success: false,
            error: 'Validation failed',
            details: error.message,
          };
        case 'NOT_FOUND':
          set.status = 404;
          return {
            success: false,
            error: 'Endpoint not found',
          };
        default:
          set.status = 500;
          return {
            success: false,
            error: 'Internal server error',
          };
      }
    })

    // Логирование запросов
    .onRequest(({ request }) => {
      console.log(`📡 ${request.method} ${new URL(request.url).pathname}`);
    })

    // Логирование ответов
    .onAfterHandle(({ request, set }) => {
      const url = new URL(request.url);
      const status = Number(set.status) || 200;
      const statusEmoji = status >= 400 ? '❌' : '✅';
      console.log(
        `${statusEmoji} ${request.method} ${url.pathname} → ${status}`,
      );
    });

  console.log('✅ HTTP сервер настроен');
  return { app, stats: { chatRepository, aiService } };
}

/**
 * Запуск сервера локально
 */
async function startServer() {
  const PORT = process.env.PORT || 3001;

  try {
    const { app, stats } = await createServer();

    // Запускаем сервер
    app.listen(PORT);

    console.log('\n🎯 AI Chat Demo Server');
    console.log('=====================');
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/swagger`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/chat/health`);

    // Показываем начальную статистику
    console.log('\n📊 Initial Stats:');
    console.log('Repository:', stats.chatRepository.getStats());
    console.log('AI Service:', stats.aiService.getStats());

    console.log('\n🚀 Server is ready! Try these commands:');
    console.log('curl http://localhost:3001/api/chat/health');
    console.log('curl -X POST http://localhost:3001/api/chat/auto');

    // Периодический вывод статистики (каждые 30 секунд)
    setInterval(() => {
      const repoStats = stats.chatRepository.getStats();
      const aiStats = stats.aiService.getStats();

      if (repoStats.totalMessages > 4 || aiStats.totalResponses > 0) {
        console.log('\n📈 Live Stats:');
        console.log('Repository:', repoStats);
        console.log('AI Service:', aiStats);
      }
    }, 30000);
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Создание приложения для Vercel
 */
async function createApp() {
  const { app } = await createServer();
  return app;
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Server terminated');
  process.exit(0);
});

// Запускаем сервер только в development режиме
if (process.env.NODE_ENV !== 'production') {
  startServer().catch((error) => {
    console.error('💥 Startup error:', error);
    process.exit(1);
  });
}

// Экспортируем handler для Vercel
export default async function handler(req: Request) {
  const app = await createApp();
  return app.handle(req);
}
