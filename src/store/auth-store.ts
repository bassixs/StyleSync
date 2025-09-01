import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Типы для Telegram WebApp
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface User {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  isPremium?: boolean;
  languageCode?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  telegramWebApp: TelegramWebApp | null;
  
  initializeTelegramAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      telegramWebApp: null,

      initializeTelegramAuth: async () => {
        set({ isLoading: true });
        
        try {
          // Проверяем, доступен ли Telegram WebApp
          if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            set({ telegramWebApp: tg });
            
            // Настраиваем WebApp
            tg.ready();
            tg.expand();
            
            // Получаем данные пользователя
            const tgUser = tg.initDataUnsafe.user;
            
            if (tgUser) {
              const user: User = {
                id: tgUser.id,
                firstName: tgUser.first_name,
                lastName: tgUser.last_name,
                username: tgUser.username,
                photoUrl: tgUser.photo_url,
                isPremium: tgUser.is_premium,
                languageCode: tgUser.language_code,
              };
              
              set({
                user,
                isAuthenticated: true,
                isLoading: false
              });
            } else {
              // Если нет данных пользователя, но WebApp доступен
              console.warn('Telegram WebApp доступен, но данные пользователя отсутствуют');
              set({ 
                isAuthenticated: false,
                isLoading: false 
              });
            }
          } else {
            // Если не в Telegram, для разработки создаем фейкового пользователя
            console.warn('Не запущено в Telegram WebApp, используется тестовый пользователь');
            set({
              user: {
                id: 12345,
                firstName: 'Тестовый',
                lastName: 'Пользователь',
                username: 'testuser',
                languageCode: 'ru'
              },
              isAuthenticated: true,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Ошибка инициализации Telegram Auth:', error);
          set({ 
            isLoading: false,
            isAuthenticated: false 
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        
        // Закрываем WebApp при выходе
        if (get().telegramWebApp) {
          get().telegramWebApp?.close();
        }
      },
    }),
    {
      name: 'stylesync-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);