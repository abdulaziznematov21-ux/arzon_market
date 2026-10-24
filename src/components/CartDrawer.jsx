import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { fmt, num, FREE_FROM, PROMOS } from "../lib/data";
import { generateProductSvg } from "../lib/svgGenerator";
import { translateProductTitle } from "../lib/translations";

import { useOverlay } from "../lib/hooks";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    lines,
    setQty,
    remove,
    sub,
    old,
    saved,
    promo,
    promoOff,
    fee,
    total,
    applyPromo,
    openCheckout,
    openProductModal,
    lang,
    t,
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoErr, setPromoErr] = useState("");

  useOverlay(isCartOpen, closeCart);

  if (!isCartOpen) return null;

  const leftForFree = Math.max(0, FREE_FROM - (sub - promoOff));
  const freePercent = Math.min(100, Math.round(((sub - promoOff) / FREE_FROM) * 100));

  const handleApply = (e) => {
    e?.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromo(promoInput);
    if (!ok) {
      setPromoErr(t("invalidPromo"));
    } else {
      setPromoErr("");
      setPromoInput("");
    }
  };

  const handleQuickPromo = (code) => {
    applyPromo(code);
    setPromoErr("");
  };

  const handleCheckout = () => {
    closeCart();
    openCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-left">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-150 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-[24px] text-[#e5252b]">shopping_cart</span>
              <h2 className="text-[18px] font-black text-gray-900">{t("cart")}</h2>
              <span className="bg-red-50 text-[#e5252b] text-[12px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-100">
                {lines.length} {t("itemsUnit")}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-rounded text-[20px]">close</span>
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-emerald-50/70 p-3.5 border-b border-emerald-100 text-[12.5px]">
            <div className="flex items-center justify-between font-bold text-emerald-900 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-rounded text-emerald-600 text-[18px]">local_shipping</span>
                <span>
                  {leftForFree > 0
                    ? `${t("freeDeliveryRemaining")} ${fmt(leftForFree, lang)}`
                    : t("congratsFreeDelivery")}
                </span>
              </div>
              <span className="text-[11px] font-black">{freePercent}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${freePercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100 space-y-4">
            {lines.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-red-50 text-[#e5252b] flex items-center justify-center text-3xl mx-auto mb-3">
                  <span className="material-symbols-rounded text-4xl">shopping_cart_off</span>
                </div>
                <h3 className="text-lg font-black text-gray-900">{t("cartEmptyTitle")}</h3>
                <p className="text-gray-500 text-[13px] mt-1 max-w-[240px] mx-auto">
                  {t("cartEmptyDesc")}
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#e5252b] text-white font-bold text-[13.5px] hover:bg-[#c81a20] transition cursor-pointer"
                >
                  {t("continueShopping")}
                </button>
              </div>
            ) : (
              lines.map(({ id, qty, p }) => (
                <div key={id} className="pt-4 first:pt-0 flex gap-3 items-start">
                  {/* Image */}
                  <div
                    onClick={() => {
                      closeCart();
                      openProductModal(p);
                    }}
                    className="w-18 h-18 rounded-xl bg-gray-50 border border-gray-150 overflow-hidden shrink-0 cursor-pointer flex items-center justify-center p-1"
                  >
                    <img
                      src={p.image}
                      alt={translateProductTitle(p.title, lang)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = p.fallback || generateProductSvg(p, "Arzon");
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div
                        onClick={() => {
                          closeCart();
                          openProductModal(p);
                        }}
                        className="text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-[#e5252b] cursor-pointer"
                      >
                        {translateProductTitle(p.title, lang)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[14px] font-black text-gray-900">{fmt(p.price, lang)}</span>
                        {p.old > p.price && (
                          <span className="text-[11px] text-gray-400 line-through">{fmt(p.old, lang)}</span>
                        )}
                      </div>
                    </div>

                    {/* Qty & Delete */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="h-[32px] bg-gray-100 rounded-lg flex items-center p-0.5 border border-gray-200">
                        <button
                          onClick={() => setQty(id, qty - 1)}
                          className="w-7 h-7 bg-white rounded text-gray-700 font-bold hover:bg-gray-50 flex items-center justify-center transition cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-[12px] font-black px-2.5">{qty}</span>
                        <button
                          onClick={() => setQty(id, qty + 1)}
                          className="w-7 h-7 bg-white rounded text-gray-700 font-bold hover:bg-gray-50 flex items-center justify-center transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => remove(id)}
                        className="text-gray-400 hover:text-[#e5252b] transition p-1 cursor-pointer"
                        aria-label="O'chirish"
                      >
                        <span className="material-symbols-rounded text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Promo Controls */}
          {lines.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-150 bg-gray-50/50 space-y-3">
              
              {/* Promo code quick selection */}
              <div>
                <div className="text-[11.5px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center justify-between">
                  <span>{t("applyPromoCodeTitle")}</span>
                  {promo && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-rounded text-[14px]">check_circle</span>
                      {promo} {t("activePromo")}
                    </span>
                  )}
                </div>

                {/* Quick Promo Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Object.values(PROMOS).map((pr) => (
                    <button
                      key={pr.code}
                      onClick={() => handleQuickPromo(pr.code)}
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        promo === pr.code
                          ? "bg-[#e5252b] text-white border-[#e5252b] shadow-xs"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#e5252b] hover:text-[#e5252b]"
                      }`}
                    >
                      {pr.code} (-{Math.round(pr.discount / 1000)}k)
                    </button>
                  ))}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApply} className="flex gap-1.5">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder={t("promoCodePlaceholder")}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] font-bold outline-none focus:border-[#e5252b]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-[12.5px] font-bold rounded-xl transition cursor-pointer"
                  >
                    {t("applyPromo")}
                  </button>
                </form>
                {promoErr && <p className="text-[11px] text-[#e5252b] mt-1 font-semibold">{promoErr}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-150 pt-2 space-y-1.5 text-[13px]">
                <div className="flex justify-between text-gray-600">
                  <span>{t("productsCost")}</span>
                  <b className="text-gray-900">{fmt(sub, lang)}</b>
                </div>

                {promoOff > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t("promoDiscountLabel")}</span>
                    <b>-{fmt(promoOff, lang)}</b>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>{t("deliveryCost")}</span>
                  {fee === 0 ? (
                    <span className="text-emerald-700 font-bold">{t("free")}</span>
                  ) : (
                    <b className="text-gray-900">{fmt(fee, lang)}</b>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-gray-900">
                  <span className="font-extrabold text-[15px]">{t("totalPay")}</span>
                  <div className="text-right">
                    <span className="text-[22px] font-black text-[#e5252b]">{num(total)}</span>{" "}
                    <span className="text-[13px] font-bold">{t("currency")}</span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={handleCheckout}
                className="w-full h-[48px] bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-[0.99] text-white rounded-xl font-black text-[15px] shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("checkoutTitle")}</span>
                <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
