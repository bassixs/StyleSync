/**
 * StyleSync Telegram Bot
 * 
 * Этот файл содержит пример кода для Telegram бота, который запускает StyleSync Mini App
 * 
 * Для запуска бота:
 * 1. Создайте бота через @BotFather в Telegram
 * 2. Получите токен бота
 * 3. Настройте Mini App через @BotFather
 * 4. Установите зависимости: npm install node-telegram-bot-api
 * 5. Запустите: node telegram-bot.js
 */

const TelegramBot = require('node-telegram-bot-api');

// Токен StyleSyncs_bot
const BOT_TOKEN = '8202127745:AAE6CoOcbJx0vByCUthla6hP-wjJKbzMyB0';

// URL StyleSync Mini App
const MINI_APP_URL = process.env.TELEGRAM_MINI_APP_URL || 'https://bassixs-stylesync-50b5.twc1.net';

// Создание экземпляра бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Пользователь';

  // Создаем клавиатуру с кнопкой для запуска Mini App
  const keyboard = {
    inline_keyboard: [[
      {
        text: '✨ Открыть StyleSync',
        web_app: { url: MINI_APP_URL }
      }
    ]]
  };

  // Отправляем приветственное сообщение
  bot.sendMessage(chatId, 
    `Привет, ${firstName}! 👋\n\n` +
    `Добро пожаловать в StyleSync - твой персональный стилист! 💫\n\n` +
    `С StyleSync ты можешь:\n` +
    `👗 Создать цифровой гардероб\n` +
    `🎨 Собирать стильные образы\n` +
    `💝 Сохранять любимые комбинации\n` +
    `📊 Анализировать свой стиль\n\n` +
    `Нажми кнопку ниже, чтобы начать!`,
    {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    }
  );
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId,
    `📱 <b>Как пользоваться StyleSync:</b>\n\n` +
    `1. Нажми "Открыть StyleSync" в боте\n` +
    `2. Загружай фото своей одежды в гардероб\n` +
    `3. Создавай образы, комбинируя вещи\n` +
    `4. Сохраняй понравившиеся образы\n` +
    `5. Смотри статистику своего стиля\n\n` +
    `💡 <b>Совет:</b> На iPhone удерживай фото в галерее и выбери "Копировать объект" - так фон удалится автоматически!\n\n` +
    `Вопросы? Пиши @support_username`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          {
            text: '✨ Открыть StyleSync',
            web_app: { url: MINI_APP_URL }
          }
        ]]
      }
    }
  );
});

// Обработчик команды /settings
bot.onText(/\/settings/, (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '👤 Профиль', callback_data: 'profile' },
        { text: '🔔 Уведомления', callback_data: 'notifications' }
      ],
      [
        { text: '🎨 Открыть StyleSync', web_app: { url: MINI_APP_URL } }
      ]
    ]
  };

  bot.sendMessage(chatId,
    `⚙️ <b>Настройки StyleSync</b>\n\n` +
    `Выберите нужный раздел:`,
    {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    }
  );
});

// Обработчик callback кнопок
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = message.chat.id;

  switch (data) {
    case 'profile':
      bot.editMessageText(
        `👤 <b>Информация о профиле</b>\n\n` +
        `ID: ${callbackQuery.from.id}\n` +
        `Имя: ${callbackQuery.from.first_name || 'Не указано'}\n` +
        `Username: @${callbackQuery.from.username || 'Не указан'}\n\n` +
        `Для изменения данных откройте приложение.`,
        {
          chat_id: chatId,
          message_id: message.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔄 Назад', callback_data: 'back_to_settings' },
              { text: '🎨 Открыть StyleSync', web_app: { url: MINI_APP_URL } }
            ]]
          }
        }
      );
      break;

    case 'notifications':
      bot.editMessageText(
        `🔔 <b>Настройки уведомлений</b>\n\n` +
        `Здесь вы сможете настроить:\n` +
        `• Напоминания о создании образов\n` +
        `• Уведомления о новых функциях\n` +
        `• Еженедельный анализ стиля\n\n` +
        `<i>Функция будет доступна в следующих обновлениях.</i>`,
        {
          chat_id: chatId,
          message_id: message.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔄 Назад', callback_data: 'back_to_settings' }
            ]]
          }
        }
      );
      break;

    case 'back_to_settings':
      // Повторно отправляем меню настроек
      bot.editMessageText(
        `⚙️ <b>Настройки StyleSync</b>\n\n` +
        `Выберите нужный раздел:`,
        {
          chat_id: chatId,
          message_id: message.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '👤 Профиль', callback_data: 'profile' },
                { text: '🔔 Уведомления', callback_data: 'notifications' }
              ],
              [
                { text: '🎨 Открыть StyleSync', web_app: { url: MINI_APP_URL } }
              ]
            ]
          }
        }
      );
      break;
  }

  // Подтверждаем обработку callback
  bot.answerCallbackQuery(callbackQuery.id);
});

// Обработчик текстовых сообщений
bot.on('message', (msg) => {
  // Игнорируем команды (они обрабатываются отдельно)
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  const chatId = msg.chat.id;
  
  // Отвечаем на произвольные сообщения
  bot.sendMessage(chatId,
    `Привет! 👋 Я StyleSync бот.\n\n` +
    `Используй команды:\n` +
    `/start - Начать работу\n` +
    `/help - Помощь\n` +
    `/settings - Настройки\n\n` +
    `Или сразу открывай приложение! 👇`,
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '✨ Открыть StyleSync',
            web_app: { url: MINI_APP_URL }
          }
        ]]
      }
    }
  );
});

// Обработка ошибок
bot.on('error', (error) => {
  console.log('Ошибка бота:', error);
});

// Обработка webhook ошибок
bot.on('webhook_error', (error) => {
  console.log('Webhook ошибка:', error);
});

console.log('🤖 StyleSync Telegram Bot запущен!');
console.log('📱 Найдите бота в Telegram и напишите /start');

// Экспортируем бота для возможного использования в других файлах
module.exports = bot;