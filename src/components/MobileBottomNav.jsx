import { useLocation, Link } from "react-router-dom";
import { useStore } from "../lib/store";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { count, favs, openCatalog, openCart, openFavorites, openProfile, openLogin, user, lang } = useStore();
  const isRu = lang === "ru";

  const isHome = pathname === "/";
  const isCatalog = pathname.startsWith("/products");

  return (
    <nav
      aria-label="Mobil navigatsiya"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Bosh sahifa */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isHome ? "text-[#e5252b]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className={`material-symbols-rounded text-[24px] ${isHome ? "fill-current" : ""}`}>
            home
          </span>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">
            {isRu ? "Главная" : "Asosiy"}
          </span>
        </Link>

        {/* 2. Katalog */}
        <button
          type="button"
          onClick={openCatalog}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isCatalog ? "text-[#e5252b]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className="material-symbols-rounded text-[24px]">widgets</span>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">
            {isRu ? "Каталог" : "Katalog"}
          </span>
        </button>

        {/* 3. Savat */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-500 hover:text-[#e5252b] transition-all relative cursor-pointer"
        >
          <div className="relative">
            <span className="material-symbols-rounded text-[24px]">shopping_bag</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-[#e5252b] text-white text-[9.5px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">
            {isRu ? "Корзина" : "Savat"}
          </span>
        </button>

        {/* 4. Sevimlilar */}
        <button
          type="button"
          onClick={openFavorites}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-500 hover:text-[#e5252b] transition-all relative cursor-pointer"
        >
          <div className="relative">
            <span className="material-symbols-rounded text-[24px]">favorite</span>
            {favs.length > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-[#e5252b] text-white text-[9.5px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {favs.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">
            {isRu ? "Избранное" : "Sevimlilar"}
          </span>
        </button>

        {/* 5. Profil / Kirish */}
        <button
          type="button"
          onClick={() => (user ? openProfile() : openLogin())}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
        >
          <span className="material-symbols-rounded text-[24px]">person</span>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">
            {user ? (isRu ? "Кабинет" : "Profil") : (isRu ? "Войти" : "Kirish")}
          </span>
        </button>
      </div>
    </nav>
  );
}
