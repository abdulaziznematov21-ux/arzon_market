import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { byId, fmt } from "../lib/data";

export default function Orders() {
  const { orders } = useStore();
  if (!orders.length) return (
    <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
      <span className="material-symbols-outlined text-[64px] text-gray-300">inventory_2</span>
      <h1 className="text-2xl font-bold mt-4">Buyurtmalar yo'q</h1>
      <p className="text-gray-500 mt-2">Birinchi buyurtmangizni bering va bu yerda kuzatib boring</p>
      <Link to="/products" className="inline-flex items-center gap-1.5 mt-6 bg-[#e5252b] hover:bg-[#c71e24] text-white px-8 py-3 rounded-xl font-semibold transition">
        Xarid qilishni boshlash<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </div>
  );
  return (
    <div className="bg-[#f9f9fa] pb-16 min-h-screen">
      <div className="max-w-[900px] mx-auto px-6 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500"><Link to="/" className="hover:text-[#e5252b]">Bosh sahifa</Link><span>›</span><b className="text-[#1a1a1a]">Buyurtmalarim</b></div>
        <h1 className="text-[26px] font-extrabold mt-3 mb-6">Buyurtmalarim</h1>
        <div className="space-y-4">
          {orders.map((o) => {
            const lines = o.items.map((it) => byId(it.id)).filter(Boolean);
            const done = o.step >= 4;
            return (
              <Link to={`/orders/${o.id}`} key={o.id} className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#e5252b]/40 hover:shadow-md transition">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <b className="text-[15.5px]">Buyurtma #{o.id}</b>
                  <span className={`text-[11.5px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${done ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-[#e5252b]"}`}>
                    <span className="material-symbols-outlined text-[14px]">{done ? "check_circle" : "local_shipping"}</span>{done ? "Yetkazildi" : "Yo'lda"}
                  </span>
                </div>
                <div className="text-[13px] text-gray-500 mt-1">{new Date(o.date).toLocaleDateString("ru-RU")} · {lines.length} ta mahsulot</div>
                <div className="flex gap-2 mt-3">
                  {lines.slice(0, 6).map((p) => <div key={p.id} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100"><img src={p.img} alt="" className="w-full h-full object-cover" /></div>)}
                </div>
                <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[13px] text-gray-500">Jami:</span>
                  <b className="text-[17px]">{fmt(o.total)}</b>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
