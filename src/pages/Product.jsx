import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../lib/store";
import { byId, PRODUCTS, fmt, STORE_INFO } from "../lib/data";
import { TelegramIcon, AiSparkleIcon } from "../components/SocialIcons";
import { translateProductTitle, translateCategory, translateBadge } from "../lib/translations";

export default function Product() {
  const { id } = useParams();
  const p = byId(id);
  const nav = useNavigate();
  const { add, favs, toggleFav, toast, openStoreInfo, openAiAssistant, lang } = useStore();
  const isRu = lang === "ru";

  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState(0);
  const [color, setColor] = useState("Qora");
  const [pw, setPw] = useState("65W");
  const [months, setMonths] = useState(12);
  const [calc, setCalc] = useState(false);
  const [zoom, setZoom] = useState(false);
  const rail = useRef(null);

  if (!p) {
    return (
      <div className="px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-[#e5252b] flex items-center justify-center text-4xl mx-auto mb-4">
          <span className="material-symbols-rounded text-[40px]">search_off</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">{isRu ? "Товар не найден" : "Mahsulot topilmadi"}</h1>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-5 bg-[#e5252b] text-white px-7 py-3 rounded-2xl font-bold"
        >
          <span>{isRu ? "Вернуться в каталог" : "Katalogga qaytish"}</span>
          <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
        </Link>
      </div>
    );
  }

  const extra = pw === "100W" ? 60000 : pw === "140W" ? 120000 : 0;
  const price = p.price + (p.id === 1 ? extra : 0);
  const isFav = favs.includes(p.id);
  const title = translateProductTitle(p.title, lang);

  const similar = PRODUCTS.filter((x) => x.group === p.group && x.id !== p.id)
    .concat(PRODUCTS.filter((x) => x.group !== p.group))
    .slice(0, 8);

  const specs =
    p.id === 1
      ? [
          [isRu ? "Максимальная выходная мощность" : "Maksimal chiqish quvvati", "65W (Power Delivery 3.0)"],
          [isRu ? "Количество и тип разъемов" : "Portlar soni va turi", isRu ? "3 шт (2x Type-C + 1x USB-A)" : "3 ta (2x Type-C + 1x USB-A)"],
          [isRu ? "Поддерживаемые протоколы" : "Qo'llab-quvvatlanuvchi protokollar", "PD 3.0, QC 4.0+, SCP, FCP, AFC, PPS"],
          [isRu ? "Технология полупроводников" : "Yarimo'tkazgich texnologiyasi", "GaN5 Pro (Galliy Nitrid 5)"],
          [isRu ? "Входное напряжение" : "Kirish kuchlanishi", "AC 100–240V~, 50/60Hz, 1.5A Max"],
          [isRu ? "Вес и габариты" : "Og'irligi va o'lchamlari", "120 g / 98 x 36.3 x 32 mm"],
          [isRu ? "Комплектация" : "To'plam tarkibi", isRu ? "Адаптер 65W, кабель 100W Type-C (1м), инструкция" : "65W adapter, 100W Type-C kabel (1m), qo'llanma"],
        ]
      : [
          [isRu ? "Бренд" : "Brend", p.brand],
          [isRu ? "Категория" : "Toifa", p.sub],
          [isRu ? "Рейтинг" : "Reyting", `${p.rating} / 5`],
          [isRu ? "Срок доставки" : "Yetkazib berish", p.delivery === "fast" ? (isRu ? "За 20 минут" : "20 daqiqada") : (isRu ? "Доставка завтра" : "Ertaga yetkazish")],
          [isRu ? "Гарантия" : "Kafolat", isRu ? "12 месяцев официальной гарантии" : "12 oy rasmiy kafolat"],
          [isRu ? "Код товара" : "Mahsulot kodi", `AM-${780000 + p.id}`],
        ];

  const reviews = isRu
    ? [
        ["Азизбек Рахимов", "Очень качественный товар, курьер доставил до двери за 25 минут!", 5],
        ["Малика Каримова", "Цена намного выгоднее, чем на базаре, упаковка на высшем уровне.", 5],
        ["Дильшод Умаров", "Настоящий оригинальный товар, доставили быстро и бесплатно.", 5],
      ]
    : [
        ["Azizbek Rahimov", "Juda sifatli tovar, 25 daqiqada kuryer eshigimgacha olib keldi!", 5],
        ["Malika Karimova", "Narxi bozordan ancha arzon ekan, qadoqlanishi ham a'lo darajada.", 5],
        ["Dilshod Umarov", "Haqiqiy original mahsulot, bepul yetkazib berishdi.", 5],
      ];

  const faq = isRu
    ? [
        ["Сколько времени занимает доставка?", "По Ташкенту доставка занимает от 20-30 минут до 1 дня."],
        ["Предоставляется ли гарантия?", "Да, на все товары действует официальная гарантия 12 месяцев."],
      ]
    : [
        ["Yetkazib berish qancha vaqt oladi?", "Toshkent shahri bo'ylab 20-30 daqiqa yoki 1 kun ichida yetkaziladi."],
        ["Kafolat beriladimi?", "Ha, barcha tovarlar 12 oylik rasmiy kafolatga ega."],
      ];

  const gal = p.images && p.images.length > 0 ? p.images : [p.image];

  return (
    <div className="bg-[#f8f9fa] pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Breadcrumbs */}
        <div className="text-[13px] text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#e5252b]">{isRu ? "Главная" : "Bosh sahifa"}</Link>
          <span>›</span>
          <Link to={`/products?group=${encodeURIComponent(p.group)}`} className="hover:text-[#e5252b]">
            {translateCategory(p.group, lang)}
          </Link>
          <span>›</span>
          <Link to={`/products?group=${encodeURIComponent(p.group)}&sub=${encodeURIComponent(p.sub)}`} className="hover:text-[#e5252b]">
            {p.sub}
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">{title.slice(0, 32)}…</span>
        </div>

        {/* Top Product Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[90px_1fr_1.1fr] gap-6">
          
          {/* Thumbnails (Desktop side list) */}
          <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar lg:overflow-visible lg:flex-col shrink-0 order-2 lg:order-1 py-1">
            {gal.map((g, i) => (
              <button
                key={i}
                onClick={() => setImg(i)}
                aria-label={`Rasm ${i + 1}`}
                className={`w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-2xl bg-white border-2 overflow-hidden flex items-center justify-center transition-all cursor-pointer ${
                  img === i ? "border-[#e5252b] shadow-sm scale-102" : "border-gray-200/80 hover:border-gray-300"
                }`}
              >
                <img src={g} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Large Image Box */}
          <div
            className={`relative overflow-hidden rounded-3xl bg-white h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center cursor-zoom-in order-1 lg:order-2 border border-gray-150 shadow-xs`}
            onClick={() => setZoom((z) => !z)}
          >
            <img
              src={gal[img] || p.image}
              alt={title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-300 select-none ${
                zoom ? "scale-125" : "hover:scale-105"
              }`}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-[#e5252b] text-white text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-sm">
                🔥 {translateBadge(p.badge, lang)}
              </div>
              <div className="bg-gray-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-sm">
                -{p.off}% {isRu ? "Скидка" : "Chegirma"}
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleFav(p.id)}
                aria-label="Sevimli"
                className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition active:scale-90 cursor-pointer ${
                  isFav ? "text-[#e5252b]" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <span className={`material-symbols-rounded text-[22px] ${isFav ? "fill-current" : ""}`}>
                  favorite
                </span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast(isRu ? "Ссылка скопирована 📋" : "Havola nusxalandi 📋");
                }}
                aria-label="Ulashish"
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 transition active:scale-90 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">share</span>
              </button>
            </div>

            <span className="hidden sm:flex items-center gap-1 absolute bottom-4 right-4 text-[12px] font-semibold bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-gray-600 shadow-xs">
              <span className="material-symbols-rounded text-[16px]">zoom_in</span>
              <span>{isRu ? "Увеличить" : "Kattalashtirish"}</span>
            </span>
          </div>

          {/* Product Info & Purchase Form */}
          <div className="order-3 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 text-[13px]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-rounded text-amber-500 text-[18px]">star</span>
                <b className="text-gray-900">{p.rating}</b>
                <span className="text-gray-500 font-medium">({p.reviews} {isRu ? "отзывов" : "sharh"})</span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-700 font-semibold">{isRu ? "4 200+ купили" : "4 200+ xarid qilingan"}</span>
              </div>
              <span className="font-mono text-gray-400 text-[12px]">{isRu ? "Код: " : "Kod: "}AM-{780000 + p.id}</span>
            </div>

            <h1 className="text-[22px] sm:text-[28px] font-black text-gray-900 leading-tight mt-2.5 break-words">
              {title}
            </h1>

            {/* Price Box */}
            <div className="bg-white rounded-3xl p-5 mt-5 border border-gray-150 shadow-xs">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[32px] sm:text-[38px] font-black text-[#e5252b] leading-none">
                  {fmt(price, lang)}
                </span>
                <span className="text-[17px] text-gray-400 line-through">
                  {fmt(p.old, lang)}
                </span>
                <span className="bg-red-50 text-[#e5252b] text-[12px] font-extrabold px-3 py-1 rounded-full border border-red-100">
                  {isRu ? `Экономия: ${fmt(p.old - price, lang)} (-${p.off}%)` : `Tejovingiz: ${fmt(p.old - price)} (-${p.off}%)`}
                </span>
              </div>

              {/* Installment widget */}
              <div className="bg-amber-50/80 rounded-2xl p-3.5 mt-4 border border-amber-200/60 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-sm shadow-2xs">
                    {months}x
                  </div>
                  <div>
                    <b className="text-[14px] text-amber-950">
                      {isRu ? `От ${fmt(price / months, lang)} в месяц` : `Oyiga ${fmt(price / months)}dan`}
                    </b>
                    <div className="text-[12px] text-amber-800">
                      {isRu ? `Рассрочка на ${months} мес без переплат (Uzum Nasiya)` : `Foizsiz ${months} oy muddatga (Uzum Nasiya & Paymart)`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCalc((v) => !v)}
                  className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-4 py-2 rounded-xl text-[12.5px] font-bold transition cursor-pointer"
                >
                  {calc ? (isRu ? "Скрыть" : "Yashirish") : (isRu ? "Выбрать срок" : "Oylarni tanlash")}
                </button>
              </div>

              {calc && (
                <div className="flex gap-2 mt-3 animate-fade-in">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`flex-1 rounded-xl border-2 py-2 text-center transition cursor-pointer ${
                        months === m
                          ? "border-[#e5252b] bg-red-50 text-[#e5252b]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-[12px] font-bold">{m} {isRu ? "мес" : "oy"}</div>
                      <div className="text-[14px] font-extrabold">{fmt(price / m, lang)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Variation Options if ID 1 */}
            {p.id === 1 && (
              <div className="mt-5 space-y-4 text-[14px]">
                <div>
                  <div className="mb-2 font-bold text-gray-700">{isRu ? "Цвет: " : "Rang: "}<span className="text-[#e5252b]">{color}</span></div>
                  <div className="flex gap-2">
                    {[isRu ? "Черный" : "Qora", isRu ? "Белый (White)" : "Oq (White)"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`px-4 py-2.5 rounded-xl border-2 font-bold transition cursor-pointer ${
                          color === c ? "border-[#e5252b] bg-red-50 text-[#e5252b]" : "border-gray-200 bg-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 font-bold text-gray-700">{isRu ? "Мощность: " : "Chiqish quvvati: "}<span className="text-[#e5252b]">{pw}</span></div>
                  <div className="flex flex-wrap gap-2">
                    {[["65W", isRu ? "Хит продаж" : "Bestseller"], ["100W", isRu ? "+60 000 сум" : "+60 000 so'm"], ["140W", "Super Pro"]].map(([w, s]) => (
                      <button
                        key={w}
                        onClick={() => setPw(w)}
                        className={`px-4 py-2 rounded-xl border-2 text-center transition cursor-pointer ${
                          pw === w ? "border-[#e5252b] bg-red-50 text-[#e5252b]" : "border-gray-200 bg-white"
                        }`}
                      >
                        <b className="block text-[14px]">{w}</b>
                        <span className="text-[11px] text-gray-500">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Buy Buttons */}
            <div className="flex flex-wrap gap-3 mt-5 items-center">
              <div className="flex items-center bg-white border border-gray-200 rounded-2xl h-[52px] p-1 shadow-2xs">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Kamaytirish"
                  className="w-10 h-full rounded-xl hover:bg-gray-100 font-bold text-lg cursor-pointer"
                >
                  −
                </button>
                <span className="w-9 text-center font-black text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  aria-label="Ko'paytirish"
                  className="w-10 h-full rounded-xl hover:bg-gray-100 font-bold text-lg cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => add(p.id, qty)}
                className="flex-1 min-w-[150px] h-[52px] rounded-2xl bg-red-50 hover:bg-red-100 text-[#e5252b] font-extrabold text-[15px] transition flex items-center justify-center gap-2 border border-red-200/60 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">shopping_bag</span>
                <span>{isRu ? "В корзину" : "Savatga qo'shish"}</span>
              </button>

              <button
                onClick={() => {
                  add(p.id, qty);
                  nav("/cart");
                }}
                className="flex-1 basis-full sm:basis-0 min-w-[150px] h-[52px] rounded-2xl bg-gradient-to-r from-[#e5252b] to-[#c8102e] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-[15px] shadow-lg shadow-red-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">bolt</span>
                <span>{isRu ? "Купить в 1 клик" : "1 klikda xarid"}</span>
              </button>
            </div>

            {/* AI Assistant & Telegram Bot Help Strip */}
            <div className="mt-4 p-3.5 bg-gradient-to-r from-purple-50/70 via-sky-50/50 to-white rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[12px] font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <span className="material-symbols-rounded text-[16px] text-purple-600">psychology</span>
                  <span>{isRu ? "AI Консультант & Telegram Бот" : "AI Maslahatchi & Telegram Bot"}</span>
                </span>
                <button
                  type="button"
                  onClick={openStoreInfo}
                  className="text-[11.5px] font-bold text-[#0088cc] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{isRu ? "Реквизиты магазина" : "Do'kon rekvizitlari"}</span>
                  <span className="material-symbols-rounded text-[14px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => openAiAssistant(isRu ? `Расскажи о характеристиках, цене и гарантии товара «${title}»` : `«${p.title}» tovari haqida xususiyatlari, narxi va kafolati bo'yicha ma'lumot ber`)}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-[#e5252b] text-purple-700 hover:text-white border border-purple-200 transition-all flex items-center justify-center gap-2 text-[12.5px] font-bold shadow-2xs group cursor-pointer"
                  title={isRu ? "Спросить AI консультанта об этом товаре" : "AI maslahatchidan ushbu mahsulot haqida ma'lumot so'rash"}
                >
                  <AiSparkleIcon className="w-4 h-4 shrink-0 transition group-hover:scale-110" />
                  <span className="truncate">{isRu ? "Спросить AI Помощника" : "AI Maslahatchidan so'rash"}</span>
                </button>

                <button
                  type="button"
                  onClick={openStoreInfo}
                  className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-[#0088cc] text-[#0088cc] hover:text-white border border-sky-200 transition-all flex items-center justify-center gap-2 text-[12.5px] font-bold shadow-2xs group cursor-pointer"
                  title={isRu ? "Telegram Бот: контакты, доставка и ответы на вопросы" : "Telegram Bot: manzillar, yetkazish va savol-javob"}
                >
                  <TelegramIcon className="w-4 h-4 shrink-0 transition group-hover:scale-110" />
                  <span className="truncate">{isRu ? "Telegram Бот (Вопрос-ответ)" : "Telegram Bot (Savol-javob)"}</span>
                </button>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-[13px]">
              <div className="bg-white rounded-2xl p-4 border border-gray-150 flex items-start gap-3">
                <span className="material-symbols-rounded text-[24px] text-emerald-600 shrink-0">local_shipping</span>
                <div>
                  <b className="text-gray-900">{isRu ? "Бесплатная доставка завтра" : "Ertaga bepul yetkazamiz"}</b>
                  <p className="text-gray-500 mt-0.5">{isRu ? "В пункты выдачи за 1 день" : "Topshirish punktlariga 1 kunda yetib boradi"}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-150 flex items-start gap-3">
                <span className="material-symbols-rounded text-[24px] text-sky-600 shrink-0">verified</span>
                <div>
                  <b className="text-gray-900">{isRu ? "12 месяцев официальной гарантии" : "12 oy rasmiy kafolat"}</b>
                  <p className="text-gray-500 mt-0.5">{isRu ? "Легкий возврат в течение 14 дней" : "14 kunda oson qaytarish kafolati"}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 sm:gap-3 mt-10 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(isRu 
            ? ["Характеристики и описание", `Отзывы (${p.reviews})`, "Частые вопросы (FAQ)", "Доставка"]
            : ["Xususiyatlari va tavsifi", `Sharhlar (${p.reviews})`, "Savol-javoblar (42)", "Yetkazib berish"]
          ).map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`shrink-0 whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-[14px] transition cursor-pointer ${
                tab === i
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="mt-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs">
          {tab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{isRu ? "Технические параметры" : "Texnik ko'rsatkichlar"}</h3>
                <div className="space-y-2">
                  {specs.map(([k, v], i) => (
                    <div
                      key={k}
                      className={`flex justify-between gap-4 px-4 py-3 text-[14px] rounded-xl ${
                        i % 2 === 0 ? "bg-gray-50/80" : ""
                      }`}
                    >
                      <span className="text-gray-500 font-medium">{k}</span>
                      <b className="text-gray-900 text-right">{v}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{isRu ? "Описание товара" : "Mahsulot tavsifi"}</h3>
                <p className="text-gray-600 leading-relaxed text-[14.5px]">
                  {title}. {isRu 
                    ? "Быстрая и надежная доставка во все регионы Узбекистана. Напрямую от официального производителя с гарантией оригинального качества."
                    : "O'zbekistonning barcha hududlariga tez va ishonchli yetkazib beriladi. Rasmiy ishlab chiqaruvchidan to'g'ridan-to'g'ri asl nusxadagi sifat kafolati bilan."}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-100">
                    <b className="text-2xl text-[#e5252b] font-black">{p.rating}</b>
                    <div className="text-[12px] text-gray-500 font-semibold mt-1">{isRu ? "Оценка покупателей" : "Xaridorlar bahosi"}</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                    <b className="text-2xl text-emerald-700 font-black">-{p.off}%</b>
                    <div className="text-[12px] text-gray-500 font-semibold mt-1">{isRu ? "Размер скидки" : "Chegirma hajmi"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="space-y-4">
              {reviews.map(([name, text, stars], idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 last:border-none">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-[#e5252b] font-bold flex items-center justify-center text-xs">
                      {name.charAt(0)}
                    </div>
                    <b className="text-gray-900 text-[14px]">{name}</b>
                    <div className="flex text-amber-500 text-[14px] ml-auto">
                      {"★".repeat(stars)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-[14px] mt-2 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 2 && (
            <div className="space-y-4">
              {faq.map(([q, a], idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4">
                  <b className="text-gray-900 text-[15px]">{q}</b>
                  <p className="text-gray-600 text-[14px] mt-1.5 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 3 && (
            <div className="text-gray-600 text-[14.5px] leading-relaxed space-y-2">
              <p>{isRu ? "Доставка по Ташкенту осуществляется от 20 минут до 1 дня." : "Yetkazib berish Toshkent shahri bo'ylab 20 daqiqadan 1 kungacha amalga oshiriladi."}</p>
              <p>{isRu ? "Для заказов на сумму от 150 000 сум доставка абсолютно бесплатна." : "150 000 so'mdan yuqori bo'lgan buyurtmalar uchun yetkazib berish butunlay bepul."}</p>
            </div>
          )}
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[20px] sm:text-[24px] font-black text-gray-900">
                {isRu ? "Похожие товары" : "O'xshash mahsulotlar"}
              </h2>
              <p className="text-[13px] text-gray-500">
                {isRu ? "Товары, которые смотрят вместе с этим" : "Ushbu tovar bilan birgalikda ko'rilgan mahsulotlar"}
              </p>
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => rail.current?.scrollBy({ left: -400, behavior: "smooth" })}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">arrow_back</span>
              </button>
              <button
                onClick={() => rail.current?.scrollBy({ left: 400, behavior: "smooth" })}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div ref={rail} className="flex gap-4 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none]">
            {similar.map((s) => (
              <div key={s.id} className="w-[170px] sm:w-[230px] shrink-0">
                <ProductCard p={s} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bar on Mobile for Product Details */}
      <div className="lg:hidden fixed bottom-[52px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-3.5 py-2 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="min-w-0">
          <span className="text-[10px] text-gray-500 font-bold block leading-none">{isRu ? "Цена товара" : "Tovarning narxi"}</span>
          <span className="text-[16px] font-black text-gray-900 leading-tight truncate block">{fmt(price, lang)}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleFav(p.id)}
            aria-label={isFav ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              isFav ? "bg-red-50 border-red-200 text-[#e5252b]" : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            <span className={`material-symbols-rounded text-[20px] ${isFav ? "fill-current" : ""}`}>favorite</span>
          </button>
          <button
            onClick={() => add(p.id, qty)}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#e5252b] to-[#c81a20] text-white font-extrabold text-[13px] flex items-center gap-1.5 shadow-md shadow-red-500/20 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-rounded text-[17px]">shopping_bag</span>
            <span>{isRu ? "В корзину" : "Savatga"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
