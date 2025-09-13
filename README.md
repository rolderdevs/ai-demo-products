# AI Demo Products

## Архитектура на основе Clean Architecture

### Технологический стек

- **Backend**: ElysiaJS - высокопроизводительный TypeScript веб-фреймворк с end-to-end type safety
- **AI Integration**: Vercel AI SDK - toolkit для интеграции с различными LLM провайдерами
- **Frontend**: shadcn/ui - коллекция доступных и кастомизируемых UI компонентов
- **Runtime**: Bun - быстрый JavaScript runtime и пакетный менеджер

### Принципы Clean Architecture

Clean Architecture разделяет приложение на концентрические слои, где зависимости направлены внутрь к бизнес-логике:

1. **Domain Layer (Сущности)** - бизнес-правила и сущности
2. **Application Layer (Сценарии использования)** - логика приложения
3. **Infrastructure Layer (Адаптеры интерфейсов)** - внешние интерфейсы
4. **Presentation Layer (UI)** - пользовательский интерфейс

### Структура проекта

```
src/
├── domain/                 # Domain Layer - Бизнес-логика
│   ├── entities/          # Сущности
│   └── repositories/      # Интерфейсы репозиториев
├── application/           # Application Layer - Сценарии использования
│   └── use-cases/        # Use Cases
├── infrastructure/        # Infrastructure Layer - Внешние зависимости
│   ├── repositories/     # Реализации репозиториев
│   ├── services/         # Внешние сервисы
│   └── web-adapters/     # Веб-адаптеры для различных платформ
├── presentation/          # Presentation Layer - UI компоненты
│   └── react/           # React-based frontend
│       ├── components/   # React компоненты
│       ├── hooks/       # Custom React hooks
│       ├── App.tsx      # Главный React компонент
│       ├── index.tsx    # Точка входа React приложения
│       └── rsbuild.config.ts # RSBuild конфигурация
└── api/
    └── index.ts          # Vercel адаптер для сервера
```

### Ключевые компоненты архитектуры

#### Domain Layer

- **Message Entity**: базовая сущность сообщения с полями id, content, role, timestamp
- **Chat Entity**: сущность чата, содержащая коллекцию сообщений
- **ChatRepository Interface**: контракт для работы с данными чата

#### Application Layer

- **SendMessageUseCase**: сценарий отправки сообщения и получения ответа от AI
- **GetChatUseCase**: сценарий получения истории чата
- **CreateChatUseCase**: сценарий создания нового чата

#### Infrastructure Layer

- **AIService**: интеграция с Vercel AI SDK для генерации ответов
- **InMemoryChatRepository**: реализация репозитория в памяти
- **ChatController**: ElysiaJS контроллер для HTTP API

#### Presentation Layer

- **ChatInterface**: основной компонент интерфейса чата
- **MessageList**: компонент списка сообщений
- **useChat Hook**: React hook для управления состоянием чата

### Преимущества архитектуры

1. **Тестируемость**: бизнес-логика изолирована и легко тестируется
2. **Гибкость**: легкая замена компонентов (например, InMemory на PostgreSQL)
3. **Независимость от фреймворков**: бизнес-логика не зависит от UI или базы данных
4. **Читаемость**: четкое разделение ответственности между слоями
5. **Расширяемость**: простое добавление новых функций без нарушения существующего кода

### Паттерны проектирования

- **Repository Pattern**: абстракция доступа к данным
- **Use Case Pattern**: инкапсуляция бизнес-логики в отдельные классы
- **Dependency Injection**: внедрение зависимостей для слабой связности
- **Service Locator**: паттерн для типобезопасности в ElysiaJS

### Масштабирование

Архитектура позволяет легко масштабировать приложение:

- Добавление новых типов сообщений (изображения, файлы)
- Интеграция с различными AI провайдерами
- Реализация персистентного хранилища
- Добавление аутентификации и авторизации
- Реализация real-time обновлений через WebSocket

