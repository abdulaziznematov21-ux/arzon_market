import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS, GROUPS, PROMOS, STORE_INFO, fmt } from "../lib/data";
import { useStore } from "../lib/store";

// Helper for local storage
const loadStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

// Seed demo orders if user has none
const DEMO_ORDERS = [
  {
    id: "AM-782194",
    date: Date.now() - 1000 * 60 * 25, // 25 mins ago
    step: 0,
    statusText: "Yangi",
    total: 15499000,
    recipient: "Abdulaziz Nematov",
    phone: "+998 (90) 123-45-67",
    address: "Toshkent sh., Chilonzor 19-mavze, 42-uy",
    pay: "Naqd / karta (kuryerga)",
    items: [
      {
        id: 1,
        title: "Smartfon Apple iPhone 15 Pro Max 256GB Natural Titanium",
        price: 15499000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "AM-641920",
    date: Date.now() - 1000 * 60 * 180, // 3 hours ago
    step: 2,
    statusText: "Yetkazilmoqda",
    total: 3890000,
    recipient: "Malika Karimova",
    phone: "+998 (93) 987-65-43",
    address: "Samarqand sh., Registon ko'chasi, 15-uy",
    pay: "Payme / Click",
    items: [
      {
        id: 11,
        title: "Aqlli robot changyutgich Xiaomi Robot Vacuum S10+",
        price: 3890000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "AM-510834",
    date: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
    step: 3,
    statusText: "Yetkazildi",
    total: 1095000,
    recipient: "Jasur Rahimov",
    phone: "+998 (97) 555-12-34",
    address: "Buxoro sh., Naqshbandiy ko'chasi, 8-uy",
    pay: "Uzum Pay",
    items: [
      {
        id: 25,
        title: "Erkaklar sport krossovkasi Nike Air Max 270 Black/White",
        price: 850000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 6,
        title: "Tezkor zaryadlash adapteri Baseus GaN5 Pro 65W",
        price: 245000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "AM-432810",
    date: Date.now() - 1000 * 60 * 60 * 28, // 1 day ago
    step: 1,
    statusText: "Qabul qilindi",
    total: 4690000,
    recipient: "Dilnoza Alimova",
    phone: "+998 (91) 400-88-99",
    address: "Farg'ona sh., Al-Farg'oniy ko'chasi, 22-uy",
    pay: "Naqd / karta (kuryerga)",
    items: [
      {
        id: 3,
        title: "Smartfon Xiaomi Redmi Note 13 Pro+ 5G",
        price: 4690000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

const ORDER_STATUS_CONFIG = {
  0: { label: "Yangi", color: "bg-amber-100 text-amber-800 border-amber-300", icon: "pending" },
  1: { label: "Qabul qilindi", color: "bg-sky-100 text-sky-800 border-sky-300", icon: "inventory_2" },
  2: { label: "Yetkazilmoqda", color: "bg-indigo-100 text-indigo-800 border-indigo-300", icon: "local_shipping" },
  3: { label: "Yetkazildi", color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "verified" },
  4: { label: "Bajarildi", color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "check_circle" },
  cancelled: { label: "Bekor qilindi", color: "bg-red-100 text-red-800 border-red-300", icon: "cancel" },
};

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useStore();

  // Authentication state
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return loadStorage("am_admin_auth", false);
  });
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation tabs: 'dashboard' | 'products' | 'orders' | 'promos' | 'customers' | 'settings'
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data Collections
  const [products, setProducts] = useState(() => {
    const saved = loadStorage("am_admin_products", null);
    return saved && Array.isArray(saved) && saved.length > 0 ? saved : PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = loadStorage("am_orders", null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return DEMO_ORDERS;
  });

  const [promos, setPromos] = useState(() => {
    const saved = loadStorage("am_admin_promos", null);
    return saved ? saved : PROMOS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = loadStorage("am_users_db", null);
    if (saved && typeof saved === "object") {
      return Object.values(saved);
    }
    return [
      {
        name: "Abdulaziz Nematov",
        phone: "+998 (90) 123-45-67",
        city: "Toshkent",
        address: "Toshkent sh., Chilonzor 19-mavze, 42-uy",
        joined: "Oktabr 2026",
        cashback: 15000,
        isVerified: true,
      },
      {
        name: "Malika Karimova",
        phone: "+998 (93) 987-65-43",
        city: "Samarqand",
        address: "Samarqand sh., Registon ko'chasi, 15-uy",
        joined: "Sentabr 2026",
        cashback: 25000,
        isVerified: true,
      },
    ];
  });

  const [storeSettings, setStoreSettings] = useState(() => {
    return loadStorage("am_store_settings", {
      name: STORE_INFO.name,
      slogan: STORE_INFO.slogan,
      phone: STORE_INFO.phone,
      hours: STORE_INFO.hours,
      address: STORE_INFO.address,
      freeFrom: 150000,
      deliveryFee: 15000,
      smsGatewayStatus: "Eskiz.uz API faol (200 OK)",
      telegramBotStatus: "@ArzonMarket_bot ulangan (Gemini AI faol)",
    });
  });

  // Save collections back to localStorage
  useEffect(() => {
    saveStorage("am_admin_products", products);
  }, [products]);

  useEffect(() => {
    saveStorage("am_orders", orders);
  }, [orders]);

  useEffect(() => {
    saveStorage("am_admin_promos", promos);
  }, [promos]);

  useEffect(() => {
    saveStorage("am_store_settings", storeSettings);
  }, [storeSettings]);

  // Product Filter & Search states
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("all");
  const [productSort, setProductSort] = useState("newest");

  // Product Modal (Add / Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    category: "Telefon va aksessuarlar",
    sub: "Smartfonlar",
    brand: "",
    price: "",
    old: "",
    image: "",
    description: "",
    badge: "Yangi",
  });

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");

  // Promo Modal
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: "",
    discount: 25000,
    minOrder: 100000,
    label: "Maxsus chegirma kodi",
  });

  // Login handler
  const handleAdminLogin = (e) => {
    if (e) e.preventDefault();
    if (pinInput === "admin123" || pinInput === "admin" || pinInput === "2026") {
      setIsAdminAuth(true);
      saveStorage("am_admin_auth", true);
      setAuthError("");
      toast("Admin panelga muvaffaqiyatli kirdingiz! 🛡️");
    } else {
      setAuthError("Noto'g'ri admin kalit kodi! (Standart PIN: admin123)");
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAdminAuth(true);
    saveStorage("am_admin_auth", true);
    setAuthError("");
    toast("Tezkor Demo Admin sifatida kirdingiz! 🚀");
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    saveStorage("am_admin_auth", false);
    toast("Admin tizimidan chiqildi");
  };

  // KPI Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.step === 0 || o.step === 1).length;
  }, [orders]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          !productSearch ||
          p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
          p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
          String(p.id) === productSearch.trim();

        const matchesCat =
          productCategory === "all" || p.category === productCategory;

        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (productSort === "price_asc") return (a.price || 0) - (b.price || 0);
        if (productSort === "price_desc") return (b.price || 0) - (a.price || 0);
        if (productSort === "rating") return (b.rating || 0) - (a.rating || 0);
        return (b.id || 0) - (a.id || 0); // newest first
      });
  }, [products, productSearch, productCategory, productSort]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const q = orderSearch.toLowerCase();
      const matchesSearch =
        !q ||
        ord.id?.toLowerCase().includes(q) ||
        ord.recipient?.toLowerCase().includes(q) ||
        ord.phone?.includes(q);

      if (!matchesSearch) return false;

      if (orderFilterStatus === "all") return true;
      if (orderFilterStatus === "0") return ord.step === 0;
      if (orderFilterStatus === "1") return ord.step === 1;
      if (orderFilterStatus === "2") return ord.step === 2;
      if (orderFilterStatus === "3") return ord.step === 3 || ord.step === 4;
      if (orderFilterStatus === "cancelled") return ord.statusText === "Bekor qilindi";
      return true;
    });
  }, [orders, orderSearch, orderFilterStatus]);

  // Handle Product Save (Add or Edit)
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: "",
      category: "Telefon va aksessuarlar",
      sub: "Smartfonlar",
      brand: "",
      price: "",
      old: "",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      description: "Rasmiy kafolatli va sifatli mahsulot.",
      badge: "Yangi",
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || "",
      category: product.category || "Telefon va aksessuarlar",
      sub: product.sub || "",
      brand: product.brand || "",
      price: product.price || "",
      old: product.old || "",
      image: product.image || "",
      description: product.description || "",
      badge: product.badge || "Yangi",
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) {
      toast("Iltimos, mahsulot nomi va narxini kiriting!");
      return;
    }

    const priceNum = Number(productForm.price);
    const oldNum = productForm.old ? Number(productForm.old) : Math.round(priceNum * 1.15);
    const offPct = Math.round(((oldNum - priceNum) / oldNum) * 100);

    if (editingProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                ...productForm,
                price: priceNum,
                old: oldNum,
                off: Math.max(0, offPct),
              }
            : item
        )
      );
      toast("Mahsulot muvaffaqiyatli yangilandi! ✏️");
    } else {
      // Create new
      const newId = Math.max(...products.map((p) => Number(p.id) || 0), 100) + 1;
      const newProd = {
        id: newId,
        ...productForm,
        price: priceNum,
        old: oldNum,
        off: Math.max(0, offPct),
        monthly: Math.round(priceNum / 12),
        rating: 5.0,
        reviews: 1,
        delivery: "fast",
        group: productForm.category,
      };
      setProducts((prev) => [newProd, ...prev]);
      toast(`Yangi mahsulot qo'shildi! (ID: #${newId}) 🎉`);
    }

    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm(`Haqiqatan ham #${id} mahsulotni o'chirmoqchimisiz?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast(`Mahsulot #${id} o'chirildi! 🗑️`);
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm("Barcha mahsulotlarni boshlang'ich katalog holatiga qaytarishni tasdiqlaysizmi?")) {
      setProducts(PRODUCTS);
      saveStorage("am_admin_products", PRODUCTS);
      toast("Mahsulotlar katalogi asl holatiga tiklandi! 🔄");
    }
  };

  // Order Status Change
  const handleUpdateOrderStatus = (orderId, newStep, statusText = "") => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            step: newStep,
            statusText: statusText || ORDER_STATUS_CONFIG[newStep]?.label || ord.statusText,
          };
        }
        return ord;
      })
    );
    toast(`Buyurtma ${orderId} holati o'zgartirildi: ${statusText || ORDER_STATUS_CONFIG[newStep]?.label}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Buyurtma ${orderId} ni o'chirishni tasdiqlaysizmi?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      toast(`Buyurtma ${orderId} o'chirildi`);
    }
  };

  // Promo save
  const handleSavePromo = (e) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.discount) {
      toast("Promokod va chegirma miqdorini kiriting!");
      return;
    }
    const cleanCode = promoForm.code.trim().toUpperCase();
    const newPromo = {
      code: cleanCode,
      discount: Number(promoForm.discount),
      minOrder: Number(promoForm.minOrder) || 100000,
      label: promoForm.label || `${cleanCode} chegirmasi`,
    };
    setPromos((prev) => ({
      ...prev,
      [cleanCode]: newPromo,
    }));
    setPromoModalOpen(false);
    toast(`Yangi promokod "${cleanCode}" muvaffaqiyatli saqlandi! 🎟️`);
  };

  const handleDeletePromo = (code) => {
    if (window.confirm(`"${code}" promokodini o'chirishni tasdiqlaysizmi?`)) {
      setPromos((prev) => {
        const next = { ...prev };
        delete next[code];
        return next;
      });
      toast(`Promokod "${code}" o'chirildi`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Title,Category,Price,OldPrice,Rating\n" +
      products.map((p) => `"${p.id}","${p.title?.replace(/"/g, '""')}","${p.category}",${p.price},${p.old},${p.rating}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arzon_market_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Mahsulotlar CSV fayli yuklab olindi! 📥");
  };

  // =========================================================================
  // AUTHENTICATION SCREEN IF NOT LOGGED IN AS ADMIN
  // =========================================================================
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#e5252b] text-white flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="material-symbols-rounded text-[34px]">admin_panel_settings</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Arzon Market Admin</h1>
            <p className="text-[13px] text-gray-500 mt-1">
              Boshqaruv markaziga kirish uchun xavfsizlik kodini kiriting
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[13px] font-semibold flex items-center gap-2 animate-shake">
              <span className="material-symbols-rounded text-[18px]">error</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                Admin PIN yoki Parol
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Standart PIN: admin123"
                  className="w-full h-12 px-4 pl-11 bg-gray-50 border border-gray-300 rounded-2xl text-[15px] font-medium text-gray-900 focus:outline-none focus:border-[#e5252b] focus:ring-2 focus:ring-red-500/20 transition"
                  autoFocus
                />
                <span className="material-symbols-rounded absolute left-3.5 top-3 text-gray-400 text-[22px]">
                  lock
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#e5252b] hover:bg-[#c91d22] text-white font-bold rounded-2xl shadow-lg shadow-red-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-rounded text-[20px]">login</span>
              <span>Tizimga kirish</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[13px] rounded-2xl border border-emerald-200 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-rounded text-[18px]">bolt</span>
              <span>1-bosishda Tezkor Demo Kirish</span>
            </button>

            <Link
              to="/"
              className="w-full h-10 text-gray-500 hover:text-gray-900 text-[13px] font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span className="material-symbols-rounded text-[18px]">arrow_back</span>
              <span>Asosiy do'konga qaytish</span>
            </Link>
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-[11.5px] text-gray-500 text-center leading-relaxed">
            🛡️ Standart admin paroli: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono font-bold text-gray-800">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD WORKSPACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] flex flex-col antialiased">
      {/* TOP ADMIN BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-xs">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-700 flex items-center justify-center transition cursor-pointer"
              aria-label="Admin Menu"
            >
              <span className="material-symbols-rounded text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>

            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e5252b] to-red-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/20">
                A
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="text-[16px] font-black tracking-tight text-gray-900 flex items-center gap-1.5">
                  <span>Arzon Market</span>
                  <span className="bg-red-100 text-[#e5252b] text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    Admin Pro
                  </span>
                </div>
                <div className="text-[11px] font-medium text-gray-400">
                  Boshqaruv & Analitika markazi
                </div>
              </div>
            </Link>
          </div>

          {/* Quick status pill & Store Link */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-[12px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tizim faol: 200 OK</span>
            </div>

            <Link
              to="/"
              className="h-9 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Do'kon vitrinasiga o'tish"
            >
              <span className="material-symbols-rounded text-[18px]">storefront</span>
              <span className="hidden sm:inline">Do'konga o'tish</span>
              <span className="material-symbols-rounded text-[14px]">arrow_outward</span>
            </Link>

            <button
              onClick={handleAdminLogout}
              className="h-9 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#e5252b] text-[13px] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Chiqish"
            >
              <span className="material-symbols-rounded text-[18px]">logout</span>
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>

        </div>
      </header>

      {/* BODY WITH SIDEBAR AND MAIN CONTENT */}
      <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-2 sticky top-24 self-start">
          <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full h-11 px-3.5 rounded-xl flex items-center gap-3 text-[14px] font-bold transition cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="material-symbols-rounded text-[21px]">dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full h-11 px-3.5 rounded-xl flex items-center justify-between text-[14px] font-bold transition cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-[21px]">inventory_2</span>
                <span>Mahsulotlar</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === "products" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full h-11 px-3.5 rounded-xl flex items-center justify-between text-[14px] font-bold transition cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-[21px]">shopping_cart</span>
                <span>Buyurtmalar</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("promos")}
              className={`w-full h-11 px-3.5 rounded-xl flex items-center justify-between text-[14px] font-bold transition cursor-pointer ${
                activeTab === "promos"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-[21px]">loyalty</span>
                <span>Promokodlar</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === "promos" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {Object.keys(promos).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("customers")}
              className={`w-full h-11 px-3.5 rounded-xl flex items-center justify-between text-[14px] font-bold transition cursor-pointer ${
                activeTab === "customers"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-[21px]">group</span>
                <span>Mijozlar</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === "customers" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full h-11 px-3.5 rounded-xl flex items-center gap-3 text-[14px] font-bold transition cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="material-symbols-rounded text-[21px]">settings</span>
              <span>Sozlamalar</span>
            </button>
          </div>

          {/* Quick Helper Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-4 shadow-lg border border-gray-700/60">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <span className="material-symbols-rounded text-[20px]">verified_user</span>
              <span className="text-[12px] font-bold uppercase tracking-wider">Super Admin</span>
            </div>
            <p className="text-[12px] text-gray-300 leading-relaxed mb-3">
              Katalog, buyurtmalar va promokodlar to'liq sinxronlangan.
            </p>
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-700">
              <span>Versiya:</span>
              <span className="font-mono text-white font-bold">2.4-PRO</span>
            </div>
          </div>
        </aside>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-slide-right">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="font-black text-gray-900 text-lg">Admin Menyusi</div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
                  >
                    <span className="material-symbols-rounded text-[20px]">close</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
                    { id: "products", label: "Mahsulotlar", icon: "inventory_2" },
                    { id: "orders", label: "Buyurtmalar", icon: "shopping_cart" },
                    { id: "promos", label: "Promokodlar", icon: "loyalty" },
                    { id: "customers", label: "Mijozlar", icon: "group" },
                    { id: "settings", label: "Sozlamalar", icon: "settings" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full h-11 px-4 rounded-xl flex items-center gap-3 text-[14px] font-bold transition ${
                        activeTab === tab.id
                          ? "bg-[#e5252b] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="material-symbols-rounded text-[21px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link
                  to="/"
                  className="w-full h-11 rounded-xl bg-gray-100 text-gray-800 font-bold text-[13px] flex items-center justify-center gap-2 mb-2"
                >
                  <span className="material-symbols-rounded text-[18px]">storefront</span>
                  <span>Do'konga o'tish</span>
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="w-full h-11 rounded-xl bg-red-50 text-[#e5252b] font-bold text-[13px] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-rounded text-[18px]">logout</span>
                  <span>Chiqish</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* =============================================================== */}
          {/* TAB 1: DASHBOARD                                               */}
          {/* =============================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Umumiy ko'rsatkichlar (Dashboard)
                  </h1>
                  <p className="text-[13px] text-gray-500">
                    Haqiqiy vaqt rejimida do'kon savdolari va buyurtmalar holati
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openAddProductModal}
                    className="h-10 px-4 rounded-xl bg-[#e5252b] hover:bg-[#c91d22] text-white font-bold text-[13px] flex items-center gap-2 shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px]">add</span>
                    <span>Yangi tovar qo'shish</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="h-10 px-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-[13px] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    title="CSV yuklab olish"
                  >
                    <span className="material-symbols-rounded text-[18px]">download</span>
                    <span className="hidden sm:inline">Eksport</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* 1. Tushum */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Jami tushum
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {fmt(totalRevenue)}
                    </div>
                    <div className="text-[12px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                      <span className="material-symbols-rounded text-[16px]">trending_up</span>
                      <span>+18.4% bu oyda</span>
                    </div>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-red-50 text-[#e5252b] flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[28px]">payments</span>
                  </div>
                </div>

                {/* 2. Buyurtmalar */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Jami buyurtmalar
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {orders.length} ta
                    </div>
                    <div className="text-[12px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                      <span className="material-symbols-rounded text-[16px]">schedule</span>
                      <span>{pendingOrdersCount} ta yangi kutmoqda</span>
                    </div>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[28px]">shopping_bag</span>
                  </div>
                </div>

                {/* 3. Mahsulotlar */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Katalogdagi tovarlar
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {products.length} ta
                    </div>
                    <div className="text-[12px] text-indigo-600 font-bold flex items-center gap-1 mt-1">
                      <span className="material-symbols-rounded text-[16px]">category</span>
                      <span>9 ta to'liq kategoriya</span>
                    </div>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[28px]">inventory_2</span>
                  </div>
                </div>

                {/* 4. Mijozlar */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Ro'yxatdan o'tganlar
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {customers.length} nafar
                    </div>
                    <div className="text-[12px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                      <span className="material-symbols-rounded text-[16px]">verified</span>
                      <span>100% SMS tasdiqlangan</span>
                    </div>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[28px]">group</span>
                  </div>
                </div>
              </div>

              {/* Graphical Charts & Statistics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Revenue Bar Chart */}
                <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[16px] font-black text-gray-900">Haftalik savdo dinamikasi</h3>
                      <p className="text-[12px] text-gray-400">Oxirgi 7 kundagi buyurtmalar tushumi</p>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      UZS / Kun
                    </span>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-gray-100">
                    {[
                      { day: "Dush", sum: "12.4M", h: "45%" },
                      { day: "Sesh", sum: "18.2M", h: "60%" },
                      { day: "Chor", sum: "15.0M", h: "52%" },
                      { day: "Pay", sum: "24.8M", h: "82%" },
                      { day: "Juma", sum: "31.5M", h: "96%" },
                      { day: "Shan", sum: "28.0M", h: "88%" },
                      { day: "Yak", sum: "22.6M", h: "74%" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-bold text-gray-400 group-hover:text-[#e5252b] transition">
                          {item.sum}
                        </div>
                        <div className="w-full max-w-[42px] bg-gray-100 rounded-t-xl overflow-hidden flex items-end h-36">
                          <div
                            style={{ height: item.h }}
                            className="w-full bg-gradient-to-t from-[#e5252b] to-red-400 rounded-t-xl group-hover:from-red-600 group-hover:to-red-500 transition-all duration-300"
                          />
                        </div>
                        <div className="text-[11px] font-bold text-gray-700">{item.day}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[12px] text-gray-500">
                    <span>O'rtacha kunlik savdo: <b>21.7 mln so'm</b></span>
                    <span className="text-emerald-600 font-bold">Yuqori o'sish tendensiyasi</span>
                  </div>
                </div>

                {/* Top Categories Breakdown */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-[16px] font-black text-gray-900 mb-1">Toifalar ulushi</h3>
                    <p className="text-[12px] text-gray-400 mb-4">Eng ko'p sotilgan kategoriyalar</p>

                    <div className="space-y-3.5">
                      {[
                        { name: "Telefon va aksessuarlar", pct: 42, color: "bg-red-500" },
                        { name: "Texnika & Kompyuterlar", pct: 28, color: "bg-indigo-500" },
                        { name: "Kiyim va poyabzal", pct: 16, color: "bg-amber-500" },
                        { name: "Oziq-ovqat mahsulotlari", pct: 14, color: "bg-emerald-500" },
                      ].map((cat, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[12.5px] font-bold text-gray-700">
                            <span>{cat.name}</span>
                            <span>{cat.pct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              style={{ width: `${cat.pct}%` }}
                              className={`h-full ${cat.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[12px]">
                    <span className="text-gray-500">Barcha toifalar soni:</span>
                    <span className="font-bold text-gray-900">9 ta asosiy guruh</span>
                  </div>
                </div>
              </div>

              {/* Latest 5 Orders Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-black text-gray-900">So'nggi buyurtmalar</h3>
                    <p className="text-[12px] text-gray-400">Qabul qilingan oxirgi arizalar</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-[#e5252b] hover:underline text-[13px] font-bold flex items-center gap-1"
                  >
                    <span>Barchasini ko'rish</span>
                    <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
                        <th className="py-3 px-4">Buyurtma ID</th>
                        <th className="py-3 px-4">Xaridor</th>
                        <th className="py-3 px-4">Manzil</th>
                        <th className="py-3 px-4">Summa</th>
                        <th className="py-3 px-4">To'lov</th>
                        <th className="py-3 px-4">Holati</th>
                        <th className="py-3 px-4 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((ord) => {
                        const statusCfg = ORDER_STATUS_CONFIG[ord.step] || ORDER_STATUS_CONFIG[0];
                        return (
                          <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                              {ord.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-gray-900">{ord.recipient || "Xaridor"}</div>
                              <div className="text-[11px] text-gray-400">{ord.phone}</div>
                            </td>
                            <td className="py-3.5 px-4 max-w-[200px] truncate text-gray-600">
                              {ord.address}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-gray-900">
                              {fmt(ord.total)}
                            </td>
                            <td className="py-3.5 px-4 text-gray-600">
                              {ord.pay || "Kuryerga"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusCfg.color}`}
                              >
                                <span className="material-symbols-rounded text-[14px]">
                                  {statusCfg.icon}
                                </span>
                                <span>{ord.statusText || statusCfg.label}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setActiveTab("orders");
                                }}
                                className="h-8 px-3 rounded-xl bg-gray-100 hover:bg-[#e5252b] hover:text-white text-gray-700 text-[12px] font-bold transition cursor-pointer"
                              >
                                Tafsilot
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 2: PRODUCTS MANAGEMENT                                     */}
          {/* =============================================================== */}
          {activeTab === "products" && (
            <div className="space-y-5 animate-fade-in">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Mahsulotlar katalogi ({products.length} ta)
                  </h1>
                  <p className="text-[13px] text-gray-500">
                    Do'kon tovarlarini qo'shish, tahrirlash va narxlarni boshqarish
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCatalog}
                    className="h-10 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[13px] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    title="Standart katalogga qaytarish"
                  >
                    <span className="material-symbols-rounded text-[18px]">restart_alt</span>
                    <span className="hidden sm:inline">Katalogni tiklash</span>
                  </button>

                  <button
                    onClick={openAddProductModal}
                    className="h-10 px-4 rounded-xl bg-[#e5252b] hover:bg-[#c91d22] text-white font-bold text-[13px] flex items-center gap-2 shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px]">add</span>
                    <span>Yangi tovar qo'shish</span>
                  </button>
                </div>
              </div>

              {/* Filtering & Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <span className="material-symbols-rounded absolute left-3.5 top-2.5 text-gray-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="search"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Nomi, brendi yoki ID bo'yicha qidirish..."
                    className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] text-gray-800 focus:outline-none focus:border-[#e5252b] transition"
                  />
                </div>

                {/* Category select */}
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:outline-none focus:border-[#e5252b] w-full md:w-auto"
                >
                  <option value="all">Barcha kategoriyalar</option>
                  {Object.keys(GROUPS).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Sort select */}
                <select
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value)}
                  className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:outline-none focus:border-[#e5252b] w-full md:w-auto"
                >
                  <option value="newest">Eng yangi</option>
                  <option value="price_asc">Narx: Arzondan qimmatga</option>
                  <option value="price_desc">Narx: Qimmatdan arzonga</option>
                  <option value="rating">Reyting bo'yicha</option>
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
                        <th className="py-3 px-4 w-16">Rasm</th>
                        <th className="py-3 px-4">Mahsulot nomi</th>
                        <th className="py-3 px-4">Kategoriya</th>
                        <th className="py-3 px-4">Narxi</th>
                        <th className="py-3 px-4">Eski narx</th>
                        <th className="py-3 px-4">Nishon</th>
                        <th className="py-3 px-4">Reyting</th>
                        <th className="py-3 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition">
                          <td className="py-2.5 px-4">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-100"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80";
                              }}
                            />
                          </td>
                          <td className="py-2.5 px-4 max-w-xs">
                            <div className="font-bold text-gray-900 line-clamp-1">{p.title}</div>
                            <div className="text-[11px] text-gray-400">
                              ID: #{p.id} • Brend: {p.brand || "Arzon"}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-gray-600">
                            <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-gray-900">
                            {fmt(p.price)}
                          </td>
                          <td className="py-2.5 px-4 text-gray-400 line-through">
                            {p.old ? fmt(p.old) : "-"}
                          </td>
                          <td className="py-2.5 px-4">
                            {p.badge ? (
                              <span className="bg-red-50 text-[#e5252b] text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                                {p.badge}
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1 font-bold text-amber-500">
                              <span className="material-symbols-rounded text-[16px]">star</span>
                              <span>{p.rating || 4.9}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditProductModal(p)}
                                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center transition cursor-pointer"
                                title="Tahrirlash"
                              >
                                <span className="material-symbols-rounded text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-[#e5252b] flex items-center justify-center transition cursor-pointer"
                                title="O'chirish"
                              >
                                <span className="material-symbols-rounded text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                      <span className="material-symbols-rounded text-[40px] mb-2 block">
                        search_off
                      </span>
                      <p className="font-bold">Mahsulot topilmadi</p>
                      <p className="text-[12px]">Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 3: ORDERS MANAGEMENT                                       */}
          {/* =============================================================== */}
          {activeTab === "orders" && (
            <div className="space-y-5 animate-fade-in">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Buyurtmalar boshqaruvi ({orders.length} ta)
                  </h1>
                  <p className="text-[13px] text-gray-500">
                    Barcha xaridorlar buyurtmalari, kuryer holatlari va to'lovlar
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOrders(DEMO_ORDERS);
                      toast("Demo buyurtmalar qayta yuklandi! 📦");
                    }}
                    className="h-10 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[13px] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px]">refresh</span>
                    <span>Demo buyurtmalar</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs & Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Barchasi" },
                    { id: "0", label: "🟡 Yangi" },
                    { id: "1", label: "🔵 Qabul qilindi" },
                    { id: "2", label: "🚚 Yetkazilmoqda" },
                    { id: "3", label: "🟢 Yetkazildi" },
                    { id: "cancelled", label: "🔴 Bekor qilingan" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setOrderFilterStatus(st.id)}
                      className={`h-9 px-3.5 rounded-xl text-[12.5px] font-bold transition cursor-pointer ${
                        orderFilterStatus === st.id
                          ? "bg-[#e5252b] text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="material-symbols-rounded absolute left-3.5 top-2.5 text-gray-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="search"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Buyurtma ID (AM-...), mijoz ismi yoki telefon raqami..."
                    className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] text-gray-800 focus:outline-none focus:border-[#e5252b] transition"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
                        <th className="py-3 px-4">Buyurtma ID</th>
                        <th className="py-3 px-4">Sana</th>
                        <th className="py-3 px-4">Mijoz / Telefon</th>
                        <th className="py-3 px-4">Yetkazish manzili</th>
                        <th className="py-3 px-4">Jami summa</th>
                        <th className="py-3 px-4">Holatni o'zgartirish</th>
                        <th className="py-3 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((ord) => {
                        const statusCfg = ORDER_STATUS_CONFIG[ord.step] || ORDER_STATUS_CONFIG[0];
                        return (
                          <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                              {ord.id}
                            </td>
                            <td className="py-3.5 px-4 text-gray-500 text-[12px]">
                              {new Date(ord.date).toLocaleDateString("uz-UZ", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-gray-900">{ord.recipient || "Xaridor"}</div>
                              <div className="text-[11px] text-gray-400 font-mono">{ord.phone}</div>
                            </td>
                            <td className="py-3.5 px-4 max-w-[220px] truncate text-gray-600">
                              {ord.address}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-gray-900">
                              {fmt(ord.total)}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={ord.step}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, Number(e.target.value))}
                                className={`text-[12px] font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${statusCfg.color}`}
                              >
                                <option value={0}>🟡 Yangi</option>
                                <option value={1}>🔵 Qabul qilindi</option>
                                <option value={2}>🚚 Yetkazilmoqda</option>
                                <option value={3}>🟢 Yetkazildi</option>
                                <option value={4}>✅ Bajarildi</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="h-8 px-3 rounded-xl bg-gray-100 hover:bg-[#e5252b] hover:text-white text-gray-700 text-[12px] font-bold transition cursor-pointer"
                                >
                                  Ko'rish
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-[#e5252b] flex items-center justify-center transition cursor-pointer"
                                  title="O'chirish"
                                >
                                  <span className="material-symbols-rounded text-[17px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                      <span className="material-symbols-rounded text-[40px] mb-2 block">
                        inbox
                      </span>
                      <p className="font-bold">Buyurtmalar mavjud emas</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 4: PROMOS MANAGEMENT                                       */}
          {/* =============================================================== */}
          {activeTab === "promos" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Aksiyalar & Promokodlar ({Object.keys(promos).length} ta)
                  </h1>
                  <p className="text-[13px] text-gray-500">
                    Chegirma kodlarini yaratish va xaridorlarni rag'batlantirish
                  </p>
                </div>
                <button
                  onClick={() => setPromoModalOpen(true)}
                  className="h-10 px-4 rounded-xl bg-[#e5252b] hover:bg-[#c91d22] text-white font-bold text-[13px] flex items-center gap-2 shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
                >
                  <span className="material-symbols-rounded text-[18px]">add</span>
                  <span>Yangi promokod yaratish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(promos).map((pr) => (
                  <div
                    key={pr.code}
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden group hover:border-red-300 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-red-50 text-[#e5252b] font-mono font-black text-[15px] px-3 py-1 rounded-xl border border-red-200 tracking-wider">
                        {pr.code}
                      </span>
                      <button
                        onClick={() => handleDeletePromo(pr.code)}
                        className="text-gray-400 hover:text-[#e5252b] transition p-1 cursor-pointer"
                        title="Promokodni o'chirish"
                      >
                        <span className="material-symbols-rounded text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="text-2xl font-black text-gray-900 mb-1">
                      -{fmt(pr.discount)}
                    </div>
                    <p className="text-[13px] text-gray-600 mb-3">{pr.label || "Maxsus chegirma"}</p>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
                      <span>Min. buyurtma:</span>
                      <span className="font-bold text-gray-900">{fmt(pr.minOrder || 100000)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 5: CUSTOMERS MANAGEMENT                                    */}
          {/* =============================================================== */}
          {activeTab === "customers" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Mijozlar bazasi ({customers.length} nafar)
                  </h1>
                  <p className="text-[13px] text-gray-500">
                    Ro'yxatdan o'tgan xaridorlar va keshbek hisoblari
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
                        <th className="py-3 px-4">Xaridor</th>
                        <th className="py-3 px-4">Telefon</th>
                        <th className="py-3 px-4">Shahar</th>
                        <th className="py-3 px-4">Asosiy manzil</th>
                        <th className="py-3 px-4">A'zolik</th>
                        <th className="py-3 px-4">SMS Tasdiq</th>
                        <th className="py-3 px-4">Keshbek</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customers.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50/80 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-[#e5252b] text-white flex items-center justify-center font-black text-sm shrink-0">
                                {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <span className="font-bold text-gray-900">{c.name || "Xaridor"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-gray-700">
                            {c.phone}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700">
                            {c.city || "Toshkent"}
                          </td>
                          <td className="py-3.5 px-4 max-w-[200px] truncate text-gray-500">
                            {c.address || "-"}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 text-[12px]">
                            {c.joined || "Oktabr 2026"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <span className="material-symbols-rounded text-[14px]">verified</span>
                              <span>Tasdiqlangan</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600">
                            {fmt(c.cashback || 15000)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 6: SETTINGS                                                */}
          {/* =============================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Do'kon sozlamalari
                </h1>
                <p className="text-[13px] text-gray-500">
                  Asosiy ma'lumotlar, yetkazish shartlari va API integratsiyalari
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                <h3 className="text-[16px] font-black text-gray-900 pb-3 border-b border-gray-100">
                  Umumiy do'kon parametrlari
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                      Do'kon nomi
                    </label>
                    <input
                      type="text"
                      value={storeSettings.name}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, name: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                      Aloqa telefoni
                    </label>
                    <input
                      type="text"
                      value={storeSettings.phone}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, phone: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                      Ish vaqti tartibi
                    </label>
                    <input
                      type="text"
                      value={storeSettings.hours}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, hours: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                      Bosh manzil
                    </label>
                    <input
                      type="text"
                      value={storeSettings.address}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, address: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                    />
                  </div>
                </div>

                <h3 className="text-[16px] font-black text-gray-900 pt-4 pb-3 border-b border-gray-100">
                  Yetkazib berish stavkalari
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                      Bepul yetkazish chegarasi (so'm)
                    </label>
                    <input
                      type="number"
                      value={storeSettings.freeFrom}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          freeFrom: Number(e.target.value),
                        })
                      }
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                      Standart kuryer to'lovi (so'm)
                    </label>
                    <input
                      type="number"
                      value={storeSettings.deliveryFee}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          deliveryFee: Number(e.target.value),
                        })
                      }
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                    />
                  </div>
                </div>

                <h3 className="text-[16px] font-black text-gray-900 pt-4 pb-3 border-b border-gray-100">
                  API & Xizmatlar holati
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <span className="material-symbols-rounded text-[22px]">sms</span>
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-gray-900">Eskiz.uz SMS Shlyuz</div>
                        <div className="text-[11px] text-gray-500">Real SMS xabarlar va kod yuborish</div>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
                      Faol (200 OK)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                        <span className="material-symbols-rounded text-[22px]">smart_toy</span>
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-gray-900">Telegram Bot & Gemini AI</div>
                        <div className="text-[11px] text-gray-500">@ArzonMarket_bot do'kon yordamchisi</div>
                      </div>
                    </div>
                    <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-3 py-1 rounded-full">
                      Ulangan (24/7 Online)
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      saveStorage("am_store_settings", storeSettings);
                      toast("Sozlamalar muvaffaqiyatli saqlandi! ✨");
                    }}
                    className="h-11 px-6 bg-[#e5252b] hover:bg-[#c91d22] text-white font-bold text-[14px] rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
                  >
                    Sozlamalarni saqlash
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: ADD / EDIT PRODUCT                                         */}
      {/* =================================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-150 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {editingProduct ? "Mahsulotni tahrirlash" : "Yangi tovar qo'shish"}
                </h2>
                <p className="text-[12px] text-gray-500">
                  {editingProduct ? `ID: #${editingProduct.id}` : "Katalogga yangi tovar kiritish"}
                </p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Mahsulot to'liq nomi *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Masalan: Smartfon Samsung Galaxy S24 Ultra 512GB"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">
                    Asosiy kategoriya *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const subs = GROUPS[newCat] || [];
                      setProductForm({
                        ...productForm,
                        category: newCat,
                        sub: subs[0] || "",
                      });
                    }}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:outline-none focus:border-[#e5252b]"
                  >
                    {Object.keys(GROUPS).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">
                    Brend
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Masalan: Apple, Samsung, Nike..."
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">
                    Sotuv narxi (so'm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="Masalan: 4500000"
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">
                    Eski narxi (so'm)
                  </label>
                  <input
                    type="number"
                    value={productForm.old}
                    onChange={(e) => setProductForm({ ...productForm, old: e.target.value })}
                    placeholder="Chegirma ko'rinishi uchun"
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Rasm havolasi (URL)
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/... yoki rasm linki"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                />
              </div>

              {/* Rasm Preview */}
              {productForm.image && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <img
                    src={productForm.image}
                    alt="Preview"
                    className="w-16 h-16 object-contain rounded-xl bg-white border border-gray-200"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                  <div className="text-[12px] text-gray-500">
                    <span className="font-bold text-gray-800">Rasm ko'rinishi faol</span>
                    <p>Ushbu rasm tovar kartasida va tafsilot sahifasida ko'rinadi.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">
                    Nishon (Badge)
                  </label>
                  <select
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:outline-none focus:border-[#e5252b]"
                  >
                    <option value="">Nishonsiz</option>
                    <option value="Xit tovar">Xit tovar</option>
                    <option value="Super narx">Super narx</option>
                    <option value="Arzon narx">Arzon narx</option>
                    <option value="Yangi">Yangi</option>
                    <option value="Katta chegirma">Katta chegirma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">
                    Tavsif (Description)
                  </label>
                  <input
                    type="text"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Tovar haqida qisqacha ma'lumot"
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="h-11 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[13px] transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#e5252b] hover:bg-[#c91d22] text-white font-bold text-[13px] shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: ORDER DETAILS                                              */}
      {/* =================================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-150 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Buyurtma tafsilotlari
                </div>
                <h2 className="text-xl font-mono font-black text-gray-900">
                  {selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
              >
                <span className="material-symbols-rounded text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Recipient Details */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
                <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Mijoz ma'lumotlari
                </div>
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-gray-500">Qabul qiluvchi:</span>
                  <span className="font-bold text-gray-900">{selectedOrder.recipient || "Xaridor"}</span>
                </div>
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-gray-500">Telefon:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedOrder.phone}</span>
                </div>
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-gray-500">Manzil:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{selectedOrder.address}</span>
                </div>
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-gray-500">To'lov usuli:</span>
                  <span className="font-bold text-gray-900">{selectedOrder.pay || "Kuryerga"}</span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-bold text-amber-800">Buyurtma holati</div>
                  <div className="text-[13px] text-gray-600">Xaridor uchun trekking yangilanadi</div>
                </div>
                <select
                  value={selectedOrder.step}
                  onChange={(e) => {
                    const stepNum = Number(e.target.value);
                    handleUpdateOrderStatus(selectedOrder.id, stepNum);
                    setSelectedOrder({ ...selectedOrder, step: stepNum });
                  }}
                  className="h-10 px-3 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-[13px] shadow-xs cursor-pointer focus:outline-none"
                >
                  <option value={0}>🟡 Yangi</option>
                  <option value={1}>🔵 Qabul qilindi</option>
                  <option value={2}>🚚 Yetkazilmoqda</option>
                  <option value={3}>🟢 Yetkazildi</option>
                  <option value={4}>✅ Bajarildi</option>
                </select>
              </div>

              {/* Order Items */}
              <div>
                <div className="text-[13px] font-bold text-gray-700 mb-2">Buyurtma tarkibi:</div>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80"}
                          alt={item.title}
                          className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100"
                        />
                        <div>
                          <div className="text-[13px] font-bold text-gray-900 line-clamp-1">
                            {item.title || `Mahsulot #${item.id}`}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            Miqdor: {item.qty || 1} dona
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 text-[13px] shrink-0">
                        {fmt(item.price || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-base font-black">
                <span>Jami to'lov:</span>
                <span className="text-[#e5252b] text-xl">{fmt(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-10 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[13px] transition cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: ADD PROMO                                                  */}
      {/* =================================================================== */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-150 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="text-lg font-black text-gray-900">Yangi promokod yaratish</h2>
              <button
                onClick={() => setPromoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Promokod kodi *
                </label>
                <input
                  type="text"
                  required
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  placeholder="Masalan: NAVROZ2026"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-mono font-bold uppercase text-gray-900 focus:outline-none focus:border-[#e5252b]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Chegirma summasi (so'm) *
                </label>
                <input
                  type="number"
                  required
                  value={promoForm.discount}
                  onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                  placeholder="30000"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Minimal xarid summasi (so'm)
                </label>
                <input
                  type="number"
                  value={promoForm.minOrder}
                  onChange={(e) => setPromoForm({ ...promoForm, minOrder: e.target.value })}
                  placeholder="100000"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Qisqacha tavsif
                </label>
                <input
                  type="text"
                  value={promoForm.label}
                  onChange={(e) => setPromoForm({ ...promoForm, label: e.target.value })}
                  placeholder="30 000 so'm Navro'z bayrami aksiyasi"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:border-[#e5252b]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-[13px]"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#e5252b] hover:bg-[#c91d22] text-white font-bold text-[13px] shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
                >
                  Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
