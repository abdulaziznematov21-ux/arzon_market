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
  const [searchFocused, setSearchFocused] = useState(false);

  const searchBoxRef = useRef(null);
  const userMenuRef = useRef(null);
  const groupNames = Object.keys(GROUPS);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useOverlay(menuOpen, closeMenu);

  // Click outside listener
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    toast(`Yetkazib berish hududi: ${c} etib belgilandi`);
  };

  // Instant live matched products in search dropdown
  const matchedProducts = q.trim().length > 1
    ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
    : [];

  return (
    <header className="w-full bg-white text-[#1e293b] border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">

      {/* 1. TOP UTILITY BAR (Desktop) */}
      <div className="hidden lg:block bg-[#f8f9fa] border-b border-gray-200/70 text-[12.5px] text-gray-600 select-none">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[38px] flex items-center justify-between">

          {/* Left: City & Pickups */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Interactive City Selector */}
            <div className="relative">
              <button
                onClick={() => setCityModalOpen((v) => !v)}
                className="flex items-center gap-1.5 hover:text-[#e5252b] transition font-medium cursor-pointer py-1 px-2 -ml-2 rounded-lg hover:bg-gray-200/60 whitespace-nowrap"
              >
                <span className="material-symbols-rounded text-[17px] text-[#e5252b]">location_on</span>
                <span className="whitespace-nowrap">
                  {t("city")}: <strong className="text-gray-900 underline decoration-dotted decoration-gray-400 font-bold ml-0.5">{getCityName(city, lang)}</strong>
                </span>
                <span className="material-symbols-rounded text-[15px] text-gray-400">expand_more</span>
              </button>

              {/* City Selection Dropdown */}
              {cityModalOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setCityModalOpen(false)} />
                  <div className="absolute top-[32px] left-0 w-[240px] bg-white rounded-2xl shadow-2xl border border-gray-150 p-3 z-40 animate-slide-down">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                      {t("selectCity")}
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-[260px] overflow-y-auto mt-1 pr-1">
                      {CITIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => selectCity(c)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium flex items-center justify-between transition cursor-pointer whitespace-nowrap ${c === city
                              ? "bg-red-50 text-[#e5252b] font-bold"
                              : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                          <span>{getCityName(c, lang)}</span>
                          {c === city && <span className="material-symbols-rounded text-[18px]">check</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

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

          {/* Center: 1-Day Delivery Guarantee Banner */}
          <div className="hidden xl:flex items-center gap-2 text-gray-500 whitespace-nowrap text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t("deliveryPromoBanner")}</span>
          </div>

          {/* Right: FAQ, Orders & Language Switcher */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-200/80 hover:bg-gray-300/80 text-[12px] font-extrabold text-gray-800 transition-all cursor-pointer border border-gray-300/70 shadow-2xs whitespace-nowrap active:scale-95 ml-1"
              title={lang === "uz" ? "Rus tiliga o'tish (Русский)" : "O'zbek tiliga o'tish (O'zbekcha)"}
            >
              <span>{lang === "uz" ? "O'zbekcha" : "Русский"}</span>
              <span className="material-symbols-rounded text-[15px] text-gray-400">swap_horiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-0 lg:h-[78px] flex flex-wrap lg:flex-nowrap items-center gap-x-2 sm:gap-x-3 gap-y-2 lg:gap-5">

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menyuni ochish"
          className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-700 transition active:scale-95 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-rounded text-[24px] sm:text-[26px]">menu</span>
        </button>

        {/* BEAUTIFUL ARZON MARKET LOGO */}
        <Link to="/" aria-label="Bosh sahifa" className="shrink-0 group">
          <ArzonLogo size="default" />
        </Link>

        {/* CATALOG BUTTON (Desktop) */}
        <div className="relative hidden lg:block">
          <button
            onClick={openCatalog}
            className="h-[46px] px-5 rounded-2xl font-bold text-[14px] flex items-center gap-2.5 bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-95 text-white transition-all shadow-md shadow-red-500/20 cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">widgets</span>
            <span>{t("catalog")}</span>
          </button>
        </div>

        {/* SEARCH FORM */}
        <div
          ref={searchBoxRef}
          className="order-last lg:order-2 basis-full lg:basis-0 lg:flex-1 min-w-0 relative"
        >
          <form
            onSubmit={doSearch}
            role="search"
            className={`w-full h-11 sm:h-[46px] rounded-2xl border-2 transition-all flex items-center overflow-hidden bg-gray-50/80 ${searchFocused
                ? "border-[#e5252b] bg-white shadow-md shadow-red-500/10"
                : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <span className="pl-3.5 pr-2 text-gray-400 flex items-center justify-center">
              <span className="material-symbols-rounded text-[22px]">search</span>
            </span>
            <input
              type="search"
              enterKeyHint="search"
              value={q}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 min-w-0 bg-transparent outline-none pr-3 text-[14px] text-gray-800 placeholder:text-gray-400 font-medium"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Tozalash"
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center mr-1 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            )}
            <button
              type="submit"
              className="h-full px-5 bg-[#e5252b] hover:bg-[#c81a20] text-white font-bold text-[14px] transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">{t("searchBtn")}</span>
              <span className="material-symbols-rounded text-[18px] sm:hidden">arrow_forward</span>
            </button>
          </form>

          {/* Popular Search Suggestions Dropdown */}
          {searchFocused && (
            <div className="absolute top-[48px] sm:top-[52px] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-150 p-3 sm:p-4 z-40 max-h-[65vh] overflow-y-auto animate-slide-down">

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
                        onMouseDown={() => {
                          setSearchFocused(false);
                          openProductModal(p);
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                      >
                        <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
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
                    onMouseDown={() => handleSuggestionClick(term)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-[#e5252b] text-[13px] font-semibold text-gray-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[14px] text-gray-400">search</span>
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* USER ACTIONS */}
        <div className="order-2 lg:order-3 flex items-center gap-1 sm:gap-2 ml-auto shrink-0">

          {/* 1. Profile / Login */}
          <div className="relative" ref={userMenuRef}>
            {user ? (
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="h-9 sm:h-[46px] px-2 sm:px-4 rounded-xl sm:rounded-2xl hover:bg-gray-100 flex items-center gap-1.5 sm:gap-2 text-gray-700 transition font-bold text-[13px] cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#e5252b] text-white flex items-center justify-center font-black text-xs sm:text-sm">
                  {user.avatar || user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user?.name || "Xaridor"}</span>
                <span className="material-symbols-rounded text-[16px] sm:text-[18px] text-gray-400 hidden sm:inline">expand_more</span>
              </button>
            ) : (
              <button
                onClick={() => openLogin()}
                className="h-9 sm:h-[46px] px-2 sm:px-4 rounded-xl sm:rounded-2xl hover:bg-gray-100 flex items-center gap-1 sm:gap-1.5 text-gray-700 transition font-bold text-[12.5px] sm:text-[13.5px] cursor-pointer"
              >
                <span className="material-symbols-rounded text-[21px] sm:text-[24px]">person</span>
                <span className="hidden sm:inline">{t("login")}</span>
              </button>
            )}

            {/* User Dropdown */}
            {user && userMenuOpen && (
              <div className="absolute top-[44px] sm:top-[52px] right-0 w-[220px] bg-white rounded-2xl shadow-xl border border-gray-150 py-2 z-40 animate-slide-down">
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
            )}
          </div>

          {/* 2. Favorites */}
          <button
            onClick={openFavorites}
            aria-label={t("favorites")}
            className="h-9 sm:h-[46px] px-2 sm:px-3.5 rounded-xl sm:rounded-2xl hover:bg-gray-100 flex items-center gap-1.5 text-gray-700 transition relative cursor-pointer"
          >
            <span className="material-symbols-rounded text-[21px] sm:text-[24px]">favorite</span>
            <span className="hidden md:inline text-[13.5px] font-bold">{t("favorites")}</span>
            <Badge n={favs.length} />
          </button>

          {/* 3. Cart Button (Opens Cart Drawer on Single Page) */}
          <button
            onClick={openCart}
            aria-label={t("cart")}
            className="h-9 sm:h-[46px] px-2.5 sm:px-4 rounded-xl sm:rounded-2xl bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-[#e5252b] flex items-center gap-1.5 sm:gap-2 transition font-bold text-[13px] sm:text-[13.5px] relative cursor-pointer"
          >
            <span className="material-symbols-rounded text-[21px] sm:text-[24px] text-[#e5252b]">shopping_bag</span>
            <span className="hidden sm:inline">{t("cart")}</span>
            <Badge n={count} />
          </button>

        </div>

      </div>

      {/* 3. CATEGORIES NAVIGATION SUB-BAR (Horizontal Scroll) */}
      <div className="border-t border-gray-100 bg-white">
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

      {/* 4. MOBILE SLIDE-OUT DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-white shadow-2xl flex flex-col z-10 animate-slide-right">
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