### Архитектура и поток данных

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                          │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │   React UI      │    │   useChat Hook   │    │ HTTP Client │ │
│  │                 │◄───┤                  │◄───┤             │ │
│  │ • SimpleChat    │    │ • State Mgmt     │    │ • Fetch API │ │
│  │ • MessageList   │    │ • API Calls      │    │ • Requests  │ │
│  └─────────────────┘    └──────────────────┘    └─────────────┘ │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                   HTTP Requests
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                         │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │ ElysiaJS Server │    │  Chat Controller │    │ MockAIService│ │
│  │                 │◄───┤                  │◄───┤             │ │
│  │ • HTTP Server   │    │ • REST Endpoints │    │ • AI Mocks  │ │
│  │ • CORS          │    │ • Validation     │    │ • Responses │ │
│  │ • Error Handler │    │ • HTTP Mapping  │    │ • Keywords  │ │
│  └─────────────────┘    └──────────────────┘    └─────────────┘ │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                   Use Case Calls
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                           │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │ SendMessageUseCase│  │  GetChatUseCase  │    │CreateChatUseCase│
│  │                 │    │                  │    │             │ │
│  │ • Business Logic│    │ • Chat Retrieval │    │ • Chat Init │ │
│  │ • AI Integration│    │ • Message History│    │ • Validation│ │
│  │ • Orchestration │    │ • State Mgmt     │    │ • Creation  │ │
│  └─────────────────┘    └──────────────────┘    └─────────────┘ │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                  Repository Calls
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                              │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │    Entities     │    │   Repository     │    │ Validation  │ │
│  │                 │    │   Interface      │    │             │ │
│  │ • Message       │    │                  │    │ • Rules     │ │
│  │ • Chat          │    │ • ChatRepository │    │ • Errors    │ │
│  │ • ChatSettings  │    │ • Contract       │    │ • Types     │ │
│  └─────────────────┘    └──────────────────┘    └─────────────┘ │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                          ▲
                                          │
┌─────────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                         │
│  ┌─────────────────┐                                           │
│  │MockChatRepository│                                          │
│  │                 │                                           │
│  │ • In-Memory     │                                           │
│  │ • Test Data     │                                           │
│  │ • CRUD Ops      │                                           │
│  └─────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FLOW EXAMPLE                            │
│                                                                 │
│  1. User types message in React UI                             │
│  2. useChat hook sends HTTP POST to /api/chat/:id/message      │
│  3. ElysiaJS routes to ChatController                          │
│  4. Controller calls SendMessageUseCase.execute()              │
│  5. UseCase validates via Domain rules                         │
│  6. UseCase saves user message via ChatRepository              │
│  7. UseCase calls MockAIService.generateResponse()             │
│  8. UseCase saves AI response via ChatRepository               │
│  9. Controller returns both messages as JSON                   │
│ 10. useChat hook updates React state                           │
│ 11. UI re-renders with new messages                            │
│                                                                 │
│     ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│     │   USER   │───▶│    UI    │───▶│   API    │               │
│     └──────────┘    └──────────┘    └──────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Принципы реализации

- **Dependency Inversion**: Use Cases зависят от интерфейсов, не от реализаций
- **Single Responsibility**: Каждый слой имеет четкую ответственность
- **Interface Segregation**: Минимальные интерфейсы только с необходимыми методами
- **Separation of Concerns**: Бизнес-логика изолирована от UI и инфраструктуры

## План реализации AI с Vercel AI SDK

### Текущее состояние

Проект имеет полную архитектуру с mock-сервисами для демонстрации. Следующий шаг - интеграция с реальным AI через Vercel AI SDK.

### 1. Что нужно изменить

#### 1.1 Domain Layer - Упрощение сущностей

**Файл:** `src/domain/entities/message.ts`

**Изменения:**

- Упростить `Message` interface - убрать лишние поля (`chatId`, `status`, `metadata`)
- Убрать `Chat` entity - не нужна для одного чата
- Оставить только `MessageRole` (`user`, `assistant`, `system`)
- Упростить валидацию - только для содержимого сообщения

```typescript
export interface Message {
  readonly id: string;
  readonly content: string;
  readonly role: MessageRole;
  readonly timestamp: Date;
}
```

#### 1.2 Application Layer - Упрощенный AI сервис

**Файлы:**

- Обновить: `src/application/use-cases/send-message.ts`
- Удалить: `create-chat.ts`, `get-chat.ts`

