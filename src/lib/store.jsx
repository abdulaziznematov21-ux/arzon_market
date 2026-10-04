import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { byId } from "./data";

const Ctx = createContext(null);
const LS_KEY = "arzon_market_state_v2";

function loadLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const DICT = {
  uz: {
    search_ph: "1 000 000 dan ortiq tovarlar orasidan qidiring...",
    all_categories: "Barcha toifalar",
    catalog: "Katalog",
    login: "Kirish",
    logout: "Chiqish",
    favorites: "Sevimlilar",
    orders: "Buyurtmalar",
    cart: "Savat",
    city: "Shahar",
    pickup_points: "Buyurtmalarni topshirish punktlari",
    sell_on_arzon: "Arzon'da soting",
    faq: "Savol-javoblar",
    week_discounts: "Hafta chegirmalari",
    home: "Bosh sahifa",
    add_to_cart: "Savatga qo'shish",
    buy_now: "Hozir 1 klikda xarid",
    out_of_stock: "Omborda yo'q",
    reviews: "sharh",
    sold: "sotilgan",
    similar: "O'xshash mahsulotlar",
    specs: "Xususiyatlari va tavsifi",
    description: "Tavsif",
    delivery_info: "Yetkazib berish shartlari",
    questions: "Savol-javoblar",
  },
  ru: {
    search_ph: "Ищите среди более 1 000 000 товаров...",
    all_categories: "Все категории",
    catalog: "Каталог",
    login: "Войти",
    logout: "Выйти",
    favorites: "Избранное",
    orders: "Заказы",
    cart: "Корзина",
    city: "Город",
    pickup_points: "Пункты выдачи заказов",
    sell_on_arzon: "Продавайте на Arzon",
    faq: "Вопрос-ответ",
    week_discounts: "Скидки недели",
    home: "Главная",
    add_to_cart: "В корзину",
    buy_now: "Купить в 1 клик",
    out_of_stock: "Нет в наличии",
    reviews: "отзывов",
    sold: "продано",
    similar: "Похожие товары",
    specs: "Характеристики",
    description: "Описание",
    delivery_info: "Условия доставки",
    questions: "Вопросы и ответы",
  },
};

export function StoreProvider({ children }) {
  const init = useRef(loadLS()).current;
  const [cart, setCart] = useState(init.cart || {}); // {id: qty}
  const [favs, setFavs] = useState(init.favs || []);
  const [orders, setOrders] = useState(init.orders || []);
  const [user, setUser] = useState(init.user || null);
  const [city, setCity] = useState(init.city || "Toshkent");
  const [locale, setLocale] = useState(init.locale || "uz");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ cart, favs, orders, user, city, locale }));
    } catch {
      /* ignore quota errors */
    }
  }, [cart, favs, orders, user, city, locale]);

  const toast = (msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };

  const add = (id, qty = 1) => {
    setCart((c) => ({ ...c, [id]: Math.max(1, (c[id] || 0) + qty) }));
    toast("Savatga qo'shildi");
  };
  const setQty = (id, qty) => {
    setCart((c) => {
      if (qty <= 0) {
        const { [id]: _drop, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: qty };
    });
  };
  const removeFromCart = (id) => {
    setCart((c) => {
      const { [id]: _drop, ...rest } = c;
      return rest;
    });
  };
  const clearCart = () => setCart({});

  const toggleFav = (id) => {
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    toast(favs.includes(id) ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo'shildi");
  };

  const cartLines = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ id, qty, p: byId(id) })).filter((l) => l.p),
    [cart]
  );
  const count = useMemo(() => cartLines.reduce((s, l) => s + l.qty, 0), [cartLines]);
  const cartTotal = useMemo(() => cartLines.reduce((s, l) => s + l.p.price * l.qty, 0), [cartLines]);

  const placeOrder = ({ address, pay, fee = 0 }) => {
    const id = "AM-" + Math.floor(100000 + Math.random() * 899999);
    const items = cartLines.map((l) => ({ id: l.id, qty: l.qty }));
    const total = cartTotal + fee;
    setOrders((o) => [{ id, date: Date.now(), step: 0, eta: 25 + Math.floor(Math.random() * 20), items, total, fee, address, pay }, ...o]);
    clearCart();
    return id;
  };
  const advance = (id) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, step: Math.min(4, o.step + 1) } : o)));

  const login = (phone, name) => {
    setUser({ phone, name: name || "Foydalanuvchi" });
    toast(`Xush kelibsiz, ${name || "mijoz"}!`);
  };
  const logout = () => {
    setUser(null);
    toast("Tizimdan chiqdingiz");
  };

  const t = (key) => DICT[locale]?.[key] ?? DICT.uz[key] ?? key;
  const toggleLocale = () => setLocale((l) => (l === "uz" ? "ru" : "uz"));

  const value = {
    cart, cartLines, count, cartTotal,
    add, setQty, removeFromCart, clearCart,
    favs, toggleFav,
    orders, placeOrder, advance,
    user, login, logout,
    city, setCity,
    locale, setLocale, toggleLocale, t,
    toast, toasts,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t2) => (
          <div key={t2.id} className="bg-[#1a1a1a] text-white text-[14px] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[fadeIn_.2s_ease]">
            <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
            {t2.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}
