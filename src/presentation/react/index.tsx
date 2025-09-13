/**
 * Точка входа React приложения
 *
 * Инициализирует и монтирует главный компонент App.
 * Настройка для работы с Clean Architecture demo.
 */

import { createRoot } from 'react-dom/client';
import { App } from './App';

// Базовые стили для сброса браузерных значений по умолчанию
const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f0f2f5;
  }

  button {
    font-family: inherit;
  }

  input {
    font-family: inherit;
  }
`;

// Добавляем глобальные стили
const styleElement = document.createElement('style');
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);

// Получаем корневой элемент
const container = document.getElementById('root');
if (!container) {
  throw new Error(
    'Root element not found! Make sure you have <div id="root"></div> in your HTML.',
  );
}

// Создаем React root и рендерим приложение
const root = createRoot(container);

root.render(<App />);

// Добавляем обработчик ошибок для development
if (process.env.NODE_ENV === 'development') {
  console.log('🎯 AI Chat Demo - Clean Architecture');
  console.log('====================================');
  console.log('Frontend: http://localhost:4173 (или текущий порт)');
  console.log('Backend API: http://localhost:3001');
  console.log('');
  console.log('Архитектура:');
  console.log('• Domain Layer - Сущности и бизнес-правила');
  console.log('• Application Layer - Use Cases');
  console.log('• Infrastructure Layer - API, моки');
  console.log('• Presentation Layer - React UI');
}
