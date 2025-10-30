import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';


const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
              <Icon name="Wind" size={24} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl">AeroTent</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="hover:text-primary transition-colors">Характеристики</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Преимущества</a>
            <a href="#applications" className="hover:text-primary transition-colors">Применение</a>
            <a href="#gallery" className="hover:text-primary transition-colors">Галерея</a>
            <a href="#contact" className="hover:text-primary transition-colors">Контакты</a>
          </nav>
          <Button className="glow-primary">
            <Icon name="Phone" size={16} className="mr-2" />
            Заказать звонок
          </Button>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/fa7b883e-1b4e-4ad1-92fc-9c87e44104f5/files/055551dd-eaf2-4d16-ae3c-64801e069037.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 leading-tight">
                Пневмокаркасный шатёр
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  нового поколения
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Уникальная конструкция размером 32×16×8 метров с прозрачными окнами. 
                Инновационная технология пневмокаркаса для любых мероприятий.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="glow-primary">
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Заказать сейчас
                </Button>
                <Button size="lg" variant="outline" className="glass-effect">
                  <Icon name="PlayCircle" size={20} className="mr-2" />
                  Смотреть видео
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-12">
                {[
                  { value: '32м', label: 'Длина' },
                  { value: '16м', label: 'Ширина' },
                  { value: '8м', label: 'Высота' }
                ].map((item, idx) => (
                  <Card key={idx} className="glass-effect border-primary/30 hover:border-primary transition-colors">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-heading font-bold text-primary mb-1">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-8 animate-fade-in">
              <img 
                src="https://cdn.poehali.dev/files/93cec548-4268-47e3-a7bd-c494a660828f.jpg" 
                alt="Пневмокаркасный шатёр вид сбоку" 
                className="w-full h-auto"
              />
              <img 
                src="https://cdn.poehali.dev/files/1f7fe15d-73c2-4ae3-ad5f-2da31e4878b4.jpg" 
                alt="Пневмокаркасный шатёр вид сверху" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Технические характеристики
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Передовые технологии в каждой детали конструкции
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'Ruler',
                title: 'Размеры',
                description: '32м × 16м × 8м',
                detail: 'Площадь: 512 м²'
              },
              {
                icon: 'Wind',
                title: 'Пневмокаркас',
                description: 'Инновационная технология',
                detail: 'Быстрый монтаж за 1 час'
              },
              {
                icon: 'Eye',
                title: 'Прозрачные окна',
                description: 'Естественное освещение',
                detail: 'Панорамный обзор 360°'
              },
              {
                icon: 'Shield',
                title: 'Надёжность',
                description: 'Устойчивость к ветру',
                detail: 'До 25 м/с'
              },
              {
                icon: 'Thermometer',
                title: 'Всесезонность',
                description: 'От -30°C до +50°C',
                detail: 'Теплоизоляция в комплекте'
              },
              {
                icon: 'Zap',
                title: 'Автономность',
                description: 'Собственное питание',
                detail: 'Генератор и освещение'
              },
              {
                icon: 'Users',
                title: 'Вместимость',
                description: 'До 500 человек',
                detail: 'Комфортное размещение'
              },
              {
                icon: 'Package',
                title: 'Транспортировка',
                description: 'Компактная упаковка',
                detail: 'Помещается в одну газель'
              }
            ].map((feature, idx) => (
              <Card key={idx} className="glass-effect border-primary/20 hover:border-primary hover:glow-primary transition-all group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name={feature.icon} size={28} className="text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-1">{feature.description}</p>
                  <p className="text-sm text-primary">{feature.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Преимущества технологии
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Почему пневмокаркас — это будущее временных конструкций
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'Rocket',
                title: 'Быстрый монтаж',
                description: 'Установка шатра занимает всего 1 час, в отличие от 2-3 дней для традиционных конструкций'
              },
              {
                icon: 'Feather',
                title: 'Легкий вес',
                description: 'Вся конструкция весит в 3 раза меньше металлического каркаса, что упрощает транспортировку'
              },
              {
                icon: 'DollarSign',
                title: 'Экономичность',
                description: 'Снижение затрат на логистику и монтаж до 60% по сравнению с классическими шатрами'
              },
              {
                icon: 'Sparkles',
                title: 'Дизайн',
                description: 'Футуристичный внешний вид привлекает внимание и создаёт wow-эффект на мероприятиях'
              },
              {
                icon: 'RefreshCw',
                title: 'Модульность',
                description: 'Возможность изменения конфигурации и соединения нескольких модулей в единую конструкцию'
              },
              {
                icon: 'Heart',
                title: 'Экологичность',
                description: 'Не требует фундамента, минимальное воздействие на окружающую среду и территорию'
              }
            ].map((benefit, idx) => (
              <Card key={idx} className="glass-effect border-secondary/20 hover:border-secondary hover:glow-secondary transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-6">
                    <Icon name={benefit.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-2xl mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="applications" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Применение
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Универсальное решение для самых разных задач
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: 'Calendar',
                title: 'Корпоративные мероприятия',
                items: ['Презентации продуктов', 'Конференции и форумы', 'Тимбилдинги', 'Выставки']
              },
              {
                icon: 'Music',
                title: 'Развлечения',
                items: ['Концерты и фестивали', 'Свадьбы и банкеты', 'Спортивные события', 'Ярмарки']
              },
              {
                icon: 'Briefcase',
                title: 'Бизнес',
                items: ['Торговые площадки', 'Складские помещения', 'Временные офисы', 'Точки продаж']
              },
              {
                icon: 'Activity',
                title: 'Специальные задачи',
                items: ['Медицинские пункты', 'Полевые штабы', 'Ангары для техники', 'Сезонные павильоны']
              }
            ].map((app, idx) => (
              <Card key={idx} className="glass-effect border-primary/20 overflow-hidden hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Icon name={app.icon} size={32} className="text-white" />
                    </div>
                    <h3 className="font-heading font-semibold text-2xl">{app.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {app.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-3">
                        <Icon name="CheckCircle2" size={20} className="text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Галерея
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Посмотрите на наши реализованные проекты
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                url: 'https://cdn.poehali.dev/files/07c99d32-6e1a-4332-a880-60b6efcbaa00.jpg',
                title: 'Схема конструкции'
              },
              {
                url: 'https://cdn.poehali.dev/projects/fa7b883e-1b4e-4ad1-92fc-9c87e44104f5/files/a8383dc7-c2aa-43ff-8505-873789413808.jpg',
                title: '3D визуализация'
              },
              {
                url: 'https://cdn.poehali.dev/projects/fa7b883e-1b4e-4ad1-92fc-9c87e44104f5/files/530a4bf3-8b82-4a0b-b60c-67fd60f3844c.jpg',
                title: 'Внутреннее пространство'
              }
            ].map((image, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl border border-primary/20 hover:border-primary transition-all cursor-pointer">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <h3 className="font-heading font-semibold text-xl text-white">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                Оставьте заявку
              </h2>
              <p className="text-xl text-muted-foreground">
                Свяжитесь с нами для расчёта стоимости и консультации
              </p>
            </div>

            <Card className="glass-effect border-primary/30 glow-primary">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ваше имя</label>
                      <Input
                        placeholder="Иван Иванов"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="glass-effect"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="ivan@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="glass-effect"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон</label>
                    <Input
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="glass-effect"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Сообщение</label>
                    <Textarea
                      placeholder="Расскажите о вашем мероприятии и задачах..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="glass-effect"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full glow-primary">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: 'Mail',
                  title: 'Email',
                  value: 'info@aerotent.ru'
                },
                {
                  icon: 'Phone',
                  title: 'Телефон',
                  value: '+7 (999) 123-45-67'
                },
                {
                  icon: 'MapPin',
                  title: 'Адрес',
                  value: 'Москва, Россия'
                }
              ].map((contact, idx) => (
                <Card key={idx} className="glass-effect border-primary/20 hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                      <Icon name={contact.icon} size={24} className="text-white" />
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{contact.title}</div>
                    <div className="font-medium">{contact.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/50 glass-effect">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Wind" size={24} className="text-white" />
              </div>
              <span className="font-heading font-bold text-xl">AeroTent</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 AeroTent. Все права защищены.
            </p>
            
            <div className="flex items-center gap-4">
              {['Instagram', 'Facebook', 'Linkedin'].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Icon name={social} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;