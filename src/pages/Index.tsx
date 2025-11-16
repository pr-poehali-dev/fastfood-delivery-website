import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CourierOrder {
  id: number;
  address: string;
  items: string[];
  total: number;
  status: 'pending' | 'delivering' | 'completed';
}

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', comment: '' });
  const { toast } = useToast();

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Чизбургер Классик', price: 350, category: 'Бургеры', image: '🍔', description: 'Сочная говяжья котлета, сыр чеддер' },
    { id: 2, name: 'Двойной Биг Бургер', price: 520, category: 'Бургеры', image: '🍔', description: 'Две котлеты, бекон, специальный соус' },
    { id: 3, name: 'Пицца Пепперони', price: 650, category: 'Пицца', image: '🍕', description: '30 см, моцарелла, пепперони' },
    { id: 4, name: 'Картофель Фри', price: 180, category: 'Гарниры', image: '🍟', description: 'Хрустящий золотистый картофель' },
    { id: 5, name: 'Наггетсы 9 шт', price: 280, category: 'Снеки', image: '🍗', description: 'Куриные наггетсы с соусом' },
    { id: 6, name: 'Кола 0.5л', price: 120, category: 'Напитки', image: '🥤', description: 'Холодная освежающая кола' },
  ];

  const courierOrders: CourierOrder[] = [
    { id: 101, address: 'ул. Пушкина, 15, кв. 42', items: ['Чизбургер x2', 'Кола'], total: 820, status: 'pending' },
    { id: 102, address: 'пр. Ленина, 88, офис 12', items: ['Пицца Пепперони', 'Картофель Фри'], total: 830, status: 'delivering' },
    { id: 103, address: 'ул. Садовая, 7', items: ['Двойной Биг Бургер', 'Наггетсы'], total: 800, status: 'completed' },
  ];

  const categories = ['Все', 'Бургеры', 'Пицца', 'Гарниры', 'Снеки', 'Напитки'];
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const filteredItems = selectedCategory === 'Все' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🚀</div>
            <h1 className="text-2xl font-bold text-secondary">FastFood</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="menu">Меню</TabsTrigger>
              <TabsTrigger value="courier">Для курьеров</TabsTrigger>
            </TabsList>
          </Tabs>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 animate-scale-in">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg animate-slide-in-right">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <Card key={item.id} className="p-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{item.image}</span>
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 ml-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-primary">{cartTotal} ₽</span>
                      </div>
                      <Button 
                        className="w-full h-12 text-lg" 
                        size="lg"
                        onClick={() => setOrderDialogOpen(true)}
                      >
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TabsContent value="menu" className="mt-0">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-2">Быстрая доставка</h2>
            <p className="text-muted-foreground text-lg">Ваш заказ уже через 30 минут</p>
          </div>

          <section className="mb-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary to-orange-600 text-white overflow-hidden relative">
                <div className="p-6 relative z-10">
                  <Badge className="bg-white text-primary mb-3">
                    <Icon name="Flame" size={14} className="mr-1" />
                    Горячее предложение
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Комбо на двоих -30%</h3>
                  <p className="text-white/90 mb-4">2 бургера + картофель фри + 2 напитка</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">890 ₽</span>
                    <span className="text-lg line-through opacity-75">1270 ₽</span>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 text-9xl opacity-20">🍔</div>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-400 to-orange-400 text-secondary overflow-hidden relative">
                <div className="p-6 relative z-10">
                  <Badge className="bg-secondary text-white mb-3">
                    <Icon name="Gift" size={14} className="mr-1" />
                    Подарок
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Пицца + напиток в подарок</h3>
                  <p className="text-secondary/80 mb-4">При заказе любой пиццы — напиток бесплатно</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">от 650 ₽</span>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 text-9xl opacity-20">🍕</div>
              </Card>
            </div>
          </section>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center">{item.image}</div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{item.price} ₽</span>
                    <Button onClick={() => addToCart(item)} size="lg">
                      <Icon name="Plus" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courier" className="mt-0">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-2">Панель курьера</h2>
            <p className="text-muted-foreground text-lg">Активные заказы для доставки</p>
          </div>

          <div className="grid gap-4 max-w-3xl">
            {courierOrders.map((order, index) => (
              <Card 
                key={order.id} 
                className="p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">Заказ #{order.id}</h3>
                      <Badge 
                        variant={
                          order.status === 'pending' ? 'secondary' : 
                          order.status === 'delivering' ? 'default' : 
                          'outline'
                        }
                      >
                        {order.status === 'pending' ? 'Ожидает' : 
                         order.status === 'delivering' ? 'В пути' : 
                         'Доставлен'}
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground mb-3">
                      <Icon name="MapPin" size={18} className="mt-0.5" />
                      <span>{order.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Package" size={16} />
                      <span>{order.items.join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{order.total} ₽</div>
                  </div>
                </div>
                
                {order.status === 'pending' && (
                  <Button className="w-full" size="lg">
                    <Icon name="Bike" size={18} className="mr-2" />
                    Начать доставку
                  </Button>
                )}
                
                {order.status === 'delivering' && (
                  <Button className="w-full" size="lg" variant="outline">
                    <Icon name="CheckCircle" size={18} className="mr-2" />
                    Завершить доставку
                  </Button>
                )}
              </Card>
            ))}
          </div>

          <section className="mt-16 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2">Отзывы клиентов</h2>
              <p className="text-muted-foreground text-lg">Что говорят о нас наши гости</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    👨
                  </div>
                  <div>
                    <h3 className="font-bold">Алексей М.</h3>
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={14} className="fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Заказываю здесь регулярно! Всегда быстрая доставка, бургеры горячие и очень вкусные. Особенно нравится Двойной Биг Бургер — сытный и сочный!
                </p>
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    👩
                  </div>
                  <div>
                    <h3 className="font-bold">Мария К.</h3>
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={14} className="fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Лучшая пицца в городе! Заказала Пепперони — тесто тонкое, начинки много. Доставили ровно через 30 минут, как и обещали. Рекомендую!
                </p>
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    👨
                  </div>
                  <div>
                    <h3 className="font-bold">Дмитрий П.</h3>
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={14} className="fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Отличный сервис! Курьер приехал вовремя, еда была упакована идеально. Наггетсы и картофель фри — просто огонь. Спасибо за качество!
                </p>
              </Card>
            </div>
          </section>
        </TabsContent>
      </main>

      <footer className="bg-secondary text-secondary-foreground mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">О нас</h3>
              <p className="text-sm opacity-90">Быстрая доставка вкусной еды прямо к вашей двери</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Контакты</h3>
              <div className="text-sm space-y-1 opacity-90">
                <p>📞 +7 (900) 123-45-67</p>
                <p>📧 info@fastfood.ru</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Доставка</h3>
              <div className="text-sm space-y-1 opacity-90">
                <p>⏰ Работаем: 10:00 - 23:00</p>
                <p>🚀 Доставка: 30-40 минут</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Оформление заказа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя</Label>
              <Input 
                id="name" 
                placeholder="Иван Иванов"
                value={orderForm.name}
                onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input 
                id="phone" 
                type="tel"
                placeholder="+7 (900) 123-45-67"
                value={orderForm.phone}
                onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Адрес доставки</Label>
              <Input 
                id="address" 
                placeholder="ул. Пушкина, д. 10, кв. 5"
                value={orderForm.address}
                onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий к заказу</Label>
              <Textarea 
                id="comment" 
                placeholder="Позвоните за 5 минут до приезда"
                value={orderForm.comment}
                onChange={(e) => setOrderForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Итого к оплате:</span>
                <span className="text-2xl font-bold text-primary">{cartTotal} ₽</span>
              </div>
              <Button 
                className="w-full h-12 text-lg" 
                size="lg"
                onClick={() => {
                  if (!orderForm.name || !orderForm.phone || !orderForm.address) {
                    toast({
                      title: "Заполните все поля",
                      description: "Пожалуйста, укажите имя, телефон и адрес доставки",
                      variant: "destructive"
                    });
                    return;
                  }
                  toast({
                    title: "Заказ принят! 🎉",
                    description: `Ваш заказ на сумму ${cartTotal} ₽ будет доставлен через 30-40 минут`,
                  });
                  setOrderDialogOpen(false);
                  setCart([]);
                  setOrderForm({ name: '', phone: '', address: '', comment: '' });
                }}
              >
                <Icon name="CheckCircle" size={20} className="mr-2" />
                Подтвердить заказ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}