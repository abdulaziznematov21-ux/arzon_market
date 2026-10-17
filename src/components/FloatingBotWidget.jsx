import { useState } from "react";
import { SOCIAL_LINKS, STORE_INFO } from "../lib/data";
import { useStore } from "../lib/store";
import { TelegramIcon, AiSparkleIcon } from "./SocialIcons";

export default function FloatingBotWidget() {
  const { openStoreInfo, openAiAssistant } = useStore();
  const { telegramBot, aiAssistant } = SOCIAL_LINKS;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-[68px] sm:bottom-5 right-3 sm:right-5 z-40 flex flex-col items-end gap-2.5 select-none">
      
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/90 p-3 w-[290px] space-y-2 animate-scale-up mb-1">
          <div className="flex items-center justify-between pb-2 border-b border-gray-150">
            <div className="text-[12px] font-black text-gray-900 flex items-center gap-1.5">
              <span>🤖</span>
              <span>AI Yordamchi & Telegram Bot</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* 1. AI Yordamchi (Sun'iy intellekt xarid maslahatchisi) */}
          <button
            onClick={() => {
              setIsOpen(false);
              openAiAssistant();
            }}
            className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-[#e5252b] text-purple-700 hover:text-white transition-all group/ai cursor-pointer shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-[#e5252b] text-white flex items-center justify-center shrink-0 shadow-xs">
              <AiSparkleIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-black text-gray-900 group-hover/ai:text-white truncate flex items-center gap-1">
                <span>{aiAssistant?.name || "AI Yordamchi"}</span>
                <span className="text-[9px] bg-purple-200 text-purple-800 group-hover/ai:bg-white/20 group-hover/ai:text-white font-extrabold px-1 rounded">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-gray-500 group-hover/ai:text-purple-100 truncate">
                Tovarlar topish & chegirmalar
              </div>
            </div>
          </button>

          {/* 2. Telegram Bot (Jonli savol-javob & Do'kon ma'lumotlari) */}
          <button
            onClick={() => {
              setIsOpen(false);
              openStoreInfo();
            }}
            className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl bg-sky-50 hover:bg-[#0088cc] text-[#0088cc] hover:text-white transition-all group/tg cursor-pointer shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0088cc] text-white flex items-center justify-center shrink-0 shadow-xs">
              <TelegramIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-black text-gray-900 group-hover/tg:text-white truncate flex items-center gap-1">
                <span>Telegram Bot</span>
                <span className="text-[9px] bg-sky-200 text-[#0088cc] group-hover/tg:bg-white/20 group-hover/tg:text-white font-extrabold px-1 rounded">
                  SAVOL-JAVOB
                </span>
              </div>
              <div className="text-[10px] text-gray-500 group-hover/tg:text-sky-100 truncate">
                Do'kon manzili & Ish vaqti (06:00-00:00)
              </div>
            </div>
          </button>

          {/* 3. Direct Phone Support */}
          <a
            href={`tel:${STORE_INFO.rawPhone}`}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-all group/phone shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-rounded text-[18px]">call</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-black text-gray-900 group-hover/phone:text-white truncate">
                {STORE_INFO.phone}
              </div>
              <div className="text-[10px] text-gray-500 group-hover/phone:text-emerald-100 truncate">
                Aloqa markazi (06:00 - 00:00)
              </div>
            </div>
          </a>

          {/* Do'kon ma'lumotlari to'liq ko'rish */}
          <button
            onClick={() => {
              setIsOpen(false);
              openStoreInfo();
            }}
            className="w-full text-center py-2 text-[11px] font-bold text-gray-600 hover:text-[#0088cc] hover:bg-gray-50 rounded-lg transition border border-dashed border-gray-200 mt-1 cursor-pointer"
          >
            📍 Bektemir Bo'g'i Eram 4-ko'cha, 3-uy
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        {/* Quick AI Trigger */}
        <button
          onClick={() => openAiAssistant()}
          aria-label="AI Yordamchi"
          className="group flex items-center gap-1.5 h-12 px-3.5 rounded-full bg-gradient-to-r from-purple-600 to-[#e5252b] text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/40"
          title="Sun'iy intellekt xarid maslahatchisi"
        >
          <AiSparkleIcon className="w-5 h-5 animate-pulse" />
          <span className="text-[12.5px] font-black hidden sm:inline">
            AI Yordamchi
          </span>
        </button>

        {/* Telegram Bot Trigger */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Telegram Bot va Do'kon ma'lumotlari"
          className="group flex items-center gap-2 h-12 px-3.5 sm:px-4 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-xl shadow-sky-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/40"
          title="Telegram Bot: savol yozsangiz javob beradi"
        >
          <div className="relative">
            <TelegramIcon className="w-5 h-5 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0088cc]" />
          </div>
          <span className="text-[12.5px] font-extrabold tracking-wide hidden sm:inline">
            Telegram Bot
          </span>
          <span className="text-[10px] bg-white/20 font-black px-1.5 py-0.5 rounded-full">
            24/7
          </span>
        </button>
      </div>

    </div>
  );
}
