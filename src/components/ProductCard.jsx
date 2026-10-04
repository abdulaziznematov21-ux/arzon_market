import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { fmt } from "../lib/data";

const DELIVERY_LABEL = {
  fast: { icon: "bolt", text: "30 daqiqada", cls: "bg-emerald-50 text-emerald-700" },
  tomorrow: { icon: "local_shipping", text: "Ertaga", cls: "bg-gray-100 text-gray-600" },
  "3days": { icon: "local_shipping", text: "2-3 kunda", cls: "bg-gray-100 text-gray-600" },
};

export default function ProductCard({ p, list = false }) {
  const { cart, add, setQty, favs, toggleFav } = useStore();
  const qty = cart[p.id] || 0;
  const isFav = favs.includes(p.id);
  const dv = DELIVERY_LABEL[p.delivery] || DELIVERY_LABEL.tomorrow;

  const CartControl = () =>
    qty === 0 ? (
      <button
        onClick={(e) => { e.preventDefault(); add(p.id); }}
        className="w-full h-[38px] rounded-xl bg-[#e5252b] hover:bg-[#c71e24] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition"
      >
        <span className="material-symbols-outlined text-[18px]">shopping_bag</span>Savatga
      </button>
    ) : (
      <div className="w-full h-[38px] rounded-xl bg-[#fdeceb] flex items-center justify-between px-1">
        <button onClick={(e) => { e.preventDefault(); setQty(p.id, qty - 1); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#e5252b] hover:bg-white/70">
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <span className="text-[14px] font-bold text-[#e5252b]">{qty}</span>
        <button onClick={(e) => { e.preventDefault(); setQty(p.id, qty + 1); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#e5252b] hover:bg-white/70">
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>
    );

  if (list) {
    return (
      <Link to={`/product/${p.id}`} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition group">
        <div className="relative w-[140px] h-[140px] shrink-0 rounded-xl overflow-hidden bg-gray-50">
          <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          {p.off > 0 && <span className="absolute top-2 left-2 bg-[#e5252b] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md">-{p.off}%</span>}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-medium text-[#1a1a1a] line-clamp-2 flex-1">{p.title}</h3>
            <button onClick={(e) => { e.preventDefault(); toggleFav(p.id); }} className="shrink-0 text-gray-300 hover:text-[#e5252b]">
              <span className={`material-symbols-outlined ${isFav ? "msf text-[#e5252b]" : ""}`}>favorite</span>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[13px] text-gray-500">
            <span className="flex items-center gap-0.5 text-amber-500 font-semibold"><span className="material-symbols-outlined msf text-[15px]">star</span>{p.rating}</span>
            <span>({p.reviews})</span>
            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium ${dv.cls}`}><span className="material-symbols-outlined text-[13px]">{dv.icon}</span>{dv.text}</span>
          </div>
          <div className="mt-auto flex items-end justify-between pt-2">
            <div>
              {p.oldPrice > 0 && <div className="text-[12px] text-gray-400 line-through">{fmt(p.oldPrice)}</div>}
              <div className="text-[18px] font-extrabold text-[#1a1a1a]">{fmt(p.price)}</div>
            </div>
            <div className="w-[160px]"><CartControl /></div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${p.id}`} className="flex flex-col bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-lg hover:border-gray-200 transition group">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
        <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        {p.off > 0 && <span className="absolute top-2 left-2 bg-[#e5252b] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md">-{p.off}%</span>}
        <button onClick={(e) => { e.preventDefault(); toggleFav(p.id); }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-400 hover:text-[#e5252b] shadow-sm">
          <span className={`material-symbols-outlined text-[18px] ${isFav ? "msf text-[#e5252b]" : ""}`}>favorite</span>
        </button>
        <span className={`absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${dv.cls}`}>
          <span className="material-symbols-outlined text-[12px]">{dv.icon}</span>{dv.text}
        </span>
      </div>
      <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-1">
        <span className="flex items-center gap-0.5 text-amber-500 font-semibold"><span className="material-symbols-outlined msf text-[14px]">star</span>{p.rating}</span>
        <span>({p.reviews})</span>
      </div>
      <h3 className="text-[13.5px] leading-snug text-[#1a1a1a] line-clamp-2 min-h-[36px]">{p.title}</h3>
      <div className="mt-2">
        {p.oldPrice > 0 && <div className="text-[11px] text-gray-400 line-through">{fmt(p.oldPrice)}</div>}
        <div className="text-[16px] font-extrabold text-[#1a1a1a]">{fmt(p.price)}</div>
      </div>
      <div className="mt-2.5"><CartControl /></div>
    </Link>
  );
}
