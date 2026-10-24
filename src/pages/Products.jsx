import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { GROUPS, PRODUCTS } from "../lib/data";
import { useOverlay } from "../lib/hooks";
import { useStore } from "../lib/store";
import { translateCategory } from "../lib/translations";

const PAGE_SIZE = 24;

export default function Products() {
  const { lang } = useStore();
  const isRu = lang === "ru";

  const [sp, setSp] = useSearchParams();
  const [view, setView] = useState("grid");
  const [priceOpen, setPriceOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  useOverlay(filtersOpen, closeFilters);

  const group = sp.get("group") || "";
  const sub = sp.get("sub") || "";
  const q = (sp.get("q") || "").toLowerCase().trim();
  const sort = sp.get("sort") || "pop";
  const fast = sp.get("fast") === "1";
  const tomorrow = sp.get("tomorrow") === "1";
  const discountOnly = sp.get("discount") === "1";
  const rating4 = sp.get("rating") === "4";
  const brands = (sp.get("brands") || "").split(",").filter(Boolean);
  const min = Number(sp.get("min") || 0);
  const max = Number(sp.get("max") || 25000000);
  const page = Number(sp.get("page") || 1);

  const set = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => (v === "" || v === null || v === undefined || v === false) ? next.delete(k) : next.set(k, v));
    if (!("page" in patch)) next.delete("page");
    setSp(next);
  };

  const toggleBrand = (b) => {
    const on = brands.includes(b);
    const next = on ? brands.filter((x) => x !== b) : [...brands, b];
    set({ brands: next.join(",") });
  };

  const norm = (s = "") => s.replace(/[‘’`]/g, "'").toLowerCase().trim();
  const groupNorm = norm(group);
  const subNorm = norm(sub);

  const baseByGroup = group
    ? PRODUCTS.filter((p) => norm(p.group) === groupNorm || norm(p.category) === groupNorm)
    : PRODUCTS;
  const availableBrands = useMemo(() => {
    const m = new Map();
    baseByGroup.forEach((p) => m.set(p.brand, (m.get(p.brand) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [group]);

  const brandsKey = brands.join(",");

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (group && norm(p.group) !== groupNorm && norm(p.category) !== groupNorm) return false;
      if (sub && norm(p.sub) !== subNorm) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      if (fast && p.delivery !== "fast") return false;
      if (tomorrow && p.delivery !== "tomorrow") return false;
      if (discountOnly && p.off < 15) return false;
      if (rating4 && p.rating < 4.0) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (p.price < min || p.price > max) return false;
      return true;
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [groupNorm, subNorm, q, sort, fast, tomorrow, discountOnly, rating4, brandsKey, min, max]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  const activeTags = [
    fast && [isRu ? "⚡ За 30 минут" : "⚡ 30 daqiqada", () => set({ fast: "" })],
    tomorrow && [isRu ? "🚚 Завтра" : "🚚 Ertaga", () => set({ tomorrow: "" })],
    discountOnly && [isRu ? "🔥 Скидки" : "🔥 Chegirmalar", () => set({ discount: "" })],
    rating4 && [isRu ? "★ 4.0 и выше" : "★ 4.0 va yuqori", () => set({ rating: "" })],
    ...brands.map((b) => [b, () => toggleBrand(b)]),
    sub && [sub, () => set({ sub: "" })],
  ].filter(Boolean);

  const clearAll = () => setSp({});

  const title = sub || (group ? translateCategory(group, lang) : (isRu ? "Все товары" : "Barcha mahsulotlar"));

  return (
    <div className="bg-[#f9f9fa] min-h-screen pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* BREADCRUMB */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px] text-gray-500">
          <Link to="/" className="hover:text-[#e5252b]">🏠 {isRu ? "Главная" : "Bosh sahifa"}</Link>
          <span>›</span>
          {group ? (
            <button onClick={() => set({ group: "", sub: "" })} className="hover:text-[#e5252b]">
              {translateCategory(group, lang)}
            </button>
          ) : (
            <span>{isRu ? "Каталог" : "Katalog"}</span>
          )}
          {sub && <><span>›</span><span className="text-[#222] font-medium">{sub}</span></>}
        </div>

        {/* TITLE ROW */}
        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4 mt-4">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <h1 className="text-[24px] sm:text-[30px] font-extrabold text-[#111]">{title}</h1>
            <span className="bg-gray-100 text-gray-600 text-[13px] px-3 py-1 rounded-full">
              {filtered.length} {isRu ? "товаров" : "ta tovar"}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden shrink-0 h-10 px-4 rounded-lg border border-gray-200 bg-white text-[14px] font-medium flex items-center gap-2"
            >
              ☰ {isRu ? "Фильтры" : "Filtrlar"}
              {activeTags.length > 0 && (
                <span className="bg-[#e5252b] text-white text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                  {activeTags.length}
                </span>
              )}
            </button>
            <select
              value={sort}
              onChange={(e) => set({ sort: e.target.value })}
              className="flex-1 min-w-0 sm:flex-none sm:w-auto h-10 sm:h-auto text-[14px] border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none cursor-pointer"
            >
              <option value="pop">{isRu ? "Сортировка: По популярности" : "Saralash: Ommabopligi bo'yicha"}</option>
              <option value="price_asc">{isRu ? "Сначала дешевле" : "Narx: pastdan yuqoriga"}</option>
              <option value="price_desc">{isRu ? "Сначала дороже" : "Narx: yuqoridan pastga"}</option>
              <option value="rating">{isRu ? "По рейтингу" : "Reyting bo'yicha"}</option>
            </select>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer ${
                  view === "grid" ? "bg-white shadow-sm text-[#333]" : "text-gray-400"
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer ${
                  view === "list" ? "bg-white shadow-sm text-[#333]" : "text-gray-400"
                }`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start mt-4 sm:mt-6">
          {/* SIDEBAR */}
          {filtersOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={closeFilters} />}
          <aside
            className={`fixed top-0 bottom-0 left-0 z-50 w-[88%] max-w-[340px] overflow-y-auto overscroll-contain bg-white p-4 shadow-xl transition-transform duration-200 ${
              filtersOpen ? "translate-x-0" : "-translate-x-full max-lg:invisible"
            } lg:translate-x-0 lg:sticky lg:top-4 lg:bottom-auto lg:left-auto lg:z-auto lg:w-[260px] lg:shrink-0 lg:overflow-visible lg:rounded-2xl lg:border lg:border-gray-100 lg:p-5 lg:shadow-none`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[15px] text-[#222]">☰ {isRu ? "Фильтры" : "Filtrlar"}</span>
              <div className="flex items-center gap-2">
                <button onClick={clearAll} className="text-[13px] text-gray-400 hover:text-[#e5252b] cursor-pointer">
                  {isRu ? "Сбросить" : "Tozalash"}
                </button>
                <button onClick={closeFilters} aria-label="Yopish" className="lg:hidden w-9 h-9 rounded-lg hover:bg-gray-100 cursor-pointer">✕</button>
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h4 className="font-semibold text-[14px] text-[#222] mb-3">{isRu ? "Категории" : "Toifalar"}</h4>
              <div className="space-y-1">
                {!group && Object.keys(GROUPS).map((g) => (
                  <button
                    key={g}
                    onClick={() => set({ group: g, sub: "" })}
                    className="w-full flex items-center justify-between text-[14px] px-2 py-1.5 rounded-lg text-[#333] hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <span>{translateCategory(g, lang)}</span>
                    <span className="text-gray-400">{PRODUCTS.filter((p) => p.group === g).length}</span>
                  </button>
                ))}
                {group && GROUPS[group]?.map((s) => (
                  <button
                    key={s}
                    onClick={() => set({ sub: sub === s ? "" : s })}
                    className={`w-full flex items-center justify-between text-[14px] px-2 py-1.5 rounded-lg text-left cursor-pointer ${
                      sub === s ? "bg-red-50 text-[#e5252b] font-medium" : "text-[#333] hover:bg-gray-50"
                    }`}
                  >
                    <span>{s}</span>
                    <span className={sub === s ? "text-[#e5252b]" : "text-gray-400"}>
                      {PRODUCTS.filter((p) => p.group === group && p.sub === s).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <button onClick={() => setPriceOpen((v) => !v)} className="w-full flex items-center justify-between mb-3 cursor-pointer">
                <h4 className="font-semibold text-[14px] text-[#222]">{isRu ? "Цена (сум)" : "Narx (so'm)"}</h4>
                <span className="text-gray-400">{priceOpen ? "⌃" : "⌄"}</span>
              </button>
              {priceOpen && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <label className="text-[11px] text-gray-400">{isRu ? "ОТ" : "DAN"}</label>
                    <input
                      type="number"
                      value={min || ""}
                      onChange={(e) => set({ min: e.target.value })}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-[#e5252b]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[11px] text-gray-400">{isRu ? "ДО" : "GACHA"}</label>
                    <input
                      type="number"
                      value={max === 500000 ? "" : max}
                      onChange={(e) => set({ max: e.target.value || "500000" })}
                      placeholder="500000"
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-[#e5252b]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* DELIVERY */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h4 className="font-semibold text-[14px] text-[#222] mb-3">{isRu ? "Срок доставки" : "Yetkazib berish muddati"}</h4>
              <label className="flex items-center gap-2.5 text-[14px] py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fast}
                  onChange={(e) => set({ fast: e.target.checked ? "1" : "" })}
                  className="accent-[#e5252b] w-4 h-4 cursor-pointer"
                />
                {isRu ? "⚡ Быстрая доставка за 30 мин" : "⚡ Bugun 30 daqiqada"}
              </label>
              <label className="flex items-center gap-2.5 text-[14px] py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tomorrow}
                  onChange={(e) => set({ tomorrow: e.target.checked ? "1" : "" })}
                  className="accent-[#e5252b] w-4 h-4 cursor-pointer"
                />
                {isRu ? "🚚 Доставка завтра (1 день)" : "🚚 Ertaga (1 kunda)"}
              </label>
            </div>

            {/* BRANDS */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[14px] text-[#222]">{isRu ? "Бренды" : "Brendlar"}</h4>
                {brands.length > 0 && (
                  <span className="text-[12px] text-gray-400">
                    {brands.length} {isRu ? "выбрано" : "tanlandi"}
                  </span>
                )}
              </div>
              <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                {availableBrands.map(([b, c]) => (
                  <label key={b} className="flex items-center justify-between text-[14px] cursor-pointer py-0.5">
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={brands.includes(b)}
                        onChange={() => toggleBrand(b)}
                        className="accent-[#e5252b] w-4 h-4 cursor-pointer"
                      />
                      {b}
                    </span>
                    <span className="text-gray-400 text-[13px]">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DISCOUNT & RATING */}
            <div className="pb-2">
              <label className="flex items-center gap-2.5 text-[14px] py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => set({ discount: e.target.checked ? "1" : "" })}
                  className="accent-[#e5252b] w-4 h-4 cursor-pointer"
                />
                {isRu ? "🔥 Только со скидкой" : "🔥 Faqat chegirmali tovarlar"}
              </label>
              <label className="flex items-center gap-2.5 text-[14px] py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rating4}
                  onChange={(e) => set({ rating: e.target.checked ? "4" : "" })}
                  className="accent-[#e5252b] w-4 h-4 cursor-pointer"
                />
                {isRu ? "★ Рейтинг 4.0 и выше" : "★ 4.0 va yuqori reyting"}
              </label>
            </div>

            <button
              onClick={closeFilters}
              className="lg:hidden sticky bottom-0 w-full h-12 mt-4 rounded-xl bg-[#e5252b] text-white font-semibold cursor-pointer"
            >
              {isRu ? `Показать результаты (${filtered.length})` : `Natijalarni ko'rsatish (${filtered.length})`}
            </button>
          </aside>

          {/* RESULTS */}
          <div className="flex-1 min-w-0">
            {activeTags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 mb-5 text-[13px]">
                <span className="font-medium text-[#333]">{isRu ? "АКТИВНЫЕ:" : "FAOL:"}</span>
                {activeTags.map(([label, fn], i) => (
                  <button
                    key={i}
                    onClick={fn}
                    className="flex items-center gap-1.5 bg-gray-100 text-[#333] px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer"
                  >
                    {label} ✕
                  </button>
                ))}
                <button onClick={clearAll} className="text-[#e5252b] font-medium ml-1 cursor-pointer">
                  {isRu ? "Сбросить всё" : "Barchasini tozalash"}
                </button>
              </div>
            )}

            {pageItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-16 text-center text-gray-500">
                <div className="text-5xl mb-3">🔍</div>
                {isRu ? "Ничего не найдено. Попробуйте изменить фильтры." : "Hech narsa topilmadi. Filtrlarni o'zgartirib ko'ring."}
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5" : "space-y-3 sm:space-y-4"}>
                {pageItems.map((p) => <ProductCard key={p.id} p={p} list={view === "list"} />)}
              </div>
            )}

            {pageCount > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-10 text-[14px] text-gray-500 text-center">
                <span>
                  {isRu ? "Показано:" : "Ko'rsatilmoqda:"} {(curPage - 1) * PAGE_SIZE + 1} – {Math.min(curPage * PAGE_SIZE, filtered.length)} / {filtered.length} {isRu ? "товаров" : "ta tovar"}
                </span>
                <div className="flex items-center justify-center flex-wrap gap-1.5">
                  <button
                    disabled={curPage === 1}
                    onClick={() => set({ page: curPage - 1 })}
                    aria-label="Oldingi"
                    className="h-9 px-3 rounded-xl border border-gray-200 bg-white font-bold hover:bg-gray-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    ‹ {isRu ? "Назад" : "Oldingi"}
                  </button>

                  {pageCount > 5 && curPage > 3 && (
                    <>
                      <button onClick={() => set({ page: 1 })} className="w-9 h-9 rounded-xl border border-gray-200 bg-white font-bold hover:bg-gray-50 flex items-center justify-center transition cursor-pointer">1</button>
                      <span className="px-1 text-gray-400 font-bold">...</span>
                    </>
                  )}

                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    let pNum = curPage - 2 + i;
                    if (curPage <= 3) pNum = i + 1;
                    else if (curPage >= pageCount - 2) pNum = pageCount - 4 + i;
                    if (pNum < 1 || pNum > pageCount) return null;
                    return (
                      <button
                        key={pNum}
                        onClick={() => set({ page: pNum })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13.5px] transition cursor-pointer ${
                          pNum === curPage ? "bg-[#e5252b] text-white shadow-xs" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  {pageCount > 5 && curPage < pageCount - 2 && (
                    <>
                      <span className="px-1 text-gray-400 font-bold">...</span>
                      <button onClick={() => set({ page: pageCount })} className="w-9 h-9 rounded-xl border border-gray-200 bg-white font-bold hover:bg-gray-50 flex items-center justify-center transition cursor-pointer">{pageCount}</button>
                    </>
                  )}

                  <button
                    disabled={curPage === pageCount}
                    onClick={() => set({ page: curPage + 1 })}
                    className="h-9 px-3 rounded-xl border border-gray-200 bg-white font-bold hover:bg-gray-50 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    {isRu ? "Вперед" : "Keyingisi"} ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
