import { useEffect } from "react";
import { useStore } from "../lib/store";
import { byId, fmt } from "../lib/data";
import { generateProductSvg } from "../lib/svgGenerator";
import { translateProductTitle } from "../lib/translations";

export default function FavoritesDrawer() {
  const { isFavoritesOpen, closeFavorites, favs, toggleFav, add, openProductModal, lang } = useStore();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFavoritesOpen) closeFavorites();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFavoritesOpen, closeFavorites]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isFavoritesOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFavoritesOpen]);

  if (!isFavoritesOpen) return null;

  const favoriteProducts = favs.map((id) => byId(id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={closeFavorites} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-left">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-150 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-[24px] text-[#e5252b]">favorite</span>
              <h2 className="text-[18px] font-black text-gray-900">{lang === "ru" ? "Избранное" : "Saralanganlar"}</h2>
              <span className="bg-red-50 text-[#e5252b] text-[12px] font-extrabold px-2.5 py-0.5 rounded-full">
                {favoriteProducts.length} {lang === "ru" ? "товаров" : "ta"}
              </span>
            </div>
            <button
              onClick={closeFavorites}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
            >
              <span className="material-symbols-rounded text-[20px]">close</span>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100 space-y-3">
            {favoriteProducts.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-red-50 text-[#e5252b] flex items-center justify-center text-3xl mx-auto mb-3">
                  <span className="material-symbols-rounded text-4xl">favorite_border</span>
                </div>
                <h3 className="text-lg font-black text-gray-900">{lang === "ru" ? "В избранном пока пусто" : "Saralanganlar bo'sh"}</h3>
                <p className="text-gray-500 text-[13px] mt-1 max-w-[240px] mx-auto">
                  {lang === "ru" 
                    ? "Нажимайте на сердечко на карточке товара, чтобы сохранять понравившееся." 
                    : "Mahsulot kartasidagi yurakcha belgisini bosib, yoqqan tovarlarni saqlab qo'ying."}
                </p>
              </div>
            ) : (
              favoriteProducts.map((p) => (
                <div key={p.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <div
                    onClick={() => {
                      closeFavorites();
                      openProductModal(p);
                    }}
                    className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-150 overflow-hidden shrink-0 cursor-pointer flex items-center justify-center p-1"
                  >
                    <img
                      src={p.image}
                      alt={translateProductTitle(p.title, lang)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = p.fallback || generateProductSvg(p, "Arzon");
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      onClick={() => {
                        closeFavorites();
                        openProductModal(p);
                      }}
                      className="text-[13px] font-bold text-gray-800 line-clamp-1 hover:text-[#e5252b] cursor-pointer"
                    >
                      {translateProductTitle(p.title, lang)}
                    </div>
                    <div className="text-[14px] font-black text-gray-900 mt-0.5">{fmt(p.price, lang)}</div>
                    <button
                      onClick={() => add(p.id, 1, false)}
                      className="mt-1 text-[12px] font-bold text-[#e5252b] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-rounded text-[14px]">shopping_bag</span>
                      <span>{lang === "ru" ? "В корзину" : "Savatga qo'shish"}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleFav(p.id)}
                    className="text-gray-400 hover:text-[#e5252b] p-1.5 transition cursor-pointer"
                    aria-label={lang === "ru" ? "Удалить" : "Olib tashlash"}
                  >
                    <span className="material-symbols-rounded text-[20px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-150 bg-gray-50/50">
            <button
              onClick={closeFavorites}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-[14px] hover:bg-black transition cursor-pointer"
            >
              {lang === "ru" ? "Закрыть" : "Yopish"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
