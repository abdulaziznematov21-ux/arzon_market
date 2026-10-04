import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { CITIES } from "../lib/data";

const POINT_NAMES = ["Chilonzor Hub", "Yunusobod filiali", "Mirzo Ulug'bek markazi", "Sergeli punkti", "Yashnobod filiali", "Olmazor markazi"];
const STREETS = ["Bunyodkor shoh ko'chasi, 12", "Amir Temur ko'chasi, 45", "Mustaqillik ko'chasi, 8", "Universitet ko'chasi, 21", "Qo'yliq bozori yonida", "Yangi Shahar tumani, 3-mavze"];

function pointsFor(city) {
  return POINT_NAMES.map((name, i) => ({
    id: `${city}-${i}`,
    name: `${name} (${city})`,
    address: `${city} sh., ${STREETS[i]}`,
    hours: i % 2 === 0 ? "09:00 - 21:00" : "08:00 - 22:00",
    phone: `+998 71 2${i}0 00 0${i}`,
  }));
}

export default function PickupPoints() {
  const { city, toast } = useStore();
  const points = pointsFor(city);

  return (
    <div className="bg-[#f9f9fa] min-h-screen pb-16">
      <div className="max-w-[1100px] mx-auto px-6 pt-4">
        <div className="text-[13px] text-gray-500"><Link to="/" className="hover:text-[#e5252b]">Bosh sahifa</Link> › <b className="text-[#1a1a1a]">Topshirish punktlari</b></div>
        <h1 className="text-[28px] font-extrabold mt-3">Buyurtmalarni topshirish punktlari</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">Buyurtmangizni kuryer orqali emas, eng yaqin punktdan o'zingiz olib ketishni xohlasangiz, {city} shahridagi quyidagi punktlardan birini tanlang — bu yetkazib berish narxini tejaydi.</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {points.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#e5252b]">store</span>
                </div>
                <div className="min-w-0">
                  <b className="text-[15px]">{p.name}</b>
                  <div className="text-[13px] text-gray-500 mt-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">location_on</span>{p.address}</div>
                  <div className="text-[13px] text-gray-500 mt-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">schedule</span>{p.hours}</div>
                  <div className="text-[13px] text-gray-500 mt-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">call</span>{p.phone}</div>
                </div>
              </div>
              <button onClick={() => toast(`${p.name} tanlandi`)} className="w-full mt-4 h-[40px] rounded-xl bg-gray-100 hover:bg-gray-200 text-[13.5px] font-semibold transition">Shu punktni tanlash</button>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-5">
          <b className="text-[14px]">Boshqa shahar tanlang</b>
          <div className="flex flex-wrap gap-2 mt-3">
            {CITIES.slice(0, 10).map((c) => (
              <span key={c} className={`text-[12.5px] px-3 py-1.5 rounded-full ${c === city ? "bg-[#e5252b] text-white" : "bg-gray-100 text-gray-600"}`}>{c}</span>
            ))}
          </div>
          <p className="text-[12px] text-gray-400 mt-3">Shaharni header'dagi "Shahar" tugmasidan o'zgartirishingiz mumkin.</p>
        </div>
      </div>
    </div>
  );
}
