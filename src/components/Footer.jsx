import { Link } from "react-router-dom";
import ArzonLogo from "./ArzonLogo";
import { STORE_INFO } from "../lib/data";
import { TelegramIcon, AiSparkleIcon } from "./SocialIcons";
import { useStore } from "../lib/store";

export default function Footer() {
  const { openStoreInfo, openAiAssistant, lang } = useStore();
  const isRu = lang === "ru";

  return (
    <footer className="bg-white border-t border-gray-200/90 text-gray-700 mt-auto pb-16 lg:pb-0">
      
      {/* Upper features ribbon */}
      <div className="border-b border-gray-100 bg-[#fafafa]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#e5252b] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">local_shipping</span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-gray-900">
                  {isRu ? "Доставка за 1 день бесплатно" : "1 kunda bepul yetkazish"}
                </div>
                <div className="text-[12px] text-gray-500">
                  {isRu ? "При покупке от 150 000 сум" : "150 000 so'mdan yuqori xaridlarga"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">payments</span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-gray-900">
                  {isRu ? "Рассрочка 0%" : "0% muddatli to'lov"}
                </div>
                <div className="text-[12px] text-gray-500">
                  {isRu ? "До 12 месяцев без переплат" : "12 oygacha ortiqcha to'lovlarsiz"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">verified</span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-gray-900">
                  {isRu ? "100% оригинальные товары" : "100% original tovarlar"}
                </div>
                <div className="text-[12px] text-gray-500">
                  {isRu ? "Гарантированное качество" : "Kafolatlangan sertifikat bilan"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">published_with_changes</span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-gray-900">
                  {isRu ? "Легкий возврат за 14 дней" : "14 kunda oson qaytarish"}
                </div>
                <div className="text-[12px] text-gray-500">
                  {isRu ? "Быстрый возврат средств" : "Savollarsiz, darhol pulni qaytarish"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* BIZ HAQIMIZDA */}
          <div>
            <div className="mb-4">
              <ArzonLogo size="default" />
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
              {isRu 
                ? "Удобная, выгодная и надежная торговая интернет-площадка в Узбекистане."
                : "O'zbekistondagi eng qulay, arzon va ishonchli onlayn savdo maydonchasi."}
            </p>
            <div className="space-y-2.5 text-[14px]">
              <Link to="/about" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "О компании" : "Kompaniya haqida"}
              </Link>
              <Link to="/careers" className="flex items-center gap-2 text-gray-600 hover:text-[#e5252b] transition">
                <span>{isRu ? "Вакансии" : "Bo'sh ish o'rinlari"}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {isRu ? "Активно 8" : "Faol 8"}
                </span>
              </Link>
              <Link to="/pickup-points" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Пункты выдачи на карте" : "Topshirish punktlari xaritasi"}
              </Link>
              <Link to="/blog" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Новости & блог Arzon Market" : "Arzon Market yangiliklari & blog"}
              </Link>
            </div>
          </div>

          {/* XARIDORLARGA */}
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-4">
              {isRu ? "Покупателям" : "Xaridorlarga"}
            </h3>
            <div className="space-y-2.5 text-[14px]">
              <Link to="/delivery" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Доставка и оплата" : "Yetkazib berish va to'lov"}
              </Link>
              <Link to="/returns" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Правила возврата товара" : "Tovarni qaytarish qoidalari"}
              </Link>
              <Link to="/installment" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Рассрочка (Uzum Nasiya)" : "Muddatli to'lov (Uzum Nasiya)"}
              </Link>
              <Link to="/faq" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Вопросы и ответы (FAQ)" : "Ko'p beriladigan savollar (FAQ)"}
              </Link>
              <Link to="/orders" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Отслеживание заказа" : "Buyurtmani kuzatish"}
              </Link>
            </div>
          </div>

          {/* HAMKORLARGA */}
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-4">
              {isRu ? "Партнерам" : "Hamkorlarga"}
            </h3>
            <div className="space-y-2.5 text-[14px]">
              <Link to="/sell" className="flex items-center gap-1.5 text-gray-600 hover:text-[#e5252b] transition">
                <span className="material-symbols-rounded text-[18px] text-[#e5252b]">storefront</span>
                <span>{isRu ? "Продавайте на Arzon Market" : "Arzon Marketda soting"}</span>
              </Link>
              <Link to="/partners" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Партнерская программа" : "Hamkorlik dasturi"}
              </Link>
              <Link to="/open-pickup" className="block text-gray-600 hover:text-[#e5252b] transition">
                {isRu ? "Открыть пункт выдачи" : "Topshirish punkti ochish"}
              </Link>
              <Link to="/admin" className="flex items-center gap-1.5 text-gray-600 hover:text-[#e5252b] transition pt-1">
                <span className="material-symbols-rounded text-[18px] text-[#e5252b]">admin_panel_settings</span>
                <span>{isRu ? "Панель администратора" : "Admin Panel"}</span>
              </Link>
            </div>
          </div>

          {/* ILOVA VA IJTIMOIY TARMOQLAR */}
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-4">
              {isRu ? "Мобильное приложение" : "Mobil ilova"}
            </h3>
            <p className="text-[13px] text-gray-500 leading-snug mb-4">
              {isRu
                ? "Заказывайте любые товары в 1 клик с вашего смартфона."
                : "Telefoningizda har qanday mahsulotni 1 klikda buyurtma qiling."}
            </p>

            <div className="flex gap-2 mb-6">
              <a
                href="#appstore"
                onClick={(e) => e.preventDefault()}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[12px] font-semibold flex items-center gap-2 transition"
              >
                <span className="text-lg"></span>
                <div className="text-left leading-tight">
                  <div className="text-[9px] text-gray-500 uppercase">Download</div>
                  <div className="font-bold">App Store</div>
                </div>
              </a>
              <a
                href="#googleplay"
                onClick={(e) => e.preventDefault()}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[12px] font-semibold flex items-center gap-2 transition"
              >
                <span className="text-lg">▶</span>
                <div className="text-left leading-tight">
                  <div className="text-[9px] text-gray-500 uppercase">Get it on</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </a>
            </div>
            <div className="pt-2 border-t border-gray-150">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-[13px] font-black text-gray-900">
                  {isRu ? "AI Помощник & Telegram Бот" : "AI Yordamchi & Telegram Bot"}
                </h4>
                <button
                  onClick={openStoreInfo}
                  className="text-[11px] text-[#0088cc] font-bold hover:underline cursor-pointer"
                >
                  {isRu ? "Инфо о магазине ›" : "Do'kon ma'lumotlari ›"}
                </button>
              </div>

              <div className="space-y-2">
                {/* 1. AI Yordamchi - Xarid maslahatchisi */}
                <button
                  type="button"
                  onClick={() => openAiAssistant()}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-[#e5252b] text-purple-700 hover:text-white transition-all group shadow-2xs cursor-pointer"
                  title={isRu ? "Консультация с умным AI помощником" : "Sun'iy intellekt xarid maslahatchisi bilan suhbat"}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-[#e5252b] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <AiSparkleIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-black text-gray-900 group-hover:text-white flex items-center gap-1.5">
                      <span>{isRu ? "AI Помощник" : "AI Yordamchi"}</span>
                      <span className="text-[9px] bg-purple-200 group-hover:bg-white/20 text-purple-800 group-hover:text-white px-1.5 py-0.2 rounded font-black">
                        {isRu ? "УМНЫЙ СОВЕТ" : "AQLLI MASLAHAT"}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-gray-500 group-hover:text-purple-100 truncate">
                      {isRu ? "Рекомендации товаров и лучшие цены" : "Mahsulotlar tavsiyasi va arzon narxlar"}
                    </div>
                  </div>
                </button>

                {/* 2. Telegram Bot - Do'kon haqida ma'lumotlar & Savol-javob */}
                <button
                  type="button"
                  onClick={openStoreInfo}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl bg-sky-50 hover:bg-[#0088cc] text-[#0088cc] hover:text-white transition-all group shadow-2xs cursor-pointer"
                  title={isRu ? "Telegram Бот: мгновенные ответы на вопросы" : "Telegram Bot: savol yozsangiz darhol javob beradi"}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0088cc] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <TelegramIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-black text-gray-900 group-hover:text-white flex items-center gap-1.5">
                      <span>{isRu ? "Telegram Бот" : "Telegram Bot"}</span>
                      <span className="text-[9px] bg-sky-200 group-hover:bg-white/20 text-[#0088cc] group-hover:text-white px-1.5 py-0.2 rounded font-black">
                        {isRu ? "ВОПРОС-ОТВЕТ" : "SAVOL-JAVOB"}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-gray-500 group-hover:text-sky-100 truncate">
                      {STORE_INFO.phone} • {isRu ? "с 06:00 до 00:00" : "06:00 dan 00:00 gacha"}
                    </div>
                  </div>
                </button>

                {/* Direct office and phone info box */}
                <div className="mt-2 p-2.5 rounded-xl bg-gray-50 border border-gray-150 text-[11.5px] text-gray-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <span className="material-symbols-rounded text-[15px] text-sky-600">location_on</span>
                    <span className="truncate">{STORE_INFO.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-gray-600">
                    <span className="material-symbols-rounded text-[15px] text-amber-600">schedule</span>
                    <span>{isRu ? "06:00 – 00:00 (без выходных)" : "06:00 – 00:00 (dam olishsiz)"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="border-t border-gray-200/80 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-500">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-semibold text-gray-700">{isRu ? "Безопасная оплата:" : "Xavfsiz to'lov:"}</span>
            {["UZUM NASIYA", "PAYME", "CLICK", "HUMO", "UZCARD"].map((card) => (
              <span
                key={card}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg font-bold text-[11px] tracking-wide"
              >
                {card}
              </span>
            ))}
          </div>

          <p className="text-center md:text-right">
            {isRu 
              ? "© 2026 ООО «Arzon Market». Все права защищены."
              : "© 2026 «Arzon Market» MCHJ. Barcha huquqlar himoyalangan."}
          </p>
        </div>

      </div>

    </footer>
  );
}