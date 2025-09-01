# 🚀 Развертывание StyleSync на TimeWeb

## 📋 Подготовка переменных окружения

### 📄 Доступные файлы с настройками:
- **`env-variables.txt`** - все переменные для копирования
- **`timeweb-env-setup.txt`** - готовые настройки для TimeWeb
- **`env.local.txt`** - настройки для локальной разработки

### ⚙️ Параметры приложения:
- **Команда сборки:** `npm run build`
- **Директория сборки:** `dist`
- **Node.js версия:** 18+ (рекомендуется 20)

### 🔧 Переменные окружения:

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=8202127745:AAE6CoOcbJx0vByCUthla6hP-wjJKbzMyB0
TELEGRAM_MINI_APP_URL=https://your-domain.timeweb.cloud

# Application
NODE_ENV=production
VITE_DEV_MODE=false
```

### 📋 Полный список переменных для TimeWeb:

| Переменная | Значение | Описание |
|------------|----------|----------|
| `TELEGRAM_BOT_TOKEN` | `8202127745:AAE6CoOcbJx0vByCUthla6hP-wjJKbzMyB0` | Токен Telegram бота |
| `TELEGRAM_MINI_APP_URL` | `https://your-domain.timeweb.cloud` | URL вашего домена |
| `NODE_ENV` | `production` | Режим работы |
| `VITE_DEV_MODE` | `false` | Отключение режима разработки |

### 🔄 Процесс развертывания:

1. **Загрузите код** из GitHub репозитория
2. **Установите переменные** окружения в панели TimeWeb
3. **Дождитесь сборки** - TimeWeb автоматически выполнит `npm run build`
4. **Проверьте работу** по вашему домену

### 📱 После развертывания:

1. **Обновите Mini App URL** в @BotFather
2. **Проверьте бота** - отправьте `/start`
3. **Тестируйте** приложение в Telegram

### ⚠️ Важные замечания:

- Убедитесь что домен поддерживает HTTPS
- Telegram Mini Apps требуют HTTPS для работы
- Проверьте что все переменные окружения установлены корректно

### 🆘 Troubleshooting:

**Если сборка падает:**
```bash
npm install --legacy-peer-deps
npm run build
```

**Если приложение не загружается:**
- Проверьте переменные окружения
- Убедитесь что домен доступен
- Проверьте логи в панели TimeWeb

**Если бот не работает:**
- Проверьте токен бота
- Убедитесь что TELEGRAM_MINI_APP_URL корректный
- Проверьте логи бота
