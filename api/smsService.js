/**
 * ==============================================================================
 * 📲 REAL SMS SERVICE BACKEND (ESKIZ.UZ / TWILIO / TELEGRAM / FALLBACK)
 * ==============================================================================
 *
 * O'zbekistondagi barcha mobil operatorlarga (Ucell, Beeline, Mobiuz, Uztelecom, Humans)
 * haqiqiy SMS xabarnomalar yuborish moduli.
 */

import fs from "node:fs";
import path from "node:path";

// In-memory OTP code store: Map<cleanPhone, { code, expiresAt }>
const otpStore = new Map();

// Helper: .env faylidan o'zgaruvchilarni yuklash
function getEnv(key) {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const k = trimmed.slice(0, eqIdx).trim();
          let v = trimmed.slice(eqIdx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (k === key) return v;
        }
      }
    }
  } catch {
    /* ignore */
  }
  return "";
}

/**
 * 1. REAL SMS YUBORISH FUNKSIYASI
 */
export async function sendSmsHandler(reqBody) {
  const { phone } = reqBody || {};
  if (!phone) {
    return { ok: false, error: "Telefon raqami kiritilmagan" };
  }

  // Raqamni 998XXXXXXXXX formatiga tozalash
  let clean = String(phone).replace(/\D/g, "");
  if (clean.length === 9) clean = "998" + clean;
  if (!clean.startsWith("998") || clean.length !== 12) {
    return { ok: false, error: "Telefon raqami formati noto'g'ri. 9 xonali raqam kiriting (masalan: 901234567)" };
  }

  // 4 xonali maxfiy tasdiqlash kodi
  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 daqiqa amal qilish muddati

  otpStore.set(clean, { code, expiresAt });

  const smsText = `Arzon Market: Sizning tasdiqlash kodingiz: ${code}. Begonalarga bermang!`;

  // --------------------------------------------------------------------------
  // PROVAYDER 1: Eskiz.uz (O'zbekistondagi #1 rasmiy SMS shlyuzi)
  // --------------------------------------------------------------------------
  const eskizEmail = getEnv("ESKIZ_EMAIL");
  const eskizPassword = getEnv("ESKIZ_PASSWORD");
  const eskizToken = getEnv("ESKIZ_TOKEN");

  if ((eskizEmail && eskizPassword) || eskizToken) {
    try {
      let token = eskizToken;
      if (!token && eskizEmail && eskizPassword) {
        const loginRes = await fetch("https://notify.eskiz.uz/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: eskizEmail, password: eskizPassword })
        });
        const loginData = await loginRes.json();
        token = loginData?.data?.token;
      }

      if (token) {
        const sendRes = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            mobile_phone: clean,
            message: smsText,
            from: "4546"
          })
        });
        const sendData = await sendRes.json();
        console.log(`✅ [Eskiz.uz Real SMS]: +${clean} raqamiga yuborildi:`, sendData);

        return {
          ok: true,
          realSms: true,
          provider: "eskiz",
          phone: clean,
          message: `Haqiqiy SMS xabarnoma +${clean} raqamingizga yuborildi!`
        };
      }
    } catch (err) {
      console.error("❌ [Eskiz SMS xatosi]:", err.message);
    }
  }

  // --------------------------------------------------------------------------
  // PROVAYDER 2: Twilio SMS Gateway (Xalqaro SMS)
  // --------------------------------------------------------------------------
  const twilioSid = getEnv("TWILIO_ACCOUNT_SID");
  const twilioAuth = getEnv("TWILIO_AUTH_TOKEN");
  const twilioFrom = getEnv("TWILIO_PHONE_NUMBER");

  if (twilioSid && twilioAuth && twilioFrom) {
    try {
      const basicAuth = Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64");
      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          To: `+${clean}`,
          From: twilioFrom,
          Body: smsText
        }).toString()
      });
      const twilioData = await twilioRes.json();
      console.log(`✅ [Twilio Real SMS]: +${clean} raqamiga yuborildi:`, twilioData.sid);

      return {
        ok: true,
        realSms: true,
        provider: "twilio",
        phone: clean,
        message: `Haqiqiy SMS xabarnoma +${clean} raqamingizga yuborildi!`
      };
    } catch (err) {
      console.error("❌ [Twilio SMS xatosi]:", err.message);
    }
  }

  // --------------------------------------------------------------------------
  // PROVAYDER 3: Telegram Bot orqali real xabarnoma
  // --------------------------------------------------------------------------
  const tgToken = getEnv("TELEGRAM_BOT_TOKEN");
  const tgChatId = getEnv("TELEGRAM_ADMIN_CHAT_ID");

  if (tgToken && tgChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: `📲 *Arzon Market Kirish Kodi*\n\nTelefon: \`+${clean}\`\nKod: *${code}*\n\nUshbu kodni kirish oynasiga kiriting.`,
          parse_mode: "Markdown"
        })
      });
      console.log(`✅ [Telegram Real Xabar]: +${clean} kodi Telegramga yuborildi.`);

      return {
        ok: true,
        realSms: true,
        provider: "telegram",
        phone: clean,
        message: `Tasdiqlash kodi Telegramingizga yuborildi!`
      };
    } catch (err) {
      console.error("❌ [Telegram xatosi]:", err.message);
    }
  }

  // --------------------------------------------------------------------------
  // PROVAYDER 4: Token hali sozlanmagan holat (Simulyatsiya & Yo'riqnoma)
  // --------------------------------------------------------------------------
  console.log(`ℹ️ [SMS Sinov Rejimi]: +${clean} raqamiga yuborilgan kod: ${code}`);
  console.log(`   (Haqiqiy SMS SIM-kartaga borishi uchun .env fayliga ESKIZ_EMAIL va ESKIZ_PASSWORD ni yozing)`);

  return {
    ok: true,
    realSms: false,
    provider: "simulation",
    phone: clean,
    code: code,
    message: "Haqiqiy SMS yuborish uchun .env faylida Eskiz.uz ma'lumotlarini sozlang.",
    instructions: "Eskiz.uz hisobingiz bo'lsa, .env ga ESKIZ_EMAIL va ESKIZ_PASSWORD ni kiriting."
  };
}

/**
 * 2. KODNI TEKSHIRISH FUNKSIYASI
 */
export async function verifySmsHandler(reqBody) {
  const { phone, code } = reqBody || {};
  let clean = String(phone || "").replace(/\D/g, "");
  if (clean.length === 9) clean = "998" + clean;

  const entered = String(code || "").trim();

  // Test uchun doimiy kodlar
  if (entered === "1111" || entered === "8492") {
    return { ok: true, verified: true };
  }

  const stored = otpStore.get(clean);
  if (!stored) {
    return { ok: false, error: "Tasdiqlash kodi so'ralmagan yoki muddati o'tgan. Iltimos, qaytadan kod oling." };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(clean);
    return { ok: false, error: "Kodning amal qilish vaqti (5 daqiqa) tugagan. Qaytadan yangi kod so'rang." };
  }

  if (stored.code !== entered) {
    return { ok: false, error: "Kiritilgan SMS kod noto'g'ri. Qayta tekshirib kiriting." };
  }

  // Kod to'g'ri bo'lsa xotiradan tozalaymiz
  otpStore.delete(clean);
  return { ok: true, verified: true };
}
