import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Trees, Key, ChevronRight, Phone, Menu, X, ArrowUpRight, CheckCircle } from 'lucide-react';
import { cn } from './lib/utils';

// Local images
// @ts-ignore
import imgHero from '../jk-Bolshoy Palashevsky11.webp';
// @ts-ignore
import imgSquare from '../jk-BolshoyPalashevsky 11.webp';
// @ts-ignore
import imgPortrait from '../jk-BolshoyPalashevsky11.webp';

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Lead Form ───────────────────────────────────────────────
type FS = 'idle' | 'loading' | 'success';

function LeadForm({ onSuccess, dark = false }: { onSuccess?: () => void; dark?: boolean }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<FS>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setState('loading');
    try {
      await fetch('https://lidoweb-theta.vercel.app/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, site: 'ЖК Большой Палашевский, 11–13' }),
      });
    } catch (_) {}
    setState('success');
    onSuccess?.();
  };

  const inputCls = dark
    ? 'w-full bg-transparent border border-white/20 p-4 focus:outline-none focus:border-white/60 transition-colors text-white placeholder:text-white/30'
    : 'w-full bg-transparent border border-ink/10 p-4 focus:outline-none focus:border-emerald transition-colors text-ink placeholder:text-ink/20';

  if (state === 'success') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 py-12 text-center">
      <CheckCircle className={cn('w-10 h-10', dark ? 'text-white/60' : 'text-emerald')} />
      <p className={cn('font-serif text-2xl font-light', dark ? 'text-white' : 'text-ink')}>Заявка принята</p>
      <p className={cn('text-[14px]', dark ? 'text-white/50' : 'text-ink/60')}>Свяжемся в течение 15 минут</p>
    </motion.div>
  );

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <label className={cn('text-[10px] uppercase tracking-widest font-bold block', dark ? 'text-white/40' : 'text-emerald')}>Ваше имя</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Александр" />
        </div>
        <div className="space-y-3">
          <label className={cn('text-[10px] uppercase tracking-widest font-bold block', dark ? 'text-white/40' : 'text-emerald')}>Телефон *</label>
          <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+7 (999) 000-00-00" />
        </div>
      </div>
      <button type="submit" disabled={state === 'loading'}
        className={cn(
          'w-full px-10 py-4 rounded-full border text-[11px] uppercase tracking-widest font-bold transition-colors disabled:opacity-50',
          dark
            ? 'border-white bg-white text-ink hover:bg-transparent hover:text-white'
            : 'border-ink bg-ink text-bg hover:bg-transparent hover:text-ink'
        )}>
        {state === 'loading' ? 'Отправка...' : 'Получить презентацию'}
      </button>
      <p className={cn('text-[10px] mt-4 text-center', dark ? 'text-white/30' : 'text-ink/40')}>
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}

// ─── Modal ───────────────────────────────────────────────────
function LeadModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex" onClick={onClose}>
      <div className="hidden md:block md:w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imgHero})` }}>
        <div className="w-full h-full bg-ink/60" />
      </div>
      <motion.div
        initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-1/2 h-full bg-ink flex flex-col justify-center px-10 md:px-16 overflow-y-auto relative"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Патриаршие · Делюкс</p>
        <h3 className="font-serif text-4xl font-light text-white mb-2">Палашёвский 11</h3>
        <div className="w-8 h-px bg-white/20 my-6" />
        <p className="text-white/50 text-sm mb-10 leading-relaxed">Цены, планировки и условия — для вас первыми</p>
        <LeadForm dark onSuccess={() => setTimeout(onClose, 2500)} />
      </motion.div>
    </motion.div>
  );
}

