import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { fmt } from "../lib/data";

const FREE_THRESHOLD = 50000;
const DELIVERY_FEE = 20000;

export default function Cart() {
  const { cartLines, setQty, removeFromCart, cartTotal, placeOrder, city, toast } = useStore();
  const nav = useNavigate();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(null);
  const [address, setAddress] = useState(`${city} sh., manzilni kiriting`);
  const [editingAddr, setEditingAddr] = useState(false);
  const [pay, setPay] = useState("Click orqali");

  if (cartLines.length === 0) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <span className="material-symbols-outlined text-[64px] text-gray-300">shopping_cart</span>
        <h1 className="text-2xl font-bold mt-4">Savatingiz bo'sh</h1>
        <p className="text-gray-500 mt-2">Mahsulotlarni ko'rib chiqing va savatga qo'shing</p>
        <Link to="/products" className="inline-flex items-center gap-1.5 mt-6 bg-[#e5252b] hover:bg-[#c71e24] text-white px-8 py-3 rounded-xl font-semibold transition">
          Xarid qilishni boshlash<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    );
  }

  const discount = applied ? Math.round(cartTotal * applied.pct) : 0;
  const fee = cartTotal - discount >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = cartTotal - discount + fee;
  const progress = Math.min(100, Math.round((cartTotal / FREE_THRESHOLD) * 100));

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promo.trim().toUpperCase();
    if (code === "BAHOR2025" || code === "ARZON10") {
      setApplied({ code, pct: code === "BAHOR2025" ? 0.08 : 0.1 });
      toast("Promokod qo'llanildi!");
    } else {
      toast("Promokod topilmadi");
    }
  };

  const checkout = () => {
    const id = placeOrder({ address, pay, fee });
    toast("Buyurtma qabul qilindi!");
    nav(`/orders/${id}`);
  };

  return (
    <div className="bg-[#f9f9fa] min-h-screen pb-16">
      <div className="max-w-[1180px] mx-auto px-6 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500"><Link to="/" className="hover:text-[#e5252b]">Bosh sahifa</Link><span>›</span><b className="text-[#1a1a1a]">Savat</b></div>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-[26px] font-extrabold">Savat</h1>
          <span className="bg-gray-100 text-gray-600 text-[13px] px-2.5 py-1 rounded-full">{cartLines.length} ta mahsulot</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-5 items-start">
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <div className="flex items-center gap-2 text-[13.5px]">
                <span className="material-symbols-outlined text-emerald-600 text-[19px]">local_shipping</span>
                <b>Bepul yetkazib berish</b>
                {fee === 0 ? <span className="text-emerald-600 font-medium">— qo'lga kiritildi!</span> : <span className="text-gray-500">— yana {fmt(FREE_THRESHOLD - cartTotal)} qoldi</span>}
              </div>
              <div className="h-2 bg-gray-100 rounded-full mt-2.5 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
            </div>

            <div className="space-y-3">
              {cartLines.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                  <Link to={`/product/${l.id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0"><img src={l.p.img} alt="" className="w-full h-full object-cover" /></Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${l.id}`} className="text-[14.5px] font-medium hover:text-[#e5252b] line-clamp-2">{l.p.title}</Link>
                      <button onClick={() => removeFromCart(l.id)} className="shrink-0 text-gray-300 hover:text-[#e5252b]"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </div>
                    <div className="text-[12.5px] text-gray-400 mt-0.5">{l.p.brand}</div>
                    <div className="flex items-end justify-between mt-3">
                      <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-1">
                        <button onClick={() => setQty(l.id, l.qty - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#e5252b]"><span className="material-symbols-outlined text-[17px]">remove</span></button>
                        <span className="w-8 text-center font-semibold text-[14px]">{l.qty}</span>
                        <button onClick={() => setQty(l.id, l.qty + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#e5252b]"><span className="material-symbols-outlined text-[17px]">add</span></button>
                      </div>
                      <b className="text-[16px]">{fmt(l.p.price * l.qty)}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-white rounded-2xl border border-gray-100 p-5 lg:sticky lg:top-[90px]">
            <b className="text-[16px]">Buyurtma hisobi</b>
            <div className="text-[12.5px] text-gray-500 mt-0.5">{city}</div>

            <form onSubmit={applyPromo} className="mt-4">
              <label className="text-[12px] text-gray-500 mb-1 block">Promokod</label>
              <div className="flex gap-2">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="BAHOR2025" className="flex-1 h-[40px] px-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[#e5252b]" />
                <button type="submit" className="h-[40px] px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[13px] font-semibold">Qo'llash</button>
              </div>
              {applied && <div className="mt-2 flex items-center justify-between bg-emerald-50 text-emerald-700 text-[12.5px] px-3 py-2 rounded-lg"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span>{applied.code} qo'llandi</span><button type="button" onClick={() => setApplied(null)}><span className="material-symbols-outlined text-[16px]">close</span></button></div>}
            </form>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-[14px]">
              <div className="flex justify-between text-gray-600"><span>Mahsulotlar ({cartLines.reduce((s, l) => s + l.qty, 0)} dona):</span><span>{fmt(cartTotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Promokod chegirmasi:</span><span>-{fmt(discount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Yetkazib berish:</span><span>{fee ? fmt(fee) : "Bepul"}</span></div>
              <div className="flex justify-between items-end pt-2 border-t border-gray-100"><b className="text-[16px]">Jami to'lov:</b><b className="text-[22px]">{fmt(total)}</b></div>
            </div>

            <div className="mt-4">
              <label className="text-[12px] text-gray-500 mb-1 block">Yetkazib berish manzili</label>
              {editingAddr ? (
                <div className="flex gap-2">
                  <input autoFocus value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setEditingAddr(false)} className="flex-1 h-[40px] px-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[#e5252b]" />
                  <button onClick={() => setEditingAddr(false)} className="h-[40px] px-3 rounded-xl bg-gray-100 text-[13px] font-semibold">OK</button>
                </div>
              ) : (
                <button onClick={() => setEditingAddr(true)} className="w-full flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 text-left hover:bg-gray-100">
                  <span className="text-[13.5px] flex items-center gap-1.5"><span className="material-symbols-outlined text-[17px] text-gray-400">location_on</span>{address}</span>
                  <span className="text-[12.5px] text-[#e5252b] font-medium">O'zgartirish</span>
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-[12px] text-gray-500 mb-1.5 block">To'lov usuli</label>
              <div className="grid grid-cols-2 gap-2">
                {["Click orqali", "Payme orqali", "Naqd pul", "Uzcard/Humo"].map((m) => (
                  <button key={m} onClick={() => setPay(m)} className={`h-[38px] rounded-xl text-[12.5px] font-medium border ${pay === m ? "bg-red-50 border-[#e5252b] text-[#e5252b]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{m}</button>
                ))}
              </div>
            </div>

            <button onClick={checkout} className="w-full h-[50px] mt-5 rounded-xl bg-[#e5252b] hover:bg-[#c71e24] text-white font-bold flex items-center justify-center gap-2 transition">
              Buyurtmani rasmiylashtirish<span className="material-symbols-outlined text-[19px]">arrow_forward</span>
            </button>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-1.5 text-[11.5px] text-gray-500 bg-gray-50 rounded-lg px-2 py-2"><span className="material-symbols-outlined text-[16px]">lock</span>Xavfsiz to'lov</div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-gray-500 bg-gray-50 rounded-lg px-2 py-2"><span className="material-symbols-outlined text-[16px]">autorenew</span>14 kun qaytarish</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
