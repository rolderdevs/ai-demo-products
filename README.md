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
│   ├── entities/          # Сущности (Message, Chat, User)
│   └── repositories/      # Интерфейсы репозиториев
├── application/           # Application Layer - Сценарии использования
│   └── use-cases/        # Use Cases (SendMessage, GetChat)
├── infrastructure/        # Infrastructure Layer - Внешние зависимости
│   ├── repositories/     # Реализации репозиториев
│   ├── services/         # Внешние сервисы (AI Service)
│   └── controllers/      # HTTP контроллеры (ElysiaJS)
├── presentation/          # Presentation Layer - UI компоненты
│   ├── components/       # React компоненты (shadcn/ui)
│   └── hooks/           # Custom React hooks
└── main.ts              # Точка входа и Dependency Injection
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

### План поэтапной разработки

Clean Architecture позволяет разрабатывать приложение поэтапно, тестируя каждый слой независимо:

#### Этап 1: Domain Foundation

**Цель**: Определить основные сущности и контракты

- [x] Создать интерфейсы Message и Chat в `src/domain/entities/`
- [x] Определить интерфейс ChatRepository в `src/domain/repositories/`

**Результат**: ✅ Типы готовы, можно писать остальные слои

#### Этап 2: Application Core

**Цель**: Реализовать основную бизнес-логику

- [x] Создать SendMessageUseCase в `src/application/use-cases/`
- [x] Добавить базовую логику обработки сообщений

**Результат**: ✅ Бизнес-логика готова, можно тестировать изолированно

#### Этап 3: Infrastructure Mocks

**Цель**: Создать заглушки для быстрого тестирования

- [x] Реализовать MockChatRepository с захардкоженными данными
- [x] Создать MockAIService возвращающий тестовые ответы
- [x] Настроить dependency injection в main.ts

**Результат**: ✅ Можно тестировать use cases end-to-end

#### Этап 4: Minimal API

**Цель**: HTTP endpoints для тестирования через API

- [x] Создать ChatController с базовыми эндпоинтами
- [x] Настроить ElysiaJS сервер
- [x] Добавить обработку ошибок

**Результат**: ✅ Можно тестировать через curl/Postman

#### Этап 5: Basic UI

**Цель**: Простейший пользовательский интерфейс

- [x] Создать базовый React компонент чата
- [x] Добавить useChat hook для API взаимодействия
- [x] Реализовать отправку и отображение сообщений

**Результат**: ✅ Рабочий чат в браузере

#### Этап 6: Production Ready

**Цель**: Замена моков на реальные интеграции

##### 6a. Real AI Integration

- [ ] Заменить MockAIService на VercelAIService
- [ ] Настроить интеграцию с выбранным LLM провайдером
- [ ] Добавить обработку streaming ответов

##### 6b. Persistent Storage

- [ ] Реализовать FileSystemChatRepository или DatabaseChatRepository
- [ ] Добавить миграции и схему данных
- [ ] Настроить connection pooling (если БД)

##### 6c. UI Polish

- [ ] Интегрировать shadcn/ui компоненты
- [ ] Добавить адаптивный дизайн
- [ ] Реализовать loading states и error handling

**Результат**: Production-ready чат приложение

### Развертывание

Проект готов к развертыванию на различных платформах:

- Vercel (рекомендуется для frontend)
- Railway, Fly.io для backend
- Docker контейнеризация
