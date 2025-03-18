# Сервис сокращения ссылок

<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/DKeken/url-shorter)
![GitHub issues](https://img.shields.io/github/issues/DKeken/url-shorter)
![GitHub stars](https://img.shields.io/github/stars/DKeken/url-shorter)
![GitHub license](https://img.shields.io/github/license/DKeken/url-shorter)

[English](README.md#english) | [Русский](README.ru.md)

</div>

## 🌐 Сервис сокращения ссылок

Монорепозиторий для создания коротких ссылок с аналитикой посещений.

### 🚀 Технологии

**Фронтенд**

- Next.js 15
- React 19
- Tailwind CSS
- Zustand
- React Hook Form + Zod

**Бэкенд**

- NestJS 11
- Drizzle ORM
- PostgreSQL
- KeyDB (форк Redis)
- Swagger

### 📁 Структура проекта

```
├── apps/
│   ├── backend/       # NestJS приложение
│   └── frontend/      # Next.js приложение
├── packages/
│   ├── database/      # Общий пакет с Drizzle ORM
│   ├── eslint-config/ # Конфиги ESLint
│   └── typescript-config/ # Конфиги TypeScript
```

### ✨ Функциональность

- Создание коротких ссылок
- Собственные алиасы
- Статистика переходов
- QR-коды для ссылок
- Срок действия ссылок

### 🏁 Запуск проекта

```bash
# Запуск всех компонентов через Docker
docker-compose up

# Разработка
bun install
bun run dev
```

### 🔌 Порты

- Фронтенд: http://localhost:3000
- Бэкенд: http://localhost:3333
- PostgreSQL: localhost:5432
- KeyDB: localhost:6379

### ⚙️ Настройка окружения

Перед запуском проекта необходимо создать файлы с переменными окружения:

```bash
# Копирование файлов .env.example в .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
cp packages/database/.env.example packages/database/.env
```

После копирования настройте переменные в соответствии с вашим окружением.
