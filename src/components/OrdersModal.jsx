import { useEffect } from "react";
import { useStore } from "../lib/store";
import { byId, fmt } from "../lib/data";
import { translateProductTitle } from "../lib/translations";

const STEPS_UZ = ["Qabul qilindi", "Yig'ilmoqda", "Kuryerga berildi", "Topshirishga tayyor", "Topshirildi"];
const STEPS_RU = ["Принят", "Собирается", "Передан курьеру", "Готов к выдаче", "Доставлен"];

export default function OrdersModal() {
  const { isOrdersOpen, closeOrders, orders, advance, lang } = useStore();
  const steps = lang === "ru" ? STEPS_RU : STEPS_UZ;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOrdersOpen) closeOrders();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOrdersOpen, closeOrders]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOrdersOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOrdersOpen]);

  if (!isOrdersOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={closeOrders} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200/80 w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10 animate-modal-pop">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e5252b] flex items-center justify-center">
              <span className="material-symbols-rounded text-[22px]">package_2</span>
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-black text-gray-900">
                {lang === "ru" ? "Мои заказы" : "Mening buyurtmalarim"}
              </h2>
              <div className="text-[12px] text-gray-500">
                {lang === "ru" ? "Отслеживание и получение всех заказов" : "Barcha buyurtmalarni kuzatish va qabul qilish"}
              </div>
            </div>
          </div>

          <button
            onClick={closeOrders}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Orders list */}
        <div className="p-5 sm:p-6 space-y-5">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-[14px]">
                {lang === "ru" ? "У вас пока нет активных заказов." : "Hozircha faol buyurtmalaringiz mavjud emas."}
              </p>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bg-gray-50/80 rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4">
                
                {/* Order header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[12px] text-gray-400 font-semibold">
                      {lang === "ru" ? "ID заказа:" : "Buyurtma ID:"}
                    </span>{" "}
                    <b className="text-[15px] font-mono text-gray-900">{o.id}</b>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[12px] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-200">
                    {lang === "ru" ? "Код: " : "Kodi: "}
                    <strong className="font-mono text-[13px]">{o.code}</strong>
                  </span>
                </div>

                {/* Step indicator */}
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-2">
                    {steps.map((s, idx) => (
                      <span
                        key={s}
                        className={idx <= o.step ? "text-[#e5252b] font-black" : "text-gray-400"}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#e5252b] to-[#b91c1c] transition-all duration-500 rounded-full"
                      style={{ width: `${((o.step + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex gap-2.5 overflow-x-auto py-1">
                  {o.items.map((it) => {
                    const prod = byId(it.id);
                    if (!prod) return null;
                    const translatedTitle = translateProductTitle(prod.title, lang);
                    return (
                      <div key={it.id} className="w-14 h-14 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 relative" title={translatedTitle}>
                        <img src={prod.image} alt={translatedTitle} className="w-full h-full object-cover" />
                        {it.qty > 1 && (
                          <span className="absolute bottom-0 right-0 bg-[#e5252b] text-white text-[10px] font-bold px-1 rounded-tl">
                            {it.qty}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between text-[13px] border-t border-gray-200/60 pt-3">
                  <div>
                    <span className="text-gray-500">{lang === "ru" ? "Итого к оплате:" : "Jami to'lov:"}</span>{" "}
                    <b className="text-gray-900 font-extrabold">{fmt(o.total, lang)}</b>
                  </div>

                  {o.step < 4 && (
                    <button
                      onClick={() => advance(o.id)}
                      className="text-[12px] font-bold text-[#e5252b] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{lang === "ru" ? "Перейти на следующий этап" : "Keyingi bosqichga o'tkazish"}</span>
                      <span className="material-symbols-rounded text-[14px]">arrow_forward</span>
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
