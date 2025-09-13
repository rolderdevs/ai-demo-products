/**
 * Vercel адаптер для Clean Architecture сервера
 *
 * Импортирует и экспортирует ElysiaJS приложение для работы на Vercel.
 * Мостик между Vercel Functions и нашим Clean Architecture сервером.
 */

// Импортируем handler из Infrastructure слоя
import handler from '../src/infrastructure/web-adapters/elysia/server';

// Экспортируем для Vercel
export default handler;
