/**
 * Главный компонент приложения
 *
 * Демонстрирует работу AI чата с Clean Architecture.
 * Простой layout без сложной стилизации.
 */

import type React from 'react';
import { SimpleChat } from './components/simple-chat';

export function App(): React.ReactElement {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Заголовок приложения */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1a202c',
            margin: '0 0 8px 0',
          }}
        >
          🤖 AI Chat Demo
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#4a5568',
            margin: '0 0 16px 0',
          }}
        >
          Демонстрация Clean Architecture с ElysiaJS, Vercel AI SDK и React
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: '#718096',
          }}
        >
          <span>🏗️ Clean Architecture</span>
          <span>⚡ ElysiaJS Backend</span>
          <span>🧠 Mock AI Service</span>
          <span>⚛️ React Frontend</span>
        </div>
      </header>

      {/* Основной контент */}
      <main>
        <SimpleChat />
      </main>

      {/* Футер с информацией */}
      <footer
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          fontSize: '14px',
          color: '#a0aec0',
        }}
      >
        <p style={{ margin: '0 0 8px 0' }}>
          Проект демонстрирует правильное разделение слоев в Clean Architecture
        </p>
        <p style={{ margin: '0' }}>
          Domain → Application → Infrastructure → Presentation
        </p>
      </footer>
    </div>
  );
}

export default App;
