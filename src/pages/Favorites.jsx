import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../lib/store";
import { byId } from "../lib/data";

export default function Favorites() {
  const { favs, lang } = useStore();
  const items = favs.map(byId).filter(Boolean);
  const isRu = lang === "ru";

  if (!items.length) {
    return (
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-[#e5252b] flex items-center justify-center text-4xl mx-auto mb-4 shadow-xs">
          <span className="material-symbols-rounded text-[40px]">favorite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          {isRu ? "Список избранного пуст" : "Sevimlilar ro'yxati bo'sh"}
        </h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-[14.5px]">
          {isRu 
            ? "Вы можете сохранять понравившиеся товары с помощью значка сердечка (♥)." 
            : "Sizga yoqqan mahsulotlarni yurakcha (♥) tugmasi orqali shu yerga saqlab qo'yishingiz mumkin."}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-6 bg-[#e5252b] hover:bg-[#c81a20] text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-red-500/25 transition-all active:scale-95"
        >
          <span>{isRu ? "Смотреть товары" : "Mahsulotlarni ko'rish"}</span>
          <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] pb-16 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#e5252b]">{isRu ? "Главная" : "Bosh sahifa"}</Link>
          <span>›</span>
          <b className="text-gray-900">{isRu ? "Избранное" : "Sevimlilar"}</b>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] sm:text-[30px] font-black text-gray-900">
              {isRu ? "Моё избранное" : "Sevimlilarim"}
            </h1>
            <span className="bg-red-50 text-[#e5252b] text-[12px] font-extrabold px-3 py-1 rounded-full border border-red-100">
              {items.length} {isRu ? "товаров" : "ta tovar"}
            </span>
          </div>
          <Link
            to="/products"
            className="text-[#e5252b] text-[13.5px] font-bold hover:underline hidden sm:flex items-center gap-1"
          >
            <span>{isRu ? "Добавить больше товаров" : "Yana tovarlar qo'shish"}</span>
            <span className="material-symbols-rounded text-[16px]">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
