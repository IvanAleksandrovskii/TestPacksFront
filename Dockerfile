# Этап сборки
FROM node:18-alpine as build

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости и проверяем их наличие
RUN npm install && npm list @mui/material || npm install @mui/material @emotion/react @emotion/styled

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап продакшена
FROM nginx:alpine

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 5173
EXPOSE 5173

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]