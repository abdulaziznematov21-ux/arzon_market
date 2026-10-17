/**
 * ==============================================================================
 * ARZON MARKET RASMIY TELEGRAM BOTI (NODE.JS)
 * ==============================================================================
 * 
 * Ishga tushirish uchun:
 * 1. @BotFather dan bot yarating va TOKEN oling.
 * 2. Terminalda bot tokenini o'rnating yoki quyidagi BOT_TOKEN o'zgaruvchisiga yozing:
 *    set TELEGRAM_BOT_TOKEN="sizning_bot_tokeningiz"
 * 3. Botni ishga tushiring:
 *    node telegram_bot.js
 * 
 * ==============================================================================
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "YOUR_TELEGRAM_BOT_TOKEN_HERE";

// Do'kon rasmiy ma'lumotlari
const STORE_INFO = {
  name: "Arzon Market",
  phone: "+998 (95) 271-98-71",
  rawPhone: "952719871",
  hours: "Har kuni 06:00 dan 00:00 gacha (dam olish kunlarisiz, 18 soat uzluksiz)",
  address: "Toshkent shahri, Bektemir tumani, Bo'g'i Eram 4-ko'cha, 3-uy",
  landmark: "Bektemir Bo'g'i Eram hududi",
  delivery: "O'zbekiston bo'ylab 1 kunda bepul yetkazib berish (150 000 so'mdan yuqori)",
  branches: "120+ ta topshirish punktlari",
  promos: [
    "🎟️ ARZON2026 — 30 000 so'm chegirma (100k dan yuqoriga)",
    "🎟️ BAHOR50 — 50 000 so'm chegirma (250k dan yuqoriga)",
    "🎟️ SUPER10 — 20 000 so'm chegirma (80k dan yuqoriga)"
  ]
};

// Ommabop tovarlar namunalari
const SAMPLE_PRODUCTS = [
  { name: "iPhone 15 Pro Max 256GB Natural Titanium", price: "15 499 000 so'm", monthly: "1 690 000 so'm/oy" },
  { name: "Samsung Galaxy S24 Ultra 512GB", price: "14 890 000 so'm", monthly: "1 620 000 so'm/oy" },
  { name: "Xiaomi Redmi Note 13 Pro 8/256GB", price: "2 890 000 so'm", monthly: "315 000 so'm/oy" },
  { name: "Apple AirPods Pro 2 (USB-C)", price: "2 790 000 so'm", monthly: "305 000 so'm/oy" },
  { name: "Apple MacBook Air 13 M2 8/256GB", price: "11 990 000 so'm", monthly: "1 310 000 so'm/oy" },
  { name: "Robot-changyutgich Xiaomi Robot Vacuum", price: "2 290 000 so'm", monthly: "250 000 so'm/oy" }
];

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Telegramga xabar yuborish
async function sendMessage(chatId, text, replyMarkup = null) {
  try {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error("Xabar yuborishda xatolik:", err.message);
  }
}

// Boshlang'ich klaviatura menyusi
function getMainKeyboard() {
  return {
    keyboard: [
      [{ text: "📍 Do'kon manzili & Ish vaqti" }, { text: "📞 Aloqa markazi" }],
      [{ text: "🚚 Yetkazib berish" }, { text: "🎟️ Chegirma promokodlari" }],
      [{ text: "📱 Ommabop mahsulotlar" }, { text: "🛡️ Kafolat va qaytarish" }]
    ],
    resize_keyboard: true
  };
}

// Savolga javob berish mantiqi (NLP)
function processUserQuery(text) {
  const q = String(text || "").toLowerCase().trim();

  // /start yoki salom
  if (q.startsWith("/start") || q.includes("salom") || q.includes("assalom")) {
    return {
      text: `👋 Assalomu alaykum! *${STORE_INFO.name}* rasmiy botiga xush kelibsiz! 🏪🤖\n\nMen sizga do'kon manzillari, ish tartibi, yetkazib berish shartlari va mahsulotlar haqida ma'lumot beraman.\n\nMenga xohlagan savolingizni yozing yoki quyidagi menyudan tanlang:`,
      keyboard: getMainKeyboard()
    };
  }

  // Do'kon manzili, ish vaqti
  if (
    q.includes("manzil") ||
    q.includes("dokon") ||
    q.includes("do'kon") ||
    q.includes("qayerda") ||
    q.includes("ofis") ||
    q.includes("ish vaqti") ||
    q.includes("tartib") ||
    q.includes("/dokon")
  ) {
    return {
      text: `📍 *«${STORE_INFO.name}» Bosh do'koni va ofisi:*\n\n🏢 *Manzil:* ${STORE_INFO.address}\n🧭 *Mo'ljal:* ${STORE_INFO.landmark}\n⏰ *Ish tartibi:* ${STORE_INFO.hours}\n\n🏪 Shuningdek, O'zbekiston bo'ylab *${STORE_INFO.branches}* mavjud. Xaridlaringizni 06:00 dan 00:00 gacha qulay vaqtingizda qabul qilib olishingiz mumkin!`,
      keyboard: getMainKeyboard()
    };
  }

  // Telefon / Aloqa / Operator
  if (
    q.includes("telefon") ||
    q.includes("aloqa") ||
    q.includes("nomer") ||
    q.includes("operator") ||
    q.includes("bog'lanish") ||
    q.includes("/aloqa")
  ) {
    return {
      text: `📞 *Aloqa markazi va Call-markaz:*\n\n☎️ Telefon: *${STORE_INFO.phone}*\n⏰ Ish vaqti: *06:00 dan 00:00 gacha (dam olish kunlarisiz)*\n\nOperatorlarimiz barcha savollaringizga mamnuniyat bilan javob berishadi!`,
      keyboard: getMainKeyboard()
    };
  }

  // Yetkazib berish
  if (
    q.includes("yetkaz") ||
    q.includes("dostavka") ||
    q.includes("kuryer") ||
    q.includes("bepul") ||
    q.includes("/yetkazish")
  ) {
    return {
      text: `🚚 *Yetkazib berish xizmati:*\n\n• *Narxi:* 150 000 so'mdan yuqori buyurtmalar O'zbekiston bo'ylab *MUTLAQO BEPUL*!\n• *Muddati:* 1 kunda topshirish punktlariga yoki eshigingizgacha.\n• *Toshkentda tezkor kuryer:* 20-30 daqiqa ichida.\n• *Kuryerlar ish vaqti:* Har kuni 06:00 dan 00:00 gacha!`,
      keyboard: getMainKeyboard()
    };
  }

  // Promokodlar
  if (
    q.includes("promokod") ||
    q.includes("chegirma") ||
    q.includes("kupon") ||
    q.includes("aksiya") ||
    q.includes("/promokod")
  ) {
    return {
      text: `🎟️ *Faol chegirma promokodlari:*\n\n${STORE_INFO.promos.join("\n")}\n\nSaytimizda savatga o'tib, ushbu kodlarni kiritsangiz, chegirma avtomatik hisoblanadi!`,
      keyboard: getMainKeyboard()
    };
  }

  // Kafolat va qaytarish
  if (
    q.includes("kafolat") ||
    q.includes("garantiya") ||
    q.includes("qaytarish") ||
    q.includes("/kafolat")
  ) {
    return {
      text: `🛡️ *Kafolat va qaytarish shartlari:*\n\n• Elektronika va maishiy texnikalarga *12 oylik rasmiy kafolat* beriladi.\n• Agar mahsulot ma'qul kelmasa, *14 kun ichida* hech qanday savollarsiz qaytarib berishingiz yoki almashtirishingiz mumkin!`,
      keyboard: getMainKeyboard()
    };
  }

  // Mahsulotlar / Katalog
  if (
    q.includes("mahsulot") ||
    q.includes("telefon") ||
    q.includes("iphone") ||
    q.includes("samsung") ||
    q.includes("katalog") ||
    q.includes("narx") ||
    q.includes("/katalog")
  ) {
    const list = SAMPLE_PRODUCTS.map((p, i) => `${i + 1}. *${p.name}*\n   💰 Narxi: ${p.price}\n   💳 Muddatli to'lov: ${p.monthly}`).join("\n\n");
    return {
      text: `🛍️ *Hozirgi kunda eng ko'p sotilayotgan tovarlar:*\n\n${list}\n\nSaytimizda 9 ta toifa bo'yicha 70 dan ortiq mahsulotlar mavjud!`,
      keyboard: getMainKeyboard()
    };
  }

  // Umumiy javob
  return {
    text: `Savolingiz uchun rahmat! «${text}» bo'yicha ma'lumot qabul qilindi.\n\nSizga yordam berishim uchun quyidagi menyu tugmalaridan birini tanlang yoki savolingizni boshqacha shaklda yozing. Shuningdek, operatorimizga to'g'ridan-to'g'ri qo'ng'iroq qilishingiz mumkin:\n📞 *${STORE_INFO.phone}*`,
    keyboard: getMainKeyboard()
  };
}

// Bot polling tsikli
let lastUpdateId = 0;

async function startPolling() {
  if (!BOT_TOKEN || BOT_TOKEN === "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
    console.log("-----------------------------------------------------------------");
    console.log("ℹ️ TELEGRAM BOT BILDIRISHNOMASI:");
    console.log("Haqiqiy Telegram botni ishga tushirish uchun TELEGRAM_BOT_TOKEN kerak.");
    console.log("1. Telegramda @BotFather ga kiring va /newbot buyrug'i bilan bot yarating.");
    console.log("2. Olingan tokenni quyidagicha o'rnating:");
    console.log("   set TELEGRAM_BOT_TOKEN=123456789:ABCdef...");
    console.log("3. So'ng 'node telegram_bot.js' buyrug'ini ishga tushiring.");
    console.log("Saytdagi interaktiv bot esa 100% tokensiz darhol ishlamoqda!");
    console.log("-----------------------------------------------------------------");
    return;
  }

  console.log(`🤖 Arzon Market Telegram boti ishga tushdi...`);
  console.log(`Bosh ofis: ${STORE_INFO.address}`);
  console.log(`Ish vaqti: ${STORE_INFO.hours}`);
  console.log(`Aloqa markazi: ${STORE_INFO.phone}`);

  while (true) {
    try {
      const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;

          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const userText = update.message.text;
            const userName = update.message.from?.first_name || "Xaridor";

            console.log(`[${new Date().toLocaleTimeString()}] Xabar keldi (${userName}): ${userText}`);

            const reply = processUserQuery(userText);
            await sendMessage(chatId, reply.text, reply.keyboard);
          }
        }
      }
    } catch (err) {
      console.error("Polling xatosi:", err.message);
      await new Promise((r) => setTimeout(r, 4000));
    }
  }
}

startPolling();
