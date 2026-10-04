import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { byId, fmt, specsFor, descFor, similarTo } from "../lib/data";
import ProductCard from "../components/ProductCard";

const TABS = ["Xususiyatlari va tavsifi", "Sharhlar", "Savol-javoblar", "Yetkazib berish shartlari"];
const DELIVERY_TEXT = { fast: "30 daqiqada", tomorrow: "Ertaga (1 kunda)", "3days": "2-3 kun ichida" };

export default function Product() {
  const { id } = useParams();
  const nav = useNavigate();
  const { cart, add, setQty, favs, toggleFav } = useStore();
  const [tab, setTab] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);

  const p = byId(id);
  if (!p) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-24 text-center">
        <span className="material-symbols-outlined text-[52px] text-gray-300">search_off</span>
        <h1 className="text-xl font-bold mt-3">Mahsulot topilmadi</h1>
        <Link to="/products" className="inline-block mt-5 text-[#e5252b] font-semibold">Katalogga qaytish →</Link>
      </div>
    );
  }

  const qty = cart[p.id] || 0;
  const isFav = favs.includes(p.id);
  const gallery = [p.img, `https://picsum.photos/seed/am-g2-${p.id}/500/500`, `https://picsum.photos/seed/am-g3-${p.id}/500/500`, `https://picsum.photos/seed/am-g4-${p.id}/500/500`];
  const specs = specsFor(p);
  const similar = similarTo(p, 10);

  const buyNow = () => {
    if (qty === 0) add(p.id);
    nav("/cart");
  };

  return (
    <div className="bg-[#f9f9fa] pb-16">
      <div className="max-w-[1280px] mx-auto px-6 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500 flex-wrap">
          <Link to="/" className="hover:text-[#e5252b]">Bosh sahifa</Link><span>›</span>
          <Link to={`/products?group=${encodeURIComponent(p.group)}`} className="hover:text-[#e5252b]">{p.group}</Link><span>›</span>
          <Link to={`/products?group=${encodeURIComponent(p.group)}&sub=${encodeURIComponent(p.sub)}`} className="hover:text-[#e5252b]">{p.sub}</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_340px] gap-7 mt-4">
          {/* GALLERY */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100">
              <img src={gallery[imgIdx]} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 mt-3">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`w-[64px] h-[64px] rounded-xl overflow-hidden border-2 ${i === imgIdx ? "border-[#e5252b]" : "border-transparent"}`}>
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#111] leading-snug">{p.title}</h1>
              <button onClick={() => toggleFav(p.id)} className="shrink-0 w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#e5252b] hover:border-[#e5252b]">
                <span className={`material-symbols-outlined ${isFav ? "msf text-[#e5252b]" : ""}`}>favorite</span>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[14px]">
              <span className="flex items-center gap-1 font-semibold text-amber-500"><span className="material-symbols-outlined msf text-[18px]">star</span>{p.rating} <span className="text-gray-400 font-normal">({p.reviews} sharh)</span></span>
              <span className="flex items-center gap-1 text-emerald-600"><span className="material-symbols-outlined text-[18px]">verified</span>{p.sold * 47}+ xarid qilingan</span>
            </div>

            <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-[30px] font-black text-[#111]">{fmt(p.price)}</span>
                {p.oldPrice > 0 && <span className="text-[16px] text-gray-400 line-through mb-1">{fmt(p.oldPrice)}</span>}
                {p.off > 0 && <span className="bg-red-50 text-[#e5252b] text-[12.5px] font-bold px-2.5 py-1 rounded-lg mb-0.5">Tejovingiz: {fmt(p.oldPrice - p.price)} (-{p.off}%)</span>}
              </div>

              <div className="flex items-center gap-3 mt-5">
                {qty === 0 ? (
                  <button onClick={() => add(p.id)} className="flex-1 h-[48px] rounded-xl bg-red-50 text-[#e5252b] font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition">
                    <span className="material-symbols-outlined">shopping_cart</span>Savatga qo'shish
                  </button>
                ) : (
                  <div className="flex-1 h-[48px] rounded-xl bg-red-50 flex items-center justify-between px-2">
                    <button onClick={() => setQty(p.id, qty - 1)} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#e5252b] hover:bg-white"><span className="material-symbols-outlined">remove</span></button>
                    <span className="font-bold text-[#e5252b] text-[16px]">{qty} dona</span>
                    <button onClick={() => setQty(p.id, qty + 1)} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#e5252b] hover:bg-white"><span className="material-symbols-outlined">add</span></button>
                  </div>
                )}
                <button onClick={buyNow} className="flex-1 h-[48px] rounded-xl bg-[#e5252b] hover:bg-[#c71e24] text-white font-semibold flex items-center justify-center gap-2 transition">
                  <span className="material-symbols-outlined">bolt</span>Hozir 1 klikda xarid
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-emerald-600 text-[20px]">local_shipping</span></span>
                <div><b className="text-[13.5px]">Yetkazib beramiz</b><p className="text-[12.5px] text-gray-500 mt-0.5">{DELIVERY_TEXT[p.delivery]} ichida yetkazib beriladi.</p></div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-blue-600 text-[20px]">verified_user</span></span>
                <div><b className="text-[13.5px]">12 oy rasmiy kafolat</b><p className="text-[12.5px] text-gray-500 mt-0.5">14 kun ichida bepul qaytarish imkoniyati.</p></div>
              </div>
            </div>
          </div>

          {/* SELLER */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"><span className="material-symbols-outlined text-gray-500">storefront</span></div>
                <div className="min-w-0">
                  <b className="text-[14px] flex items-center gap-1 truncate">{p.brand} Official Store<span className="material-symbols-outlined text-emerald-500 text-[16px]">verified</span></b>
                  <div className="text-[12.5px] text-gray-500 mt-0.5 flex items-center gap-1"><span className="material-symbols-outlined msf text-amber-500 text-[14px]">star</span>4.{7 + (p.reviews % 3)} · {(p.reviews * 4).toLocaleString("ru-RU")}+ sharh</div>
                </div>
              </div>
              <button className="w-full h-[40px] mt-4 rounded-xl border border-gray-200 text-[13.5px] font-semibold hover:bg-gray-50">Do'konga o'tish</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4 text-[13px] text-gray-600 space-y-2.5">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-gray-400">lock</span>Xavfsiz to'lov — 100% himoyalangan</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-gray-400">autorenew</span>14 kunda kafolatlangan qaytarish</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-gray-400">support_agent</span>24/7 qo'llab-quvvatlash</div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-10">
          <div className="flex items-center gap-2 overflow-x-auto">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`px-5 py-3 rounded-xl text-[13.5px] font-semibold whitespace-nowrap transition ${tab === i ? "bg-[#e5252b] text-white" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"}`}>{t}</button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
            {tab === 0 && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-[15px] mb-3">Asosiy texnik ko'rsatkichlar</h4>
                  <div className="divide-y divide-gray-100">
                    {specs.map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2.5 text-[13.5px]"><span className="text-gray-500">{k}</span><b className="text-[#1a1a1a] text-right">{v}</b></div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[15px] mb-3">Tavsif</h4>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed">{descFor(p)}</p>
                </div>
              </div>
            )}
            {tab === 1 && (
              <div className="text-center py-10 text-gray-500">
                <span className="material-symbols-outlined text-[44px] text-amber-400 msf">star</span>
                <p className="mt-2 font-semibold text-[#1a1a1a] text-[16px]">{p.rating} / 5 — {p.reviews} ta sharh</p>
                <p className="text-[13px] mt-1">Sharhlar tez orada ko'rsatiladi.</p>
              </div>
            )}
            {tab === 2 && (
              <div className="text-center py-10 text-gray-500">
                <span className="material-symbols-outlined text-[44px] text-gray-300">forum</span>
                <p className="mt-2 text-[13.5px]">Hali savollar yo'q. Birinchi bo'lib savol bering!</p>
              </div>
            )}
            {tab === 3 && (
              <div className="space-y-3 text-[13.5px] text-gray-600 max-w-xl">
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-600 text-[18px]">bolt</span>Tezkor yetkazish: 30 daqiqada (Toshkent, tanlangan tumanlar)</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-[18px]">local_shipping</span>Standart yetkazish: 1-3 kun ichida butun O'zbekiston bo'ylab</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-[18px]">payments</span>To'lov: naqd, Click, Payme, Uzcard/Humo, muddatli to'lov</p>
              </div>
            )}
          </div>
        </div>

        {/* SIMILAR */}
        {similar.length > 0 && (
          <div className="mt-10">
            <h3 className="text-[19px] font-extrabold mb-4">O'xshash mahsulotlar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {similar.map((sp) => <ProductCard key={sp.id} p={sp} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
