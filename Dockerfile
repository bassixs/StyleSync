# Использовать Node.js 20 LTS
FROM node:20-alpine

# Установить рабочую директорию
WORKDIR /app

# Скопировать package.json и package-lock.json
COPY package*.json ./

# Установить зависимости
RUN npm ci --only=production

# Скопировать исходный код
COPY . .

# Собрать приложение
RUN npm run build

# Экспонировать порт
EXPOSE 3000

# Запустить приложение
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