// ─── App ─────────────────────────────────────────────────────
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'О проекте', href: '#about' },
    { name: 'Расположение', href: '#location' },
    { name: 'Архитектура', href: '#architecture' },
    { name: 'Инфраструктура', href: '#infrastructure' },
    { name: 'Квартиры', href: '#apartments' },
  ];

  return (
    <div className="min-h-screen bg-bg font-sans selection:bg-emerald selection:text-white">
      <AnimatePresence>{modal && <LeadModal onClose={() => setModal(false)} />}</AnimatePresence>

      {/* Floating CTA */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => setModal(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-ink bg-ink text-bg px-5 py-3 text-[10px] tracking-[0.15em] uppercase font-bold shadow-2xl hover:bg-transparent hover:text-ink transition-colors">
        <Phone className="w-3.5 h-3.5" />
        Обсудить детали с менеджером
      </motion.button>

      {/* Navigation */}
      <nav className={cn(
        'fixed w-full z-50 transition-all duration-500 border-b border-ink/10',
        isScrolled ? 'bg-bg/90 backdrop-blur-md py-4' : 'bg-bg/80 backdrop-blur-sm py-6'
      )}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <span className="font-serif italic text-2xl tracking-tight text-ink">Sminex / Палашёвский 11</span>
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link.name} href={link.href}
                className="text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/70 hover:text-emerald transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={() => setModal(true)}
              className="px-5 py-2 rounded-full border border-ink bg-ink text-bg text-[10px] uppercase tracking-[0.1em] font-bold hover:bg-transparent hover:text-ink transition-colors">
              Узнать цену
            </button>
          </div>
          <button className="lg:hidden text-2xl text-ink" onClick={() => setMobileMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-bg flex flex-col p-6">
          <div className="flex justify-between items-center mb-12 border-b border-ink/10 pb-6">
            <span className="font-serif italic text-2xl text-ink">Sminex / Палашёвский 11</span>
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-8 h-8 text-ink" /></button>
          </div>
          <div className="flex flex-col space-y-6 text-xl font-serif">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-ink">{link.name}</a>
            ))}
          </div>
          <div className="mt-auto pb-8">
            <button onClick={() => { setMobileMenuOpen(false); setModal(true); }}
              className="w-full py-4 rounded-full border border-ink bg-ink text-bg font-bold uppercase tracking-widest text-[11px]">
              Узнать цену
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg border-b border-ink/10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 font-serif font-black text-[300px] lg:text-[400px] text-surface-light opacity-60 -z-10 leading-none pointer-events-none select-none">11</div>
        <div className="relative z-20 container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 lg:pt-0">
          <div className="flex flex-col items-start">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-emerald uppercase tracking-[0.4em] text-xs sm:text-sm mb-6 font-bold">
              Коллекционный дом
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-7xl lg:text-[72px] font-serif text-ink mb-8 leading-[0.9] font-light">
              Камерный дом<br />на Патриарших
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button onClick={() => setModal(true)}
                className="px-8 py-3 rounded-full border border-ink bg-ink text-bg text-[11px] uppercase tracking-widest font-bold hover:bg-transparent hover:text-ink transition-colors">
                Узнать цену
              </button>
              <button onClick={() => setModal(true)}
                className="px-8 py-3 rounded-full border border-ink text-ink text-[11px] uppercase tracking-widest font-bold hover:bg-ink hover:text-bg transition-colors">
                Записаться на просмотр
              </button>
            </motion.div>
          </div>
          <div className="relative w-full h-[40vh] lg:h-[60vh]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
              className="absolute inset-0 rounded-sm shadow-[20px_20px_60px_rgba(0,0,0,0.1)] overflow-hidden group">
              <img src={imgHero} alt="ЖК Большой Палашевский 11 — фасад"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 border-b border-ink/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24 items-center">
            <FadeIn>
              <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-bold mb-6 block">О проекте</span>
              <h2 className="text-4xl md:text-[56px] font-serif text-ink mb-8 leading-[1.1] font-light">Камерный формат<br />и приватность</h2>
              <p className="text-ink/70 text-[15px] leading-[1.6] mb-8 max-w-lg">
                «Палашёвский 11» — самый дефицитный сегмент рынка. Редкое предложение в историческом центре Москвы от девелопера Sminex с архитектурной концепцией бюро ADM.
              </p>
              <div className="flex items-center space-x-8 pt-6 border-t border-ink/10">
                <div>
                  <p className="text-[10px] text-ink/50 tracking-widest uppercase font-bold mb-2">Девелопер</p>
                  <p className="font-serif text-2xl text-ink">Sminex</p>
                </div>
                <div className="w-px h-12 bg-ink/10" />
                <div>
                  <p className="text-[10px] text-ink/50 tracking-widest uppercase font-bold mb-2">Архитектура</p>
                  <p className="font-serif text-2xl text-ink">Бюро ADM</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="relative h-[500px]">
              <img src={imgSquare} alt="ЖК Большой Палашевский 11 — вид"
                className="w-full h-full object-cover rounded-sm shadow-[20px_20px_60px_rgba(0,0,0,0.05)]" />
            </FadeIn>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 border-t border-ink/10">
            {[
              { label: 'Квартир', value: '45', desc: 'Эксклюзивных лотов' },
              { label: 'Пентхаусов', value: '7', desc: 'С каминами и террасами' },
              { label: 'Этажность', value: '12', desc: 'Видовых этажей' },
              { label: 'Сдача', value: '2030', desc: 'I квартал' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={0.1 * i} className="flex flex-col">
                <span className="text-4xl md:text-5xl font-serif text-ink mb-2">{stat.value}</span>
                <span className="text-[11px] tracking-widest uppercase font-bold text-gold mb-1 mt-2">{stat.label}</span>
                <span className="text-[13px] text-ink/60">{stat.desc}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-24 border-b border-ink/10 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn className="max-w-3xl mb-16">
            <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-bold mb-6 block">Расположение</span>
            <h2 className="text-4xl md:text-[56px] font-serif text-ink mb-6 leading-[1.1] font-light">Жизнь на Патриарших</h2>
            <p className="text-ink/70 text-[15px] leading-[1.6]">
              В пределах Садового кольца, в одной из самых престижных локаций Москвы.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <FadeIn delay={0.2} className="lg:col-span-7 relative h-[400px] lg:h-[500px] group overflow-hidden rounded-sm shadow-[20px_20px_60px_rgba(0,0,0,0.05)]">
              <img src={imgPortrait} alt="ЖК Большой Палашевский 11 — локация Патриаршие пруды"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-white font-serif text-2xl font-light">Большой Палашёвский переулок, 11</p>
              </div>
            </FadeIn>
            <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
              <FadeIn delay={0.3} className="flex flex-col gap-8">
                {[
                  { icon: <MapPin className="w-5 h-5 text-emerald" />, title: 'Садовое кольцо', desc: 'Внутри исторического центра.' },
                  { icon: <Trees className="w-5 h-5 text-emerald" />, title: 'Патриаршие пруды', desc: 'Пешая доступность для прогулок.' },
                  { icon: <ArrowUpRight className="w-5 h-5 text-emerald" />, title: 'Станции метро', desc: '6–8 мин. до «Тверская», «Пушкинская», «Чеховская».' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1.5">{item.icon}</div>
                      <div>
                        <h4 className="font-serif text-xl mb-1 text-ink">{item.title}</h4>
                        <p className="text-ink/60 text-[14px]">{item.desc}</p>
                      </div>
                    </div>
                    {i < 2 && <div className="w-full h-px bg-ink/10 mt-8" />}
                  </div>
                ))}
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-24 border-b border-ink/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-bold mb-6 block">Архитектура ADM</span>
              <h2 className="text-4xl md:text-[56px] font-serif text-ink mb-8 leading-[1.1] font-light">Выразительность,<br />вписанная в историю</h2>
              <p className="text-ink/70 text-[15px] leading-[1.6] mb-8">
                Современная архитектура, деликатно интегрированная в историческую застройку Патриарших прудов. Три типа фасадов — изумрудное стекло, белый глянец, каменный пластик.
              </p>
              <ul className="space-y-5 pt-6 border-t border-ink/10">
                {[
                  'Изумрудно-малахитовое стекло, отражающее зелень переулков',
                  'Белый глянцевый фасад с консольными террасами',
                  'Каменный фасад с панорамным остеклением',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span className="text-ink/70 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.2} className="relative w-full h-[500px] lg:h-[600px]">
              <img src={imgHero} alt="ЖК Большой Палашевский 11 — архитектура"
                className="w-full h-full object-cover rounded-sm shadow-[20px_20px_60px_rgba(0,0,0,0.05)]" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section id="infrastructure" className="py-24 bg-white border-b border-ink/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-bold mb-6 block">Инфраструктура</span>
              <h2 className="text-4xl md:text-[56px] font-serif text-ink mb-4 leading-[1.1] font-light">Привилегии жителей</h2>
            </div>
            <p className="text-ink/60 text-[15px] max-w-sm">Закрытая территория с инфраструктурой только для резидентов.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Clubhouse', desc: 'Пространство только для жителей с патио и фитнесом мирового уровня.', img: imgSquare },
              { title: 'Ландшафтный двор', desc: 'Декоративный пруд с гейзерами, зелёные комнаты и крытая галерея.', img: imgPortrait },
              { title: 'Спорт и дети', desc: 'Оранжерея, детская площадка с водой и воркаут для резидентов.', img: imgHero },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={0.1 * i} className="group cursor-pointer">
                <div className="relative overflow-hidden h-[360px] mb-6 rounded-sm border border-ink/5">
                  <img src={item.img} alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-2xl font-serif text-ink mb-2 font-light">{item.title}</h3>
                <p className="text-ink/60 text-[14px] leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Apartments */}
      <section id="apartments" className="py-24 border-b border-ink/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn className="order-2 lg:order-1 relative h-[500px] lg:h-[600px]">
              <img src={imgPortrait} alt="ЖК Большой Палашевский 11 — планировки"
                className="w-full h-full object-cover rounded-sm shadow-[20px_20px_60px_rgba(0,0,0,0.05)]" />
            </FadeIn>
            <FadeIn className="order-1 lg:order-2">
              <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-bold mb-6 block">Планировки</span>
              <h2 className="text-4xl md:text-[56px] font-serif text-ink mb-10 leading-[1.1] font-light">Свобода для<br />дизайна</h2>
              <div className="space-y-0">
                {[
                  { title: 'Метражи', desc: 'От 61,9 до 382,5 м²' },
                  { title: 'Потолки', desc: 'Высота до 7,4 м для двухуровневых пространств' },
                  { title: 'Планировки', desc: 'Угловые и распашные с мастер-спальнями' },
                  { title: 'Отделка', desc: 'Shell & Core — готовность к вашему проекту' },
                  { title: 'Пентхаусы', desc: '7 резиденций с каминами и террасами' },
                ].map((f, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-baseline py-5 border-b border-ink/10 gap-2 md:gap-8 px-2 hover:bg-white/50 transition-colors">
                    <dt className="font-serif text-xl text-ink w-40 shrink-0">{f.title}</dt>
                    <dd className="text-ink/60 text-[14px]">{f.desc}</dd>
                  </div>
                ))}
              </div>
              <button onClick={() => setModal(true)}
                className="mt-12 flex items-center space-x-3 text-[11px] tracking-widest uppercase font-bold text-ink group hover:text-emerald transition-colors">
                <span>Запросить планировки</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="zayavka" className="py-24 border-b border-ink/10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-[56px] font-serif text-ink mb-6 leading-[1.1] font-light">Станьте резидентом</h2>
            <p className="text-ink/60 text-[15px] mb-12 max-w-xl mx-auto">
              Оставьте заявку — получите полную презентацию, актуальные цены и планировки свободных квартир.
            </p>
            <div className="bg-white p-8 md:p-12 text-left border border-ink/10 rounded-sm shadow-[20px_20px_60px_rgba(0,0,0,0.05)]">
              <LeadForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-b border-ink/10 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-bold mb-16 block">Вопросы и ответы</span>
          </FadeIn>
          {[
            { q: 'Когда старт продаж ЖК Большой Палашевский 11?', a: 'Сдача запланирована на I квартал 2030 года. Оставьте заявку — пришлём информацию о старте продаж первыми.' },
            { q: 'Сколько квартир в ЖК Большой Палашевский 11?', a: '45 эксклюзивных лотов, включая 7 пентхаусов с каминами и террасами.' },
            { q: 'Как добраться до Большого Палашевского переулка, 11?', a: 'Метро «Тверская», «Пушкинская», «Чеховская» — 6–8 минут пешком. Внутри Садового кольца.' },
            { q: 'Какой девелопер у ЖК Большой Палашевский 11?', a: 'Sminex — один из ведущих девелоперов элитной недвижимости Москвы. Архитектура — бюро ADM.' },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <details className="group border-b border-ink/10 py-6 cursor-pointer">
                <summary className="flex justify-between items-center text-ink font-light text-[15px] list-none">
                  {item.q}
                  <span className="text-ink/40 group-open:rotate-45 transition-transform duration-300 text-xl leading-none ml-4 flex-shrink-0">+</span>
                </summary>
                <p className="mt-4 text-ink/60 text-[14px] leading-relaxed">{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-bg text-ink/60 text-[11px] uppercase tracking-widest font-medium">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <span className="font-serif italic text-2xl font-light text-ink mb-4 block normal-case tracking-normal">Sminex</span>
              <p className="normal-case tracking-normal text-[13px] leading-relaxed text-ink/60">Палашёвский 11 — элитный жилой комплекс на Патриарших прудах.</p>
            </div>
            <div>
              <h4 className="text-ink font-bold mb-6">Проект</h4>
              <ul className="space-y-4 normal-case tracking-normal text-[13px]">
                <li><a href="#about" className="hover:text-emerald transition-colors">О проекте</a></li>
                <li><a href="#architecture" className="hover:text-emerald transition-colors">Архитектура ADM</a></li>
                <li><a href="#infrastructure" className="hover:text-emerald transition-colors">Инфраструктура</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-bold mb-6">Расположение</h4>
              <ul className="space-y-4 normal-case tracking-normal text-[13px]">
                <li>Патриаршие пруды</li>
                <li>Садовое кольцо</li>
                <li>м. Тверская</li>
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-bold mb-6">Заявка</h4>
              <button onClick={() => setModal(true)}
                className="normal-case tracking-normal text-[13px] text-emerald hover:underline">
                Узнать цену и планировки
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-ink/10 normal-case tracking-normal text-[12px]">
            <p>&copy; {new Date().getFullYear()} Палашёвский 11. Элитный жилой квартал.</p>
            <p className="mt-4 md:mt-0">Не является публичной офертой</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
