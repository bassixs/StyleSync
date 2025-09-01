import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useWardrobeStore, Outfit } from '@/store/wardrobe-store';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  HeartOff, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Sparkles,
  Star,
  MoreHorizontal,
  Eye,
  Loader2
} from 'lucide-react';

const OCCASIONS = [
  { value: 'casual', label: 'Повседневный', emoji: '👕' },
  { value: 'work', label: 'Работа', emoji: '💼' },
  { value: 'formal', label: 'Официальный', emoji: '🤵' },
  { value: 'date', label: 'Свидание', emoji: '💕' },
  { value: 'party', label: 'Вечеринка', emoji: '🎉' },
  { value: 'sport', label: 'Спорт', emoji: '🏃' },
  { value: 'travel', label: 'Путешествие', emoji: '✈️' }
];

export default function OutfitsTab() {
  const { outfits, wardrobeItems, isLoading, toggleFavoriteOutfit, deleteOutfit } = useWardrobeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [favoriteFilter, setFavoriteFilter] = useState<boolean | null>(null);

  const handleToggleFavorite = async (outfit: Outfit) => {
    if (!user) return;
    
    try {
      const currentFavorite = outfit.favorite === 'true';
      await toggleFavoriteOutfit(outfit._id, user.id.toString(), !currentFavorite);
      toast({
        title: currentFavorite ? '💔 Убрано из избранного' : '❤️ Добавлено в избранное',
        description: `"${outfit.name}" ${currentFavorite ? 'убран из' : 'добавлен в'} избранное`,
      });
    } catch (error) {
      toast({
        title: '😔 Ошибка',
        description: 'Не удалось обновить избранное',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteOutfit = async (outfit: Outfit) => {
    if (!user) return;
    
    try {
      await deleteOutfit(outfit._id, user.id.toString());
      toast({
        title: '🗑️ Образ удален',
        description: `"${outfit.name}" удален из коллекции`,
      });
    } catch (error) {
      toast({
        title: '😔 Ошибка',
        description: 'Не удалось удалить образ',
        variant: 'destructive',
      });
    }
  };

  // Получение вещей образа
  const getOutfitItems = (outfit: Outfit) => {
    try {
      const itemIds = JSON.parse(outfit.item_ids);
      return itemIds.map((itemId: string) => 
        wardrobeItems.find(item => item._id === itemId)
      ).filter(Boolean);
    } catch {
      return [];
    }
  };

  // Фильтрация образов
  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = outfit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outfit.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOccasion = occasionFilter === 'all' || outfit.occasion === occasionFilter;
    
    const matchesFavorite = favoriteFilter === null || (outfit.favorite === 'true') === favoriteFilter;
    
    return matchesSearch && matchesOccasion && matchesFavorite;
  });

  const favoriteOutfits = outfits.filter(outfit => outfit.favorite === 'true');
  const recentOutfits = outfits.slice(0, 3);

  const getOccasionInfo = (occasionValue: string) => {
    return OCCASIONS.find(occ => occ.value === occasionValue) || { emoji: '👔', label: occasionValue };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="space-y-8">
      {/* Премиальный заголовок */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 glass-card p-4 rounded-2xl">
          <div className="premium-card p-3 rounded-xl">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Мои образы</h1>
            <p className="text-muted-foreground">
              {outfits.length} {outfits.length === 1 ? 'образ' : outfits.length < 5 ? 'образа' : 'образов'} • {favoriteOutfits.length} в избранном
            </p>
          </div>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-4">
        <div className="glass-card p-4 rounded-2xl space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Найти образ по названию или заметкам..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base bg-background/50 border-0 rounded-xl"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={favoriteFilter === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFavoriteFilter(null)}
              className="rounded-full h-9"
            >
              🌟 Все
            </Button>
            <Button
              variant={favoriteFilter === true ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFavoriteFilter(true)}
              className="rounded-full h-9"
            >
              ❤️ Избранные
            </Button>
            <Button
              variant={occasionFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOccasionFilter('all')}
              className="rounded-full h-9"
            >
              🎯 Все поводы
            </Button>
            {OCCASIONS.map(occasion => (
              <Button
                key={occasion.value}
                variant={occasionFilter === occasion.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOccasionFilter(occasion.value)}
                className="rounded-full h-9"
              >
                {occasion.emoji} {occasion.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Быстрые категории */}
      {favoriteOutfits.length > 0 && favoriteFilter === null && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Избранные образы</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteOutfits.slice(0, 3).map((outfit) => {
              const items = getOutfitItems(outfit);
              const occasionInfo = getOccasionInfo(outfit.occasion);
              
              return (
                <Card key={outfit._id} className="glass-card border-0 overflow-hidden group premium-hover premium-transition">
                  <CardContent className="p-0">
                    {/* Превью образа */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                      {items.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1 h-full p-2">
                          {items.slice(0, 4).map((item, index) => (
                            <div key={item?._id || index} className="bg-background/50 rounded-lg overflow-hidden">
                              {item && (
                                <img 
                                  src={item.image_url} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Sparkles className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      
                      {/* Избранное */}
                      {outfit.favorite === 'true' && (
                        <div className="absolute top-3 right-3">
                          <Heart className="h-5 w-5 text-red-500 fill-current" />
                        </div>
                      )}
                    </div>
                    
                    {/* Информация */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-base truncate">{outfit.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <Badge className="bg-primary/10 text-primary border-0 rounded-full text-xs">
                            {occasionInfo.emoji} {occasionInfo.label}
                          </Badge>
                          {outfit.date && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(outfit.date)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {outfit.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {outfit.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Все образы */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {favoriteFilter === true ? 'Избранные образы' : 'Все образы'}
        </h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Загружаем ваши образы...</p>
            </div>
          </div>
        ) : filteredOutfits.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="glass-card p-8 rounded-3xl inline-block">
              <Heart className="h-16 w-16 text-primary/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {outfits.length === 0 ? 'Пока нет образов' : 'Ничего не найдено'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {outfits.length === 0 
                  ? 'Создайте свой первый образ в разделе "Создать образ"'
                  : 'Попробуйте изменить поисковый запрос или фильтры'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOutfits.map((outfit) => {
              const items = getOutfitItems(outfit);
              const occasionInfo = getOccasionInfo(outfit.occasion);
              
              return (
                <Card key={outfit._id} className="glass-card border-0 overflow-hidden group premium-hover premium-transition">
                  <CardContent className="p-0">
                    {/* Превью образа */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                      {items.length > 0 ? (
                        <div className={`grid gap-1 h-full p-2 ${
                          items.length === 1 ? 'grid-cols-1' :
                          items.length === 2 ? 'grid-cols-2' :
                          items.length === 3 ? 'grid-cols-3' :
                          'grid-cols-2'
                        }`}>
                          {items.slice(0, 4).map((item, index) => (
                            <div key={item?._id || index} className="bg-background/50 rounded-lg overflow-hidden">
                              {item && (
                                <img 
                                  src={item.image_url} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Sparkles className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      
                      {/* Действия */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 premium-transition flex items-center justify-center">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleToggleFavorite(outfit)}
                            className="rounded-full w-10 h-10 p-0"
                          >
                            {outfit.favorite === 'true' ? (
                              <Heart className="h-4 w-4 fill-current text-red-500" />
                            ) : (
                              <HeartOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteOutfit(outfit)}
                            className="rounded-full w-10 h-10 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Избранное индикатор */}
                      {outfit.favorite === 'true' && (
                        <div className="absolute top-3 right-3">
                          <Heart className="h-5 w-5 text-red-500 fill-current" />
                        </div>
                      )}
                    </div>
                    
                    {/* Информация */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-base truncate">{outfit.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <Badge className="bg-primary/10 text-primary border-0 rounded-full text-xs">
                            {occasionInfo.emoji} {occasionInfo.label}
                          </Badge>
                          {outfit.date && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(outfit.date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {outfit.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {outfit.notes}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{items.length} {items.length === 1 ? 'вещь' : items.length < 5 ? 'вещи' : 'вещей'}</span>
                        <div className="flex -space-x-1">
                          {items.slice(0, 3).map((item, index) => (
                            <div 
                              key={item?._id || index}
                              className="w-6 h-6 rounded-full border-2 border-background overflow-hidden bg-primary/10"
                            >
                              {item && (
                                <img 
                                  src={item.image_url} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                          {items.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-xs font-medium">
                              +{items.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}