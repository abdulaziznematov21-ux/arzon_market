import { useState } from "react";
import { useStore } from "../lib/store";
import { useOverlay } from "../lib/hooks";
import { fmt, num, CITIES, PROMOS } from "../lib/data";
import { getCityName } from "../lib/translations";

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    checkoutDirectItem,
    sel,
    user,
    city,
    address,
    promo,
    promoOff,
    fee,
    total,
    placeOrder,
    openOrders,
    lang,
    t,
  } = useStore();

  const [deliveryType, setDeliveryType] = useState("point"); // 'point' | 'courier'
  const [recipient, setRecipient] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [userAddress, setUserAddress] = useState(address || "");
  const [payMethod, setPayMethod] = useState("Click"); // 'Click' | 'Payme' | 'Uzum Pay' | 'Naqd'
  const [orderCompleteId, setOrderCompleteId] = useState(null);

  const handleClose = () => {
    setOrderCompleteId(null);
    closeCheckout();
  };

  useOverlay(isCheckoutOpen, handleClose);

  if (!isCheckoutOpen) return null;

  // Direct single item or entire cart
  const items = checkoutDirectItem
    ? [{ id: checkoutDirectItem.id, qty: checkoutDirectItem.qty || 1, p: checkoutDirectItem }]
    : sel;

  const directSub = checkoutDirectItem
    ? (checkoutDirectItem.price || 0) * (checkoutDirectItem.qty || 1)
    : 0;
  const currentTotal = checkoutDirectItem ? directSub : total;
  const currentFee = deliveryType === "courier" ? 20000 : 0;
  const finalTotal = currentTotal + (checkoutDirectItem ? currentFee : 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const finalRecipient = recipient.trim() || user?.name || "Xaridor";
    const finalPhone = phone.trim() || user?.phone || "+998 (90) 123-45-67";
    const id = placeOrder({
      address: deliveryType === "point" ? `${city} sh., Arzon Market topshirish punkti #12` : (userAddress.trim() || `${city} sh., Markaziy ko'cha`),
      pay: payMethod,
      recipient: finalRecipient,
      phone: finalPhone,
      fee: currentFee,
    });
    setOrderCompleteId(id);
  };

  const handleViewOrders = () => {
    setOrderCompleteId(null);
    closeCheckout();
    openOrders();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200/80 w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10 animate-modal-pop">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e5252b] flex items-center justify-center">
              <span className="material-symbols-rounded text-[22px]">shopping_bag</span>
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-black text-gray-900">
                {orderCompleteId ? t("orderSuccessTitle") : t("checkoutTitle")}
              </h2>
              <div className="text-[12px] text-gray-500">
                {orderCompleteId ? t("tomorrowInHands") : t("quickOneMinute")}
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        {orderCompleteId ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-md border border-emerald-100 animate-bounce">
              <span className="material-symbols-rounded text-5xl">check_circle</span>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900">
              {t("orderSuccessTitle")}
            </h3>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-500">{t("orderNumber")}</span>
                <b className="text-gray-900 font-mono text-[15px]">{orderCompleteId}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("recipient")}</span>
                <b className="text-gray-900">{recipient}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("phone")}</span>
                <b className="text-gray-900">{phone}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("paymentMethod")}</span>
                <b className="text-gray-900">{payMethod}</b>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-[14px]">
                <span className="font-bold text-gray-700">{t("totalOrderPay")}</span>
                <b className="text-[#e5252b] font-black">{fmt(finalTotal, lang)}</b>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
              <button
                onClick={handleViewOrders}
                className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[18px]">receipt_long</span>
                <span>{t("trackOrder")}</span>
              </button>

              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl bg-[#e5252b] hover:bg-[#c81a20] text-white font-bold text-[14px] transition cursor-pointer"
              >
                {t("continueShopping")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-5">
            
            {/* Delivery Type Switcher */}
            <div>
              <label className="text-[12px] font-extrabold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("deliveryMethod")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div
                  onClick={() => setDeliveryType("point")}
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    deliveryType === "point"
                      ? "border-[#e5252b] bg-red-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="material-symbols-rounded text-[#e5252b] text-[24px] shrink-0">store</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-gray-900 truncate">
                      {lang === "ru" ? "Пункт выдачи" : "Topshirish punkti"}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold">
                      {lang === "ru" ? "За 1 день • Бесплатно" : "1 kunda • Bepul"}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryType("courier")}
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    deliveryType === "courier"
                      ? "border-[#e5252b] bg-red-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="material-symbols-rounded text-[#e5252b] text-[24px] shrink-0">local_shipping</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-gray-900 truncate">
                      {lang === "ru" ? "Курьером до двери" : "Kuryer orqali eshikkacha"}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {lang === "ru" ? "Быстрая доставка" : "Tezkor yetkazish"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-bold text-gray-700 block mb-1">
                  {lang === "ru" ? "Ф.И.О. получателя" : "Ism va familiya"}
                </label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={t("recipientNamePlaceholder")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-[#e5252b] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-700 block mb-1">
                  {lang === "ru" ? "Номер телефона" : "Telefon raqam"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-[#e5252b] focus:bg-white"
                />
              </div>
            </div>

            {/* Address if courier */}
            {deliveryType === "courier" ? (
              <div>
                <label className="text-[12px] font-bold text-gray-700 block mb-1">
                  {t("deliveryAddress")}
                </label>
                <input
                  type="text"
                  required
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder={lang === "ru" ? "Город, район, улица, дом" : "Shahar, tuman, ko'cha, uy raqami"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-[#e5252b] focus:bg-white"
                />
              </div>
            ) : (
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3 flex items-center gap-2.5 text-[12.5px] text-amber-900">
                <span className="material-symbols-rounded text-amber-600">location_on</span>
                <span>
                  {lang === "ru" ? (
                    <><b>В городе {getCityName(city, lang)}</b> в ближайший пункт выдачи Arzon Market доставим за 1 день.</>
                  ) : (
                    <><b>{city} shahridagi</b> sizga eng yaqin Arzon Market topshirish punktiga 1 kunda yetib boradi.</>
                  )}
                </span>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="text-[12px] font-extrabold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("paymentMethod")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Click", "Payme", "Uzum Pay", lang === "ru" ? "Курьеру (Наличные)" : "Kuryerga (Naqd)"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayMethod(m)}
                    className={`py-2 px-3 rounded-xl border text-[13px] font-bold transition cursor-pointer ${
                      payMethod === m
                        ? "bg-[#e5252b] text-white border-[#e5252b] shadow-xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-[13.5px] space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>{t("productsCost")} ({items.length} {t("itemsUnit")}):</span>
                <b className="text-gray-900">{fmt(checkoutDirectItem ? directSub : total - fee, lang)}</b>
              </div>
              {promo && !checkoutDirectItem && promoOff > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t("promoDiscountLabel")} ({promo}):</span>
                  <span>-{fmt(promoOff, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>{t("deliveryCost")}</span>
                <span className={currentFee === 0 ? "text-emerald-700 font-bold" : "text-gray-900 font-bold"}>
                  {currentFee === 0 ? t("free") : fmt(currentFee, lang)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-gray-900">
                <b className="text-[16px]">{t("totalOrderPay")}</b>
                <b className="text-[22px] font-black text-[#e5252b]">{fmt(finalTotal, lang)}</b>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full h-[52px] bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-[0.99] text-white rounded-2xl font-black text-[16px] shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t("confirmOrder")}</span>
              <span className="material-symbols-rounded text-[20px]">check</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
