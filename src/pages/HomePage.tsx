import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useWardrobeStore } from '@/store/wardrobe-store';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import WardrobeTab from '@/components/WardrobeTab';
import OutfitBuilderTab from '@/components/OutfitBuilderTab';
import OutfitsTab from '@/components/OutfitsTab';
import WardrobeStats from '@/components/WardrobeStats';
import { 
  Sparkles, 
  LogOut, 
  User, 
  Shirt, 
  Palette, 
  Heart,
  Settings,
  Menu,
  PieChart
} from 'lucide-react';

export default function HomePage() {
  const { user, logout, initializeTelegramAuth, isAuthenticated } = useAuthStore();
  const { loadWardrobeItems, loadOutfits } = useWardrobeStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Инициализируем Telegram авторизацию при загрузке
    initializeTelegramAuth();
  }, [initializeTelegramAuth]);

  useEffect(() => {
    // Загружаем данные пользователя после авторизации
    if (isAuthenticated && user) {
      loadWardrobeItems();
      loadOutfits();
    }
  }, [isAuthenticated, user, loadWardrobeItems, loadOutfits]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'До свидания! ✨',
        description: 'Увидимся снова очень скоро',
      });
    } catch (error) {
      toast({
        title: 'Упс! 😔',
        description: 'Что-то пошло не так',
        variant: 'destructive',
      });
    }
  };

  const tabs = [
    {
      id: 'wardrobe',
      label: 'Гардероб',
      icon: Shirt,
      component: WardrobeTab
    },
    {
      id: 'builder',
      label: 'Образы',
      icon: Palette,
      component: OutfitBuilderTab
    },
    {
      id: 'outfits',
      label: 'Избранное',
      icon: Heart,
      component: OutfitsTab
    },
    {
      id: 'stats',
      label: 'Статистика',
      icon: PieChart,
      component: WardrobeStats
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Анимированный фон */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(267,57%,78%,0.15)_0%,transparent_50%)] -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(340,75%,85%,0.15)_0%,transparent_50%)] -z-10" />

        {/* Премиальный заголовок */}
        <header className="safe-area-top sticky top-0 z-40 glass-card border-0 border-b border-glass-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="premium-card p-3 rounded-2xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">StyleSync</h1>
                  <p className="text-sm text-muted-foreground">Твой персональный стилист</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="touch-target p-2 rounded-full hover:bg-primary/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Выпадающее меню */}
            {showMenu && (
              <div className="absolute top-full right-4 mt-2 glass-card rounded-2xl p-4 min-w-[200px] fade-in">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-glass-border">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{user?.username || `user${user?.id}`}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm py-3 px-2"
                  onClick={() => setShowMenu(false)}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Настройки
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-sm py-3 px-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Выйти
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Основной контент */}
        <main className="px-6 pt-8 pb-24">
          <div className="fade-in">
            {tabs.map((tab) => {
              const TabComponent = tab.component;
              return activeTab === tab.id ? (
                <div key={tab.id} className="fade-in">
                  <TabComponent />
                </div>
              ) : null;
            })}
          </div>
        </main>

        {/* Премиальная мобильная навигация */}
        <nav className="mobile-nav glass-card border-0 border-t border-glass-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      touch-target flex flex-col items-center space-y-1 premium-transition
                      ${isActive 
                        ? 'text-primary scale-110' 
                        : 'text-muted-foreground hover:text-primary'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-2xl premium-transition
                      ${isActive 
                        ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg' 
                        : 'hover:bg-primary/10'
                      }
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Overlay для закрытия меню */}
        {showMenu && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
} 