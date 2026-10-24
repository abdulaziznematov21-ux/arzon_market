import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useCountdown } from "../lib/hooks";
import { GROUPS, PRODUCTS, PROMOS } from "../lib/data";
import { useStore } from "../lib/store";
import { translateCategory, HERO_SLIDES_TRANSLATED } from "../lib/translations";

const CAT_ICON = {
  "Telefon va aksessuarlar": "📱",
  "Texnika & Kompyuterlar": "💻",
  "Oziq-ovqat": "🍎",
  "Kiyim va poyabzal": "👟",
  "Sport va fitnes": "⚽",
  "Go‘zallik va salomatlik": "💄",
  "Go'zallik va salomatlik": "💄",
  "Ro‘zg‘or buyumlari": "🏠",
  "Ro'zg'or buyumlari": "🏠",
  "Bolalar olami": "🧸",
  "Avtotovarlar & Asboblar": "🚗",
};

export default function Home() {
  const { copyAndApplyPromo, promo, openAiAssistant, openStoreInfo, lang, t } = useStore();
  const [slide, setSlide] = useState(0);
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'price_asc' | 'price_desc' | 'discount' | 'rating'
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const heroSlides = HERO_SLIDES_TRANSLATED[lang] || HERO_SLIDES_TRANSLATED.uz;
  const deals = useCountdown(2 * 3600 + 14 * 60 + 32);
  const daily = useCountdown(8 * 3600 + 42 * 60 + 13);

  // Auto-scroll hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Reset page when category or sorting changes
  const handleCatChange = (cat) => {
    setSelectedCat(cat);
    setPage(1);
  };

  const handleSortChange = (sortKey) => {
    setSortBy(sortKey);
    setPage(1);
  };

  // Filter products by selected category
  let filtered = [...PRODUCTS];

  if (selectedCat === "deals") {
    filtered = filtered.filter((p) => p.off >= 30);
  } else if (selectedCat === "promo") {
    filtered = filtered.filter((p) => Boolean(p.promo));
  } else if (selectedCat !== "all") {
    const norm = (s = "") => s.replace(/[‘’`]/g, "'").toLowerCase().trim();
    const target = norm(selectedCat);
    filtered = filtered.filter(
      (p) => norm(p.category) === target || norm(p.group) === target
    );
  }

  // Sort products
  if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "discount") {
    filtered.sort((a, b) => b.off - a.off);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const currentHero = heroSlides[slide] || heroSlides[0];
  const flash = [...PRODUCTS].sort((a, b) => b.off - a.off).slice(0, 6);

  // Page calculations for 5,000 products pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const curPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((curPage - 1) * pageSize, curPage * pageSize);

  const goToPage = (p) => {
    const target = Math.max(1, Math.min(pageCount, p));
    setPage(target);
    const el = document.getElementById("catalog-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#f8f9fa] pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* 1. HERO BANNER CAROUSEL */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br text-white p-5 sm:p-9 lg:p-12 pb-10 sm:pb-9 shadow-xl shadow-red-500/10 min-h-[280px] sm:min-h-[340px] flex flex-col justify-center transition-all duration-700 select-none">
          {/* Slide Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentHero.bg} transition-all duration-700`}
          />

          {/* Decorative Glow Elements */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

          {/* Slide Content */}
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-[11px] sm:text-[12px] font-black px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3 tracking-wide">
              <span>{currentHero.tag}</span>
            </div>

            <h1 className="text-[22px] sm:text-[36px] lg:text-[44px] font-black leading-tight tracking-tight">
              {currentHero.title}
            </h1>

            <p className="mt-2 text-[13px] sm:text-[16px] font-medium text-white/90 max-w-xl leading-relaxed">
              {currentHero.desc}
            </p>

            <div className="flex items-center flex-wrap gap-3 sm:gap-4 mt-5 sm:mt-6">
              {/* Countdown */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
                {[[t("hour"), deals.h], [t("minute"), deals.m], [t("second"), deals.s]].map(([l, v]) => (
                  <div key={l} className="bg-white/15 rounded-xl px-2.5 sm:px-3 py-1 text-center min-w-[42px] sm:min-w-[50px]">
                    <div className="text-[16px] sm:text-[20px] font-black leading-none">{v}</div>
                    <div className="text-[8.5px] sm:text-[9px] text-white/70 font-bold mt-0.5">{l}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById("catalog-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white text-[#e5252b] hover:bg-white/95 font-black px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-lg transition active:scale-95 text-[13.5px] sm:text-[14.5px] flex items-center gap-2 cursor-pointer"
              >
                <span>{currentHero.cta}</span>
                <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Carousel Dot Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 z-10 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                  slide === i ? "w-6 sm:w-8 bg-white" : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2. CORE VALUE PROPOSITIONS & GUARANTEES (Afzalliklarimiz) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 shadow-xs flex items-center gap-3 sm:gap-3.5 hover:shadow-md transition">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-[#e5252b] flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[24px] sm:text-[28px]">local_shipping</span>
            </div>
            <div className="min-w-0">
              <b className="block text-[13px] sm:text-[14.5px] text-gray-900 font-black leading-tight">
                {lang === "ru" ? "Доставка за 1 день" : "1 kunda bepul yetkazish"}
              </b>
              <span className="text-[11px] sm:text-[12px] text-gray-500 line-clamp-1">
                {lang === "ru" ? "В пункты выдачи или курьером" : "Topshirish punkti yoki kuryer bilan"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 shadow-xs flex items-center gap-3 sm:gap-3.5 hover:shadow-md transition">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[24px] sm:text-[28px]">sell</span>
            </div>
            <div className="min-w-0">
              <b className="block text-[13px] sm:text-[14.5px] text-gray-900 font-black leading-tight">
                {lang === "ru" ? "Цены ниже рыночных" : "Bozor narxidan arzon"}
              </b>
              <span className="text-[11px] sm:text-[12px] text-gray-500 line-clamp-1">
                {lang === "ru" ? "Напрямую со складов без наценок" : "To'g'ridan-to'g'ri ulgurji omborlardan"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 shadow-xs flex items-center gap-3 sm:gap-3.5 hover:shadow-md transition">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[24px] sm:text-[28px]">credit_card</span>
            </div>
            <div className="min-w-0">
              <b className="block text-[13px] sm:text-[14.5px] text-gray-900 font-black leading-tight">
                {lang === "ru" ? "Рассрочка 0% до 12 мес" : "0% muddatli to'lov"}
              </b>
              <span className="text-[11px] sm:text-[12px] text-gray-500 line-clamp-1">
                {lang === "ru" ? "Без процентов и переплат" : "12 oygacha ortiqcha foizlarsiz"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 shadow-xs flex items-center gap-3 sm:gap-3.5 hover:shadow-md transition">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[24px] sm:text-[28px]">verified</span>
            </div>
            <div className="min-w-0">
              <b className="block text-[13px] sm:text-[14.5px] text-gray-900 font-black leading-tight">
                {lang === "ru" ? "100% оригинал и возврат" : "100% original va sifat"}
              </b>
              <span className="text-[11px] sm:text-[12px] text-gray-500 line-clamp-1">
                {lang === "ru" ? "14 дней на бесплатный возврат" : "14 kunda bepul qaytarish kafolati"}
              </span>
            </div>
          </div>
        </div>

        {/* 3. VISUAL POPULAR CATEGORY SHORTCUTS (Tezkor toifalar) */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              <h2 className="text-[17px] sm:text-[19px] font-black text-gray-900">
                {lang === "ru" ? "Популярные категории" : "Ommabop toifalar"}
              </h2>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById("catalog-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[#e5252b] text-[13px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{lang === "ru" ? "Все категории" : "Barcha toifalar"}</span>
              <span className="material-symbols-rounded text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
            {Object.keys(GROUPS).slice(0, 8).map((g) => {
              const active = selectedCat === g;
              return (
                <button
                  key={g}
                  onClick={() => {
                    handleCatChange(g);
                    const el = document.getElementById("catalog-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group border ${
                    active
                      ? "bg-red-50 border-[#e5252b] text-[#e5252b] shadow-xs"
                      : "bg-white hover:bg-gray-50 border-gray-150 hover:border-gray-300 text-gray-800"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1.5 transition group-hover:scale-110">
                    {CAT_ICON[g] || "📦"}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-bold line-clamp-1 leading-tight">
                    {translateCategory(g, lang)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. HOW ARZON MARKET WORKS (Qanday ishlaydi - 3 oddiy qadam) */}
        <div className="mt-8 bg-gradient-to-r from-red-50 via-white to-red-50 rounded-3xl p-5 sm:p-7 border border-red-150">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="bg-[#e5252b] text-white text-[10.5px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {lang === "ru" ? "ПРОСТО И УДОБНО" : "SODDA VA QULAY"}
            </span>
            <h2 className="text-[18px] sm:text-[22px] font-black text-gray-900 mt-2">
              {lang === "ru" ? "Как покупать в Arzon Market? (3 простых шага)" : "Arzon Marketda qanday xarid qilinadi? (3 oddiy qadam)"}
            </h2>
            <p className="text-[12.5px] sm:text-[13.5px] text-gray-600 mt-1">
              {lang === "ru" 
                ? "Покупайте товары по оптовым ценам с гарантией и получайте уже на следующий день"
                : "Bozor narxidan ancha arzon xarid qiling va buyurtmangizni ertagayoq qabul qilib oling"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 shadow-2xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#e5252b] flex items-center justify-center font-black text-lg shrink-0">
                1
              </div>
              <div>
                <b className="text-[14px] font-black text-gray-900 block">
                  {lang === "ru" ? "1. Выберите товар" : "1. Tovarni tanlang"}
                </b>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  {lang === "ru" 
                    ? "5 000+ товаров с гарантией низких цен. Используйте активные промокоды для скидок."
                    : "5 000+ mahsulot, eng past narxlar kafolati va faol promokodlar bilan tejang."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 shadow-2xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg shrink-0">
                2
              </div>
              <div>
                <b className="text-[14px] font-black text-gray-900 block">
                  {lang === "ru" ? "2. Доставка за 1 день" : "2. 1 kunda yetkazib beramiz"}
                </b>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  {lang === "ru"
                    ? "Бесплатно в пункты выдачи или курьером прямо до вашей двери по всему Узбекистану."
                    : "Topshirish punktlariga mutlaqo bepul yoki kuryer orqali to'g'ridan-to'g'ri eshigingizgacha."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 shadow-2xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg shrink-0">
                3
              </div>
              <div>
                <b className="text-[14px] font-black text-gray-900 block">
                  {lang === "ru" ? "3. Оплата при получении" : "3. Ko'rib xotirjam to'lang"}
                </b>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  {lang === "ru"
                    ? "Проверьте товар при получении (Наличные, Click, Payme) или оформите в рассрочку 0%."
                    : "Tovarni qo'lingizda tekshirib olgach to'lang (Naqd, Click, Payme) yoki 0% muddatli to'lovga oling."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. AI ASSISTANT & TELEGRAM BOT HELP BANNER */}
        <div className="mt-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-[#990a17] text-white rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/20">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black bg-purple-400 text-gray-950 px-2 py-0.5 rounded-full uppercase">
                  AI + Telegram 24/7
                </span>
                <span className="text-[12px] text-white/80 font-bold">
                  {lang === "ru" ? "Бесплатная помощь" : "Bepul maslahat"}
                </span>
              </div>
              <h3 className="text-[17px] sm:text-[20px] font-black leading-tight mt-1">
                {lang === "ru"
                  ? "Не знаете, какой товар выбрать или есть вопросы?"
                  : "Qaysi tovarni tanlashni bilmayapsizmi yoki savolingiz bormi?"}
              </h3>
              <p className="text-[12.5px] sm:text-[13.5px] text-white/85 mt-1 max-w-xl">
                {lang === "ru"
                  ? "Умный ИИ-консультант подберет товары под ваш бюджет, а официальный Telegram-бот ответит на любые вопросы о доставке и гарантии."
                  : "Sun'iy intellekt maslahatchimiz sizga budjetingiz bo'yicha eng yaxshi mahsulotlarni topib beradi, Telegram Bot orqali esa 24/7 javob olasiz."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => openAiAssistant()}
              className="flex-1 md:flex-none h-11 px-5 rounded-2xl bg-white text-purple-950 font-black text-[13.5px] hover:bg-white/90 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>✨</span>
              <span>{lang === "ru" ? "Спросить AI" : "AI Maslahatchi"}</span>
            </button>
            <button
              onClick={() => openStoreInfo()}
              className="flex-1 md:flex-none h-11 px-5 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-[13.5px] transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>✈️</span>
              <span>Telegram Bot</span>
            </button>
          </div>
        </div>

        {/* 6. PROMO CODES BAR (CARD PROMO INTEGRATION) */}
        <div className="mt-6 bg-white rounded-3xl p-4 sm:p-5 border border-red-150 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-red-50 text-[#e5252b] flex items-center justify-center font-bold">
                🎟️
              </span>
              <div>
                <b className="text-[15px] sm:text-[16px] font-black text-gray-900 block leading-tight">
                  {lang === "ru" ? "Активные промокоды на скидку" : "Faol chegirma promokodlari"}
                </b>
                <span className="text-[11.5px] sm:text-[12px] text-gray-500">
                  {lang === "ru" ? "Скопируйте в 1 клик и примените в корзине" : "Bir bosishda nusxalang va savatingizda qo'llang"}
                </span>
              </div>
            </div>

            {promo && (
              <div className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5 self-start sm:self-auto">
                <span className="material-symbols-rounded text-[16px]">check_circle</span>
                <span>{lang === "ru" ? "Активный промокод:" : "Faol promokod:"} <b>{promo}</b></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {Object.values(PROMOS).map((pr) => {
              const active = promo === pr.code;
              return (
                <div
                  key={pr.code}
                  onClick={() => copyAndApplyPromo(pr.code)}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group last:col-span-2 sm:last:col-span-1 ${
                    active
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                      : "bg-gray-50/70 hover:bg-red-50/60 border-gray-200/80 hover:border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-[14px] text-gray-900 group-hover:text-[#e5252b]">
                      {pr.code}
                    </span>
                    <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-700">
                      -{Math.round(pr.discount / 1000)}k
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                    {pr.label}
                  </div>
                  <div className="mt-2 text-[11px] font-extrabold text-[#e5252b] flex items-center gap-1">
                    <span className="material-symbols-rounded text-[14px]">content_copy</span>
                    <span>{active ? "Qo'llangan ✓" : "Nusxalash"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. KUN TAKLIFLARI (FLASH SALE) */}
        <div className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#e5252b] text-white text-[14px] font-black px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[18px]">bolt</span>
                <span>{lang === "ru" ? "Предложения дня" : "Kun takliflari"}</span>
              </span>
              <span className="bg-white border border-gray-200 text-gray-700 text-[13px] font-mono font-black px-3 py-1.5 rounded-xl">
                ⏱ {daily.h}:{daily.m}:{daily.s}
              </span>
            </div>

            <button
              onClick={() => setSelectedCat("deals")}
              className="text-[#e5252b] text-[13.5px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{lang === "ru" ? "Все скидки" : "Barcha chegirmalar"}</span>
              <span className="material-symbols-rounded text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {flash.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>

        {/* 4. INTERACTIVE SINGLE-PAGE CATEGORY FILTER TABS */}
        <div id="catalog-section" className="mt-12 sm:mt-14 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[22px] sm:text-[26px] font-black text-gray-900 tracking-tight">
                  {t("catalogModalTitle")}
                </h2>
                <span className="bg-red-50 text-[#e5252b] text-[12px] font-black px-3 py-1 rounded-full border border-red-150">
                  {PRODUCTS.length.toLocaleString()} {lang === "ru" ? "товаров" : "ta tovar"}
                </span>
              </div>
              <p className="text-[13px] text-gray-500 mt-1">
                {lang === "ru" ? "Выберите категорию или отсортируйте по цене и скидкам" : "Toifani tanlang yoki narx va chegirmalar bo'yicha saralang"}
              </p>
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-[13px]">
              <span className="text-gray-400 font-bold shrink-0">{t("sort")}:</span>
              {[
                ["popular", lang === "ru" ? "Популярные" : "Ommabop"],
                ["price_asc", lang === "ru" ? "Дешевле" : "Arzonroq"],
                ["price_desc", lang === "ru" ? "Дороже" : "Qimmatroq"],
                ["discount", lang === "ru" ? "Большая скидка" : "Katta chegirma"],
                ["rating", lang === "ru" ? "Высокий рейтинг" : "Yuqori reyting"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleSortChange(key)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                    sortBy === key
                      ? "bg-gray-900 text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills (Horizontal Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            <button
              onClick={() => handleCatChange("all")}
              className={`px-4 py-2 rounded-2xl text-[13.5px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCat === "all"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{lang === "ru" ? "Все" : "Barchasi"}</span>
              <span className="text-[11px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {PRODUCTS.length.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => handleCatChange("promo")}
              className={`px-4 py-2 rounded-2xl text-[13.5px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCat === "promo"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "bg-white text-[#e5252b] border border-red-200 hover:bg-red-50"
              }`}
            >
              <span>{lang === "ru" ? "🎟️ С промокодом" : "🎟️ Promokodlilar"}</span>
            </button>

            <button
              onClick={() => handleCatChange("deals")}
              className={`px-4 py-2 rounded-2xl text-[13.5px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCat === "deals"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{lang === "ru" ? "🔥 Скидки 30%+" : "🔥 30%+ Chegirmalar"}</span>
            </button>

            {Object.keys(GROUPS).map((g) => (
              <button
                key={g}
                onClick={() => handleCatChange(g)}
                className={`px-4 py-2 rounded-2xl text-[13.5px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCat === g
                    ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <span>{CAT_ICON[g] || "📦"}</span>
                <span>{translateCategory(g, lang)}</span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 mt-4">
            {pageItems.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pageCount > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-150 text-[13.5px] text-gray-600">
              <div className="font-semibold text-center sm:text-left">
                {t("showingProducts")} <b className="text-gray-900">{(curPage - 1) * pageSize + 1} – {Math.min(curPage * pageSize, filtered.length)}</b> / {t("ofTotal")} <b className="text-gray-900">{filtered.length.toLocaleString()}</b> {t("productsCountUnit")}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  disabled={curPage === 1}
                  onClick={() => goToPage(curPage - 1)}
                  className="px-3.5 h-[38px] rounded-xl border border-gray-200 bg-white font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-rounded text-[18px]">chevron_left</span>
                  <span>{lang === "ru" ? "Назад" : "Oldingi"}</span>
                </button>

                {/* First page button and leading ellipsis when not near the start */}
                {pageCount > 5 && curPage > 3 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className="w-[38px] h-[38px] rounded-xl font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      1
                    </button>
                    <span className="px-1 text-gray-400 font-bold">...</span>
                  </>
                )}

                {/* Visible sliding page window */}
                {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                  let pNum = curPage - 2 + i;
                  if (curPage <= 3) pNum = i + 1;
                  else if (curPage >= pageCount - 2) pNum = pageCount - 4 + i;
                  if (pNum < 1 || pNum > pageCount) return null;
                  return (
                    <button
                      key={pNum}
                      onClick={() => goToPage(pNum)}
                      className={`w-[38px] h-[38px] rounded-xl font-black text-[13.5px] transition cursor-pointer ${
                        curPage === pNum
                          ? "bg-[#e5252b] text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {pageCount > 5 && curPage < pageCount - 2 && (
                  <>
                    <span className="px-1 text-gray-400 font-bold">...</span>
                    <button
                      onClick={() => goToPage(pageCount)}
                      className="w-[38px] h-[38px] rounded-xl font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      {pageCount}
                    </button>
                  </>
                )}

                <button
                  disabled={curPage === pageCount}
                  onClick={() => goToPage(curPage + 1)}
                  className="px-3.5 h-[38px] rounded-xl border border-gray-200 bg-white font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === "ru" ? "Вперед" : "Keyingi"}</span>
                  <span className="material-symbols-rounded text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. BOTTOM TRUST STRIP */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200/80 text-center text-gray-500 text-[12.5px]">
          <p className="max-w-2xl mx-auto leading-relaxed">
            {lang === "ru"
              ? "Arzon Market — официальный онлайн-гипермаркет Узбекистана с гарантией низких цен. Быстрая доставка за 1 день, проверенные сертифицированные товары и безопасные способы оплаты."
              : "Arzon Market — O'zbekistondagi hamyonbop onlayn gipermarket. 1 kunda tezkor yetkazib berish, sertifikatlangan tovarlar, rasmiy kafolat va xavfsiz to'lov usullari."}
          </p>
        </div>

      </div>
    </div>
  );
}
