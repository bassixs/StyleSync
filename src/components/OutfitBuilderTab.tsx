import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWardrobeStore, WardrobeItem } from '@/store/wardrobe-store';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Plus, 
  X, 
  Palette, 
  Sparkles,
  Heart,
  Calendar,
  MessageCircle,
  Filter,
  Shirt,
  RefreshCw,
  Check
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

const CATEGORY_NAMES = {
  top: 'Верх',
  bottom: 'Низ', 
  dress: 'Платья',
  outerwear: 'Верхняя одежда',
  shoes: 'Обувь',
  accessories: 'Аксессуары'
};

export default function OutfitBuilderTab() {
  const { wardrobeItems, saveOutfit } = useWardrobeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [selectedItems, setSelectedItems] = useState<WardrobeItem[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [outfitData, setOutfitData] = useState({
    name: '',
    occasion: 'casual',
    date: '',
    notes: ''
  });

  // Группировка вещей по категориям
  const itemsByCategory = wardrobeItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, WardrobeItem[]>);

  const filteredItems = categoryFilter === 'all' 
    ? wardrobeItems 
    : wardrobeItems.filter(item => item.category === categoryFilter);

  const handleSelectItem = (item: WardrobeItem) => {
    setSelectedItems(prev => {
      const isAlreadySelected = prev.some(selected => selected._id === item._id);
      if (isAlreadySelected) {
        return prev.filter(selected => selected._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item._id !== itemId));
  };

  const generateOutfitName = () => {
    if (selectedItems.length === 0) return '';
    
    const topItem = selectedItems.find(item => item.category === 'top' || item.category === 'dress');
    const occasion = OCCASIONS.find(occ => occ.value === outfitData.occasion)?.label || 'Образ';
    
    if (topItem) {
      return `${topItem.color} ${topItem.name} - ${occasion}`;
    } else {
      return `${occasion} образ`;
    }
  };

  const clearOutfit = () => {
    setSelectedItems([]);
    setOutfitData({
      name: '',
      occasion: 'casual',
      date: '',
      notes: ''
    });
  };

  const handleSaveOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || selectedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const itemIds = selectedItems.map(item => item._id);
      const name = outfitData.name || generateOutfitName();
      
      await saveOutfit({
        name,
        item_ids: JSON.stringify(itemIds),
        occasion: outfitData.occasion,
        date: outfitData.date,
        notes: outfitData.notes,
        favorite: 'false'
      });

      toast({
        title: '🎉 Образ сохранен!',
        description: `"${name}" добавлен в вашу коллекцию`,
      });

      clearOutfit();
      setIsSaveDialogOpen(false);
    } catch (error) {
      toast({
        title: '😔 Что-то пошло не так',
        description: 'Не удалось сохранить образ. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestRandomOutfit = () => {
    if (wardrobeItems.length < 2) {
      toast({
        title: '🤔 Мало вещей',
        description: 'Добавьте больше вещей в гардероб для создания образов',
      });
      return;
    }

    const categories = Object.keys(itemsByCategory);
    const selectedCategories = categories.filter(() => Math.random() > 0.5).slice(0, 3);
    
    const newSelection: WardrobeItem[] = [];
    selectedCategories.forEach(category => {
      const items = itemsByCategory[category];
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        newSelection.push(randomItem);
      }
    });

    if (newSelection.length > 0) {
      setSelectedItems(newSelection);
      toast({
        title: '✨ Случайный образ!',
        description: 'Попробовали создать что-то новое для вас',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Премиальный заголовок */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 glass-card p-4 rounded-2xl">
          <div className="premium-card p-3 rounded-xl">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Создать образ</h1>
            <p className="text-muted-foreground">
              Соберите идеальный наряд из вашего гардероба
            </p>
          </div>
        </div>
      </div>

      {/* Область сборки образа */}
      <div className="glass-card p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Ваш образ</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={suggestRandomOutfit}
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Случайный
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearOutfit}
              disabled={selectedItems.length === 0}
              className="rounded-full"
            >
              <X className="h-4 w-4 mr-2" />
              Очистить
            </Button>
          </div>
        </div>

        {selectedItems.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Sparkles className="h-16 w-16 text-primary/40 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Начните собирать образ
              </h3>
              <p className="text-sm text-muted-foreground">
                Выберите вещи из гардероба ниже, чтобы создать стильный образ
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Визуализация образа */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedItems.map((item, index) => (
                <Card key={item._id} className="glass-card border-0 overflow-hidden group premium-hover premium-transition">
                  <CardContent className="p-0">
                    <div className="clothing-item">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Кнопка удаления */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 premium-transition">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(item._id)}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Номер позиции */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white border-0 rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.color}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Кнопка сохранения */}
            <div className="flex justify-center">
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="premium-hover premium-transition rounded-2xl h-14 px-8 text-base font-semibold"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Сохранить образ
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-lg glass-card border-0 rounded-3xl p-8">
                  <DialogHeader className="text-center pb-6">
                    <DialogTitle className="text-2xl gradient-text">Сохранить образ</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSaveOutfit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">Название образа</Label>
                      <Input
                        id="name"
                        value={outfitData.name}
                        onChange={(e) => setOutfitData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={generateOutfitName() || "Мой стильный образ"}
                        className="h-12 rounded-xl border-0 bg-background/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-base">Повод</Label>
                        <Select
                          value={outfitData.occasion}
                          onValueChange={(value) => setOutfitData(prev => ({ ...prev, occasion: value }))}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-0 bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {OCCASIONS.map(occasion => (
                              <SelectItem key={occasion.value} value={occasion.value}>
                                {occasion.emoji} {occasion.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-base">Дата</Label>
                        <Input
                          id="date"
                          type="date"
                          value={outfitData.date}
                          onChange={(e) => setOutfitData(prev => ({ ...prev, date: e.target.value }))}
                          className="h-12 rounded-xl border-0 bg-background/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-base">Заметки</Label>
                      <Textarea
                        id="notes"
                        value={outfitData.notes}
                        onChange={(e) => setOutfitData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Особые случаи, сочетания, идеи..."
                        className="min-h-[100px] rounded-xl border-0 bg-background/50 resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full h-14 rounded-2xl text-base font-semibold premium-hover premium-transition" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                          Сохраняем...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-5 w-5" />
                          Сохранить в коллекцию
                        </>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>

      {/* Фильтр по категориям */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
            className="rounded-full h-9"
          >
            🌈 Все
          </Button>
          {Object.keys(itemsByCategory).map(category => {
            const count = itemsByCategory[category].length;
            return (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className="rounded-full h-9"
              >
                {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Гардероб для выбора */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Выберите вещи</h2>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="glass-card p-8 rounded-3xl inline-block">
              <Shirt className="h-16 w-16 text-primary/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Пустой гардероб</h3>
              <p className="text-muted-foreground">
                Добавьте вещи в гардероб, чтобы создавать образы
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.some(selected => selected._id === item._id);
              
              return (
                <Card 
                  key={item._id} 
                  className={`
                    glass-card border-0 overflow-hidden cursor-pointer premium-hover premium-transition
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  onClick={() => handleSelectItem(item)}
                >
                  <CardContent className="p-0">
                    <div className="clothing-item">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Индикатор выбора */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <Check className="h-5 w-5" />
                          </div>
                        </div>
                      )}
                      
                      {/* Категория */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-black/50 text-white border-0 rounded-full text-xs">
                          {CATEGORY_NAMES[item.category as keyof typeof CATEGORY_NAMES]}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.color}</p>
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