const http = require('http');

http.get('http://localhost:4040/api/tunnels', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const tunnels = JSON.parse(data);
      if (tunnels.tunnels && tunnels.tunnels.length > 0) {
        console.log('Ngrok URL:', tunnels.tunnels[0].public_url);
        console.log('\nОбновите telegram-bot.js с этим URL:');
        console.log(`const MINI_APP_URL = '${tunnels.tunnels[0].public_url}';`);
      } else {
        console.log('Туннели не найдены. Убедитесь, что ngrok запущен: ngrok http 5173');
      }
    } catch (e) {
      console.log('Ошибка получения данных от ngrok');
    }
  });
}).on('error', (err) => {
  console.log('Ngrok не запущен или недоступен');
  console.log('Запустите: ngrok http 5173');
});
