import { Link, useParams } from "react-router-dom";
import { useStore } from "../lib/store";
import { byId, fmt } from "../lib/data";

const STEPS = [
  ["Buyurtma qabul qilindi", "To'lov muvaffaqiyatli tasdiqlandi"],
  ["Omborda yig'ildi va qadoqlandi", "Sifat nazoratidan o'tkazildi"],
  ["Kuryerga topshirildi", "Yo'lga chiqdi"],
  ["Kuryer manzilingizga bormoqda", "Iltimos, telefoningizni ochiq tuting"],
  ["Yetkazildi", "Xaridor tomonidan qabul qilindi"],
];
const STATUS = ["TASDIQLANDI", "TAYYORLANMOQDA", "YO'LGA CHIQDI", "KURYER YO'LDA", "YETKAZILDI"];

export default function OrderDetail() {
  const { id } = useParams();
  const s = useStore();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return <div className="px-4 py-16 sm:p-20 text-center"><div className="text-5xl mb-3">📦</div><h1 className="text-xl font-bold">Buyurtma topilmadi</h1><Link to="/orders" className="inline-block mt-5 bg-[#e5252b] text-white px-6 py-3 rounded-xl">Buyurtmalarimga qaytish</Link></div>;

  const lines = o.items.map((it) => ({ ...it, p: byId(it.id) })).filter((l) => l.p);
  const done = o.step >= 4;

  return (
    <div className="bg-[#f9f9fa] pb-12 sm:pb-16">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-[13px] text-gray-500"><Link to="/">🏠 Bosh sahifa</Link> › <Link to="/orders">Buyurtmalarim</Link> › <b className="text-[#222]">Buyurtma #{o.id}</b></div>

        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <h1 className="text-[21px] sm:text-[26px] font-extrabold">Buyurtma #{o.id}</h1>
            <span className={`text-[12px] font-bold px-3 py-1.5 rounded-full ${done ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-[#e5252b]"}`}>{done ? "✔ YETKAZILDI" : `🏍 ${STATUS[o.step]}`}</span>
          </div>
          {!done && <div className="bg-white rounded-xl px-4 py-2 text-[14px]"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2" />Kutilayotgan yetkazish: <b>taxminan {o.eta} daqiqa</b></div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 lg:gap-6 mt-4 items-start">
          <div className="min-w-0">
            {/* MAP */}
            <div className="relative bg-white rounded-2xl border border-gray-100 h-[230px] sm:h-[340px] overflow-hidden">
              <svg viewBox="0 0 700 340" className="w-full h-full">
                <rect width="700" height="340" fill="#eef0f2" />
                <path d="M40 300 C 200 260, 280 160, 350 170 S 560 90, 660 40" stroke="#e5252b" strokeWidth="4" fill="none" strokeDasharray={done ? "0" : "0"} opacity={done ? 0.35 : 1} />
                <circle cx="40" cy="300" r="9" fill="#16a34a" stroke="white" strokeWidth="3" />
                <circle cx="660" cy="40" r="9" fill="#111" stroke="white" strokeWidth="3" />
                {!done && <circle cx="350" cy="170" r="13" fill="#e5252b" stroke="white" strokeWidth="4" />}
              </svg>
              {!done && <div className="absolute top-3 left-3 right-3 sm:right-auto bg-white rounded-xl px-3 py-2 text-[11px] sm:text-[12px] shadow flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />HAQIQIY VAQT KUZATUVI — {o.eta} daqiqada yetib keladi</div>}
              <div className="absolute bottom-3 left-3 bg-white rounded-lg px-3 py-1.5 text-[12px] shadow">📍 Ombor (Markaz)</div>
              <div className="absolute bottom-3 right-3 bg-white rounded-lg px-3 py-1.5 text-[12px] shadow">🏠 Yetkazish manzili</div>
            </div>

            {/* COURIER */}
            {!done && <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mt-4 flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl">🏍</div>
              <div className="flex-1 min-w-[140px]"><b className="text-[16px]">Jasur Rahimov</b><div className="text-[13px] text-gray-500">★ 4.9 (1,840+) · 742 AAB</div></div>
              <button onClick={() => s.toast("Qo'ng'iroq ulanmoqda...")} className="px-4 sm:px-5 py-2.5 rounded-xl bg-gray-100 font-medium text-[14px]">📞 Qo'ng'iroq</button>
              <button onClick={() => s.toast("Xabar yuborildi")} className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#e5252b] text-white font-medium text-[14px]">💬 Xabar yozish</button>
            </div>}

            {/* STEPS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mt-4">
              <div className="flex items-center justify-between mb-4"><b className="text-lg">Yetkazish bosqichlari</b><span className="bg-gray-100 text-[12px] px-2 py-1 rounded-full">{Math.min(o.step + 1, 5)} / 5 bosqich</span></div>
              <div className="space-y-0">
                {STEPS.map(([t, sub], i) => (
                  <div key={t} className="flex gap-3 sm:gap-4 pb-6 last:pb-0 relative">
                    {i < STEPS.length - 1 && <span className={`absolute left-[13px] top-7 w-0.5 h-full ${i < o.step ? "bg-emerald-400" : "bg-gray-100"}`} />}
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] shrink-0 z-10 ${i < o.step ? "bg-emerald-500 text-white" : i === o.step ? "bg-[#e5252b] text-white" : "bg-gray-100 text-gray-400"}`}>{i < o.step ? "✓" : i + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2"><b className={i > o.step ? "text-gray-400" : ""}>{t}</b>{i === o.step && !done && <span className="bg-red-100 text-[#e5252b] text-[10px] font-bold px-2 py-0.5 rounded">HOZIR</span>}</div>
                      <p className={`text-[13px] mt-0.5 ${i > o.step ? "text-gray-300" : "text-gray-500"}`}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {!done && <button onClick={() => s.advance(o.id)} className="mt-2 w-full h-[44px] rounded-xl bg-gray-100 hover:bg-gray-200 font-medium text-[14px]">Keyingi bosqichni simulyatsiya qilish (demo)</button>}
            </div>
          </div>

          <aside className="space-y-4 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-[11px] text-gray-500 tracking-wide">YETKAZIB BERISH MANZILI</div>
              <div className="font-semibold mt-1">{o.address}</div>
              <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-[12px] px-2 py-1 rounded-md">Kuryer eshigingizgacha</span>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3"><b>Buyurtma tarkibi</b><span className="text-[13px] text-gray-500">{lines.length} ta tovar</span></div>
              <div className="space-y-3">
                {lines.map((l) => (
                  <Link to={`/product/${l.id}`} key={l.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-150 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={l.p.image} alt={l.p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0"><div className="text-[14px] truncate">{l.p.title}</div><div className="text-[12px] text-gray-500">{l.qty} dona</div></div>
                    <b className="text-[14px] shrink-0">{fmt(l.p.price * l.qty)}</b>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-[14px]">
                <div className="flex justify-between gap-3 text-gray-600"><span>To'lov usuli:</span><b className="text-[#222] text-right">{o.pay}</b></div>
                <div className="flex justify-between text-gray-600"><span>Yetkazib berish:</span><b>{o.fee ? fmt(o.fee) : "Bepul"}</b></div>
                <div className="flex justify-between items-end pt-2"><b className="text-lg">Jami summa:</b><b className="text-[24px]">{fmt(o.total)}</b></div>
              </div>
              <button onClick={() => s.toast("Chek yuklab olindi")} className="w-full h-[46px] mt-4 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium text-[14px]">🧾 Elektron chekni yuklab olish</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
