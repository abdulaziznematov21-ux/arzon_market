import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { fmt, num, FREE_FROM, PROMOS } from "../lib/data";
import { translateProductTitle, getCityName } from "../lib/translations";

export default function Cart() {
  const s = useStore();
  const isRu = s.lang === "ru";
  const nav = useNavigate();
  const [code, setCode] = useState(s.promo || "");
  const [err, setErr] = useState(false);
  const [edit, setEdit] = useState(false);

  const allSel = s.lines.length > 0 && s.lines.every((l) => l.sel);
  const left = Math.max(0, FREE_FROM - (s.sub - s.promoOff));

  const check = () => {
    if (!s.lines.length || !s.sel.length) {
      s.toast(isRu ? "Пожалуйста, выберите товары для оформления заказа" : "Iltimos, buyurtma berish uchun mahsulotni tanlang");
      return;
    }
    s.openCheckout();
  };

  if (!s.lines.length) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
        <div className="w-24 h-24 rounded-3xl bg-red-50 text-[#e5252b] flex items-center justify-center text-5xl mx-auto mb-5 shadow-sm">
          🛒
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          {isRu ? "В корзине пока пусто" : "Savat hozircha bo'sh"}
        </h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-[15px]">
          {isRu 
            ? "Перейдите на главную страницу или воспользуйтесь поиском, чтобы добавить понравившиеся товары."
            : "Bosh sahifaga o'ting yoki qidiruv orqali yoqqan mahsulotlaringizni savatga qo'shing."}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-6 bg-[#e5252b] hover:bg-[#c81a20] text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-red-500/25 transition-all active:scale-95"
        >
          <span>{isRu ? "Начать покупки" : "Xarid qilishni boshlash"}</span>
          <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#e5252b]">{isRu ? "Главная" : "Bosh sahifa"}</Link>
          <span>›</span>
          <b className="text-gray-900">{isRu ? "Корзина" : "Savat"}</b>
        </div>

        {/* Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] sm:text-[32px] font-black text-gray-900">{isRu ? "Корзина" : "Savat"}</h1>
              <span className="bg-red-50 text-[#e5252b] text-[12px] font-extrabold px-3 py-1 rounded-full border border-red-100">
                {s.lines.length} {isRu ? "товаров" : "ta tovar"}
              </span>
            </div>
            <p className="text-[13px] text-gray-500 mt-1">
              {isRu ? "Проверьте выбранные товары и оформите заказ" : "Tanlangan mahsulotlarni ko'rib chiqing va buyurtmani rasmiylashtiring"}
            </p>
          </div>

          <div className="bg-white rounded-2xl px-5 py-3 flex items-center flex-wrap gap-4 text-[13.5px] border border-gray-150 shadow-xs">
            <label className="flex items-center gap-2.5 font-bold text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSel}
                onChange={() => s.selAll(!allSel)}
                className="accent-[#e5252b] w-4.5 h-4.5 rounded cursor-pointer"
              />
              <span>{isRu ? "Выбрать все" : "Hammasini belgilash"}</span>
            </label>
            <div className="w-px h-4 bg-gray-200" />
            <button
              onClick={s.removeSel}
              className="text-[#e5252b] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-rounded text-[18px]">delete</span>
              <span>{isRu ? "Удалить выбранные" : "Tanlanganlarni o'chirish"}</span>
            </button>
          </div>
        </div>

        {/* Free Delivery Tracker Ribbon */}
        <div className="bg-white rounded-3xl p-5 mt-4 border border-gray-150 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-rounded text-[22px] text-emerald-600">local_shipping</span>
              <div>
                <b className="text-[15px] text-gray-900">{isRu ? "Бесплатная доставка" : "Bepul yetkazib berish"}</b>
                <div className="text-[13px] text-gray-500">
                  {left > 0 ? (
                    <>
                      {isRu ? "До бесплатной доставки еще " : "Bepul yetkazishgacha yana "}
                      <strong className="text-gray-800">{fmt(left, s.lang)}</strong>
                      {!isRu && " qoldi"}
                    </>
                  ) : (
                    <span className="text-emerald-600 font-bold">
                      {isRu ? "Поздравляем! Для вас доставка бесплатна!" : "Tabriklaymiz! Siz uchun yetkazib berish bepul!"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right font-extrabold text-[14px] text-emerald-700">
              {num(s.sub - s.promoOff)} / {num(FREE_FROM)} {isRu ? "сум" : "so'm"}
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((s.sub - s.promoOff) / FREE_FROM) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Contents & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px] gap-6 mt-6 items-start">
          
          {/* Left Column: Cart Items list & details */}
          <div className="space-y-4 min-w-0">
            {s.lines.map(({ id, qty, sel, p }) => {
              const translatedTitle = translateProductTitle(p.title, s.lang);
              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-150 shadow-xs flex items-start sm:items-center gap-3 sm:gap-4 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={!!sel}
                    onChange={() => s.toggleSel(id)}
                    aria-label="Tanlash"
                    className="accent-[#e5252b] w-5 h-5 rounded cursor-pointer mt-1 sm:mt-0 shrink-0"
                  />

                  <Link
                    to={`/product/${id}`}
                    className="relative w-[85px] h-[85px] sm:w-[110px] sm:h-[110px] rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center shrink-0 group overflow-hidden"
                  >
                    <img src={p.image} alt={translatedTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute top-1.5 left-1.5 bg-[#e5252b] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                      -{p.off}%
                    </span>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 pr-2">
                      <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>
                          {p.delivery === "fast" 
                            ? (isRu ? "⚡ Доставка за 20 минут" : "⚡ 20 daqiqada yetkaziladi") 
                            : (isRu ? "Доставка завтра" : "Ertaga yetkaziladi")}
                        </span>
                      </div>
                      <Link
                        to={`/product/${id}`}
                        className="font-bold text-[15px] sm:text-[16px] text-gray-900 hover:text-[#e5252b] transition line-clamp-2 mt-0.5 break-words"
                      >
                        {translatedTitle}
                      </Link>
                      <div className="text-[12px] text-gray-400 mt-0.5 font-medium">
                        {isRu ? "Бренд:" : "Brend:"} <span className="text-gray-600 font-semibold">{p.brand}</span> · {p.sub}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-[18px] sm:text-[20px] font-black text-gray-900">
                        {fmt(p.price * qty, s.lang)}
                      </div>
                      {qty > 1 && (
                        <div className="text-[11.5px] text-gray-500">
                          {qty} {isRu ? "шт" : "dona"} × {num(p.price)}
                        </div>
                      )}
                      <div className="text-[12px] text-gray-400 line-through">
                        {fmt(p.old * qty, s.lang)}
                      </div>

                      <div className="flex items-center gap-2 mt-2 justify-between sm:justify-end">
                        <div className="flex items-center bg-gray-100 rounded-xl p-0.5 border border-gray-200/60">
                          <button
                            onClick={() => s.setQty(id, qty - 1)}
                            aria-label="Kamaytirish"
                            className="w-8 h-8 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center font-bold text-base transition shadow-2xs cursor-pointer"
                          >
                            −
                          </button>
                          <b className="w-8 text-center text-[13px] font-extrabold">{qty}</b>
                          <button
                            onClick={() => s.setQty(id, qty + 1)}
                            aria-label="Ko'paytirish"
                            className="w-8 h-8 rounded-lg bg-[#e5252b] text-white flex items-center justify-center font-bold text-base transition shadow-2xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => s.remove(id)}
                          aria-label="O'chirish"
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-[#e5252b] flex items-center justify-center transition cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Promocode Box */}
            <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <b className="text-[16px] text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-rounded text-[20px] text-amber-500">confirmation_number</span>
                  <span>{isRu ? "Промокоды и скидки" : "Promokod va chegirmalar"}</span>
                </b>
                <span className="text-[12px] text-gray-400 font-medium">{isRu ? "Выберите в 1 клик" : "1 bosishda tanlang"}</span>
              </div>

              {/* Quick promo code chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.values(PROMOS).map((pr) => (
                  <button
                    key={pr.code}
                    onClick={() => {
                      setCode(pr.code);
                      s.applyPromo(pr.code);
                    }}
                    className={`text-[12px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      s.promo === pr.code
                        ? "bg-[#e5252b] text-white border-[#e5252b] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#e5252b] hover:text-[#e5252b]"
                    }`}
                  >
                    <span>{pr.code}</span>
                    <span className="opacity-80">(-{Math.round(pr.discount / 1000)}k)</span>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2.5">
                <input
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setErr(false); }}
                  placeholder={isRu ? "Введите промокод..." : "Promokodni kiriting..."}
                  className="flex-1 min-w-0 bg-gray-50 rounded-2xl px-4 h-[48px] text-[15px] font-bold outline-none border border-gray-200 focus:border-[#e5252b] uppercase transition"
                />
                <button
                  onClick={() => setErr(!s.applyPromo(code))}
                  className="px-6 h-[48px] rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] transition active:scale-95 cursor-pointer"
                >
                  {isRu ? "Применить" : "Qo'llash"}
                </button>
              </div>

              {s.promo && (
                <div className="mt-3 bg-emerald-50 text-emerald-800 rounded-2xl px-4 py-3 flex items-center justify-between text-[13.5px] border border-emerald-200/60">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[18px] text-emerald-600">check_circle</span>
                    <span>
                      <strong>{s.promo}</strong> {isRu ? `код успешно применен (-${num(s.promoOff)} сум)` : `kodi muvaffaqiyatli qo'llandi (-${num(s.promoOff)} so'm)`}
                    </span>
                  </span>
                  <button
                    onClick={() => { s.setPromo(null); setCode(""); }}
                    className="text-emerald-700 font-bold hover:text-emerald-900 cursor-pointer"
                  >
                    {isRu ? "Отменить" : "Bekor qilish"}
                  </button>
                </div>
              )}

              {err && (
                <div className="mt-3 bg-red-50 text-red-600 rounded-2xl px-4 py-2.5 text-[13px] flex items-center gap-1.5 border border-red-100">
                  <span className="material-symbols-rounded text-[18px]">error</span>
                  <span>{isRu ? "Промокод не найден. Например: ARZON2026, BAHOR50, SUPER10" : "Promokod topilmadi. Masalan: ARZON2026, BAHOR50, SUPER10"}</span>
                </div>
              )}
            </div>

            {/* Address & Delivery Info Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-xs flex items-center flex-wrap sm:flex-nowrap gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#e5252b] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">location_on</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {isRu ? `Адрес доставки (${getCityName(s.city, s.lang)})` : `Yetkazish manzili (${s.city})`}
                </div>
                {edit ? (
                  <input
                    autoFocus
                    value={s.address}
                    onChange={(e) => s.setAddress(e.target.value)}
                    onBlur={() => setEdit(false)}
                    onKeyDown={(e) => e.key === "Enter" && setEdit(false)}
                    className="w-full border-b-2 border-[#e5252b] outline-none font-bold text-[15px] text-gray-900 py-1"
                  />
                ) : (
                  <div className="font-extrabold text-[15px] text-gray-900 break-words mt-0.5">
                    {s.address}
                  </div>
                )}
                <div className="text-[12px] text-emerald-600 font-semibold mt-0.5">
                  {isRu ? "Завтра с 10:00 до 22:00 курьер доставит заказ" : "Ertaga soat 10:00 - 22:00 oralig'ida kuryer yetkazadi"}
                </div>
              </div>
              <button
                onClick={() => setEdit(!edit)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold transition cursor-pointer"
              >
                {edit ? (isRu ? "Сохранить" : "Saqlash") : (isRu ? "Изменить" : "O'zgartirish")}
              </button>
            </div>

            {/* User Receiver Banner */}
            {s.user ? (
              <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-3xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {s.user.avatar || s.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-gray-900">
                      {isRu ? "Получатель:" : "Qabul qiluvchi:"} {s.user?.name || (isRu ? "Покупатель" : "Xaridor")}
                    </div>
                    <div className="text-[12px] text-gray-600 font-mono">{s.user?.phone || ""}</div>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                  {isRu ? "Аккаунт подключен" : "Hisob ulangan"}
                </span>
              </div>
            ) : (
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-3xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-amber-600 text-[26px]">account_circle</span>
                  <div className="text-[13px] text-amber-900">
                    {isRu 
                      ? "Войдите в профиль для быстрого оформления и получения бонусов." 
                      : "Buyurtmani tezroq rasmiylashtirish va bonuslar uchun profilingizga kiring."}
                  </div>
                </div>
                <button
                  onClick={s.openLogin}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold transition shrink-0 cursor-pointer"
                >
                  {isRu ? "Войти" : "Kirish"}
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary & Checkout CTA */}
          <aside className="space-y-4 lg:sticky lg:top-[100px] min-w-0">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <b className="text-[18px] font-black text-gray-900">{isRu ? "Сумма заказа" : "Buyurtma hisobi"}</b>
                <span className="bg-gray-100 text-gray-700 text-[12px] font-bold px-2.5 py-1 rounded-lg">
                  {getCityName(s.city, s.lang)}
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4 text-[14px]">
                <div className="flex justify-between text-gray-600">
                  <span>{isRu ? `Товары (${s.sel.reduce((a, l) => a + l.qty, 0)} шт):` : `Tovarlar (${s.sel.reduce((a, l) => a + l.qty, 0)} dona):`}</span>
                  <b className="text-gray-900 font-bold">{fmt(s.old, s.lang)}</b>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>{isRu ? "Сезонная скидка:" : "Mavsumiy chegirma:"}</span>
                  <b className="text-[#e5252b] font-bold">-{fmt(s.saved, s.lang)}</b>
                </div>

                {s.promo && (
                  <div className="flex justify-between text-gray-600">
                    <span>{isRu ? "Скидка по промокоду:" : "Promokod chegirmasi:"}</span>
                    <b className="text-[#e5252b] font-bold">-{fmt(s.promoOff, s.lang)}</b>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>{isRu ? "Доставка:" : "Yetkazib berish:"}</span>
                  {s.fee ? (
                    <b className="text-gray-900">{fmt(s.fee, s.lang)}</b>
                  ) : (
                    <span>
                      <s className="text-gray-400 text-[12px] mr-1.5">{isRu ? "20 000 сум" : "20 000 so'm"}</s>
                      <b className="text-emerald-600 font-bold">{isRu ? "Бесплатно" : "Bepul"}</b>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end gap-2 border-t border-gray-100 mt-4 pt-4">
                <b className="text-[16px] text-gray-900">{isRu ? "Итого к оплате:" : "Jami to'lov:"}</b>
                <div className="text-right">
                  <div className="text-[28px] sm:text-[32px] font-black text-gray-900 leading-none">
                    {num(s.total)} <span className="text-[17px] font-bold">{isRu ? "сум" : "so'm"}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2 text-[12.5px] mt-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
                <span>{isRu ? "Ваша общая экономия:" : "Umumiy tejovingiz:"}</span>
                <b className="font-extrabold">{fmt(s.saved + s.promoOff, s.lang)}</b>
              </div>

              {/* Installment preview pill */}
              <div className="bg-amber-50/80 rounded-2xl p-3 mt-4 border border-amber-200/60 text-[13px] text-amber-900">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  {isRu ? "Рассрочка (Uzum Nasiya)" : "Muddatli to'lov (Uzum Nasiya)"}
                </div>
                <div>
                  {isRu 
                    ? <>От <strong className="text-[#e5252b] font-extrabold">{fmt(s.total / 12, s.lang)}</strong> в месяц на 12 мес</>
                    : <>Oyiga <strong className="text-[#e5252b] font-extrabold">{fmt(s.total / 12)}</strong>dan 12 oyga</>}
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={check}
                className="w-full h-[54px] mt-5 bg-gradient-to-r from-[#e5252b] to-[#c8102e] hover:brightness-105 active:scale-[0.99] text-white rounded-2xl font-black text-[16px] shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isRu ? "Оформить заказ" : "Buyurtmani rasmiylashtirish"}</span>
                <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
              </button>

              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-gray-500 text-center">
                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                  <b className="block text-gray-800 text-[12px]">{isRu ? "Безопасная оплата" : "Xavfsiz to'lov"}</b>
                  {isRu ? "100% защита данных" : "100% himoyalangan"}
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                  <b className="block text-gray-800 text-[12px]">{isRu ? "Возврат за 14 дней" : "14 kunda qaytarish"}</b>
                  {isRu ? "Гарантия без хлопот" : "Muammosiz kafolat"}
                </div>
              </div>
            </div>

            <div className="bg-gray-100/80 rounded-2xl p-4 text-[12.5px] text-gray-600 flex items-start gap-2.5">
              <span className="material-symbols-rounded text-[20px] text-gray-500 shrink-0 mt-0.5">verified_user</span>
              <span>
                {isRu 
                  ? "Вы можете проверить товар при получении. Если не подойдет — возврат на месте бесплатный."
                  : "Tovarni qabul qilayotganingizda bemalol tekshirib olishingiz mumkin. Yoqmasa, joyida qaytarish bepul."}
              </span>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
