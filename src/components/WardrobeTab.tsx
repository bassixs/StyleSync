import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWardrobeStore, WardrobeItem } from '@/store/wardrobe-store';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Loader2, 
  Search, 
  Filter, 
  Camera,
  Sparkles,
  Heart,
  Tag,
  Palette,
  X,
  MoreHorizontal
} from 'lucide-react';
import { upload } from '@devvai/devv-code-backend';

const CATEGORIES = [
  { value: 'top', label: 'Верх', emoji: '👚' },
  { value: 'bottom', label: 'Низ', emoji: '👖' },
  { value: 'dress', label: 'Платья', emoji: '👗' },
  { value: 'outerwear', label: 'Верхняя одежда', emoji: '🧥' },
  { value: 'shoes', label: 'Обувь', emoji: '👠' },
  { value: 'accessories', label: 'Аксессуары', emoji: '👜' }
];

const SEASONS = [
  { value: 'all', label: 'Все сезоны', emoji: '🌈' },
  { value: 'spring', label: 'Весна', emoji: '🌸' },
  { value: 'summer', label: 'Лето', emoji: '☀️' },
  { value: 'fall', label: 'Осень', emoji: '🍂' },
  { value: 'winter', label: 'Зима', emoji: '❄️' }
];

const COLORS = [
  { value: 'белый', color: '#FFFFFF', border: '#E5E7EB' },
  { value: 'чёрный', color: '#000000' },
  { value: 'серый', color: '#6B7280' },
  { value: 'красный', color: '#EF4444' },
  { value: 'розовый', color: '#EC4899' },
  { value: 'синий', color: '#3B82F6' },
  { value: 'зелёный', color: '#10B981' },
  { value: 'жёлтый', color: '#F59E0B' },
  { value: 'фиолетовый', color: '#8B5CF6' },
  { value: 'коричневый', color: '#A3530D' },
];

