import { createContext, useContext, useEffect, useRef, useState } from "react";
import { byId, PROMOS, FREE_FROM, DELIVERY_FEE } from "./data";
import { TRANSLATIONS } from "./translations";

const Ctx = createContext(null);
const load = (k, d) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v ?? d;
  } catch {
    return d;
  }
};
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

export function StoreProvider({ children }) {
  // Real clean initial state without fake preloaded demo items
  const [user, setUser] = useState(() => load("am_user", null));
  const [cart, setCart] = useState(() => load("am_cart", []));
  const [favs, setFavs] = useState(() => load("am_favs", []));
  const [orders, setOrders] = useState(() => load("am_orders", []));
  const [city, setCity] = useState(() => load("am_city", "Toshkent"));
  const [address, setAddress] = useState(() =>
    load("am_addr", "Toshkent sh., Chilonzor 19-mavze, 42-uy")
  );
  const [promo, setPromo] = useState(() => load("am_promo", "ARZON2026"));
  const [lang, setLang] = useState(() => load("am_lang", "uz"));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginReason, setLoginReason] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const tm = useRef();

  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.uz[key] || key;

  // Single-Page Modals State
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDirectItem, setCheckoutDirectItem] = useState(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState("");

  useEffect(() => save("am_cart", cart), [cart]);
  useEffect(() => save("am_favs", favs), [favs]);
  useEffect(() => save("am_orders", orders), [orders]);
  useEffect(() => save("am_user", user), [user]);
  useEffect(() => save("am_city", city), [city]);
  useEffect(() => save("am_addr", address), [address]);
  useEffect(() => save("am_promo", promo), [promo]);
  useEffect(() => save("am_lang", lang), [lang]);

  // Seed default registered users database if not present
  useEffect(() => {
    const existing = load("am_users_db", null);
    if (!existing) {
      save("am_users_db", {
        "901234567": {
          phone: "+998 (90) 123-45-67",
          rawPhone: "901234567",
          name: "Abdulaziz Nematov",
          city: "Toshkent",
          address: "Toshkent sh., Chilonzor 19-mavze, 42-uy",
          avatar: "A",
          joined: "Oktabr 2026",
          isVerified: true,
          password: "password123",
          cashback: 15000,
        },
        "939876543": {
          phone: "+998 (93) 987-65-43",
          rawPhone: "939876543",
          name: "Malika Karimova",
          city: "Samarqand",
          address: "Samarqand sh., Registon ko'chasi, 15-uy",
          avatar: "M",
          joined: "Sentabr 2026",
          isVerified: true,
          password: "password123",
          cashback: 25000,
        },
      });
    }
  }, []);

  const toast = (m) => {
    setToastMsg(m);
    clearTimeout(tm.current);
    tm.current = setTimeout(() => setToastMsg(""), 2800);
  };

  const login = (phone, name = "", extra = {}) => {
    let raw = String(phone || "").replace(/[^\d]/g, "");
    if (raw.startsWith("998") && raw.length > 9) {
      raw = raw.slice(3);
    }
    raw = raw.slice(0, 9);

    const formattedPhone =
      raw.length === 9
        ? `+998 (${raw.slice(0, 2)}) ${raw.slice(2, 5)}-${raw.slice(5, 7)}-${raw.slice(7, 9)}`
        : String(phone).startsWith("+")
        ? phone
        : `+998 ${phone}`;

    const usersDb = load("am_users_db", {});
    const existing = usersDb[raw] || {};

    const trimmedName =
      (typeof name === "string" ? name.trim() : "") || existing.name || "Xaridor";
    const userCity = extra.city || existing.city || city || "Toshkent";
    const userAddress =
      extra.address ||
      existing.address ||
      address ||
      "Toshkent sh., Chilonzor 19-mavze, 42-uy";

    const u = {
      phone: formattedPhone,
      rawPhone: raw,
      name: trimmedName,
      city: userCity,
      address: userAddress,
      avatar: trimmedName.charAt(0).toUpperCase(),
      joined: existing.joined || "Oktabr 2026",
      isVerified: true,
      cashback: existing.cashback || 15000,
    };

    // Update persistent user DB
    usersDb[raw] = {
      ...existing,
      ...u,
      password: extra.password || existing.password || "password123",
    };
    save("am_users_db", usersDb);

    setUser(u);
    if (userCity) setCity(userCity);
    if (userAddress) setAddress(userAddress);

    setIsLoginOpen(false);
    setLoginReason("");
    toast(`Xush kelibsiz, ${u.name}! 🎉`);
    return u;
  };

  const updateUserProfile = (data = {}) => {
    if (!user) return;
    const updated = { ...user, ...data };
    if (data.name) updated.avatar = data.name.trim().charAt(0).toUpperCase();
    setUser(updated);

    if (data.city) setCity(data.city);
    if (data.address) setAddress(data.address);

    const usersDb = load("am_users_db", {});
    if (user.rawPhone) {
      usersDb[user.rawPhone] = { ...(usersDb[user.rawPhone] || {}), ...updated };
      save("am_users_db", usersDb);
    }
    toast("Profil ma'lumotlari muvaffaqiyatli saqlandi! ✨");
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setFavs([]);
    localStorage.removeItem("am_user");
    localStorage.removeItem("am_cart");
    localStorage.removeItem("am_favs");
    setIsProfileOpen(false);
    toast("Hisobdan muvaffaqiyatli chiqildi");
  };

  const openLogin = (reason = "") => {
    const validReason = typeof reason === "string" ? reason : "";
    setLoginReason(validReason);
    setIsLoginOpen(true);
  };
  const closeLogin = () => {
    setLoginReason("");
    setIsLoginOpen(false);
  };

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  const qtyOf = (id) => cart.find((c) => c.id === id)?.qty || 0;

  // STRICT LOGIN GUARD: Cannot add to cart without login!
  const add = (id, n = 1, openCartDrawer = false) => {
    if (!user) {
      openLogin("Xarid qilish uchun avval hisobingizga kiring!");
      toast("Xarid qilish uchun avval hisobingizga kiring ⚠️");
      return false;
    }
    setCart((c) =>
      c.some((x) => x.id === id)
        ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + n } : x))
        : [...c, { id, qty: n, sel: true }]
    );
    toast("Savatga muvaffaqiyatli qo'shildi 🛒");
    if (openCartDrawer) {
      setIsCartOpen(true);
    }
    return true;
  };

  // STRICT LOGIN GUARD: Cannot like/favorite without login!
  const toggleFav = (id) => {
    if (!user) {
      openLogin("Sevimlilarga saqlash uchun avval hisobingizga kiring!");
      toast("Like bosish uchun avval hisobingizga kiring ⚠️");
      return false;
    }
    setFavs((f) => {
      const on = f.includes(id);
      toast(on ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo'shildi ❤️");
      return on ? f.filter((x) => x !== id) : [...f, id];
    });
    return true;
  };

  const setQty = (id, q) => {
    if (!user) {
      openLogin("Savatingizni boshqarish uchun avval hisobingizga kiring!");
      return false;
    }
    setCart((c) =>
      q <= 0
        ? c.filter((x) => x.id !== id)
        : c.map((x) => (x.id === id ? { ...x, qty: q } : x))
    );
  };

  const remove = (id) => setCart((c) => c.filter((x) => x.id !== id));
  const toggleSel = (id) =>
    setCart((c) => c.map((x) => (x.id === id ? { ...x, sel: !x.sel } : x)));
  const selAll = (v) => setCart((c) => c.map((x) => ({ ...x, sel: v })));
  const removeSel = () => setCart((c) => c.filter((x) => !x.sel));

  const lines = cart
    .map((c) => ({ ...c, p: byId(c.id) }))
    .filter((l) => l.p);
  const sel = lines.filter((l) => l.sel);
  const old = sel.reduce((s, l) => s + l.p.old * l.qty, 0);
  const sub = sel.reduce((s, l) => s + l.p.price * l.qty, 0);
  const saved = old - sub;

  // Promo calculation
  const promoObj = promo ? PROMOS[promo] : null;
  const promoOff =
    promoObj && sub > 0 ? Math.min(promoObj.discount, sub) : 0;
  const afterPromo = Math.max(0, sub - promoOff);
  const fee = sub === 0 || afterPromo >= FREE_FROM ? 0 : DELIVERY_FEE;
  const total = afterPromo + fee;

  const applyPromo = (code) => {
    const c = String(code || "").trim().toUpperCase();
    if (PROMOS[c]) {
      setPromo(c);
      toast(`Promokod faollashtirildi: -${PROMOS[c].discount.toLocaleString()} so'm! 🎟`);
      return true;
    }
    setPromo(null);
    toast("Bunday promokod mavjud emas!");
    return false;
  };

  const copyAndApplyPromo = (code) => {
    const c = String(code || "").trim().toUpperCase();
    try {
      navigator.clipboard?.writeText(c);
    } catch {
      /* ignore */
    }
    if (PROMOS[c]) {
      setPromo(c);
      toast(`Promokod nusxalandi va qo'llandi: ${c} (-${PROMOS[c].discount.toLocaleString()} so'm) 🎟`);
      return true;
    }
    return false;
  };

  // Quick single-page modal helpers
  const openProductModal = (product) => setActiveProductModal(product);
  const closeProductModal = () => setActiveProductModal(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // STRICT LOGIN GUARD: Cannot checkout without login!
  const openCheckout = (directItem = null) => {
    if (!user) {
      openLogin("Buyurtmani rasmiylashtirish uchun hisobingizga kiring!");
      toast("Buyurtma berish uchun avval hisobingizga kiring ⚠️");
      return false;
    }
    setCheckoutDirectItem(directItem);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => {
    setCheckoutDirectItem(null);
    setIsCheckoutOpen(false);
  };

  const openCatalog = () => setIsCatalogOpen(true);
  const closeCatalog = () => setIsCatalogOpen(false);

  const openFavorites = () => setIsFavoritesOpen(true);
  const closeFavorites = () => setIsFavoritesOpen(false);

  const openOrders = () => setIsOrdersOpen(true);
  const closeOrders = () => setIsOrdersOpen(false);

  const openStoreInfo = () => setIsStoreInfoOpen(true);
  const closeStoreInfo = () => setIsStoreInfoOpen(false);

  const openAiAssistant = (initialQuery = "") => {
    if (typeof initialQuery === "string" && initialQuery.trim()) {
      setAiInitialQuery(initialQuery.trim());
    } else {
      setAiInitialQuery("");
    }
    setIsAiAssistantOpen(true);
  };
  const closeAiAssistant = () => {
    setIsAiAssistantOpen(false);
    setAiInitialQuery("");
  };

  const placeOrder = (customData = {}) => {
    if (!user) {
      openLogin("Buyurtmani tasdiqlash uchun hisobingizga kiring!");
      return null;
    }

    const id = "AM-" + Math.floor(100000 + Math.random() * 900000);
    const orderItems = checkoutDirectItem
      ? [{ id: checkoutDirectItem.id, qty: checkoutDirectItem.qty || 1 }]
      : sel.map((l) => ({ id: l.id, qty: l.qty }));

    const orderTotal = checkoutDirectItem
      ? (checkoutDirectItem.price || 0) * (checkoutDirectItem.qty || 1)
      : total;

    const o = {
      id,
      date: Date.now(),
      step: 0,
      eta: 35,
      code: String(Math.floor(100000 + Math.random() * 900000)),
      items: orderItems,
      total: orderTotal,
      fee: customData.fee ?? fee,
      address: customData.address || address,
      pay: customData.pay || "Naqd / karta (kuryerga)",
      recipient: customData.recipient || user?.name || "Xaridor",
      phone: customData.phone || user?.phone || "+998 90 123 45 67",
    };

    setOrders((x) => [o, ...x]);

    if (!checkoutDirectItem) {
      setCart((c) => c.filter((x) => !x.sel));
    }
    setCheckoutDirectItem(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    toast(`Buyurtma qabul qilindi! Buyurtma kodi: ${id} 🚀`);
    return id;
  };

  const advance = (id) =>
    setOrders((os) =>
      os.map((o) => (o.id === id ? { ...o, step: Math.min(4, o.step + 1) } : o))
    );

  const v = {
    cart,
    lines,
    sel,
    count: cart.reduce((s, c) => s + c.qty, 0),
    qtyOf,
    add,
    setQty,
    remove,
    toggleSel,
    selAll,
    removeSel,
    favs,
    toggleFav,
    orders,
    advance,
    placeOrder,
    user,
    setUser,
    login,
    logout,
    city,
    setCity,
    isLoginOpen,
    loginReason,
    openLogin,
    closeLogin,
    address,
    setAddress,
    promo,
    promoObj,
    applyPromo,
    copyAndApplyPromo,
    setPromo,
    old,
    sub,
    saved,
    promoOff,
    fee,
    total,
    toast,

    updateUserProfile,

    // Single Page Controls
    activeProductModal,
    openProductModal,
    closeProductModal,
    isCartOpen,
    openCart,
    closeCart,
    isCheckoutOpen,
    checkoutDirectItem,
    openCheckout,
    closeCheckout,
    isCatalogOpen,
    openCatalog,
    closeCatalog,
    isFavoritesOpen,
    openFavorites,
    closeFavorites,
    isOrdersOpen,
    openOrders,
    closeOrders,
    isProfileOpen,
    openProfile,
    closeProfile,
    isStoreInfoOpen,
    openStoreInfo,
    closeStoreInfo,
    isAiAssistantOpen,
    openAiAssistant,
    closeAiAssistant,
    aiInitialQuery,
    setAiInitialQuery,
    lang,
    setLang,
    t,
  };

  return (
    <Ctx.Provider value={v}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-[120] max-w-[calc(100vw-2rem)] flex items-center gap-2.5 bg-gray-900/95 backdrop-blur-md text-white text-[14px] font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 pointer-events-none ${
          toastMsg
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#e5252b] animate-ping" />
        <span>{toastMsg}</span>
      </div>
    </Ctx.Provider>
  );
}

export const useStore = () => useContext(Ctx);
