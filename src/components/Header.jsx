import { useCallback, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { useOverlay } from "../lib/hooks";
import { GROUPS, CITIES, POPULAR_SEARCHES, PRODUCTS, fmt } from "../lib/data";
import { translateCategory, getCityName } from "../lib/translations";
import ArzonLogo from "./ArzonLogo";

const GROUP_ICONS = {
  "Telefon va aksessuarlar": "📱",
  "Texnika & Kompyuterlar": "💻",
  "Oziq-ovqat": "🍎",
  "Kiyim va poyabzal": "👟",
  "Sport va fitnes": "⚽",
  "Go‘zallik va salomatlik": "💄",
  "Go'zallik va salomatlik": "💄",
  "Ro‘zg‘or buyumlari": "🏠",
  "Ro'zg'or buyumlari": "🏠",
  "Bolalar olami": "🧸",
  "Avtotovarlar & Asboblar": "🚗",
};

const Badge = ({ n }) =>
  n > 0 ? (
    <span className="absolute -top-1.5 -right-1.5 bg-[#e5252b] text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs animate-pulse-glow">
      {n > 99 ? "99+" : n}
    </span>
  ) : null;

export default function Header() {
  const {
    count,
    favs,
    orders,
    user,
    logout,
    openLogin,
    city,
    setCity,
    toast,
    openCart,
    openFavorites,
    openCatalog,
    openOrders,
    openProfile,
    openProductModal,
    lang,
    setLang,
    t,
  } = useStore();

  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchBoxRef = useRef(null);
  const userMenuRef = useRef(null);
  const groupNames = Object.keys(GROUPS);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useOverlay(menuOpen, closeMenu);

  const closeCityModal = useCallback(() => setCityModalOpen(false), []);
  useOverlay(cityModalOpen, closeCityModal);

  // Click outside listener (mouse & touch)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const doSearch = (e) => {
    e.preventDefault();
    setSearchFocused(false);
    nav(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
    searchBoxRef.current?.querySelector("input")?.blur();
  };

  const handleSuggestionClick = (term) => {
    setQ(term);
    setSearchFocused(false);
    nav(`/products?q=${encodeURIComponent(term)}`);
  };

  const selectCity = (c) => {
    setCity(c);
    setCityModalOpen(false);
    toast(lang === "ru" ? `Регион доставки: ${getCityName(c, "ru")}` : `Yetkazib berish hududi: ${c} etib belgilandi`);
  };

  // Instant live matched products in search dropdown
  const matchedProducts = q.trim().length > 1
    ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
    : [];

  return (
    <header className="w-full bg-white text-[#1e293b] border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">

      {/* 0. SITE ESSENCE & PURPOSE TOP BANNER (Mobile-friendly with city pill) */}
      <div className="bg-gradient-to-r from-[#e5252b] via-[#c81a20] to-[#b91c1c] text-white text-[11px] sm:text-[12px] py-1.5 px-3 sm:px-6 font-semibold select-none flex items-center justify-between md:justify-center gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="bg-white/20 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            ⚡ 1 KUNDA
          </span>
          <span className="truncate text-[11px] sm:text-[12px]">
            {lang === "ru"
              ? "Arzon Market: бесплатная доставка за 1 день по всему Узбекистану!"
              : "Arzon Market: butun O'zbekiston bo'ylab 1 kunda bepul yetkazish!"}
          </span>
        </div>

        {/* Mobile City Selector Pill (Direct 1-tap access on mobile phones) */}
        <button
          type="button"
          onClick={() => setCityModalOpen(true)}
          className="md:hidden shrink-0 flex items-center gap-1 bg-black/25 hover:bg-black/35 active:scale-95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full transition cursor-pointer border border-white/20"
          title={t("selectCity")}
        >
          <span className="material-symbols-rounded text-[13px]">location_on</span>
          <span className="max-w-[85px] sm:max-w-[120px] truncate">{getCityName(city, lang)}</span>
          <span className="material-symbols-rounded text-[13px]">expand_more</span>
        </button>
      </div>

      {/* 1. TOP UTILITY BAR (Desktop & Tablet: md+) */}
      <div className="hidden md:block bg-[#f8f9fa] border-b border-gray-200/70 text-[12px] lg:text-[12.5px] text-gray-600 select-none">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[38px] flex items-center justify-between">

          {/* Left: City & Pickups */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Interactive City Selector */}
            <button
              onClick={() => setCityModalOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#e5252b] transition font-medium cursor-pointer py-1 px-2 -ml-2 rounded-lg hover:bg-gray-200/60 whitespace-nowrap"
            >
              <span className="material-symbols-rounded text-[17px] text-[#e5252b]">location_on</span>
              <span className="whitespace-nowrap">
                {t("city")}: <strong className="text-gray-900 underline decoration-dotted decoration-gray-400 font-bold ml-0.5">{getCityName(city, lang)}</strong>
              </span>
              <span className="material-symbols-rounded text-[15px] text-gray-400">expand_more</span>
            </button>

            <span className="w-px h-3.5 bg-gray-300"></span>

            <Link
              to="/pickup-points"
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#e5252b] transition font-medium py-1 px-2 rounded-lg hover:bg-gray-200/60 whitespace-nowrap"
            >
              <span className="material-symbols-rounded text-[16px] text-emerald-600">store</span>
              <span>{t("pickupPoints")}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded whitespace-nowrap">
                {t("delivery1Day")}
              </span>
            </Link>
          </div>

          {/* Center: 1-Day Delivery Guarantee Banner (Large Desktop) */}
          <div className="hidden xl:flex items-center gap-2 text-gray-500 whitespace-nowrap text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t("deliveryPromoBanner")}</span>
          </div>

          {/* Right: FAQ, Orders & Desktop Language Switcher */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0 whitespace-nowrap">
            <Link
              to="/faq"
              className="hover:text-[#e5252b] text-gray-600 transition flex items-center gap-1 font-medium py-1 px-2 rounded-lg hover:bg-gray-200/60 whitespace-nowrap"
            >
              <span className="material-symbols-rounded text-[16px] text-gray-400">help_outline</span>
              <span>{t("faq")}</span>
            </Link>

            <button
              onClick={openOrders}
              className="text-gray-600 hover:text-[#e5252b] transition flex items-center gap-1 font-medium py-1 px-2 rounded-lg hover:bg-gray-200/60 cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-rounded text-[16px] text-gray-400">receipt_long</span>
              <span>{t("myOrders")}</span>
            </button>

            {/* Single Language Switcher Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextLang = lang === "uz" ? "ru" : "uz";
                setLang(nextLang);
                toast(nextLang === "ru" ? "Язык: Русский" : "Til: O'zbekcha");
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-200/80 hover:bg-gray-300/80 text-[11.5px] font-extrabold text-gray-800 transition-all cursor-pointer border border-gray-300/70 shadow-2xs whitespace-nowrap active:scale-95 ml-1"
              title={lang === "uz" ? "Rus tiliga o'tish (Русский)" : "O'zbek tiliga o'tish (O'zbekcha)"}
            >
              <span>{lang === "uz" ? "O'zbekcha" : "Русский"}</span>
              <span className="material-symbols-rounded text-[14px] text-gray-400">swap_horiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Responsive: 2-row on mobile, 1-row on tablet & desktop) */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-0 md:h-[72px] lg:h-[76px] flex flex-col md:flex-row md:items-center md:gap-3 lg:gap-4">

        {/* TOP ROW on mobile / LEFT SIDE on tablet & desktop */}
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto shrink-0 gap-2 sm:gap-3">
          
          {/* Left sub-group: Hamburger (mobile only) + Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menyuni ochish"
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-700 transition active:scale-95 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-rounded text-[22px] sm:text-[24px]">menu</span>
            </button>

            {/* BEAUTIFUL ARZON MARKET LOGO */}
            <Link to="/" aria-label="Bosh sahifa" className="shrink-0 group">
              <ArzonLogo size="default" />
            </Link>
          </div>

          {/* CATALOG BUTTON (Tablet & Desktop: md+) */}
          <button
            onClick={openCatalog}
            className="hidden md:flex h-[42px] lg:h-[46px] px-3.5 lg:px-5 rounded-2xl font-bold text-[13px] lg:text-[14px] items-center gap-2 bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-95 text-white transition-all shadow-md shadow-red-500/20 cursor-pointer shrink-0"
          >
            <span className="material-symbols-rounded text-[20px]">widgets</span>
            <span>{t("catalog")}</span>
          </button>

          {/* MOBILE-ONLY ACTION SHORTCUTS (Row 1 Right on mobile, hidden on md+) */}
          <div className="flex md:hidden items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Quick Mobile Language Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = lang === "uz" ? "ru" : "uz";
                setLang(next);
                toast(next === "ru" ? "Язык: Русский" : "Til: O'zbekcha");
              }}
              className="h-8 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-black flex items-center gap-1 border border-gray-200/80 cursor-pointer shrink-0 active:scale-95 transition"
              title={lang === "uz" ? "Русский" : "O'zbekcha"}
            >
              <span>{lang.toUpperCase()}</span>
              <span className="material-symbols-rounded text-[13px] text-gray-400">swap_horiz</span>
            </button>

            {/* Mobile User / Login */}
            {user ? (
              <button
                onClick={openProfile}
                className="w-8 h-8 rounded-full bg-[#e5252b] text-white flex items-center justify-center font-black text-xs shrink-0 cursor-pointer shadow-xs active:scale-95"
                title={user?.name || "Profil"}
              >
                {(typeof user?.name === "string" && user.name.trim().charAt(0).toUpperCase()) || user?.avatar || "U"}
              </button>
            ) : (
              <button
                onClick={openLogin}
                className="w-8 h-8 rounded-xl hover:bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                title={t("login")}
              >
                <span className="material-symbols-rounded text-[21px]">person</span>
              </button>
            )}

            {/* Mobile Cart Button */}
            <button
              onClick={openCart}
              aria-label={t("cart")}
              className="h-8 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#e5252b] flex items-center gap-1 font-bold text-[12px] relative cursor-pointer active:scale-95 shrink-0"
            >
              <span className="material-symbols-rounded text-[19px]">shopping_bag</span>
              {count > 0 && (
                <span className="bg-[#e5252b] text-white text-[9.5px] font-black min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* SEARCH FORM (Row 2 on mobile, Center flex-1 on md+) */}
        <div
          ref={searchBoxRef}
          className="w-full md:flex-1 min-w-0 relative mt-1.5 md:mt-0"
        >
          <form
            onSubmit={doSearch}
            role="search"
            className={`w-full h-10 sm:h-11 md:h-[44px] lg:h-[46px] rounded-xl sm:rounded-2xl border-2 transition-all flex items-center overflow-hidden bg-gray-50/90 ${
              searchFocused
                ? "border-[#e5252b] bg-white shadow-md shadow-red-500/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="pl-3 pr-2 text-gray-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[20px] sm:text-[22px]">search</span>
            </span>
            <input
              type="search"
              enterKeyHint="search"
              value={q}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 min-w-0 bg-transparent outline-none pr-2 text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 font-medium"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Tozalash"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center mr-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-rounded text-[16px] sm:text-[18px]">close</span>
              </button>
            )}
            <button
              type="submit"
              className="h-full px-3.5 sm:px-5 bg-[#e5252b] hover:bg-[#c81a20] text-white font-bold text-[13px] sm:text-[14px] transition flex items-center justify-center gap-1 cursor-pointer shrink-0 active:brightness-90"
            >
              <span className="hidden sm:inline">{t("searchBtn")}</span>
              <span className="material-symbols-rounded text-[18px] sm:hidden">arrow_forward</span>
            </button>
          </form>

          {/* Popular Search Suggestions Dropdown */}
          {searchFocused && (
            <>
              {/* Tap backdrop to easily dismiss suggestions on mobile */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setSearchFocused(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-150 p-3 sm:p-4 z-40 max-h-[60vh] overflow-y-auto animate-slide-down">
                {/* Matched product previews if typed */}
                {matchedProducts.length > 0 && (
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Topilgan tovarlar
                    </div>
                    <div className="space-y-1.5">
                      {matchedProducts.map((p) => (
                        <div
                          key={p.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchFocused(false);
                            openProductModal(p);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            setSearchFocused(false);
                            openProductModal(p);
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition active:bg-gray-100"
                        >
                          <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-gray-800 truncate">{p.title}</div>
                            <div className="text-[12px] font-black text-[#e5252b]">{fmt(p.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-rounded text-[16px] text-amber-500">trending_up</span>
                  <span>Ommabop qidiruvlar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(term);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(term);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-[#e5252b] text-[13px] font-semibold text-gray-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-rounded text-[14px] text-gray-400">search</span>
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* DESKTOP & TABLET USER ACTIONS (hidden on mobile, shown on md+) */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">

          {/* 1. Desktop Profile / Login */}
          <div className="relative" ref={userMenuRef}>
            {user ? (
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="h-[42px] lg:h-[46px] px-2.5 lg:px-4 rounded-xl lg:rounded-2xl hover:bg-gray-100 flex items-center gap-1.5 lg:gap-2 text-gray-700 transition font-bold text-[13px] cursor-pointer"
              >
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#e5252b] text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                  {(typeof user?.name === "string" && user.name.trim().charAt(0).toUpperCase()) || user?.avatar || "U"}
                </div>
                <span className="hidden xl:inline max-w-[90px] truncate">{user?.name || "Xaridor"}</span>
                <span className="material-symbols-rounded text-[16px] text-gray-400 hidden xl:inline">expand_more</span>
              </button>
            ) : (
              <button
                onClick={() => openLogin()}
                className="h-[42px] lg:h-[46px] px-2.5 lg:px-4 rounded-xl lg:rounded-2xl hover:bg-gray-100 flex items-center gap-1.5 text-gray-700 transition font-bold text-[13px] cursor-pointer"
              >
                <span className="material-symbols-rounded text-[22px] lg:text-[24px]">person</span>
                <span className="hidden lg:inline">{t("login")}</span>
              </button>
            )}

            {/* User Dropdown */}
            {user && userMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute top-[48px] lg:top-[52px] right-0 w-[220px] bg-white rounded-2xl shadow-xl border border-gray-150 py-2 z-40 animate-slide-down">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <b className="block text-[14px] text-gray-900 truncate">{user?.name || "Xaridor"}</b>
                      <span className="material-symbols-rounded text-emerald-500 text-[16px]">verified</span>
                    </div>
                    <span className="text-[12px] text-gray-500 font-mono">{user?.phone || ""}</span>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openProfile();
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px] text-gray-500">account_circle</span>
                    <span>{t("myProfile")}</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openOrders();
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px]">receipt_long</span>
                    <span>{t("myOrders")}</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openFavorites();
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px]">favorite</span>
                    <span>{t("favorites")}</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#e5252b] hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-gray-100"
                  >
                    <span className="material-symbols-rounded text-[18px]">logout</span>
                    <span>{t("logout")}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 2. Favorites */}
          <button
            onClick={openFavorites}
            aria-label={t("favorites")}
            className="h-[42px] lg:h-[46px] px-2.5 lg:px-3.5 rounded-xl lg:rounded-2xl hover:bg-gray-100 flex items-center gap-1.5 text-gray-700 transition relative cursor-pointer"
          >
            <span className="material-symbols-rounded text-[22px] lg:text-[24px]">favorite</span>
            <span className="hidden lg:inline text-[13px] font-bold">{t("favorites")}</span>
            <Badge n={favs.length} />
          </button>

          {/* 3. Cart Button */}
          <button
            onClick={openCart}
            aria-label={t("cart")}
            className="h-[42px] lg:h-[46px] px-3 lg:px-4 rounded-xl lg:rounded-2xl bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-[#e5252b] flex items-center gap-1.5 lg:gap-2 transition font-bold text-[13px] relative cursor-pointer"
          >
            <span className="material-symbols-rounded text-[22px] lg:text-[24px] text-[#e5252b]">shopping_bag</span>
            <span className="hidden lg:inline">{t("cart")}</span>
            <Badge n={count} />
          </button>

        </div>

      </div>

      {/* 3. CATEGORIES NAVIGATION SUB-BAR (Horizontal Scroll - Tablet & Desktop) */}
      <div className="hidden md:block border-t border-gray-100 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto no-scrollbar py-2.5 text-[13px] font-bold text-gray-600">
          <button
            onClick={openCatalog}
            className="flex items-center gap-1.5 text-[#e5252b] hover:text-[#c81a20] shrink-0 cursor-pointer"
          >
            <span className="material-symbols-rounded text-[18px]">local_fire_department</span>
            <span>{t("weeklyDeals")}</span>
          </button>

          <Link
            to="/installment"
            className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{t("installment0012")}</span>
          </Link>

          {groupNames.map((g) => (
            <Link
              key={g}
              to={`/products?group=${encodeURIComponent(g)}`}
              className="hover:text-[#e5252b] transition shrink-0 whitespace-nowrap"
            >
              {translateCategory(g, lang)}
            </Link>
          ))}
        </div>
      </div>

      {/* UNIVERSAL RESPONSIVE CITY SELECTION MODAL */}
      {cityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="fixed inset-0" onClick={() => setCityModalOpen(false)} />
          <div className="relative w-full max-w-[340px] bg-white rounded-3xl shadow-2xl border border-gray-150 p-4 sm:p-5 z-10 animate-modal-pop">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#e5252b] flex items-center justify-center">
                  <span className="material-symbols-rounded text-[18px]">location_on</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-gray-900">{t("selectCity")}</h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {lang === "ru" ? "Выберите регион доставки" : "Yetkazib berish hududini belgilang"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCityModalOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-1">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => selectCity(c)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-between transition cursor-pointer ${
                    c === city
                      ? "bg-red-50 text-[#e5252b]"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span>{getCityName(c, lang)}</span>
                  {c === city && (
                    <span className="material-symbols-rounded text-[18px] text-[#e5252b]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE SLIDE-OUT DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-[320px] w-[85vw] bg-white shadow-2xl flex flex-col z-10 animate-slide-right pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/70">
              <Link to="/" onClick={closeMenu}>
                <ArzonLogo size="small" />
              </Link>
              <button
                onClick={closeMenu}
                aria-label="Yopish"
                className="w-9 h-9 rounded-xl hover:bg-gray-200/70 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[22px]">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Mobile Language Switcher */}
              <button
                type="button"
                onClick={() => {
                  const nextLang = lang === "uz" ? "ru" : "uz";
                  setLang(nextLang);
                  toast(nextLang === "ru" ? "Язык: Русский" : "Til: O'zbekcha");
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[13px] font-bold text-gray-800 transition flex items-center justify-between border border-gray-200 active:scale-98 cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold">{lang === "uz" ? "O'zbekcha" : "Русский"}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                  <span>{lang === "uz" ? "Rus tiliga o'tish" : "Переключить на узбекский"}</span>
                  <span className="material-symbols-rounded text-[16px]">swap_horiz</span>
                </div>
              </button>

              {/* Mobile City Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCityOpen(!cityOpen)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[13px] font-bold text-gray-800 transition flex items-center justify-between border border-gray-200 cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-[18px] text-[#e5252b]">location_on</span>
                    <span>{t("city")}: <b className="text-gray-900">{getCityName(city, lang)}</b></span>
                  </div>
                  <span className="material-symbols-rounded text-[18px] text-gray-500">
                    {cityOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>
                {cityOpen && (
                  <div className="mt-1.5 bg-white rounded-2xl p-1.5 border border-gray-200 shadow-lg space-y-0.5 max-h-48 overflow-y-auto">
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          selectCity(c);
                          setCityOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-medium flex items-center justify-between transition cursor-pointer ${
                          c === city ? "bg-red-50 text-[#e5252b] font-bold" : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span>{getCityName(c, lang)}</span>
                        {c === city && <span className="material-symbols-rounded text-[17px]">check</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Catalog Button */}
              <button
                onClick={() => {
                  closeMenu();
                  openCatalog();
                }}
                className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-[#e5252b] to-[#c81a20] text-white font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">widgets</span>
                <span>{t("allCategories")}</span>
              </button>

              {/* Store contact info */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-150 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-1">
                  {t("contacts")}
                </div>

                <a
                  href="tel:952719871"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[18px]">call</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-bold text-gray-900 truncate">
                      +998 (95) 271-98-71
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{t("workingHours")}</div>
                  </div>
                </a>

                <div className="px-2 pt-1 text-[11px] text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-rounded text-[14px] text-sky-600">location_on</span>
                  <span className="truncate">Toshkent sh., Bektemir Bo'g'i Eram 4-ko'cha, 3-uy</span>
                </div>
              </div>

              {/* Categories list */}
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-1 mb-2">
                  {t("allCategories")}
                </div>
                <div className="space-y-1">
                  {groupNames.map((g) => (
                    <Link
                      key={g}
                      to={`/products?group=${encodeURIComponent(g)}`}
                      onClick={closeMenu}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 text-[13.5px] font-semibold text-gray-800 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span>{GROUP_ICONS[g] || "📦"}</span>
                        <span>{translateCategory(g, lang)}</span>
                      </div>
                      <span className="material-symbols-rounded text-[18px] text-gray-400">chevron_right</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other links */}
              <div className="pt-2 border-t border-gray-150 space-y-1">
                <button
                  onClick={() => {
                    closeMenu();
                    openOrders();
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-100 text-[13px] font-bold text-gray-700 cursor-pointer"
                >
                  <span className="material-symbols-rounded text-[20px] text-gray-500">receipt_long</span>
                  <span>{t("myOrders")}</span>
                </button>
                <Link
                  to="/sell"
                  onClick={closeMenu}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-100 text-[13px] font-bold text-[#e5252b]"
                >
                  <span className="material-symbols-rounded text-[20px]">storefront</span>
                  <span>{t("sellOnArzon")}</span>
                </Link>
                <Link
                  to="/faq"
                  onClick={closeMenu}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-100 text-[13px] font-semibold text-gray-700"
                >
                  <span className="material-symbols-rounded text-[20px] text-gray-500">help_outline</span>
                  <span>{t("faq")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
