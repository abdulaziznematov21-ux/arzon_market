import { useLocation, Link } from "react-router-dom";
import { useStore } from "../lib/store";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const {
    count,
    favs,
    openCatalog,
    closeCatalog,
    isCatalogOpen,
    openCart,
    closeCart,
    isCartOpen,
    openFavorites,
    closeFavorites,
    isFavoritesOpen,
    openProfile,
    closeProfile,
    isProfileOpen,
    openLogin,
    user,
    lang,
  } = useStore();
  const isRu = lang === "ru";

  const isHome = pathname === "/" && !isCatalogOpen && !isCartOpen && !isFavoritesOpen && !isProfileOpen;
  const isCatalogActive = isCatalogOpen || (pathname.startsWith("/products") && !isCartOpen && !isFavoritesOpen && !isProfileOpen);
  const isCartActive = isCartOpen || pathname === "/cart";
  const isFavoritesActive = isFavoritesOpen || pathname === "/favorites";
  const isProfileActive = isProfileOpen;

  const handleCatalogClick = () => {
    if (isCatalogOpen) closeCatalog();
    else openCatalog();
  };

  const handleCartClick = () => {
    if (isCartOpen) closeCart();
    else openCart();
  };

  const handleFavoritesClick = () => {
    if (isFavoritesOpen) closeFavorites();
    else openFavorites();
  };

  const handleProfileClick = () => {
    if (user) {
      if (isProfileOpen) closeProfile();
      else openProfile();
    } else {
      openLogin();
    }
  };

  return (
    <nav
      aria-label="Mobil navigatsiya"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Bosh sahifa */}
        <Link
          to="/"
          onClick={() => {
            if (isCatalogOpen) closeCatalog();
            if (isCartOpen) closeCart();
            if (isFavoritesOpen) closeFavorites();
            if (isProfileOpen) closeProfile();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
            isHome ? "text-[#e5252b]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className={`material-symbols-rounded text-[24px] ${isHome ? "fill-current" : ""}`}>
            home
          </span>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isHome ? "font-black" : "font-bold"}`}>
            {isRu ? "Главная" : "Asosiy"}
          </span>
        </Link>

        {/* 2. Katalog */}
        <button
          type="button"
          onClick={handleCatalogClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
            isCatalogActive ? "text-[#e5252b]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className={`material-symbols-rounded text-[24px] ${isCatalogActive ? "fill-current" : ""}`}>
            widgets
          </span>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isCatalogActive ? "font-black" : "font-bold"}`}>
            {isRu ? "Каталог" : "Katalog"}
          </span>
        </button>

        {/* 3. Savat */}
        <button
          type="button"
          onClick={handleCartClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 relative cursor-pointer ${
            isCartActive ? "text-[#e5252b]" : "text-gray-500 hover:text-[#e5252b]"
          }`}
        >
          <div className="relative">
            <span className={`material-symbols-rounded text-[24px] ${isCartActive ? "fill-current" : ""}`}>
              shopping_bag
            </span>
            {count > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-[#e5252b] text-white text-[9.5px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isCartActive ? "font-black" : "font-bold"}`}>
            {isRu ? "Корзина" : "Savat"}
          </span>
        </button>

        {/* 4. Sevimlilar */}
        <button
          type="button"
          onClick={handleFavoritesClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 relative cursor-pointer ${
            isFavoritesActive ? "text-[#e5252b]" : "text-gray-500 hover:text-[#e5252b]"
          }`}
        >
          <div className="relative">
            <span className={`material-symbols-rounded text-[24px] ${isFavoritesActive ? "fill-current" : ""}`}>
              favorite
            </span>
            {favs.length > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-[#e5252b] text-white text-[9.5px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {favs.length}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isFavoritesActive ? "font-black" : "font-bold"}`}>
            {isRu ? "Избранное" : "Sevimlilar"}
          </span>
        </button>

        {/* 5. Profil / Kirish */}
        <button
          type="button"
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
            isProfileActive ? "text-[#e5252b]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className={`material-symbols-rounded text-[24px] ${isProfileActive ? "fill-current" : ""}`}>
            person
          </span>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isProfileActive ? "font-black" : "font-bold"}`}>
            {user ? (isRu ? "Кабинет" : "Profil") : (isRu ? "Войти" : "Kirish")}
          </span>
        </button>
      </div>
    </nav>
  );
}
