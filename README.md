# URL Shortener | Сервис сокращения ссылок

<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/DKeken/url-shorter)
![GitHub issues](https://img.shields.io/github/issues/DKeken/url-shorter)
![GitHub stars](https://img.shields.io/github/stars/DKeken/url-shorter)
![GitHub license](https://img.shields.io/github/license/DKeken/url-shorter)

[English](#english) | [Русский](README.ru.md)

</div>

<a id="english"></a>

## 🌐 URL Shortener

A monorepo project for creating short links with visit analytics.

### 🚀 Technologies

**Frontend**

- Next.js 15
- React 19
- Tailwind CSS
- Zustand
- React Hook Form + Zod

**Backend**

- NestJS 11
- Drizzle ORM
- PostgreSQL
- KeyDB (Redis fork)
- Swagger

### 📁 Project Structure

```
├── apps/
│   ├── backend/       # NestJS application
│   └── frontend/      # Next.js application
├── packages/
│   ├── database/      # Shared package with Drizzle ORM
│   ├── eslint-config/ # ESLint configs
│   └── typescript-config/ # TypeScript configs
```

### ✨ Features

- Create short links
- Custom aliases
- Visit analytics
- QR codes for links
- Link expiration settings

### 🏁 Getting Started

```bash
# Launch all components via Docker
docker-compose up

# Development
bun install
bun run dev
```

### 🔌 Ports

- Frontend: http://localhost:3000
- Backend: http://localhost:3333
- PostgreSQL: localhost:5432
- KeyDB: localhost:6379

### ⚙️ Environment Setup

Before launching the project, create environment variable files:

```bash
# Copy .env.example files to .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
cp packages/database/.env.example packages/database/.env
```

After copying, configure the variables according to your environment.
