import { SOCIAL_LINKS } from "../lib/data";

export function TelegramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function AiSparkleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
    </svg>
  );
}

export function AiBotIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 013 3v8a3 3 0 01-3 3H7a3 3 0 01-3-3v-8a3 3 0 013-3h4V5.72A2 2 0 0110 4a2 2 0 012-2zm-3 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-6 5a1 1 0 000 2h6a1 1 0 100-2H9z" />
    </svg>
  );
}

// Backward compatibility stubs if needed during transitions
export function InstagramIcon({ className = "w-5 h-5" }) {
  return <AiSparkleIcon className={className} />;
}

export function YouTubeIcon({ className = "w-5 h-5" }) {
  return <AiBotIcon className={className} />;
}

export default function SocialLinksList({ onOpenStoreInfo, onOpenAiAssistant }) {
  const { telegramBot, aiAssistant } = SOCIAL_LINKS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* 1. Telegram Bot (Do'kon haqida ma'lumotlar & Jonli javob) */}
      <button
        type="button"
        onClick={onOpenStoreInfo}
        className="text-left group p-3.5 rounded-2xl border border-sky-200 bg-sky-50/70 hover:bg-[#0088cc] hover:text-white transition-all duration-300 flex items-start gap-3 shadow-xs hover:shadow-md cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-[#0088cc] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
          <TelegramIcon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <b className="text-[13px] font-black text-gray-900 group-hover:text-white truncate">
              {telegramBot.name}
            </b>
            <span className="text-[9.5px] bg-sky-100 text-[#0088cc] group-hover:bg-white/20 group-hover:text-white font-black px-1.5 py-0.2 rounded-md">
              DO'KON BOTI
            </span>
          </div>
          <div className="text-[11px] font-mono text-sky-700 group-hover:text-sky-100 truncate">
            {telegramBot.username}
          </div>
          <div className="text-[11px] text-gray-500 group-hover:text-white/80 mt-0.5 line-clamp-1">
            Savol yozing — bot darhol javob beradi!
          </div>
        </div>
      </button>

      {/* 2. AI Yordamchi (Sun'iy intellekt xarid maslahatchisi) */}
      <button
        type="button"
        onClick={onOpenAiAssistant}
        className="text-left group p-3.5 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50/60 hover:from-purple-600 hover:to-[#e5252b] hover:text-white transition-all duration-300 flex items-start gap-3 shadow-xs hover:shadow-md cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-[#e5252b] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
          <AiSparkleIcon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <b className="text-[13px] font-black text-gray-900 group-hover:text-white truncate">
              {aiAssistant?.name || "AI Yordamchi"}
            </b>
            <span className="text-[9.5px] bg-purple-100 text-purple-700 group-hover:bg-white/20 group-hover:text-white font-black px-1.5 py-0.2 rounded-md">
              AI MASLAHATCHI
            </span>
          </div>
          <div className="text-[11px] font-semibold text-purple-700 group-hover:text-purple-100 truncate">
            Aqlli sun'iy intellekt
          </div>
          <div className="text-[11px] text-gray-500 group-hover:text-white/80 mt-0.5 line-clamp-1">
            Mahsulotlar topish, arzon narxlar va maslahat
          </div>
        </div>
      </button>
    </div>
  );
}
