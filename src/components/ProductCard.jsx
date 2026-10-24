import { useState, useEffect } from "react";
import { useStore } from "../lib/store";
import { fmt } from "../lib/data";
import { generateProductSvg } from "../lib/svgGenerator";
import { translateProductTitle, translateBadge } from "../lib/translations";

export default function ProductCard({ p, list }) {
  const { qtyOf, add, setQty, favs, toggleFav, copyAndApplyPromo, openProductModal, promo, t, lang } = useStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [imgSrc, setImgSrc] = useState(p.image);

  useEffect(() => {
    setImgSrc(p.image);
  }, [p.image]);

  const handleImageError = () => {
    setImgSrc(p.fallback || generateProductSvg(p, "Arzon"));
  };

  const q = qtyOf(p.id);
  const fav = favs.includes(p.id);
  const isPromoApplied = promo === p.promo;

  const handlePromoClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (p.promo) {
      copyAndApplyPromo(p.promo);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCardClick = (e) => {
    // If not clicking a button or link, open quick view modal
    if (e.target.closest("button") || e.target.closest("a")) return;
    openProductModal(p);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-xl border border-gray-150 overflow-hidden flex min-w-0 ${
        list ? "flex-row" : "flex-col"
      } hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer`}
    >
      {/* Product Image Section */}
      <div
        className={`relative ${
          list ? "w-[140px] sm:w-[200px] shrink-0" : "w-full aspect-square"
        } bg-[#f5f6f8] overflow-hidden flex items-center justify-center rounded-t-xl`}
      >
        <img
          src={imgSrc || p.image || p.fallback || generateProductSvg(p, "Arzon")}
          alt={translateProductTitle(p.title, lang)}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges: Discount & Xit */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {p.off > 0 && (
            <span className="bg-[#e5252b] text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
              -{p.off}%
            </span>
          )}
          {p.badge && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
              {translateBadge(p.badge, lang)}
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFav(p.id);
          }}
          aria-label={t("saveToFav")}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center transition-all active:scale-75 hover:scale-110 z-10 cursor-pointer ${
            fav ? "text-[#e5252b]" : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <span className={`material-symbols-rounded text-[20px] ${fav ? "fill-current" : ""}`}>
            favorite
          </span>
        </button>

        {/* 1-Day Delivery Badge */}
        <span
          className={`absolute bottom-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white backdrop-blur-md shadow-xs flex items-center gap-1 z-10 ${
            p.delivery === "fast" ? "bg-emerald-600/90" : "bg-gray-900/85"
          }`}
        >
          <span className="material-symbols-rounded text-[13px]">
            {p.delivery === "fast" ? "bolt" : "local_shipping"}
          </span>
          <span>{p.delivery === "fast" ? t("fastDelivery20") : t("day1Delivery")}</span>
        </span>

        {/* Quick View Button on Hover (Desktop) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openProductModal(p);
          }}
          className="absolute inset-x-3 bottom-2.5 bg-white/95 backdrop-blur-md text-gray-900 font-bold text-[12px] py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hidden sm:flex items-center justify-center gap-1 hover:bg-white hover:text-[#e5252b] z-20 cursor-pointer"
        >
          <span className="material-symbols-rounded text-[16px]">visibility</span>
          <span>{t("quickView")}</span>
        </button>
      </div>

      {/* Info Body */}
      <div className="p-3 sm:p-3.5 flex flex-col gap-1 flex-1 min-w-0">
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 text-[11.5px] text-gray-500">
          <span className="text-amber-500 material-symbols-rounded text-[15px] fill-current">star</span>
          <b className="text-gray-900 font-bold">{p.rating}</b>
          <span className="text-gray-400">({p.reviews} {t("reviews")})</span>
        </div>

        {/* Title */}
        <h3
          title={translateProductTitle(p.title, lang)}
          className="text-[13px] sm:text-[13.5px] leading-snug font-medium text-gray-900 line-clamp-2 min-h-[36px] group-hover:text-[#e5252b] transition-colors break-words"
        >
          {translateProductTitle(p.title, lang)}
        </h3>

        {/* Uzum-Style Installment Badge */}
        <div className="w-fit max-w-full bg-[#ffea00]/30 border border-[#f5d000]/60 text-[#3d3200] text-[10.5px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md truncate flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{fmt(p.monthly, lang)} / {t("perMonth")}</span>
        </div>

        {/* Interactive Promo Code Chip */}
        {p.promo && (
          <div
            onClick={handlePromoClick}
            title={t("copyPromo")}
            className={`flex items-center justify-between gap-1 text-[10.5px] font-extrabold px-2 py-0.5 rounded-lg border transition-all cursor-pointer mt-0.5 ${
              copiedCode || isPromoApplied
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-red-50/80 hover:bg-red-100/80 border-red-200 text-[#e5252b]"
            }`}
          >
            <div className="flex items-center gap-1 truncate">
              <span className="material-symbols-rounded text-[13px]">confirmation_number</span>
              <span className="tracking-wide truncate">
                {copiedCode ? t("applied") : `PROMO: ${p.promo}`}
              </span>
            </div>
            <span className="text-[10px] bg-white/80 px-1 py-0.2 rounded border border-current font-black shrink-0">
              {copiedCode ? "✓" : `-${Math.round(p.promoDiscount / 1000)}k`}
            </span>
          </div>
        )}

        {/* Bottom Price & Add to Cart / Stepper */}
        <div className="flex items-end justify-between gap-1 sm:gap-2 mt-auto pt-2">
          {/* Prices on Left */}
          <div className="flex flex-col min-w-0 flex-1">
            {p.old > p.price && (
              <span className="text-[10px] sm:text-[11.5px] text-gray-400 line-through font-medium leading-none mb-0.5 truncate">
                {fmt(p.old, lang)}
              </span>
            )}
            <span className="text-[13.5px] sm:text-[16px] font-black text-gray-900 leading-tight truncate">
              {fmt(p.price, lang)}
            </span>
          </div>

          {/* Uzum-Style Cart Button or Stepper on Right */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {q > 0 ? (
              <div className="h-8 sm:h-9 bg-gray-100 rounded-xl flex items-center p-0.5 border border-gray-200 shadow-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setQty(p.id, q - 1);
                  }}
                  aria-label={t("decrease")}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white text-gray-800 hover:bg-gray-50 flex items-center justify-center font-black text-xs sm:text-sm transition active:scale-90 cursor-pointer shadow-xs"
                >
                  −
                </button>
                <span className="text-[11px] sm:text-[12px] font-black text-gray-900 px-1 sm:px-2 min-w-[16px] text-center">
                  {q}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setQty(p.id, q + 1);
                  }}
                  aria-label={t("increase")}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#e5252b] text-white hover:bg-[#c81a20] flex items-center justify-center font-black text-xs sm:text-sm transition active:scale-90 cursor-pointer shadow-xs shadow-red-500/20"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  add(p.id, 1, false);
                }}
                aria-label={t("addToCart")}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-[#e5252b] text-gray-800 hover:text-white border border-gray-200/80 hover:border-transparent flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs cursor-pointer group/btn"
              >
                <span className="material-symbols-rounded text-[18px] sm:text-[20px] group-hover/btn:rotate-6 transition-transform">
                  shopping_bag
                </span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
