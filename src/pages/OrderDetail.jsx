import { Link, useParams } from "react-router-dom";
import { useStore } from "../lib/store";
import { byId, fmt } from "../lib/data";

const STEPS = [
  ["Buyurtma qabul qilindi", "To'lov muvaffaqiyatli tasdiqlandi"],
  ["Omborda yig'ildi va qadoqlandi", "Sifat nazoratidan o'tkazildi"],
  ["Kuryerga topshirildi", "Yo'lga chiqdi"],
  ["Kuryer manzilingizga bormoqda", "Iltimos, telefoningizni ochiq tuting"],
  ["Yetkazildi", "Siz tomoningizdan qabul qilindi"],
];
const STATUS = ["TASDIQLANDI", "TAYYORLANMOQDA", "YO'LGA CHIQDI", "KURYER YO'LDA", "YETKAZILDI"];

export default function OrderDetail() {
  const { id } = useParams();
  const s = useStore();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return (
    <div className="max-w-[600px] mx-auto px-6 py-24 text-center">
      <span className="material-symbols-outlined text-[52px] text-gray-300">search_off</span>
      <h1 className="text-xl font-bold mt-3">Buyurtma topilmadi</h1>
      <Link to="/orders" className="inline-block mt-5 text-[#e5252b] font-semibold">Buyurtmalarimga qaytish →</Link>
    </div>
  );

  const lines = o.items.map((it) => ({ ...it, p: byId(it.id) })).filter((l) => l.p);
  const done = o.step >= 4;

  return (
    <div className="bg-[#f9f9fa] pb-16">
      <div className="max-w-[1180px] mx-auto px-6 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500"><Link to="/">Bosh sahifa</Link><span>›</span><Link to="/orders">Buyurtmalarim</Link><span>›</span><b className="text-[#1a1a1a]">Buyurtma #{o.id}</b></div>

        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] sm:text-[26px] font-extrabold">Buyurtma #{o.id}</h1>
            <span className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${done ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-[#e5252b]"}`}>
              <span className="material-symbols-outlined text-[15px]">{done ? "check_circle" : "two_wheeler"}</span>{done ? "YETKAZILDI" : STATUS[o.step]}
            </span>
          </div>
          {!done && <div className="bg-white rounded-xl px-4 py-2 text-[13.5px] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Kutilayotgan yetkazish: <b>taxminan {o.eta} daqiqa</b></div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-4 items-start">
          <div>
            <div className="relative bg-white rounded-2xl border border-gray-100 h-[300px] overflow-hidden">
              <svg viewBox="0 0 700 300" className="w-full h-full">
                <rect width="700" height="300" fill="#eef0f2" />
                <path d="M40 260 C 200 220, 280 140, 350 150 S 560 80, 660 40" stroke="#e5252b" strokeWidth="4" fill="none" opacity={done ? 0.3 : 1} />
                <circle cx="40" cy="260" r="9" fill="#16a34a" stroke="white" strokeWidth="3" />
                <circle cx="660" cy="40" r="9" fill="#111" stroke="white" strokeWidth="3" />
                {!done && <circle cx="350" cy="150" r="12" fill="#e5252b" stroke="white" strokeWidth="4" />}
              </svg>
              {!done && <div className="absolute top-3 left-3 bg-white rounded-xl px-3 py-2 text-[12px] shadow flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{o.eta} daqiqada yetib keladi</div>}
              <div className="absolute bottom-3 left-3 bg-white rounded-lg px-3 py-1.5 text-[12px] shadow flex items-center gap-1"><span className="material-symbols-outlined text-[15px]">warehouse</span>Ombor (Markaz)</div>
              <div className="absolute bottom-3 right-3 bg-white rounded-lg px-3 py-1.5 text-[12px] shadow flex items-center gap-1"><span className="material-symbols-outlined text-[15px]">home</span>Manzilingiz</div>
            </div>

            {!done && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4 flex items-center gap-4 flex-wrap">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center"><span className="material-symbols-outlined text-[#e5252b] text-[26px]">two_wheeler</span></div>
                <div className="flex-1 min-w-[160px]"><b className="text-[15.5px]">Jasur Rahimov</b><div className="text-[12.5px] text-gray-500 flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined msf text-[14px] text-amber-500">star</span>4.9 (1,840+) · 01 742 AAB</div></div>
                <button onClick={() => s.toast("Qo'ng'iroq ulanmoqda...")} className="px-4 py-2.5 rounded-xl bg-gray-100 font-medium text-[13.5px] flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">call</span>Qo'ng'iroq</button>
                <button onClick={() => s.toast("Xabar yuborildi")} className="px-4 py-2.5 rounded-xl bg-[#e5252b] text-white font-medium text-[13.5px] flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">chat</span>Xabar yozish</button>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
              <div className="flex items-center justify-between mb-4"><b className="text-[16px]">Yetkazish bosqichlari</b><span className="bg-gray-100 text-[12px] px-2 py-1 rounded-full">{Math.min(o.step + 1, 5)} / 5 bosqich</span></div>
              <div>
                {STEPS.map(([t, sub], i) => (
                  <div key={t} className="flex gap-4 pb-6 last:pb-0 relative">
                    {i < STEPS.length - 1 && <span className={`absolute left-[13px] top-7 w-0.5 h-full ${i < o.step ? "bg-emerald-400" : "bg-gray-100"}`} />}
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] shrink-0 z-10 ${i < o.step ? "bg-emerald-500 text-white" : i === o.step ? "bg-[#e5252b] text-white" : "bg-gray-100 text-gray-400"}`}>
                      {i < o.step ? <span className="material-symbols-outlined text-[15px]">check</span> : i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2"><b className={i > o.step ? "text-gray-400 text-[14px]" : "text-[14px]"}>{t}</b>{i === o.step && !done && <span className="bg-red-100 text-[#e5252b] text-[10px] font-bold px-2 py-0.5 rounded">HOZIR</span>}</div>
                      <p className={`text-[12.5px] mt-0.5 ${i > o.step ? "text-gray-300" : "text-gray-500"}`}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {!done && <button onClick={() => s.advance(o.id)} className="mt-2 w-full h-[44px] rounded-xl bg-gray-100 hover:bg-gray-200 font-medium text-[13.5px] flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-[18px]">play_arrow</span>Keyingi bosqich (demo simulyatsiya)</button>}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-[11px] text-gray-500 tracking-wide">YETKAZIB BERISH MANZILI</div>
              <div className="font-semibold mt-1 text-[14.5px]">{o.address}</div>
              <span className="inline-flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-700 text-[12px] px-2 py-1 rounded-md"><span className="material-symbols-outlined text-[14px]">door_front</span>Kuryer eshigingizgacha</span>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3"><b className="text-[15px]">Buyurtma tarkibi</b><span className="text-[12.5px] text-gray-500">{lines.length} ta tovar</span></div>
              <div className="space-y-3">
                {lines.map((l) => (
                  <Link to={`/product/${l.id}`} key={l.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0"><img src={l.p.img} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0"><div className="text-[13.5px] truncate">{l.p.title}</div><div className="text-[12px] text-gray-500">{l.qty} dona</div></div>
                    <b className="text-[13.5px] shrink-0">{fmt(l.p.price * l.qty)}</b>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-[13.5px]">
                <div className="flex justify-between text-gray-600"><span>To'lov usuli:</span><b className="text-[#1a1a1a]">{o.pay}</b></div>
                <div className="flex justify-between text-gray-600"><span>Yetkazib berish:</span><b>{o.fee ? fmt(o.fee) : "Bepul"}</b></div>
                <div className="flex justify-between items-end pt-2"><b className="text-[16px]">Jami summa:</b><b className="text-[22px]">{fmt(o.total)}</b></div>
              </div>
              <button onClick={() => s.toast("Chek yuklab olindi")} className="w-full h-[44px] mt-4 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium text-[13.5px] flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-[18px]">receipt_long</span>Elektron chekni yuklab olish</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
