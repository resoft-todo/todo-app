# TODO List API

REST API для управління списками завдань.

## Технології

- Node.js 22
- Express.js
- PostgreSQL
- Prisma ORM
- Docker & Docker Compose
- Swagger для документації API

## Структура проекту 

```plaintext
todoList/
├── prisma/    
│   ├── migrations/     # Міграції бази даних
│   └── schema.prisma   # Моделі бази даних
├── src/
│   ├── controllers/    # Контролери для обробки запитів
│   ├── middlewares/    # Мідлвари для роботи застосунку
│   ├── routes/         # Маршрути API
│   ├── services/       # Бізнес-логіка застосунку
│   ├── swagger/        # Документація Swagger
│   ├── validators/     # Валідація вхідних даних 
│   ├── prisma.js       # Створення PrismaClient
│   └── server.js       # Налаштування серверу застосунку
├── .env.example        # Приклад файлу змінних середовища
├── .gitignore          # Файли, які не слід публікувати в репозиторій
├── docker-compose.yml  # Конфігурація Docker Compose
├── Dockerfile          # Конфігурація Docker
├── package.json        # Залежності та конфігурація npm
└── README.md           # Цей файл
```

## Передумови

- Docker
- Docker Compose

## Встановлення та запуск

1. Клонуйте репозиторій:
```bash
git clone https://github.com/dizzzyy0/todoList.git
cd todoList
```
2. Налаштуйте усі змінні середовища, які написані в файлі .env.example

3. Відкрийте термінал і запустіть команду:
```bash
docker-compose up --build -d
```
#### або
```bash
docker-compose up --build 
```
#### якщо хочете бачити логи.

## Документація API

Swagger документація доступна за адресою: http://localhost:8000/api-docs