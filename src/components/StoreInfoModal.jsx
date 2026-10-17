import { useState, useEffect, useRef } from "react";
import { useStore } from "../lib/store";
import { STORE_INFO, SOCIAL_LINKS, PRODUCTS, PROMOS, fmt } from "../lib/data";
import { TelegramIcon } from "./SocialIcons";

export default function StoreInfoModal() {
  const { isStoreInfoOpen, closeStoreInfo, openProductModal } = useStore();
  const { telegramBot } = SOCIAL_LINKS;

  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "info"
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      time: "06:00",
      text: `Assalomu alaykum! «${STORE_INFO.name}» rasmiy Telegram botiga xush kelibsiz! 🤖🏪\n\nMen sizga do'konimiz manzili, ish vaqti, yetkazib berish va barcha savollaringiz bo'yicha yordam beraman.\n\nMenga istalgan savolingizni yozing yoki quyidagi buyruqlardan birini tanlang:`,
      commands: [
        { cmd: "/dokon", label: "📍 Do'kon manzili & Ish vaqti" },
        { cmd: "/aloqa", label: "📞 Aloqa markazi (+998 95 271-98-71)" },
        { cmd: "/yetkazish", label: "🚚 Yetkazib berish shartlari" },
        { cmd: "/promokod", label: "🎟️ Chegirma promokodlari" },
        { cmd: "/kafolat", label: "🛡️ Kafolat va qaytarish" },
      ],
    },
  ]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isStoreInfoOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(scrollToBottom, 150);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isStoreInfoOpen, activeTab]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isStoreInfoOpen) closeStoreInfo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStoreInfoOpen, closeStoreInfo]);

  if (!isStoreInfoOpen) return null;

  // Telegram bot natural language responder
  const handleBotResponse = (userText) => {
    const q = userText.toLowerCase().trim();

    // 1. /dokon or Address / Working Hours
    if (
      q.includes("/dokon") ||
      q.includes("manzil") ||
      q.includes("qayerda") ||
      q.includes("bosh ofis") ||
      q.includes("filial") ||
      q.includes("ish vaqti") ||
      q.includes("ish tartibi") ||
      q.includes("vaqt") ||
      q.includes("ochiq")
    ) {
      return {
        text: `📍 **«Arzon Market» Bosh ofisi va do'koni:**\n\n🏢 **Manzil:** ${STORE_INFO.address}\n🧭 **Mo'ljal:** ${STORE_INFO.landmark}\n⏰ **Ish tartibi:** ${STORE_INFO.hours}\n\n🏪 Shuningdek, butun O'zbekiston bo'ylab 120 dan ortiq qulay tarqatish punktlarimiz mavjud. Xaridingizni 06:00 dan 00:00 gacha xohlagan vaqtingizda qabul qilib olishingiz mumkin!`,
        commands: [
          { cmd: "/aloqa", label: "📞 Aloqa markaziga qo'ng'iroq" },
          { cmd: "/yetkazish", label: "🚚 Yetkazib berish" },
        ],
      };
    }

    // 2. /aloqa or Phone / Operator
    if (
      q.includes("/aloqa") ||
      q.includes("telefon") ||
      q.includes("nomer") ||
      q.includes("aloqa") ||
      q.includes("operator") ||
      q.includes("bog'lanish") ||
      q.includes("boglanish") ||
      q.includes("call")
    ) {
      return {
        text: `📞 **Aloqa markazi va Call-markaz:**\n\n☎️ **Telefon:** ${STORE_INFO.phone}\n📱 **Qo'ng'iroq qilish:** [${STORE_INFO.phone}](tel:${STORE_INFO.rawPhone})\n⏰ **Ish vaqti:** ${STORE_INFO.hours}\n💬 **Telegram:** ${telegramBot.username}\n\nOperatorlarimiz sizga buyurtma, to'lov va tovarlar bo'yicha jonli yordam ko'rsatishadi!`,
        phoneCall: true,
        commands: [
          { cmd: "/dokon", label: "📍 Do'kon manzili" },
          { cmd: "/yetkazish", label: "🚚 Yetkazib berish" },
        ],
      };
    }

    // 3. /yetkazish or Delivery
    if (
      q.includes("/yetkazish") ||
      q.includes("yetkaz") ||
      q.includes("dostavka") ||
      q.includes("kuryer") ||
      q.includes("bepul")
    ) {
      return {
        text: `🚚 **Yetkazib berish xizmati:**\n\n• **Narxi:** 150 000 so'mdan yuqori buyurtmalar butun O'zbekiston bo'ylab **MUTLAQO BEPUL**!\n• **Muddati:** 1 kunda topshirish punktlariga yoki eshigingizgacha yetkazib beriladi.\n• **Tezkor kuryer (Toshkent):** 20-30 daqiqa ichida yetkazib berish imkoniyati mavjud.\n• **Ish vaqti:** Kuryerlarimiz har kuni 06:00 dan 00:00 gacha xizmatingizda!`,
        commands: [
          { cmd: "/dokon", label: "📍 Bosh ofis manzili" },
          { cmd: "/promokod", label: "🎟️ Promokodlar" },
        ],
      };
    }

    // 4. /promokod or Promos
    if (
      q.includes("/promokod") ||
      q.includes("promokod") ||
      q.includes("chegirma") ||
      q.includes("kupon") ||
      q.includes("skidka")
    ) {
      return {
        text: `🎟️ **Faol chegirma promokodlari:**\n\n• **ARZON2026** — 30 000 so'm chegirma (100 mingdan yuqori xaridga)\n• **BAHOR50** — 50 000 so'm bahorgi mega chegirma (250 mingdan yuqori)\n• **SUPER10** — 20 000 so'm super aksiya (80 mingdan yuqori)\n\nPromokodni savatda kiriting va darhol chegirmaga ega bo'ling!`,
        commands: [
          { cmd: "/yetkazish", label: "🚚 Yetkazib berish" },
          { cmd: "/dokon", label: "📍 Manzillar" },
        ],
      };
    }

    // 5. /kafolat or Warranty
    if (
      q.includes("/kafolat") ||
      q.includes("kafolat") ||
      q.includes("garantiya") ||
      q.includes("qaytarish")
    ) {
      return {
        text: `🛡️ **Kafolat va xaridor huquqlari:**\n\n• Barcha mahsulotlar 100% original va rasmiy hisoblanadi.\n• Maishiy texnika va gadjetlarga **12 oylik rasmiy kafolat** beriladi.\n• Tovarni **14 kun ichida** hech qanday to'siqsiz qaytarish yoki almashtirish kafolatlangan!`,
        commands: [
          { cmd: "/aloqa", label: "📞 Operator bilan bog'lanish" },
          { cmd: "/dokon", label: "📍 Do'kon manzili" },
        ],
      };
    }

    // 6. /buyurtma or Order tracking
    if (q.includes("/buyurtma") || q.includes("buyurtma") || q.includes("trekking")) {
      return {
        text: `📦 **Buyurtma holatini bilish:**\n\nSaytdagi «Buyurtmalarim» bo'limi orqali yoki buyurtma kodingizni (masalan: AM-780123) yuborish orqali buyurtmangiz holatini kuzatishingiz mumkin. Kuryer jo'natilganda sizga SMS-xabar yuboriladi!`,
        commands: [
          { cmd: "/aloqa", label: "📞 Operator: +998 95 271-98-71" },
        ],
      };
    }

    // 7. Product Search inside bot
    const matched = PRODUCTS.filter((p) =>
      (p.title + " " + p.group + " " + p.sub).toLowerCase().includes(q)
    );

    if (matched.length > 0) {
      const top3 = matched.slice(0, 3);
      return {
        text: `🔍 Sizning so'rovingiz bo'yicha do'konda quyidagi tovarlar topildi:\n\n` +
          top3
            .map(
              (p, i) =>
                `${i + 1}. **${p.title}**\n   💰 Narxi: ${fmt(p.price)} (oyiga: ${fmt(p.monthly)})\n   ⭐ Reyting: ${p.rating} / 5`
            )
            .join("\n\n"),
        products: top3,
        commands: [
          { cmd: "/dokon", label: "📍 Do'kon manzili" },
          { cmd: "/aloqa", label: "📞 Aloqa markazi" },
        ],
      };
    }

    // 8. General fallback
    return {
      text: `Savolingiz uchun tashakkur! «${userText}» bo'yicha ma'lumot qabul qilindi.\n\nSizga tez va aniq yordam berishim uchun quyidagi tugmalardan birini bosing yoki bevosita operatorimiz bilan bog'laning:`,
      commands: [
        { cmd: "/dokon", label: "📍 Do'kon manzili & Ish vaqti" },
        { cmd: "/aloqa", label: "📞 Aloqa markazi: +998 (95) 271-98-71" },
        { cmd: "/yetkazish", label: "🚚 Yetkazib berish shartlari" },
        { cmd: "/promokod", label: "🎟️ Chegirma promokodlari" },
      ],
    };
  };

  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
      text: msg,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = handleBotResponse(msg);
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        text: botReply.text,
        commands: botReply.commands || [],
        products: botReply.products || [],
        phoneCall: botReply.phoneCall || false,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={closeStoreInfo}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl h-[90vh] max-h-[740px] flex flex-col z-10 overflow-hidden animate-modal-pop">
        
        {/* Header - Telegram Style */}
        <div className="p-4 sm:p-5 border-b border-gray-150 bg-[#0088cc] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <TelegramIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] sm:text-[19px] font-black leading-tight tracking-tight">
                  {STORE_INFO.name} Bot
                </h3>
                <span className="material-symbols-rounded text-white text-[18px]">verified</span>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  bot
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-white/90 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>24/7 onlayn • {telegramBot.username}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={telegramBot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#0088cc] text-[12px] font-bold hover:bg-sky-50 transition shadow-2xs"
              title="Haqiqiy Telegram ilovasida ochish"
            >
              <span>Telegramda ochish</span>
              <span className="material-symbols-rounded text-[14px]">open_in_new</span>
            </a>

            <button
              onClick={closeStoreInfo}
              aria-label="Yopish"
              className="w-8 h-8 rounded-xl hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <span className="material-symbols-rounded text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle: Bot Chat vs Store Info */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-[13px] font-bold shrink-0">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "chat"
                ? "border-[#0088cc] text-[#0088cc] bg-white"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span className="material-symbols-rounded text-[18px]">chat</span>
            <span>Jonli savol-javob boti</span>
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "info"
                ? "border-[#0088cc] text-[#0088cc] bg-white"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span className="material-symbols-rounded text-[18px]">storefront</span>
            <span>Do'kon rekvizitlari va manzili</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE BOT CHAT */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#eef3f7]/80">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
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
                        ? "bg-[#0088cc] text-white rounded-tr-none font-medium"
                        : "bg-white text-gray-900 border border-gray-200/80 rounded-tl-none font-normal"
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {/* Quick Phone Call Button */}
                    {m.phoneCall && (
                      <div className="mt-3 pt-2 border-t border-gray-150">
                        <a
                          href={`tel:${STORE_INFO.rawPhone}`}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12.5px] shadow-sm transition"
                        >
                          <span className="material-symbols-rounded text-[18px]">call</span>
                          <span>{STORE_INFO.phone} raqamiga qo'ng'iroq qilish</span>
                        </a>
                      </div>
                    )}

                    {/* Products in Bot Reply */}
                    {m.products && m.products.length > 0 && (
                      <div className="mt-2.5 space-y-1.5 pt-2 border-t border-gray-150">
                        {m.products.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-[12px]"
                          >
                            <span className="font-bold text-gray-900 truncate max-w-[220px]">
                              {p.title}
                            </span>
                            <button
                              onClick={() => {
                                closeStoreInfo();
                                openProductModal(p);
                              }}
                              className="px-2 py-1 bg-[#0088cc] text-white rounded-lg font-bold text-[11px] shrink-0 hover:bg-[#006699]"
                            >
                              Ko'rish
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[10px] mt-1 text-right ${
                        m.sender === "user" ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {m.time}
                    </div>
                  </div>

                  {/* Bot Commands Keyboard Buttons */}
                  {m.commands && m.commands.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%] sm:max-w-[80%]">
                      {m.commands.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(c.cmd)}
                          className="text-[11.5px] font-bold px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#0088cc] border border-sky-200 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                        >
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 text-[12px] bg-white border border-gray-200 rounded-2xl px-3.5 py-2 w-fit shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#0088cc] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#0088cc] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#0088cc] animate-bounce [animation-delay:0.3s]" />
                  <span className="ml-1 font-semibold text-[#0088cc]">bot yozmoqda...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-gray-200 bg-white flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Savolingizni yozing (masalan: Do'kon manzili qayerda?)..."
                className="flex-1 h-11 pl-4 pr-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#0088cc] focus:bg-white text-[13.5px] text-gray-900 outline-none transition"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className={`h-11 px-4 sm:px-5 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0 ${
                  input.trim()
                    ? "bg-[#0088cc] text-white shadow-md shadow-sky-500/20 cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>Yuborish</span>
                <span className="material-symbols-rounded text-[18px]">send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: STORE INFO DETAILS */}
        {activeTab === "info" && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white">
            {/* Main Details Box */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#0088cc] to-[#006699] text-white shadow-lg shadow-sky-500/20">
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
                🏪 Rasmiy Bosh Ofis & Do'kon
              </span>
              <h3 className="text-[20px] font-black mt-2 leading-tight">
                {STORE_INFO.name}
              </h3>
              <p className="text-[13px] text-white/90 mt-1 leading-relaxed">
                {STORE_INFO.slogan}
              </p>

              <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap gap-2">
                <a
                  href={`tel:${STORE_INFO.rawPhone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#0088cc] font-black text-[13px] hover:bg-sky-50 transition"
                >
                  <span className="material-symbols-rounded text-[18px]">call</span>
                  <span>{STORE_INFO.phone}</span>
                </a>

                <a
                  href={telegramBot.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400/30 text-white font-bold text-[13px] hover:bg-sky-400/40 transition border border-white/20"
                >
                  <TelegramIcon className="w-4 h-4" />
                  <span>{telegramBot.username}</span>
                </a>
              </div>
            </div>

            {/* Grid of verified parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[13px]">
              {/* Working Hours */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                <span className="material-symbols-rounded text-[24px] text-amber-600 shrink-0">
                  schedule
                </span>
                <div>
                  <b className="text-gray-900 block font-bold text-[13.5px]">Ish tartibi:</b>
                  <p className="text-gray-700 font-semibold mt-0.5">{STORE_INFO.hours}</p>
                  <span className="text-[11px] text-amber-800 font-medium block mt-1">
                    Dam olish kunlarisiz, haftaning 7 kuni 18 soat uzluksiz xizmat
                  </span>
                </div>
              </div>

              {/* Phone Center */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                <span className="material-symbols-rounded text-[24px] text-emerald-600 shrink-0">
                  call
                </span>
                <div>
                  <b className="text-gray-900 block font-bold text-[13.5px]">Aloqa markazi:</b>
                  <a
                    href={`tel:${STORE_INFO.rawPhone}`}
                    className="text-emerald-700 font-black text-[15px] hover:underline block mt-0.5"
                  >
                    {STORE_INFO.phone}
                  </a>
                  <span className="text-[11px] text-emerald-800 font-medium block mt-1">
                    Har kuni 06:00 dan 00:00 gacha qo'ng'iroqlarni qabul qilamiz
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3">
                <span className="material-symbols-rounded text-[24px] text-sky-600 shrink-0">
                  location_on
                </span>
                <div>
                  <b className="text-gray-900 block font-bold text-[13.5px]">Bosh ofis manzili:</b>
                  <p className="text-gray-800 font-semibold mt-0.5 leading-snug">
                    {STORE_INFO.address}
                  </p>
                  <span className="text-[11px] text-sky-800 font-medium block mt-1">
                    Mo'ljal: {STORE_INFO.landmark}
                  </span>
                </div>
              </div>

              {/* Delivery */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3">
                <span className="material-symbols-rounded text-[24px] text-purple-600 shrink-0">
                  local_shipping
                </span>
                <div>
                  <b className="text-gray-900 block font-bold text-[13.5px]">Yetkazib berish:</b>
                  <p className="text-gray-700 font-semibold mt-0.5 leading-snug">
                    {STORE_INFO.delivery}
                  </p>
                  <span className="text-[11px] text-purple-800 font-medium block mt-1">
                    120+ ta topshirish punktlari respublika bo'ylab
                  </span>
                </div>
              </div>
            </div>

            {/* Telegram Bot Connection Card */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                <b className="text-gray-900 text-[13.5px] block font-bold">
                  Telegram Bot orqali 24/7 savol-javob
                </b>
                <p className="text-gray-500 text-[12px] mt-0.5">
                  Telegram ilovangizda to'g'ridan-to'g'ri {telegramBot.username} ga savolingizni yuborishingiz mumkin.
                </p>
              </div>

              <a
                href={telegramBot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-[12.5px] font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <TelegramIcon className="w-4 h-4" />
                <span>Botga o'tish</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
