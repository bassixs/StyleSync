import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Показываем загрузку пока инициализируется Telegram
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="text-center space-y-4">
          <div className="glass-card p-8 rounded-3xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold gradient-text mb-2">StyleSync</h2>
            <p className="text-muted-foreground">Подключаемся к Telegram...</p>
          </div>
        </div>
      </div>
    );
  }

  // Если не авторизован, показываем сообщение о Telegram
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="glass-card p-8 rounded-3xl">
            <div className="premium-card p-6 rounded-2xl mb-6 inline-block">
              <div className="text-4xl mb-2">📱</div>
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-4">Добро пожаловать в StyleSync!</h2>
            <p className="text-muted-foreground mb-6">
              Это приложение работает только в Telegram. Пожалуйста, откройте его через Telegram Bot.
            </p>
            <div className="text-sm text-muted-foreground bg-primary/5 rounded-2xl p-4">
              💡 Найдите @StyleSyncBot в Telegram и запустите мини-приложение
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}