import { useState, useEffect } from "react";
import { useStore } from "../lib/store";
import { fmt, PROMOS, SOCIAL_LINKS } from "../lib/data";
import { generateProductSvg } from "../lib/svgGenerator";
import { TelegramIcon, AiSparkleIcon } from "./SocialIcons";
import { useOverlay } from "../lib/hooks";
import { translateProductTitle, translateCategory } from "../lib/translations";

export default function ProductModal() {
  const {
    activeProductModal: p,
    closeProductModal,
    add,
    favs,
    toggleFav,
    openCheckout,
    promo,
    copyAndApplyPromo,
    openAiAssistant,
    openStoreInfo,
    lang,
    t,
  } = useStore();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [copiedCode, setCopiedCode] = useState("");
  const [activeTab, setActiveTab] = useState("specs"); // 'specs' | 'reviews'

  // Unified overlay hook for scroll lock and Escape
  useOverlay(Boolean(p), closeProductModal);

  if (!p) return null;

  const images = p.images && p.images.length > 0 ? p.images : [p.image];
  const isFav = Boolean(favs && favs.includes(p.id));

  const handleCopyPromo = (code) => {
    copyAndApplyPromo(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleBuyNow = () => {
    closeProductModal();
    openCheckout({ ...p, qty });
  };

  const handleAddToCart = () => {
    const ok = add(p.id, qty, true);
    if (ok) {
      closeProductModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop with dark overlay and smooth blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={closeProductModal}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200/90 w-full max-w-4xl max-h-[92vh] overflow-y-auto z-10 animate-modal-pop">
        
        {/* Prominent Close Button */}
        <button
          onClick={closeProductModal}
          aria-label="Yopish (Escape)"
          className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-100 hover:bg-red-50 hover:text-[#e5252b] text-gray-700 flex items-center justify-center transition-all duration-200 active:scale-90 z-20 cursor-pointer shadow-sm border border-gray-200"
        >
          <span className="material-symbols-rounded text-[22px]">close</span>
        </button>

        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            
            {/* Left: Product Images Gallery */}
            <div>
              <div className="relative h-[280px] sm:h-[360px] rounded-2xl bg-[#f8f9fa] border border-gray-150 overflow-hidden flex items-center justify-center p-3">
                <img
                  src={images[activeImg] || p.image || p.fallback || generateProductSvg(p, "Arzon")}
                  alt={translateProductTitle(p.title, lang)}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = p.fallback || generateProductSvg(p, "Arzon");
                  }}
                  className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
                />

                {/* Discount Badge */}
                {p.off > 0 && (
                  <span className="absolute top-3 left-3 bg-[#e5252b] text-white font-black text-[12px] px-2.5 py-1 rounded-lg shadow-sm">
                    -{p.off}%
                  </span>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFav(p.id)}
                  aria-label={t("saveToFav")}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition active:scale-90 ${
                    isFav ? "text-[#e5252b]" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <span className={`material-symbols-rounded text-[22px] ${isFav ? "fill-current" : ""}`}>
                    favorite
                  </span>
                </button>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer bg-[#f8f9fa] p-1 ${
                        activeImg === idx
                          ? "border-[#e5252b] ring-2 ring-red-500/20"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = p.fallback || generateProductSvg(p, "Arzon");
                        }}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Delivery & Warranty Features */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-[12px] text-gray-600">
                <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded-xl flex items-center gap-2 border border-emerald-100">
                  <span className="material-symbols-rounded text-emerald-600 text-[18px]">local_shipping</span>
                  <span className="font-semibold">1 kunda bepul yetkazish</span>
                </div>
                <div className="bg-sky-50 text-sky-900 p-2.5 rounded-xl flex items-center gap-2 border border-sky-100">
                  <span className="material-symbols-rounded text-sky-600 text-[18px]">verified</span>
                  <span className="font-semibold">14 kun ichida qaytarish</span>
                </div>
              </div>
            </div>

            {/* Right: Product Info & Actions */}
            <div className="flex flex-col gap-3.5">
              
              {/* Rating & Brand */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-[13px]">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <span className="material-symbols-rounded text-[18px]">star</span>
                  <span className="font-black text-gray-900">{p.rating}</span>
                  <span className="text-gray-400">({p.reviews} {t("reviews")})</span>
                </div>
                <span className="bg-gray-100 text-gray-700 font-bold px-2.5 py-0.5 rounded-lg text-[12px]">
                  {t("brand")} {p.brand}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-[20px] sm:text-[22px] font-black text-gray-900 leading-snug">
                {translateProductTitle(p.title, lang)}
              </h2>

              {/* Price section */}
              <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-150">
                <div className="flex items-baseline gap-3">
                  <div className="text-[26px] sm:text-[30px] font-black text-gray-900">
                    {fmt(p.price, lang)}
                  </div>
                  {p.old > p.price && (
                    <div className="text-[15px] text-gray-400 line-through font-semibold">
                      {fmt(p.old, lang)}
                    </div>
                  )}
                </div>

                {/* Installment Badge */}
                <div className="mt-2.5 inline-flex items-center gap-2 bg-[#fff8e1] border border-[#ffe082] text-[#8d6e15] font-bold text-[12px] px-3 py-1.5 rounded-xl">
                  <span className="material-symbols-rounded text-[16px] text-amber-600">credit_card</span>
                  <span>{lang === "ru" ? "Рассрочка:" : "Muddatli to'lov:"} <b>{fmt(p.monthly, lang)} / {t("perMonth")}</b> (12 {lang === "ru" ? "мес." : "oy"})</span>
                </div>
              </div>

              {/* PROMO CODES SECTION */}
              <div className="bg-red-50/70 border border-red-150 rounded-2xl p-3.5">
                <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#e5252b] flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-rounded text-[18px]">confirmation_number</span>
                  <span>{t("availablePromos")}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Object.values(PROMOS).slice(0, 3).map((pr) => {
                    const isCopied = copiedCode === pr.code || promo === pr.code;
                    return (
                      <button
                        key={pr.code}
                        onClick={() => handleCopyPromo(pr.code)}
                        className={`text-[12px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isCopied
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white hover:bg-red-100 text-[#e5252b] border-red-200"
                        }`}
                      >
                        <span>{pr.code}</span>
                        <span className="opacity-80">(-{Math.round(pr.discount / 1000)}k)</span>
                        <span className="text-[10px] bg-white/20 px-1 rounded">
                          {isCopied ? t("applied") : t("copy")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-[13.5px] font-bold text-gray-700">{t("quantity")}</span>
                <div className="h-[40px] bg-gray-100 rounded-xl flex items-center p-1 border border-gray-200">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 flex items-center justify-center transition"
                  >
                    −
                  </button>
                  <span className="text-[14px] font-black text-gray-900 px-3.5">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="h-[50px] bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-[0.98] text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-rounded text-[20px]">shopping_bag</span>
                  <span>{t("addToCart")}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="h-[50px] bg-gray-900 hover:bg-black active:scale-[0.98] text-white rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-rounded text-[20px]">bolt</span>
                  <span>{t("buy1Click")}</span>
                </button>
              </div>

              {/* AI & Telegram Bot Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeProductModal();
                    openAiAssistant(`«${translateProductTitle(p.title, lang)}»`);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-[#e5252b] text-purple-700 hover:text-white border border-purple-200 transition-all flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-2xs cursor-pointer group"
                  title="AI Maslahatchidan ushbu mahsulot haqida so'rash"
                >
                  <AiSparkleIcon className="w-4 h-4 transition group-hover:scale-110" />
                  <span>{lang === "ru" ? "AI Советник" : "AI Maslahatchi"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeProductModal();
                    openStoreInfo();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-[#0088cc] text-[#0088cc] hover:text-white border border-sky-200 transition-all flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-2xs cursor-pointer group"
                  title="Telegram Bot: do'kon manzillari, yetkazish va savol-javob"
                >
                  <TelegramIcon className="w-4 h-4 transition group-hover:scale-110" />
                  <span>Telegram Bot</span>
                </button>
              </div>

              {/* Tabs: Specifications & Reviews */}
              <div className="mt-4 border-t border-gray-150 pt-3">
                <div className="flex gap-4 border-b border-gray-150 text-[13px] font-bold">
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`pb-2 border-b-2 transition ${
                      activeTab === "specs"
                        ? "border-[#e5252b] text-[#e5252b]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {t("specs")}
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-2 border-b-2 transition ${
                      activeTab === "reviews"
                        ? "border-[#e5252b] text-[#e5252b]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {t("customerReviews")} ({p.reviews})
                  </button>
                </div>

                {activeTab === "specs" ? (
                  <div className="py-3 text-[13px] divide-y divide-gray-100">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-gray-500">{lang === "ru" ? "Категория:" : "Toifa:"}</span>
                      <span className="font-semibold text-gray-900">{translateCategory(p.group, lang)}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-gray-500">{lang === "ru" ? "Подкатегория:" : "Kichik toifa:"}</span>
                      <span className="font-semibold text-gray-900">{p.sub}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-gray-500">{t("brand")}</span>
                      <span className="font-semibold text-gray-900">{p.brand}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-gray-500">{lang === "ru" ? "Доставка:" : "Yetkazish:"}</span>
                      <span className="font-semibold text-emerald-700">{t("delivery1Day")}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 text-[13px] space-y-2.5">
                    <div className="bg-gray-50 p-2.5 rounded-xl">
                      <div className="flex items-center justify-between text-[12px] font-bold">
                        <span>Jasurbek A.</span>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-gray-600 text-[12.5px] mt-1">
                        {lang === "ru"
                          ? "Очень качественный товар, доставили за 1 день. Оригинал и отличная цена."
                          : "Juda ajoyib mahsulot, 1 kunda yetib keldi. Sifati original va narxi arzon."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