export default function WardrobeTab() {
  const { wardrobeItems, isLoading, addWardrobeItem, deleteWardrobeItem } = useWardrobeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '' as WardrobeItem['category'],
    color: '',
    brand: '',
    season: 'all' as WardrobeItem['season'],
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      setIsUploading(true);
      try {
        const result = await upload.uploadFile(file);
        
        if (upload.isErrorResponse(result)) {
          throw new Error(result.errMsg);
        }
        
        setUploadedImageUrl(result.link || '');
        
        toast({
          title: '✨ Отлично!',
          description: 'Фото загружено, теперь добавьте детали',
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: '😔 Что-то пошло не так',
          description: 'Попробуйте загрузить фото еще раз',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    } else {
      toast({
        title: '🤔 Неверный формат',
        description: 'Выберите изображение (JPG, PNG)',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '' as WardrobeItem['category'],
      color: '',
      brand: '',
      season: 'all' as WardrobeItem['season'],
      tags: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadedImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name || !formData.category || !uploadedImageUrl) return;

    setIsSubmitting(true);
    try {
      const newItem: Omit<WardrobeItem, '_id' | '_uid' | 'created_at'> = {
        name: formData.name,
        category: formData.category,
        color: formData.color,
        image_url: uploadedImageUrl,
        brand: formData.brand,
        season: formData.season,
        tags: formData.tags,
      };

      await addWardrobeItem(newItem, null);
      
      toast({
        title: '🎉 Готово!',
        description: `${formData.name} добавлен в ваш гардероб`,
      });
      
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: '😔 Упс!',
        description: 'Не удалось добавить вещь. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: WardrobeItem) => {
    if (!user) return;
    
    try {
      await deleteWardrobeItem(item._id, user.id.toString());
      toast({
        title: '✅ Удалено',
        description: `${item.name} убран из гардероба`,
      });
    } catch (error) {
      toast({
        title: '😔 Ошибка',
        description: 'Не удалось удалить вещь',
        variant: 'destructive',
      });
    }
  };

  // Filter items
  const filteredItems = wardrobeItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         item.tags.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find(cat => cat.value === category) || { emoji: '👔', label: category };
  };

  return (
    <div className="space-y-8">
      {/* Премиальный заголовок */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 glass-card p-4 rounded-2xl">
          <div className="premium-card p-3 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Мой гардероб</h1>
            <p className="text-muted-foreground">
              {wardrobeItems.length} {wardrobeItems.length === 1 ? 'вещь' : wardrobeItems.length < 5 ? 'вещи' : 'вещей'} в коллекции
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
              placeholder="Найти вещь по названию, цвету, бренду..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base bg-background/50 border-0 rounded-xl"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
              className="rounded-full h-9"
            >
              🌈 Все
            </Button>
            {CATEGORIES.map(cat => (
              <Button
                key={cat.value}
                variant={categoryFilter === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(cat.value)}
                className="rounded-full h-9"
              >
                {cat.emoji} {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка добавления */}
      <div className="flex justify-center">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="premium-hover premium-transition rounded-2xl h-14 px-8 text-base font-semibold"
            >
              <Camera className="h-5 w-5 mr-2" />
              Добавить вещь
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg glass-card border-0 rounded-3xl p-8">
            <DialogHeader className="text-center pb-6">
              <DialogTitle className="text-2xl gradient-text">Новая вещь</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Загрузка фото */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Фотография</Label>
                <div className="glass-card border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center premium-transition hover:border-primary/50">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="clothing-item mx-auto w-48 premium-hover premium-transition">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl('');
                            setUploadedImageUrl('');
                          }}
                          className="rounded-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Изменить
                        </Button>
                      </div>
                      {uploadedImageUrl && (
                        <div className="flex items-center justify-center space-x-2 text-sm text-primary">
                          <Sparkles className="h-4 w-4" />
                          <span>Готово к загрузке!</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="h-12 w-12 mx-auto text-primary/60" />
                      
                      {/* Инструкция для iPhone пользователей */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 text-sm">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">💡</div>
                          <div>
                            <p className="font-medium text-blue-900 mb-2">Совет для идеального результата:</p>
                            <p className="text-blue-700 leading-relaxed">
                              На iPhone: удерживайте фото в галерее и выберите "Копировать объект" - телефон автоматически вырежет одежду. 
                              Загружайте уже готовое фото без фона!
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Button 
                          type="button" 
                          variant="default" 
                          size="lg"
                          asChild
                          disabled={isUploading}
                          className="rounded-2xl"
                        >
                          <label>
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Загружаем...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Выбрать фото
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ✨ После загрузки уберем фон автоматически
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Основная информация */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Название*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Белая рубашка"
                    required
                    className="h-12 rounded-xl border-0 bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Категория*</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: WardrobeItem['category']) => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-0 bg-background/50">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Цвет и сезон */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Цвет</Label>
                  <div className="space-y-2">
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="Основной цвет"
                      className="h-12 rounded-xl border-0 bg-background/50"
                    />
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 premium-transition"
                          style={{ 
                            backgroundColor: color.color,
                            border: color.border ? `2px solid ${color.border}` : '2px solid #fff'
                          }}
                          title={color.value}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Сезон</Label>
                  <Select
                    value={formData.season}
                    onValueChange={(value: WardrobeItem['season']) => 
                      setFormData(prev => ({ ...prev, season: value }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-0 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {SEASONS.map(season => (
                        <SelectItem key={season.value} value={season.value}>
                          {season.emoji} {season.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Бренд и теги */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-base">Бренд</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Zara, H&M, Uniqlo..."
                    className="h-12 rounded-xl border-0 bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-base">Теги</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="офис, вечеринка, спорт..."
                    className="h-12 rounded-xl border-0 bg-background/50"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg"
                className="w-full h-14 rounded-2xl text-base font-semibold premium-hover premium-transition" 
                disabled={isSubmitting || isUploading || !uploadedImageUrl}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Добавляем в гардероб...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Добавить в гардероб
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Сетка вещей */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Загружаем ваш гардероб...</p>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <div className="glass-card p-8 rounded-3xl inline-block">
            <Sparkles className="h-16 w-16 text-primary/60 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {wardrobeItems.length === 0 ? 'Начните свою коллекцию' : 'Ничего не найдено'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {wardrobeItems.length === 0 
                ? 'Добавьте первую вещь в гардероб и начните создавать стильные образы'
                : 'Попробуйте изменить поисковый запрос или фильтры'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.category);
            
            return (
              <Card key={item._id} className="glass-card border-0 overflow-hidden group premium-hover premium-transition">
                <CardContent className="p-0">
                  <div className="clothing-item">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay с действиями */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 premium-transition flex items-center justify-center">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDelete(item)}
                          className="rounded-full w-10 h-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Категория бейдж */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/50 text-white border-0 rounded-full text-xs">
                        {categoryInfo.emoji}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Информация о вещи */}
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">{item.color}</span>
                      {item.brand && (
                        <Badge variant="outline" className="text-xs rounded-full">
                          {item.brand}
                        </Badge>
                      )}
                    </div>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.split(',').slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs rounded-full">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}