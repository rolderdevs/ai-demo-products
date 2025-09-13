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

### Развертывание

Проект готов к развертыванию на различных платформах:

- Vercel (рекомендуется для frontend)
- Railway, Fly.io для backend
- Docker контейнеризация
