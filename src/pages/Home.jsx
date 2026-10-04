import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCountdown } from "../lib/hooks";
import { GROUPS, GROUP_ICON, PRODUCTS, sampleAcrossGroups, fmt } from "../lib/data";

export default function Home() {
  const [shown, setShown] = useState(15);
  const deals = useCountdown(2 * 3600 + 14 * 60 + 32);
  const daily = useCountdown(8 * 3600 + 42 * 60 + 13);

  const flash = useMemo(() => sampleAcrossGroups(1, 3, (p) => p.off >= 20).slice(0, 10), []);
  const popular = useMemo(() => sampleAcrossGroups(10, 5), []);
  const visible = popular.slice(0, shown);

  return (
    <div className="bg-[#f9f9fa]">
      <div className="max-w-[1320px] mx-auto px-6 pt-5">
        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e5252b] via-[#d41f25] to-[#9c161b] text-white p-8 sm:p-10 flex flex-col justify-center min-h-[280px]">
            <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute right-20 bottom-0 w-40 h-40 rounded-full bg-white/5" />
            <span className="relative w-fit bg-white/15 text-[12px] font-semibold px-3 py-1.5 rounded-full mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>MAVSUMIY YANGILIK
            </span>
            <h1 className="relative text-[30px] sm:text-[38px] font-black leading-[1.1]">BAHORGI KATTA<br />CHEGIRMALAR!</h1>
            <p className="relative mt-2 text-[17px] font-medium text-white/90">70% gacha arzonroq va qulay xaridlar</p>
            <div className="relative flex flex-wrap items-center gap-4 mt-7">
              <div className="flex items-center gap-1.5">
                {[["SOAT", deals.h], ["DAQIQA", deals.m], ["SONIYA", deals.s]].map(([l, v]) => (
                  <div key={l} className="bg-white/15 backdrop-blur rounded-xl px-3 py-2 text-center min-w-[52px]">
                    <div className="text-[19px] font-black leading-none">{v}</div>
                    <div className="text-[9px] text-white/70 mt-1 tracking-wide">{l}</div>
                  </div>
                ))}
              </div>
              <Link to="/products?discount=1" className="bg-white text-[#e5252b] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition flex items-center gap-1.5">
                Xarid qilishni boshlash<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <Link to="/products?discount=1" className="block bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#e5252b]/30 hover:shadow-md transition">
              <span className="bg-red-50 text-[#e5252b] text-[11px] font-bold px-2 py-1 rounded-md">-45% CHEGIRMA</span>
              <b className="block mt-2 text-[15.5px]">Kun taklifi</b>
              <p className="text-[12.5px] text-gray-500 mt-1">Smartfon quvvatlagichlari va yuqori tezlikdagi kabellar</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[13px] font-semibold text-[#e5252b]">Ko'rish<span className="material-symbols-outlined text-[15px]">chevron_right</span></span>
            </Link>
            <Link to="/products?group=Oziq-ovqat%20va%20ichimliklar" className="block bg-white rounded-2xl p-4 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition">
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-1 rounded-md flex w-fit items-center gap-1"><span className="material-symbols-outlined text-[13px]">bolt</span>30 daqiqada</span>
              <b className="block mt-2 text-[15.5px]">Tezkor yetkazish</b>
              <p className="text-[12.5px] text-gray-500 mt-1">Yangi uzilgan mevalar, sabzavotlar va oziq-ovqat mahsulotlari</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[13px] font-semibold text-emerald-700">Buyurtma berish<span className="material-symbols-outlined text-[15px]">chevron_right</span></span>
            </Link>
          </div>
        </div>

        {/* FEATURE STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 bg-white rounded-2xl border border-gray-100 p-5">
          {[["local_shipping", "1 kunda bepul yetkazish", "50 000 so'mdan ortiq buyurtmaga"], ["calendar_month", "Muddatli qulay to'lov", "Uzum Nasiya / foizsiz 12 oy"], ["published_with_changes", "14 kunda oson qaytarish", "Ortiqcha savollarsiz va tezkor"], ["verified", "100% original tovarlar", "Rasmiy sertifikat va kafolat"]].map(([ic, t, s]) => (
            <div key={t} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[#e5252b] text-[21px]">{ic}</span></span>
              <div><b className="block text-[13.5px] leading-tight">{t}</b><span className="text-[11.5px] text-gray-500">{s}</span></div>
            </div>
          ))}
        </div>

        {/* CATEGORIES */}
        <div className="mt-9 flex items-center justify-between">
          <h2 className="text-[21px] font-extrabold">Ommabop toifalar</h2>
          <Link to="/products" className="text-[#e5252b] text-[13.5px] font-semibold flex items-center gap-0.5">Barchasini ko'rish<span className="material-symbols-outlined text-[16px]">chevron_right</span></Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3 mt-4">
          {Object.keys(GROUPS).map((g) => (
            <Link key={g} to={`/products?group=${encodeURIComponent(g)}`} className="flex flex-col items-center gap-2 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center group-hover:border-[#e5252b] group-hover:bg-red-50 transition">
                <span className="material-symbols-outlined text-[26px] text-[#e5252b]">{GROUP_ICON[g]}</span>
              </div>
              <span className="text-[11.5px] text-[#333] leading-tight">{g}</span>
            </Link>
          ))}
        </div>

        {/* FLASH SALE */}
        <div className="flex items-center justify-between mt-10 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-[#e5252b] text-white text-[14px] font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"><span className="material-symbols-outlined msf text-[17px]">bolt</span>Kun taklifi</span>
            <span className="bg-white border border-gray-100 text-[13px] font-mono px-3 py-2 rounded-xl flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span>{daily.h}:{daily.m}:{daily.s}</span>
          </div>
          <Link to="/products?discount=1" className="text-[#e5252b] text-[13.5px] font-semibold flex items-center gap-0.5">Barcha takliflar<span className="material-symbols-outlined text-[16px]">chevron_right</span></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {flash.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        {/* POPULAR */}
        <div className="flex items-center justify-between mt-10">
          <div className="flex items-center gap-3">
            <h2 className="text-[21px] font-extrabold">Mashhur mahsulotlar</h2>
            <span className="bg-gray-100 text-[12.5px] text-gray-600 px-2.5 py-1 rounded-full">{PRODUCTS.length.toLocaleString("ru-RU")} ta tovar</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 pb-6">
          {visible.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {shown < popular.length && (
          <div className="text-center pb-16">
            <button onClick={() => setShown((s) => Math.min(popular.length, s + 15))} className="px-6 py-3 rounded-xl bg-white border border-gray-200 font-medium hover:bg-gray-50 flex items-center gap-1.5 mx-auto">
              Yana {Math.min(15, popular.length - shown)} ta mahsulotni ko'rsatish<span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
        )}

        {/* APP BANNER */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="bg-red-50 text-[#e5252b] text-[12px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[14px]">redeem</span>Yangi foydalanuvchilar uchun</span>
            <h3 className="text-[22px] sm:text-[24px] font-extrabold mt-3 max-w-md">Arzon Market ilovasida yanada qulayroq xarid qiling!</h3>
            <p className="text-[13.5px] text-gray-500 mt-2 max-w-md">Ilovani hoziroq yuklab oling va birinchi buyurtmangiz uchun {fmt(50000)} chegirma vaucheriga ega bo'ling!</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="w-[120px] h-[46px] bg-gray-100 rounded-xl flex items-center justify-center gap-1.5 text-[12.5px] font-semibold"><span className="material-symbols-outlined text-[18px]">apple</span>App Store</div>
            <div className="w-[120px] h-[46px] bg-gray-100 rounded-xl flex items-center justify-center gap-1.5 text-[12.5px] font-semibold"><span className="material-symbols-outlined text-[18px]">android</span>Google Play</div>
          </div>
        </div>
      </div>
    </div>
  );
}
