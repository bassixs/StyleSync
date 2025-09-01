import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWardrobeStore, WardrobeItem } from '@/store/wardrobe-store';
import { PieChart, BarChart3, TrendingUp, Palette } from 'lucide-react';

const CATEGORY_COLORS = {
  top: '#FF6B6B',      // Красный
  bottom: '#4ECDC4',   // Бирюзовый  
  dress: '#45B7D1',    // Синий
  outerwear: '#96CEB4', // Зеленый
  shoes: '#FFEAA7',    // Желтый
  accessories: '#DDA0DD', // Фиолетовый
  underwear: '#FFB6C1', // Розовый
  other: '#C0C0C0'     // Серый
};

const CATEGORY_LABELS = {
  top: 'Верх',
  bottom: 'Низ', 
  dress: 'Платья',
  outerwear: 'Верхняя одежда',
  shoes: 'Обувь',
  accessories: 'Аксессуары',
  underwear: 'Белье',
  other: 'Другое'
};

export default function WardrobeStats() {
  const { wardrobeItems } = useWardrobeStore();

  const stats = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    const colorCount: Record<string, number> = {};
    const seasonCount: Record<string, number> = {};
    const brandCount: Record<string, number> = {};

    wardrobeItems.forEach((item: WardrobeItem) => {
      // Подсчет по категориям
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      
      // Подсчет по цветам
      if (item.color) {
        colorCount[item.color] = (colorCount[item.color] || 0) + 1;
      }
      
      // Подсчет по сезонам
      seasonCount[item.season] = (seasonCount[item.season] || 0) + 1;
      
      // Подсчет по брендам
      if (item.brand) {
        brandCount[item.brand] = (brandCount[item.brand] || 0) + 1;
      }
    });

    return {
      total: wardrobeItems.length,
      categories: categoryCount,
      colors: colorCount,
      seasons: seasonCount,
      brands: brandCount
    };
  }, [wardrobeItems]);

  // Создание данных для круговой диаграммы
  const chartData = useMemo(() => {
    const categories = Object.entries(stats.categories).map(([category, count]) => ({
      category,
      count,
      label: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#C0C0C0',
      percentage: Math.round((count / stats.total) * 100)
    }));

    return categories.sort((a, b) => b.count - a.count);
  }, [stats]);

  // Вычисление координат для круговой диаграммы
  const createPieChart = () => {
    if (chartData.length === 0) return [];
    
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    let currentAngle = -90; // Начинаем сверху

    return chartData.map((item) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle += angle;
      
      return {
        ...item,
        pathData,
        startAngle,
        endAngle
      };
    });
  };

  const pieSlices = createPieChart();

  if (stats.total === 0) {
    return (
      <Card className="glass-card border-glass-border">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <PieChart className="h-5 w-5" />
            Статистика гардероба
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Добавьте первые вещи в гардероб, чтобы увидеть статистику</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Основная диаграмма */}
      <Card className="glass-card border-glass-border">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <PieChart className="h-5 w-5" />
            Статистика гардероба
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Круговая диаграмма */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                {pieSlices.map((slice, index) => (
                  <path
                    key={slice.category}
                    d={slice.pathData}
                    fill={slice.color}
                    className="premium-transition hover:opacity-80"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                ))}
              </svg>
              
              {/* Центральная информация */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold gradient-text">{stats.total}</div>
                <div className="text-sm text-muted-foreground">вещей</div>
              </div>
            </div>
          </div>

          {/* Легенда */}
          <div className="grid grid-cols-2 gap-3">
            {chartData.map((item) => (
              <div key={item.category} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 gap-4">
        {/* Топ цвета */}
        {Object.keys(stats.colors).length > 0 && (
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />
                Популярные цвета
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.colors)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([color, count]) => (
                    <Badge key={color} variant="secondary" className="text-xs">
                      {color} ({count})
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Топ бренды */}
        {Object.keys(stats.brands).length > 0 && (
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Любимые бренды
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.brands)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([brand, count]) => (
                    <Badge key={brand} variant="outline" className="text-xs">
                      {brand} ({count})
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}