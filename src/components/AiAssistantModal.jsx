import { useState, useEffect, useRef } from "react";
import { useStore } from "../lib/store";
import { PRODUCTS, PROMOS, STORE_INFO, fmt } from "../lib/data";
import { useOverlay } from "../lib/hooks";
import { translateProductTitle } from "../lib/translations";
import { AiSparkleIcon } from "./SocialIcons";

export default function AiAssistantModal() {
  const {
    isAiAssistantOpen,
    closeAiAssistant,
    aiInitialQuery,
    add,
    toast,
    openProductModal,
    openStoreInfo,
    lang,
  } = useStore();

  const isRu = lang === "ru";

  const getGreeting = (russian) => ({
    id: 1,
    sender: "ai",
    time: russian ? "Сейчас" : "Hozir",
    text: russian
      ? "Здравствуйте! Я ИИ-консультант Arzon Market 🤖✨\n\nПомогу подобрать лучшие товары под ваш бюджет, расскажу о скидках, рассрочке (0-0-12) и условиях доставки. Какой товар или информацию вы ищете?"
      : "Assalomu alaykum! Men Arzon Marketning sun'iy intellekt maslahatchisiman 🤖✨\n\nSizga xohlagan budjetingiz bo'yicha eng sara mahsulotlarni topishda, chegirmalar va to'lov shartlarida yordam beraman. Qanday tovar yoki ma'lumot qidiryapsiz?",
    chips: russian
      ? [
          "🔥 Топовые смартфоны",
          "💰 Подарки до 500 000 сум",
          "🎟️ Промокоды на скидку",
          "🚚 Условия доставки",
          "💳 Рассрочка (0-0-12)",
        ]
      : [
          "🔥 Eng sara smartfonlar",
          "💰 500 000 so'mgacha sovg'alar",
          "🎟️ Bugungi chegirma promokodlari",
          "🚚 Yetkazib berish shartlari",
          "💳 Muddatli to'lov (0-0-12)",
        ],
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => [getGreeting(isRu)]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useOverlay(isAiAssistantOpen, closeAiAssistant);

  useEffect(() => {
    if (isAiAssistantOpen) {
      setTimeout(scrollToBottom, 150);
    }
  }, [isAiAssistantOpen]);


  // AI response engine with comprehensive product knowledge
  const generateAiReply = (query) => {
    const q = (typeof query === "string" ? query : "").toLowerCase().trim();

    // 1. Promos and discounts
    if (
      q.includes("promokod") ||
      q.includes("chegirma") ||
      q.includes("kupon") ||
      q.includes("aksiya") ||
      q.includes("skidka") ||
      q.includes("промокод") ||
      q.includes("скидк") ||
      q.includes("акци") ||
      q.includes("купон")
    ) {
      const promoList = Object.values(PROMOS);
      return {
        text: isRu
          ? `Сегодня в Arzon Market действуют активные скидочные промокоды! Вы можете применить их прямо в корзине:`
          : `Bugungi kunda Arzon Marketda faol chegirma promokodlari mavjud! Savatda ularni bemalol ishlatishingiz mumkin:`,
        promos: promoList,
        chips: isRu
          ? [
              "📱 Посоветуй смартфоны",
              "🚚 Сколько стоит доставка?",
              "💳 Рассрочка (0-0-12)",
            ]
          : [
              "📱 Telefonlar tavsiya qil",
              "🚚 Yetkazib berish qancha?",
              "💳 Muddatli to'lov",
            ],
      };
    }

    // 2. Delivery questions
    if (
      q.includes("yetkazish") ||
      q.includes("yetkazib") ||
      q.includes("dostavka") ||
      q.includes("kuryer") ||
      q.includes("qachon yetadi") ||
      q.includes("доставк") ||
      q.includes("курьер") ||
      q.includes("когда привез")
    ) {
      return {
        text: isRu
          ? `🚚 **Информация о доставке Arzon Market:**\n\n• **Бесплатная доставка:** при заказе от 150 000 сум доставляем за 1 день по всему Узбекистану.\n• **Срочный курьер по Ташкенту:** за 20-30 минут прямо до вашей двери.\n• **Пункты выдачи:** более 120 удобных пунктов по всей республике с бесплатной примеркой и проверкой товара.`
          : `🚚 **Yetkazib berish ma'lumotlari:**\n\n• **Bepul yetkazish:** 150 000 so'mdan yuqori xaridlar uchun butun O'zbekiston bo'ylab 1 kunda yetkazib beriladi.\n• **Toshkent bo'yicha tezkor kuryer:** 20-30 daqiqa ichida eshigingizgacha.\n• **Topshirish punktlari:** Respublika bo'ylab 120+ ta punkt mavjud. Mahsulotni kelib o'zingiz tekshirib olishingiz mumkin.`,
        chips: isRu
          ? [
              "🏪 Адрес магазина",
              "🛡️ Есть ли гарантия?",
              "📱 Покажи смартфоны",
            ]
          : [
              "🏪 Do'kon manzillari",
              "🛡️ Kafolat bormi?",
              "📱 Smartfonlarni ko'rsat",
            ],
      };
    }

    // 3. Installment / Payment
    if (
      q.includes("muddatli") ||
      q.includes("nasiya") ||
      q.includes("kredit") ||
      q.includes("bolib tolash") ||
      q.includes("bo'lib to'lash") ||
      q.includes("0-0-12") ||
      q.includes("рассрочк") ||
      q.includes("кредит") ||
      q.includes("частям") ||
      q.includes("оплат")
    ) {
      return {
        text: isRu
          ? `💳 **Беспроцентная рассрочка (0-0-12):**\n\n• Первоначальный взнос: **0 сум**\n• Переплата: **0% (без наценок)**\n• Срок: **на 3, 6 или 12 месяцев**\n• Необходимый документ: только паспорт или ID-карта (быстрое одобрение за 2 минуты онлайн).\n\nНа карточке каждого товара указан размер ежемесячного платежа.`
          : `💳 **Muddatli to'lov (Uzum Nasiya 0-0-12):**\n\n• Boshlang'ich to'lov: **0 so'm**\n• Ortiqcha ustama: **0% foiz**\n• Muddat: **3, 6 yoki 12 oyga bo'lib to'lash**\n• Kerakli hujjat: Faqat pasport yoki ID karta (rasmiylashtirish 2 daqiqada).\n\nBarcha mahsulotlar kartochkasida oylik to'lov summasi ko'rsatilgan.`,
        chips: isRu
          ? [
              "📱 Смартфоны",
              "💻 Ноутбуки",
              "🏠 Товары для дома",
            ]
          : [
              "📱 Telefonlar",
              "💻 Noutbuklar",
              "🏠 Ro'zg'or buyumlari",
            ],
      };
    }

    // 4. Warranty & Return
    if (
      q.includes("kafolat") ||
      q.includes("garantiya") ||
      q.includes("qaytarish") ||
      q.includes("almashtirish") ||
      q.includes("гаранти") ||
      q.includes("возврат") ||
      q.includes("обмен")
    ) {
      return {
        text: isRu
          ? `🛡️ **Гарантия и условия возврата:**\n\n• **12 месяцев официальной гарантии:** на всю электронику и бытовую технику действует 1 год гарантии сервисного центра.\n• **Легкий возврат в течение 14 дней:** если товар не подошел или обнаружен дефект, вы можете быстро вернуть или обменять его без лишних вопросов.`
          : `🛡️ **Kafolat va qaytarish kafolati:**\n\n• **12 oy rasmiy kafolat:** Elektronika va maishiy texnikalarga 1 yil rasmiy servis markazi kafolati beriladi.\n• **14 kunda oson qaytarish:** Agar mahsulot ma'qul kelmasa yoki nuqsoni bo'lsa, 14 kun ichida ortiqcha savollarsiz qaytarib berishingiz yoki almashtirishingiz mumkin.`,
        chips: isRu
          ? [
              "📞 Контакт-центр",
              "🏪 Адрес главного офиса",
              "🔥 Популярные товары",
            ]
          : [
              "📞 Aloqa markazi",
              "🏪 Bosh ofis manzili",
              "🔥 Ommabop tovarlar",
            ],
      };
    }

    // 5. Store Address / Working Hours / Contact
    if (
      q.includes("manzil") ||
      q.includes("dokon") ||
      q.includes("do'kon") ||
      q.includes("qayerda") ||
      q.includes("ofis") ||
      q.includes("telefon") ||
      q.includes("ish vaqti") ||
      q.includes("адрес") ||
      q.includes("где") ||
      q.includes("контакт") ||
      q.includes("офис") ||
      q.includes("телефон") ||
      q.includes("время") ||
      q.includes("режим")
    ) {
      return {
        text: isRu
          ? `🏪 **Главный офис и магазин Arzon Market:**\n\n📍 **Адрес:** ${STORE_INFO.address}\n⏰ **Режим работы:** Har kuni 06:00 dan 00:00 gacha (18 часов в день без выходных)\n📞 **Контакт-центр:** ${STORE_INFO.phone}\n\nВы также можете задавать вопросы в нашем Telegram-боте 24/7!`
          : `🏪 **Arzon Market bosh do'koni ma'lumotlari:**\n\n📍 **Manzil:** ${STORE_INFO.address}\n⏰ **Ish tartibi:** ${STORE_INFO.hours}\n📞 **Aloqa markazi:** ${STORE_INFO.phone}\n\nSavollaringizga Telegram boti orqali ham 24/7 javob olishingiz mumkin!`,
        actionTelegram: true,
        chips: isRu
          ? [
              "🤖 Открыть Telegram бот",
              "🚚 Доставка",
              "🎟️ Промокоды",
            ]
          : [
              "🤖 Telegram botni ochish",
              "🚚 Yetkazib berish",
              "🎟️ Promokodlar",
            ],
      };
    }

    // 6. Product Budget / Keyword Search
    let matchedProducts = [];

    // Check for budget mentions
    let maxBudget = null;
    if (q.includes("500") && (q.includes("ming") || q.includes("000") || q.includes("тыс"))) maxBudget = 500000;
    else if (q.includes("300") && (q.includes("ming") || q.includes("000") || q.includes("тыс"))) maxBudget = 300000;
    else if (q.includes("100") && (q.includes("ming") || q.includes("000") || q.includes("тыс"))) maxBudget = 100000;
    else if (q.includes("1") && (q.includes("mln") || q.includes("million") || q.includes("млн"))) maxBudget = 1000000;
    else if (q.includes("2") && (q.includes("mln") || q.includes("million") || q.includes("млн"))) maxBudget = 2000000;
    else if (q.includes("5") && (q.includes("mln") || q.includes("million") || q.includes("млн"))) maxBudget = 5000000;

    // Filter products by query keywords
    const keywords = q
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);

    matchedProducts = PRODUCTS.filter((p) => {
      const matchText = (
        p.title +
        " " +
        translateProductTitle(p.title, "ru") +
        " " +
        p.group +
        " " +
        p.sub +
        " " +
        p.brand
      ).toLowerCase();

      const hitsKeyword =
        keywords.length === 0 ||
        keywords.some((k) => matchText.includes(k));

      const hitsBudget = maxBudget ? p.price <= maxBudget : true;

      return hitsKeyword && hitsBudget;
    });

    if (matchedProducts.length > 0) {
      const topProducts = matchedProducts.slice(0, 4);
      return {
        text: isRu
          ? `По вашему запросу найдено ${topProducts.length} лучших товаров. Вы можете добавить любой из них в корзину в один клик:`
          : `Sizning so'rovingiz bo'yicha eng mos ${topProducts.length} ta mahsulotni tanladim. Istasangiz, to'g'ridan-to'g'ri bitta bosishda savatga qo'shishingiz mumkin:`,
        products: topProducts,
        chips: isRu
          ? [
              "🎟️ Есть промокод?",
              "🚚 Когда доставят?",
              "💳 Оплата частями",
            ]
          : [
              "🎟️ Promokod bormi?",
              "🚚 Qachon yetkaziladi?",
              "💳 Bo'lib to'lash",
            ],
      };
    }

    // Fallback: general recommendations
    const featured = PRODUCTS.slice(0, 3);
    return {
      text: isRu
        ? `Я понял ваш запрос! Вот несколько самых популярных товаров с высоким рейтингом. Или напишите категорию (например: телефон, одежда, техника, обувь):`
        : `Sizning so'rovingizni tushundim! Do'konimizdagi eng ommabop va yuqori reytingli mahsulotlardan bir nechtasini taklif qilaman. Yoki qidirayotgan aniq toifangizni (masalan: telefon, kiyim, texnika, oziq-ovqat) yozing:`,
      products: featured,
      chips: isRu
        ? [
            "📱 Смартфоны",
            "💻 Техника и компьютеры",
            "👟 Одежда и обувь",
            "🚚 Условия доставки",
          ]
        : [
            "📱 Smartfonlar",
            "💻 Texnika & Kompyuterlar",
            "👟 Kiyim va poyabzal",
            "🚚 Yetkazib berish qanday?",
          ],
    };
  };

  const handleUserSend = (userText) => {
    const raw = typeof userText === "string" ? userText : (typeof input === "string" ? input : "");
    const textToSend = raw.trim();
    if (!textToSend) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      time: isRu ? "Сейчас" : "Hozir",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const replyData = generateAiReply(textToSend);
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        time: isRu ? "Сейчас" : "Hozir",
        text: replyData.text,
        products: replyData.products || [],
        promos: replyData.promos || [],
        actionTelegram: replyData.actionTelegram || false,
        chips: replyData.chips || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }, 500);
  };

  const handleChipClick = (chip) => {
    if (
      chip === "🤖 Telegram botni ochish" ||
      chip === "🤖 Открыть Telegram бот" ||
      chip === "🏪 Do'kon manzillari" ||
      chip === "🏪 Адрес магазина" ||
      chip === "🏪 Адрес главного офиса"
    ) {
      closeAiAssistant();
      openStoreInfo();
      return;
    }
    handleUserSend(chip);
  };

  // Handle initial query if provided when opening modal
  useEffect(() => {
    if (isAiAssistantOpen && typeof aiInitialQuery === "string" && aiInitialQuery.trim()) {
      handleUserSend(aiInitialQuery.trim());
    }
  }, [isAiAssistantOpen, aiInitialQuery]);

  if (!isAiAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={closeAiAssistant}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl h-[88vh] max-h-[720px] flex flex-col z-10 overflow-hidden animate-modal-pop">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-150 bg-gradient-to-r from-purple-700 via-indigo-600 to-[#e5252b] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-inner">
              <AiSparkleIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] sm:text-[19px] font-black leading-tight tracking-tight">
                  Arzon AI {isRu ? "Помощник" : "Yordamchi"}
                </h3>
                <span className="flex items-center gap-1 text-[10.5px] font-extrabold bg-emerald-400 text-gray-900 px-2 py-0.5 rounded-full shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 animate-ping" />
                  <span>{isRu ? "Онлайн" : "Onlayn"}</span>
                </span>
              </div>
              <p className="text-[12px] text-white/80 font-medium">
                {isRu
                  ? "Умный консультант по покупкам и поиск товаров"
                  : "Sun'iy intellekt xarid maslahatchisi va tovarlar qidiruvi"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: Date.now(),
                    sender: "ai",
                    time: isRu ? "Сейчас" : "Hozir",
                    text: isRu
                      ? "Диалог обновлен! Чем я могу вам еще помочь?"
                      : "Suhbat yangilandi! Sizga yana qanday yordam bera olaman?",
                    chips: isRu
                      ? [
                          "🔥 Топовые смартфоны",
                          "🎟️ Промокоды на скидку",
                          "🚚 Условия доставки",
                        ]
                      : [
                          "🔥 Eng sara smartfonlar",
                          "🎟️ Chegirma promokodlari",
                          "🚚 Yetkazib berish",
                        ],
                  },
                ]);
                toast(isRu ? "Диалог очищен и обновлен" : "Suhbat tozalab yangilandi");
              }}
              title={isRu ? "Очистить диалог" : "Suhbatni tozalash"}
              className="w-8 h-8 rounded-xl hover:bg-white/15 text-white/90 flex items-center justify-center transition cursor-pointer text-[13px]"
            >
              <span className="material-symbols-rounded text-[18px]">restart_alt</span>
            </button>

            <button
              onClick={closeAiAssistant}
              aria-label={isRu ? "Закрыть" : "Yopish"}
              className="w-8 h-8 rounded-xl hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <span className="material-symbols-rounded text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed shadow-2xs ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-[#e5252b] to-[#c81a20] text-white rounded-tr-none font-medium"
                    : "bg-white text-gray-800 border border-gray-150 rounded-tl-none font-normal"
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Interactive Promos Box if AI returned promos */}
                {m.promos && m.promos.length > 0 && (
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-gray-150">
                    {m.promos.map((pr) => (
                      <div
                        key={pr.code}
                        className="flex items-center justify-between p-2 rounded-xl bg-red-50/70 border border-red-150 text-[12px]"
                      >
                        <div>
                          <b className="font-mono text-[#e5252b] text-[13px]">{pr.code}</b>
                          <div className="text-gray-500 text-[11px]">{pr.label}</div>
                        </div>
                        <span className="bg-[#e5252b] text-white px-2 py-1 rounded-lg font-bold text-[11px]">
                          -{Math.round(pr.discount / 1000)}k
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Product Cards in Chat */}
                {m.products && m.products.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-gray-150">
                    {m.products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition"
                      >
                        <img
                          src={p.image}
                          alt={translateProductTitle(p.title, lang)}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-lg bg-white shrink-0 border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <b className="text-[12.5px] font-bold text-gray-900 block truncate">
                            {translateProductTitle(p.title, lang)}
                          </b>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-[13px] font-black text-[#e5252b]">
                              {fmt(p.price, lang)}
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold">
                              ({fmt(p.monthly, lang)}/{isRu ? "мес" : "oy"})
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => {
                              add(p.id, 1);
                              toast(
                                isRu
                                  ? `«${translateProductTitle(p.title, lang).slice(0, 20)}...» добавлен в корзину! 🛍️`
                                  : `«${p.title.slice(0, 20)}...» savatga qo'shildi! 🛍️`
                              );
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#e5252b] hover:bg-[#c81a20] text-white text-[11px] font-bold transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <span className="material-symbols-rounded text-[14px]">add_shopping_cart</span>
                            <span>{isRu ? "В корзину" : "Savatga"}</span>
                          </button>
                          <button
                            onClick={() => openProductModal(p)}
                            className="px-2 py-1 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-[10.5px] font-semibold text-center cursor-pointer"
                          >
                            {isRu ? "Просмотр" : "Ko'rish"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Telegram Bot Call-out Action */}
                {m.actionTelegram && (
                  <div className="mt-3 pt-2 border-t border-gray-150">
                    <button
                      onClick={() => {
                        closeAiAssistant();
                        openStoreInfo();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-[#0088cc] text-[#0088cc] hover:text-white font-bold text-[12px] flex items-center justify-center gap-2 transition cursor-pointer border border-sky-200"
                    >
                      <span className="material-symbols-rounded text-[16px]">smart_toy</span>
                      <span>
                        {isRu
                          ? "Задать вопрос в Telegram-боте (@ArzonMarket_bot)"
                          : "Telegram Botda savol berish (@ArzonMarket_bot)"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Chips suggestions */}
              {m.chips && m.chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%] sm:max-w-[80%]">
                  {m.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      className="text-[11.5px] font-semibold px-2.5 py-1 rounded-xl bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 text-[12px] bg-white border border-gray-150 rounded-2xl px-4 py-2.5 w-fit shadow-2xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#e5252b] animate-bounce [animation-delay:0.3s]" />
              <span className="ml-1 text-gray-500 font-semibold">
                {isRu ? "ИИ готовит ответ..." : "AI javob tayyorlamoqda..."}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSend();
          }}
          className="p-3 sm:p-4 border-t border-gray-150 bg-white flex items-center gap-2 shrink-0"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isRu
                  ? "Например: есть ли телефон до 1 млн сум? или сколько доставка?"
                  : "Masalan: 1 mln so'mgacha telefon bormi? yoki yetkazish qancha?"
              }
              className="w-full h-12 pl-4 pr-10 rounded-2xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white text-[13.5px] text-gray-900 outline-none transition"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[13px] font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className={`h-12 px-5 rounded-2xl font-bold text-[13.5px] flex items-center justify-center gap-2 transition active:scale-95 shrink-0 ${
              input.trim()
                ? "bg-gradient-to-r from-purple-600 to-[#e5252b] text-white shadow-md shadow-purple-500/20 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>{isRu ? "Отправить" : "Yuborish"}</span>
            <span className="material-symbols-rounded text-[18px]">send</span>
          </button>
        </form>

      </div>
    </div>
  );
}
