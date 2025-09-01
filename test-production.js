#!/usr/bin/env node

/**
 * Скрипт для тестирования продакшена локально
 * Запускает собранное приложение на порту 3000
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Тестирование StyleSync в режиме продакшена...\n');

// Установка переменных окружения
process.env.NODE_ENV = 'production';
process.env.VITE_DEV_MODE = 'false';
process.env.TELEGRAM_MINI_APP_URL = 'http://localhost:3000';

console.log('✅ Переменные окружения установлены:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   VITE_DEV_MODE: ${process.env.VITE_DEV_MODE}`);
console.log(`   TELEGRAM_MINI_APP_URL: ${process.env.TELEGRAM_MINI_APP_URL}\n`);

try {
  // Проверка существования папки dist
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    console.log('📦 Папка dist не найдена. Запускаем сборку...');
    execSync('npm run build', { stdio: 'inherit' });
  }

  console.log('🌐 Запуск сервера на порту 3000...');
  console.log('📱 Откройте: http://localhost:3000\n');

  // Запуск preview сервера
  execSync('npm run preview -- --port 3000', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Ошибка при запуске:', error.message);
  process.exit(1);
}
