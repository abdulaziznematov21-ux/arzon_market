import { Link } from "react-router-dom";
import { useStore } from "../lib/store";

const COLS = [
  {
    title: "Biz haqimizda",
    links: [
      ["Kompaniya haqida", "/about"],
      ["Bo'sh ish o'rinlari", "/careers"],
      ["Topshirish punktlari", "/pickup-punktlari"],
      ["Arzon Market blogi", "/blog"],
    ],
  },
  {
    title: "Xaridorlarga",
    links: [
      ["Yetkazib berish va to'lov", "/delivery-info"],
      ["Tovarni qaytarish", "/returns"],
      ["Muddatli to'lov qoidalari", "/installment"],
      ["Savol-javoblar", "/faq"],
    ],
  },
  {
    title: "Hamkorlarga",
    links: [
      ["Arzon Marketda soting", "/sell"],
      ["Hamkorlik dasturi", "/partners"],
      ["Yetkazib berish punkti ochish", "/open-pickup"],
    ],
  },
];

const SOCIAL = ["play_arrow", "photo_camera", "smart_display"];
const PAY = ["UZUM", "PAYME", "CLICK", "HUMO", "UZCARD"];

export default function Footer() {
  const { toast } = useStore();
  return (
    <footer className="bg-white border-t border-gray-100 mt-10">
      <div className="max-w-[1320px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-bold text-[15px] mb-4">{c.title}</h4>
            <ul className="space-y-2.5">
              {c.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-[13.5px] text-gray-500 hover:text-[#e5252b] transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-bold text-[15px] mb-4">Ilovani yuklab oling</h4>
          <p className="text-[13px] text-gray-500 mb-4">Smartfoningizda xarid qilish yanada oson va qulayroq</p>
          <div className="flex flex-col gap-2 mb-5">
            <button onClick={() => toast("Ilova tez orada chiqadi")} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 hover:border-gray-300">
              <span className="material-symbols-outlined text-[20px]">apple</span>
              <span className="text-left leading-tight">
                <span className="block text-[9px] text-gray-400">DOWNLOAD ON</span>
                <span className="block text-[13px] font-semibold">App Store</span>
              </span>
            </button>
            <button onClick={() => toast("Ilova tez orada chiqadi")} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 hover:border-gray-300">
              <span className="material-symbols-outlined text-[20px]">android</span>
              <span className="text-left leading-tight">
                <span className="block text-[9px] text-gray-400">GET IT ON</span>
                <span className="block text-[13px] font-semibold">Google Play</span>
              </span>
            </button>
          </div>
          <h4 className="font-bold text-[14px] mb-3">Ijtimoiy tarmoqlar</h4>
          <div className="flex gap-2">
            {SOCIAL.map((ic) => (
              <button key={ic} onClick={() => toast("Tez orada")} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                <span className="material-symbols-outlined text-[18px]">{ic}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-[1320px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500">To'lov turlari:</span>
            {PAY.map((p) => (
              <span key={p} className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">{p}</span>
            ))}
          </div>
          <span className="text-[12.5px] text-gray-400">© {new Date().getFullYear()} «Arzon Market» MCHJ. Barcha huquqlar himoyalangan.</span>
        </div>
      </div>
    </footer>
  );
}
