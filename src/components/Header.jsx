import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { GROUPS, GROUP_ICON, NAV_GROUPS, CITIES, searchProducts, fmt } from "../lib/data";
import LoginModal from "./LoginModal";

export default function Header() {
  const { count, favs, user, logout, city, setCity, locale, toggleLocale, toast, t } = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [sugOpen, setSugOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(Object.keys(GROUPS)[0]);
  const boxRef = useRef(null);

  const suggestions = q.trim().length > 1 ? searchProducts(q, 6) : [];

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setSugOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const doSearch = (e) => {
    e.preventDefault();
    setSugOpen(false);
    nav(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
  };

  const groupNames = Object.keys(GROUPS);
  const restGroups = groupNames.filter((g) => !NAV_GROUPS.includes(g));

  return (
    <header className="w-full bg-white sticky top-0 z-30 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}

      {/* TOP BAR */}
      <div className="bg-[#f6f7f9] border-b border-gray-100">
        <div className="max-w-[1320px] mx-auto px-6 h-[38px] flex items-center justify-between text-[12.5px] text-gray-600">
          <div className="flex items-center gap-5">
            <div className="relative">
              <button onClick={() => setCityOpen((v) => !v)} className="flex items-center gap-1 hover:text-[#e5252b]">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {t("city")}: <b className="text-[#1a1a1a]">{city}</b>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
              {cityOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCityOpen(false)} />
                  <div className="absolute top-[28px] left-0 w-[220px] max-h-[320px] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                    {CITIES.map((c) => (
                      <button key={c} onClick={() => { setCity(c); setCityOpen(false); toast(`Shahar: ${c}`); }} className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 ${c === city ? "text-[#e5252b] font-semibold" : ""}`}>{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link to="/pickup-punktlari" className="hidden md:flex items-center gap-1.5 hover:text-[#e5252b]">
              <span className="material-symbols-outlined text-[16px]">store</span>
              Buyurtmalarni topshirish punktlari
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => toast("Sotuvchi bo'lish uchun ariza yuborildi")} className="hidden sm:flex items-center gap-1 text-[#e5252b] font-medium hover:underline">
              <span className="material-symbols-outlined text-[16px]">storefront</span>Arzonda soting
            </button>
            <Link to="/faq" className="hidden sm:flex items-center gap-1 hover:text-[#e5252b]">
              <span className="material-symbols-outlined text-[16px]">help</span>Savol-javoblar
            </Link>
            <button onClick={toggleLocale} className="flex items-center gap-1.5 font-medium">
              <span className={locale === "uz" ? "text-[#1a1a1a]" : "text-gray-400"}>O'zbekcha</span>
              <span className="text-gray-300">|</span>
              <span className={locale === "ru" ? "text-[#1a1a1a]" : "text-gray-400"}>Русский</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className="max-w-[1320px] mx-auto px-6 h-[76px] flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-[36px] h-[36px] rounded-xl bg-[#e5252b] text-white flex items-center justify-center">
            <span className="material-symbols-outlined msf text-[20px]">shopping_bag</span>
          </div>
          <span className="text-[20px] font-extrabold text-[#1a1a1a] hidden sm:inline">Arzon<span className="text-[#e5252b]">Market</span></span>
        </Link>

        {/* CATALOG */}
        <div className="relative shrink-0">
          <button onClick={() => setCatOpen((v) => !v)} className={`h-[46px] px-4 rounded-xl font-semibold flex items-center gap-2 transition ${catOpen ? "bg-[#c71e24]" : "bg-[#e5252b] hover:bg-[#c71e24]"} text-white`}>
            <span className="material-symbols-outlined text-[20px]">apps</span>
            <span className="hidden md:inline">Katalog</span>
          </button>
          {catOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setCatOpen(false)} />
              <div className="absolute top-[52px] left-0 w-[760px] max-w-[88vw] bg-white rounded-2xl shadow-2xl border border-gray-100 flex z-20 overflow-hidden" style={{ height: 420 }}>
                <div className="w-[270px] border-r border-gray-100 overflow-y-auto py-2">
                  {groupNames.map((g) => (
                    <button key={g} onMouseEnter={() => setActiveGroup(g)} onClick={() => { setCatOpen(false); nav(`/products?group=${encodeURIComponent(g)}`); }}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-[13.5px] text-left ${activeGroup === g ? "bg-red-50 text-[#e5252b] font-semibold" : "text-[#1a1a1a] hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-2.5"><span className="material-symbols-outlined text-[19px]">{GROUP_ICON[g]}</span>{g}</span>
                      <span className="material-symbols-outlined text-[16px] text-gray-300">chevron_right</span>
                    </button>
                  ))}
                </div>
                <div className="flex-1 p-5 overflow-y-auto">
                  <h4 className="font-bold text-[15px] mb-3">{activeGroup}</h4>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                    {GROUPS[activeGroup].map((s) => (
                      <Link key={s} to={`/products?group=${encodeURIComponent(activeGroup)}&sub=${encodeURIComponent(s)}`} onClick={() => setCatOpen(false)} className="text-[13.5px] text-gray-600 hover:text-[#e5252b] py-1.5">{s}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* SEARCH */}
        <div ref={boxRef} className="relative flex-1 min-w-0">
          <form onSubmit={doSearch} className="h-[46px] bg-[#f6f7f9] border border-gray-200 rounded-xl flex items-center overflow-hidden focus-within:border-[#e5252b] transition">
            <span className="material-symbols-outlined text-gray-400 pl-4">search</span>
            <input
              type="text"
              value={q}
              onChange={(e) => { setQ(e.target.value); setSugOpen(true); }}
              onFocus={() => setSugOpen(true)}
              placeholder={t("search_ph")}
              className="flex-1 bg-transparent outline-none px-3 text-[14px] placeholder:text-gray-400 min-w-0"
            />
            <button type="submit" className="h-full px-5 bg-[#e5252b] hover:bg-[#c71e24] text-white text-[14px] font-semibold shrink-0 transition">Qidirish</button>
          </form>
          {sugOpen && suggestions.length > 0 && (
            <div className="absolute top-[52px] left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 max-h-[420px] overflow-y-auto">
              {suggestions.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} onClick={() => setSugOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                  <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <span className="flex-1 min-w-0 text-[13.5px] truncate">{p.title}</span>
                  <span className="text-[13px] font-semibold shrink-0">{fmt(p.price)}</span>
                </Link>
              ))}
              <button onMouseDown={doSearch} className="w-full text-left px-4 pt-2 text-[13px] text-[#e5252b] font-medium">"{q}" bo'yicha barcha natijalarni ko'rish →</button>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="relative">
            <button onClick={() => (user ? setUserOpen((v) => !v) : setLoginOpen(true))} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-[#1a1a1a]">
              <span className="material-symbols-outlined">{user ? "account_circle" : "person"}</span>
              <span className="text-[10.5px] max-w-[64px] truncate">{user ? user.name : "Kirish"}</span>
            </button>
            {userOpen && user && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                <div className="absolute top-[58px] right-0 w-[200px] bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20">
                  <div className="px-4 py-2 text-[13px] text-gray-500 border-b border-gray-100 mb-1">+998 {user.phone}</div>
                  <Link to="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-[13.5px] hover:bg-gray-50"><span className="material-symbols-outlined text-[19px]">receipt_long</span>Buyurtmalarim</Link>
                  <Link to="/favorites" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-[13.5px] hover:bg-gray-50"><span className="material-symbols-outlined text-[19px]">favorite</span>Sevimlilar</Link>
                  <button onClick={() => { logout(); setUserOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-[13.5px] text-[#e5252b] hover:bg-gray-50"><span className="material-symbols-outlined text-[19px]">logout</span>Chiqish</button>
                </div>
              </>
            )}
          </div>

          <Link to="/favorites" className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-[#1a1a1a]">
            <span className="material-symbols-outlined">favorite</span>
            {favs.length > 0 && <span className="absolute top-0 right-1.5 bg-[#e5252b] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{favs.length > 9 ? "9+" : favs.length}</span>}
            <span className="text-[10.5px]">Sevimli</span>
          </Link>

          <Link to="/orders" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-[#1a1a1a]">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[10.5px]">Buyurtma</span>
          </Link>

          <Link to="/cart" className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-[#1a1a1a]">
            <span className="material-symbols-outlined">shopping_cart</span>
            {count > 0 && <span className="absolute top-0 right-1.5 bg-[#e5252b] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count > 9 ? "9+" : count}</span>}
            <span className="text-[10.5px]">Savat</span>
          </Link>
        </div>
      </div>

      {/* NAV */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1320px] mx-auto px-6 h-[42px] flex items-center gap-5 text-[13.5px] whitespace-nowrap overflow-x-auto">
          <Link to="/products?discount=1" className="text-[#e5252b] font-semibold shrink-0 flex items-center gap-1">
            <span className="material-symbols-outlined msf text-[16px]">local_fire_department</span>Hafta chegirmalari
          </Link>
          {NAV_GROUPS.map((g) => (
            <Link key={g} to={`/products?group=${encodeURIComponent(g)}`} className="shrink-0 text-gray-600 hover:text-[#e5252b]">{g}</Link>
          ))}
          <div className="relative shrink-0">
            <button onClick={() => setMoreOpen((v) => !v)} className="flex items-center gap-0.5 text-gray-600 hover:text-[#e5252b]">
              Yana <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                <div className="absolute top-[34px] left-0 w-[240px] bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20">
                  {restGroups.map((g) => (
                    <Link key={g} to={`/products?group=${encodeURIComponent(g)}`} onClick={() => setMoreOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-[13.5px] hover:bg-gray-50">
                      <span className="material-symbols-outlined text-[18px] text-gray-400">{GROUP_ICON[g]}</span>{g}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
