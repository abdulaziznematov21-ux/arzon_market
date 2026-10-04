import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../lib/store";
import { byId } from "../lib/data";

export default function Favorites() {
  const { favs } = useStore();
  const items = favs.map(byId).filter(Boolean);

  if (!items.length) return (
    <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
      <span className="material-symbols-outlined text-[64px] text-gray-300">favorite</span>
      <h1 className="text-2xl font-bold mt-4">Sevimlilar bo'sh</h1>
      <p className="text-gray-500 mt-2">Yoqqan mahsulotlaringizni ♡ belgisi orqali shu yerga saqlang</p>
      <Link to="/products" className="inline-flex items-center gap-1.5 mt-6 bg-[#e5252b] hover:bg-[#c71e24] text-white px-8 py-3 rounded-xl font-semibold transition">
        Mahsulotlarni ko'rish<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </div>
  );

  return (
    <div className="bg-[#f9f9fa] pb-16 min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500"><Link to="/" className="hover:text-[#e5252b]">Bosh sahifa</Link><span>›</span><b className="text-[#1a1a1a]">Sevimlilar</b></div>
        <h1 className="text-[26px] font-extrabold mt-3 mb-6">Sevimlilar <span className="text-gray-400 text-[17px] font-medium">({items.length})</span></h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}
