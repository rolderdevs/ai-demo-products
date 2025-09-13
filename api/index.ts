/**
 * Vercel адаптер для Clean Architecture сервера
 *
 * Импортирует и экспортирует ElysiaJS приложение для работы на Vercel.
 * Мостик между Vercel Functions и нашим Clean Architecture сервером.
 */

// Импортируем готовый сервер из Infrastructure слоя
import '../src/infrastructure/server';

// Vercel автоматически подхватит экспорт из server.ts
// Никаких дополнительных действий не требуется