**Новый AIService интерфейс:**

```typescript
export interface AIService {
  streamResponse(messages: Message[]): Promise<ReadableStream>;
}
```

**Упрощенный SendMessageUseCase:**

- Работает со списком сообщений в памяти
- Убрать зависимость от ChatRepository
- Возвращает ReadableStream для стриминга

#### 1.3 Infrastructure Layer - Vercel AI Service

**Создать:** `src/infrastructure/services/vercel-ai-service.ts`

```typescript
export class VercelAIService implements AIService {
  async streamResponse(messages: Message[]): Promise<ReadableStream> {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return result.textStream;
  }
}
```

**Обновить:** `src/infrastructure/web-adapters/elysia/chat-controller.ts`

- Новый эндпоинт `/api/chat/stream` для стриминга
- Использовать `result.toUIMessageStreamResponse()` из AI SDK
- ElysiaJS автоматически обработает ReadableStream

#### 1.4 Presentation Layer - Интеграция с AI SDK

**Обновить:** `src/presentation/react/hooks/use-chat.ts`

```typescript
import { useChat } from "@ai-sdk/react";

export function useSimpleChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat/stream",
    });

  return { messages, input, handleInputChange, handleSubmit, isLoading };
}
```

#### 1.5 Зависимости

**Добавить в `package.json`:**

```json
{
  "dependencies": {
    "ai": "^3.4.32",
    "@ai-sdk/openai": "^1.0.0",
    "@ai-sdk/react": "^0.0.62"
  }
}
```

### 2. Что лишнее в текущей реализации

#### 2.1 Удалить файлы:

- `src/application/use-cases/create-chat.ts`
- `src/application/use-cases/get-chat.ts`
- `src/infrastructure/repositories/mock-chat-repository.ts`
- `src/infrastructure/services/mock-ai-service.ts`
- `src/domain/repositories/chat-repository.ts`

#### 2.2 Упростить сущности:

- **Chat entity** - не нужна для одного чата
- **ChatRepository** - заменяется in-memory состоянием
- **ChatSettings** - можно добавить позже
- **Сложные метаданные** в Message

#### 2.3 Убрать из контроллера:

- Эндпоинты создания чатов (`POST /`, `POST /auto`)
- Эндпоинты получения чатов (`GET /:id`, `GET /:id/messages`)
- Сложную обработку ошибок для несуществующих чатов

### 3. Архитектурные принципы (сохраняем)

#### 3.1 Clean Architecture

- **Domain** остается центром - Message entity и валидация
- **Application** - упрощенный SendMessageUseCase
- **Infrastructure** - реальный AI сервис вместо mock
- **Presentation** - React с AI SDK hooks

#### 3.2 ElysiaJS + AI SDK интеграция

```typescript
// Прямая поддержка стриминга
new Elysia().post("/stream", async ({ body }) => {
  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: body.messages,
  });

  return result.toUIMessageStreamResponse(); // Автоматическая обработка
});
```

### 4. Последовательность реализации

1. **Установить AI SDK зависимости**
2. **Создать VercelAIService** - заменить MockAIService
3. **Упростить SendMessageUseCase** - убрать репозиторий
4. **Обновить контроллер** - использовать `result.toUIMessageStreamResponse()`
5. **Обновить фронтенд** - использовать `useChat` из AI SDK
6. **Удалить лишние файлы** и код
7. **Добавить переменные окружения** - `OPENAI_API_KEY`
8. **Тестирование** стриминга

### 5. Итоговая архитектура

После реализации получится упрощенная, но правильная Clean Architecture:

- **Domain**: Message entity, валидация
- **Application**: SendMessageUseCase с AIService интерфейсом
- **Infrastructure**: VercelAIService, упрощенный контроллер
- **Presentation**: React с useChat из AI SDK

Это сохраняет демонстрацию Clean Architecture принципов, но значительно упрощает код благодаря отличной интеграции ElysiaJS с Vercel AI SDK.

### Развертывание

Проект готов к развертыванию на различных платформах:

- Vercel (рекомендуется для frontend)
- Railway, Fly.io для backend
- Docker контейнеризация
