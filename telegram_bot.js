/**
 * ==============================================================================
 * 🤖 ARZON MARKET — HAQIQIY TELEGRAM BOT (AI BILAN INTEGRATSIYA)
 * ==============================================================================
 *
 * Ushbu bot real Telegram messenjerida ishlaydi va foydalanuvchining HAR QANDAY
 * savoliga (do'kon, mahsulotlar, narxlar yoki umumiy bilimlar) javob beradi.
 *
 * ISHGA TUSHIRISH:
 * 1. Telegramda @BotFather ga kiring va /newbot buyrug'i orqali yangi bot yarating.
 * 2. @BotFather bergan tokenni .env fayliga yozing:
 *      TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHI..."
 * 3. (Ixtiyoriy) Cheksiz AI javoblari uchun bepul Gemini API kalitini ham yozishingiz mumkin:
 *      GEMINI_API_KEY="AIzaSy..."
 * 4. Botni ishga tushiring:
 *      npm run bot
 *    yoki:
 *      node telegram_bot.js
 * ==============================================================================
 */

import fs from "node:fs";
import path from "node:path";

// 1. .env faylini avtomatik yuklash
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn("⚠️ .env faylini o'qishda ogohlantirish:", e.message);
    }
  }
}

loadEnv();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const SITE_URL = "https://arzon-market-psi.vercel.app";

// 2. Do'konning rasmiy ma'lumotlar bazasi
const STORE_INFO = {
  name: "Arzon Market",
  slogan: "O'zbekistondagi eng qulay va arzon internet do'kon",
  phone: "+998 (95) 271-98-71",
  rawPhone: "952719871",
  hours: "Har kuni 06:00 dan 00:00 gacha (dam olish kunlarisiz, 18 soat uzluksiz)",
  address: "Toshkent shahri, Bektemir tumani, Bo'g'i Eram 4-ko'cha, 3-uy",
  landmark: "Bektemir Bo'g'i Eram hududi",
  delivery: "O'zbekiston bo'ylab 1 kunda bepul yetkazib berish (150 000 so'mdan yuqori)",
  branches: "120+ ta topshirish punktlari respublika bo'ylab",
  guarantee: "12 oylik rasmiy kafolat va 14 kunda bepul qaytarish kafolati",
  installment: "0-0-12 muddatli to'lov (boshlang'ich to'lovsiz, foizsiz, 12 oygacha)",
  promos: [
    "🎟️ *ARZON2026* — 30 000 so'm chegirma (100 000 so'mdan yuqoriga)",
    "🎟️ *BAHOR50* — 50 000 so'm chegirma (250 000 so'mdan yuqoriga)",
    "🎟️ *SUPER10* — 20 000 so'm chegirma (80 000 so'mdan yuqoriga)",
    "🎟️ *YANGI15* — Birinchi xarid uchun 15% chegirma"
  ]
};

