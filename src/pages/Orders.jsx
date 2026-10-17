import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { byId, fmt } from "../lib/data";
import { translateProductTitle } from "../lib/translations";

export default function Orders() {
  const s = useStore();
  const isRu = s.lang === "ru";

  if (!s.orders.length) {
    return (
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-[#e5252b] flex items-center justify-center text-4xl mx-auto mb-4 shadow-xs">
          <span className="material-symbols-rounded text-[40px]">inventory_2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          {isRu ? "Заказов пока нет" : "Buyurtmalar mavjud emas"}
        </h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-[14.5px]">
          {isRu
            ? "Вы еще не делали заказов. Перейдите в каталог и оформите первый заказ!"
            : "Siz hali buyurtma bermagansiz. Mahsulotlar katalogini ko'rib chiqing va buyurtma bering!"}
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
    <div className="bg-[#f8f9fa] pb-16 min-h-screen">
      <div className="max-w-[960px] mx-auto px-4 sm:px-8 pt-4">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#e5252b]">{isRu ? "Главная" : "Bosh sahifa"}</Link>
          <span>›</span>
          <b className="text-gray-900">{isRu ? "Мои заказы" : "Buyurtmalarim"}</b>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] sm:text-[30px] font-black text-gray-900">
              {isRu ? "Мои заказы" : "Buyurtmalarim"}
            </h1>
            <span className="bg-red-50 text-[#e5252b] text-[12px] font-extrabold px-3 py-1 rounded-full border border-red-100">
              {s.orders.length} {isRu ? "заказов" : "ta buyurtma"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {s.orders.map((o) => {
            const lines = o.items.map((it) => byId(it.id)).filter(Boolean);
            const done = o.step >= 4;

            return (
              <Link
                to={`/orders/${o.id}`}
                key={o.id}
                className="block bg-white rounded-3xl border border-gray-150 p-5 sm:p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-rounded text-[22px] text-[#e5252b]">receipt_long</span>
                    <b className="text-[17px] font-extrabold text-gray-900 group-hover:text-[#e5252b] transition">
                      {isRu ? `Заказ #${o.id}` : `Buyurtma #${o.id}`}
                    </b>
                  </div>

                  <span
                    className={`text-[12px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 ${
                      done
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-[#e5252b] animate-pulse"
                    }`}
                  >
                    <span className="material-symbols-rounded text-[15px]">
                      {done ? "check_circle" : "local_shipping"}
                    </span>
                    <span>
                      {done 
                        ? (isRu ? "Доставлен" : "Yetkazildi") 
                        : (isRu ? "Курьер в пути" : "Kuryer yo'lda")}
                    </span>
                  </span>
                </div>

                <div className="text-[13px] text-gray-500 mt-2 flex items-center gap-2 font-medium">
                  <span>{isRu ? "Дата:" : "Sana:"} {new Date(o.date).toLocaleDateString(isRu ? "ru-RU" : "uz-UZ")}</span>
                  <span>•</span>
                  <span>{lines.length} {isRu ? "товаров" : "xil mahsulot"}</span>
                  <span>•</span>
                  <span className="text-gray-400 font-mono">{isRu ? "Код:" : "Kodi:"} {o.code}</span>
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                  {lines.slice(0, 6).map((p) => {
                    const translatedTitle = translateProductTitle(p.title, s.lang);
                    return (
                      <div
                        key={p.id}
                        className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-150 overflow-hidden flex items-center justify-center shrink-0"
                        title={translatedTitle}
                      >
                        <img src={p.image} alt={translatedTitle} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                  {lines.length > 6 && (
                    <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0">
                      +{lines.length - 6}
                    </div>
                  )}
                </div>

                {/* Bottom row */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="text-[13px] text-gray-500">
                    {isRu ? "Оплата:" : "To'lov:"} <span className="font-semibold text-gray-800">{o.pay || (isRu ? "Оплата курьеру" : "Kuryerga to'lov")}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] text-gray-400 block -mb-1">{isRu ? "Итоговая сумма:" : "Jami summa:"}</span>
                    <b className="text-[18px] sm:text-[20px] font-black text-gray-900">{fmt(o.total, s.lang)}</b>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
