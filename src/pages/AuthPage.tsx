import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { Sparkles, MessageCircle, Shield } from 'lucide-react';

export default function AuthPage() {
  const { initializeTelegramAuth, isLoading } = useAuthStore();

  const handleInitAuth = () => {
    initializeTelegramAuth();
  };

  return (
    <div className="min-h-screen relative overflow-hidden safe-area-top">
      {/* Анимированный фон */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(267,57%,78%,0.15)_0%,transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(340,75%,85%,0.15)_0%,transparent_50%)] -z-10" />
      
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 fade-in">
          {/* Премиальный заголовок */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-4 glass-card p-6 rounded-3xl">
              <div className="premium-card p-4 rounded-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">StyleSync</h1>
                <p className="text-muted-foreground mt-1">
                  Ваш персональный стилист
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                Добро пожаловать в Telegram! ⚡
              </h2>
              <p className="text-muted-foreground">
                StyleSync работает как Telegram Mini App
              </p>
            </div>
          </div>

          {/* Информация о Telegram аутентификации */}
          <Card className="glass-card border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Аутентификация через Telegram</h3>
                <p className="text-sm text-muted-foreground">
                  Для полноценной работы приложения откройте StyleSync через Telegram бота
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleInitAuth}
                  size="lg"
                  className="w-full h-14 text-base font-semibold rounded-2xl premium-hover premium-transition" 
                  disabled={isLoading}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Попробовать подключиться
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Если вы не используете Telegram, некоторые функции могут быть недоступны
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Инструкции */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Как начать использовать?</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="glass-card p-4 rounded-2xl flex items-start space-x-4">
                <div className="premium-card p-3 rounded-xl flex-shrink-0">
                  <span className="text-xl">1️⃣</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">Найдите бота</h4>
                  <p className="text-xs text-muted-foreground">Откройте @StyleSyncBot в Telegram</p>
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-2xl flex items-start space-x-4">
                <div className="premium-card p-3 rounded-xl flex-shrink-0">
                  <span className="text-xl">2️⃣</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">Запустите приложение</h4>
                  <p className="text-xs text-muted-foreground">Нажмите кнопку "Открыть StyleSync" в боте</p>
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-2xl flex items-start space-x-4">
                <div className="premium-card p-3 rounded-xl flex-shrink-0">
                  <span className="text-xl">3️⃣</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">Создавайте образы</h4>
                  <p className="text-xs text-muted-foreground">Загружайте одежду и комбинируйте стильные наряды</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}