// 3. Do'kondagi ommabop mahsulotlar
const TOP_PRODUCTS = [
  { name: "iPhone 15 Pro Max 256GB Natural Titanium", price: "15 499 000 so'm", monthly: "1 690 000 so'm/oy", cat: "Smartfonlar" },
  { name: "Samsung Galaxy S24 Ultra 512GB Titanium Gray", price: "14 890 000 so'm", monthly: "1 620 000 so'm/oy", cat: "Smartfonlar" },
  { name: "Xiaomi Redmi Note 13 Pro 8/256GB Midnight Black", price: "2 890 000 so'm", monthly: "315 000 so'm/oy", cat: "Smartfonlar" },
  { name: "Apple MacBook Air 13 M2 8/256GB Space Gray", price: "11 990 000 so'm", monthly: "1 310 000 so'm/oy", cat: "Noutbuklar" },
  { name: "Apple AirPods Pro 2 (USB-C MagSafe)", price: "2 790 000 so'm", monthly: "305 000 so'm/oy", cat: "Quloqchinlar" },
  { name: "Smart TV Samsung 55 Crystal 4K UHD", price: "6 490 000 so'm", monthly: "710 000 so'm/oy", cat: "Televizorlar" },
  { name: "Robot-changyutgich Xiaomi Robot Vacuum S10", price: "2 290 000 so'm", monthly: "250 000 so'm/oy", cat: "Maishiy texnika" },
  { name: "Nike Air Force 1 '07 All White", price: "1 190 000 so'm", monthly: "130 000 so'm/oy", cat: "Kiyim & Poyabzal" }
];

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Telegram API so'rovi
async function callTelegram(method, body = {}) {
  try {
    const res = await fetch(`${TELEGRAM_API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error(`❌ Telegram API (${method}) xatolik:`, err.message);
    return null;
  }
}

// Typing indicator yuborish
async function sendTyping(chatId) {
  return callTelegram("sendChatAction", { chat_id: chatId, action: "typing" });
}

// Xabar yuborish
async function sendMessage(chatId, text, replyMarkup = null) {
  return callTelegram("sendMessage", {
    chat_id: chatId,
    text: text,
    parse_mode: "Markdown",
    reply_markup: replyMarkup
  });
}

// Boshlang'ich klaviatura menyusi (Reply Keyboard)
function getMainKeyboard() {
  return {
    keyboard: [
      [{ text: "📍 Do'kon manzili & Ish vaqti" }, { text: "📞 Aloqa markazi" }],
      [{ text: "🛍️ Mahsulotlar & Narxlar" }, { text: "🚚 Yetkazib berish" }],
      [{ text: "🎟️ Chegirma promokodlari" }, { text: "💳 Muddatli to'lov (0-0-12)" }],
      [{ text: "🌐 Arzon Market saytini ochish" }]
    ],
    resize_keyboard: true
  };
}

// Inline tugmalar
function getInlineMenu() {
  return {
    inline_keyboard: [
      [
        { text: "🛍️ Saytda xarid qilish", url: SITE_URL },
        { text: "📞 Bog'lanish", url: `tel:${STORE_INFO.rawPhone}` }
      ],
      [
        { text: "🚚 Topshirish punktlari", url: `${SITE_URL}/pickup-points` },
        { text: "🔥 Chegirmalar", url: `${SITE_URL}/products?sort=discount` }
      ]
    ]
  };
}

// 4. GEMINI AI INTEGRATSIYASI (Har qanday savolga aqlli javob berish)
async function askGeminiAi(userQuestion, userName = "Foydalanuvchi") {
  if (!GEMINI_API_KEY) return null;

  try {
    const systemPrompt = `Siz Arzon Market (arzon-market-psi.vercel.app) internet-do'konining do'stona, bilimdon va chaqqon AI yordamchisisiz.
Foydalanuvchi ismi: ${userName}.

Do'kon haqida aniq ma'lumotlar:
- Nomi: ${STORE_INFO.name}
- Ish vaqti: ${STORE_INFO.hours}
- Manzil: ${STORE_INFO.address} (Mo'ljal: ${STORE_INFO.landmark})
- Telefon: ${STORE_INFO.phone}
- Yetkazib berish: 150 000 so'mdan yuqori xaridlar O'zbekiston bo'ylab 1 kunda MUTLAQO BEPUL! Toshkentda kuryer 20-30 daqiqa.
- Punktlar: Butun O'zbekiston bo'ylab 120+ ta topshirish punkti.
- To'lov va muddatli to'lov: 0-0-12 (boshlang'ich to'lovsiz, foizsiz, 12 oygacha).
- Kafolat: 12 oy kafolat, 14 kunda tovarlarni qaytarish kafolati.
- Sayt: ${SITE_URL}

QOIDALAR:
1. Foydalanuvchi do'kon, tovarlar, texnika haqida so'rasa, yuqoridagi aniq ma'lumotlar bilan yordam bering.
2. Agar foydalanuvchi UMUMIY savol bersa (fan, texnologiya, hayotiy maslahat, hisob-kitob, she'r, dasturlash, qiziqarli faktlar va h.k.), BARCHA SAVOLLARGA to'liq, aqlli va qiziqarli qilib javob bering!
3. Javobni chiroyli Markdown formatida yozing (emojilar, qalin matn, punktlar).
4. Foydalanuvchi qaysi tilda yozsa (o'zbekcha yoki ruscha), xuddi shu tilda javob bering.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nFoydalanuvchi savoli: ${userQuestion}` }]
          }
        ]
      })
    });

    const data = await res.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (replyText) {
      return replyText.trim();
    }
  } catch (err) {
    console.error("⚠️ Gemini AI xatosi:", err.message);
  }
  return null;
}

// 5. Aqlli lokal NLP dvigateli (Gemini API kalitsiz ham ishlaydi)
function processLocalSmartQuery(text, userName = "Xaridor") {
  const q = String(text || "").toLowerCase().trim();

  // /start yoki salom
  if (q.startsWith("/start") || q === "salom" || q.includes("assalom") || q === "privet" || q === "start") {
    return {
      text: `👋 Assalomu alaykum, *${userName}*!\n\n🏪 *${STORE_INFO.name}* rasmiy AI Telegram botiga xush kelibsiz!\n\nMen sizga do'konimiz, 5000+ mahsulotlar, arzon narxlar, yetkazib berish va *xohlagan savolingizga* 24/7 javob berishga tayyorman!\n\n💡 *Menga istalgan savolingizni yozing* yoki quyidagi menyudan tanlang:`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Sayt ochish
  if (q.includes("sayt") || q.includes("web") || q.includes("veb") || q.includes("ilova")) {
    return {
      text: `🌐 *Arzon Market rasmiy sayti:*\n\n👉 [arzon-market-psi.vercel.app](${SITE_URL})\n\nSaytda 5 000+ mahsulotlar, qulay qidiruv, saralangan tovarlar va chegirmalar sizni kutmoqda!`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Do'kon manzili va ish vaqti
  if (q.includes("manzil") || q.includes("dokon") || q.includes("do'kon") || q.includes("qayerda") || q.includes("ofis") || q.includes("ish vaqti") || q.includes("tartib") || q.includes("/dokon")) {
    return {
      text: `📍 *«${STORE_INFO.name}» Bosh do'koni va ofisi:*\n\n🏢 *Manzil:* ${STORE_INFO.address}\n🧭 *Mo'ljal:* ${STORE_INFO.landmark}\n⏰ *Ish tartibi:* ${STORE_INFO.hours}\n\n🏪 Respublika bo'ylab *${STORE_INFO.branches}* mavjud. Istalgan punktga 1 kunda yetkazib beramiz!`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Aloqa markazi / telefon
  if (q.includes("telefon") || q.includes("aloqa") || q.includes("nomer") || q.includes("operator") || q.includes("bog'lanish") || q.includes("/aloqa")) {
    return {
      text: `📞 *Aloqa markazi va Call-markaz:*\n\n☎️ Telefon raqam: *${STORE_INFO.phone}*\n⏰ Ish vaqti: *06:00 dan 00:00 gacha (18 soat uzluksiz)*\n\nOperatorlarimiz barcha savollaringiz bo'yicha yordam berishga doim tayyor!`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Yetkazib berish
  if (q.includes("yetkaz") || q.includes("dostavka") || q.includes("kuryer") || q.includes("bepul") || q.includes("/yetkazish")) {
    return {
      text: `🚚 *Yetkazib berish shartlari:*\n\n• *Bepul yetkazish:* 150 000 so'mdan yuqori barcha buyurtmalar butun O'zbekiston bo'ylab *MUTLAQO BEPUL*!\n• *Muddati:* 1 kunda topshirish punktlariga yoki to'g'ridan-to'g'ri eshigingizgacha.\n• *Toshkentda tezkor kuryer:* 20-30 daqiqa ichida!\n• *Topshirish punktlari:* 120+ ta punktda tovarlarni bepul kiyib ko'rish va tekshirish imkoniyati mavjud.`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Promokodlar
  if (q.includes("promokod") || q.includes("chegirma") || q.includes("kupon") || q.includes("aksiya") || q.includes("skidka") || q.includes("/promokod")) {
    return {
      text: `🎟️ *Bugungi faol chegirma promokodlari:*\n\n${STORE_INFO.promos.join("\n")}\n\n🛒 [Arzon Market saytida](${SITE_URL}) savatga o'tib, ushbu kodlarni kiritsangiz, chegirma bir zumda hisoblanadi!`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Muddatli to'lov (nasiya / rassrochka)
  if (q.includes("muddatli") || q.includes("nasiya") || q.includes("foiz") || q.includes("rassrochka") || q.includes("0-0-12") || q.includes("kredit")) {
    return {
      text: `💳 *Muddatli to'lov (0-0-12 shartlari):*\n\n• *0%* — Boshlang'ich to'lov yo'q;\n• *0%* — Ortiqcha foiz va penyalar yo'q;\n• *12 oygacha* — Qulay teng oylik bo'lib to'lash imkoniyati.\n\nKerakli hujjat: Faqat pasport yoki ID-karta!`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Kafolat va qaytarish
  if (q.includes("kafolat") || q.includes("garantiya") || q.includes("qaytarish") || q.includes("almashtirish") || q.includes("/kafolat")) {
    return {
      text: `🛡️ *Kafolat va xaridor himoyasi:*\n\n• Barcha elektronika va texnikaga *12 oylik rasmiy kafolat* beriladi.\n• Agar mahsulot ma'qul kelmasa yoki o'lchami to'g'ri kelmasa, *14 kun ichida* hech qanday savollarsiz qaytarib berishingiz yoki almashtirishingiz mumkin!`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Mahsulotlar / narxlar
  if (q.includes("mahsulot") || q.includes("katalog") || q.includes("narx") || q.includes("tovar") || q.includes("telefon") || q.includes("iphone") || q.includes("samsung") || q.includes("noutbuk") || q.includes("/katalog")) {
    const list = TOP_PRODUCTS.map((p, i) => `${i + 1}. *${p.name}*\n   🏷️ Toifa: ${p.cat}\n   💰 Narxi: *${p.price}*\n   💳 Bo'lib to'lash: ${p.monthly}`).join("\n\n");
    return {
      text: `🛍️ *Hozirgi kunda eng ommabop mahsulotlar:*\n\n${list}\n\n👉 Barcha 5000+ tovarlarni ko'rish uchun: [Katalogni ochish](${SITE_URL}/products)`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Rahmat / rahmat sizga
  if (q.includes("rahmat") || q.includes("spasibo") || q.includes("tashakkur")) {
    return {
      text: `😊 Arzimaydi, *${userName}*! Sizga yordam berganimdan juda xursandman.\n\nYana biror savolingiz yoki xarid qilmoqchi bo'lgan mahsulotingiz bormi? Har qanday savolingizni bemalol yozavering! 🤖✨`,
      keyboard: getMainKeyboard(),
      inline: getInlineMenu()
    };
  }

  // Umumiy intellektual javob
  return {
    text: `🤖 *Savolingiz bo'yicha javob:*\n\n«*${text}*» mavzusidagi murojaatingiz uchun tashakkur!\n\n🏪 *${STORE_INFO.name}* do'koni sizga xizmat ko'rsatishdan mamnun:\n• *Yetkazib berish:* 1 kunda butun O'zbekistonga bepul;\n• *Do'kon manzili:* ${STORE_INFO.address};\n• *Ish vaqti:* Har kuni 06:00 dan 00:00 gacha;\n• *Bog'lanish:* ${STORE_INFO.phone}.\n\n💡 Agar sizga maxsus tovar tavsiyasi yoki yordam kerak bo'lsa, savolingizni aniqroq yozing yoki operatorimizga qo'ng'iroq qiling!`,
    keyboard: getMainKeyboard(),
    inline: getInlineMenu()
  };
}

// 6. Xabarni to'liq qayta ishlash funksiyasi
async function handleUserMessage(chatId, userText, userName) {
  await sendTyping(chatId);

  // Avval Gemini AI orqali har qanday savolga javob olishga urinib ko'ramiz
  let aiAnswer = null;
  if (GEMINI_API_KEY && !userText.startsWith("/")) {
    aiAnswer = await askGeminiAi(userText, userName);
  }

  if (aiAnswer) {
    await sendMessage(chatId, aiAnswer, getMainKeyboard());
    return;
  }

  // Agar Gemini kaliti bo'lmasa yoki buyruq bo'lsa, lokal aqlli dvigatel javob beradi
  const reply = processLocalSmartQuery(userText, userName);
  await sendMessage(chatId, reply.text, reply.keyboard);
}

// 7. REAL TELEGRAM LONG-POLLING OSIQLIGI
let lastUpdateId = 0;

async function startBot() {
  console.log("==================================================================");
  console.log("🤖 ARZON MARKET TELEGRAM BOT BOSHQARUV TIZIMI");
  console.log("==================================================================");

  if (!BOT_TOKEN || BOT_TOKEN === "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
    console.log("⚠️ DIQQAT: TELEGRAM BOT TOKENI TOPILMADI!");
    console.log("");
    console.log("Real Telegramda ishlashi uchun 1 daqiqada token oling:");
    console.log("1. Telegram ilovasida @BotFather botiga kiring.");
    console.log("2. /newbot buyrug'ini yuboring va botga nom bering (masalan: ArzonMarket_bot).");
    console.log("3. @BotFather bergan tokenni loyiha ildizidagi .env fayliga yozing:");
    console.log("   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNO...");
    console.log("4. So'ngra 'npm run bot' buyrug'ini bering!");
    console.log("==================================================================");
    return;
  }

  // Bot ma'lumotlarini tekshirish
  try {
    const meRes = await fetch(`${TELEGRAM_API}/getMe`);
    const meData = await meRes.json();

    if (!meData.ok) {
      console.error("❌ Telegram Token yaroqsiz:", meData.description);
      console.log("Iltimos, @BotFather bergan tokenni to'g'riligini tekshiring.");
      return;
    }

    const botInfo = meData.result;
    console.log(`✅ Telegram bot muvaffaqiyatli ulandi:`);
    console.log(`   • Bot nomi: ${botInfo.first_name}`);
    console.log(`   • Username: @${botInfo.username}`);
    console.log(`   • Havola:   https://t.me/${botInfo.username}`);
    console.log(`   • AI rejimi: ${GEMINI_API_KEY ? "🟢 Google Gemini AI faol" : "🟡 Smart Local NLP faol"}`);
    console.log("------------------------------------------------------------------");
    console.log("🚀 Bot xabarlarni kutmoqda... Telegramdan xabar yozib ko'rishingiz mumkin!");
  } catch (err) {
    console.error("❌ Telegram API bilan bog'lanishda xato:", err.message);
    return;
  }

  // Doimiy Polling tsikli
  while (true) {
    try {
      const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=25`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;

          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const userText = update.message.text;
            const userName = update.message.from?.first_name || "Xaridor";

            console.log(`📩 [${new Date().toLocaleTimeString()}] Xabar keldi (${userName}): ${userText}`);
            await handleUserMessage(chatId, userText, userName);
          }
        }
      }
    } catch (err) {
      console.error("⚠️ Polling uzilishi:", err.message);
      await new Promise((r) => setTimeout(r, 3500));
    }
  }
}

startBot();
