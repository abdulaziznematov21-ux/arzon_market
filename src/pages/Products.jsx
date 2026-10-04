import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { GROUPS, GROUP_ICON, GROUP_RANGES, PRODUCTS, searchProducts } from "../lib/data";

const PAGE_SIZE = 24;

export default function Products() {
  const [sp, setSp] = useSearchParams();
  const [view, setView] = useState("grid");
  const [priceOpen, setPriceOpen] = useState(true);

  const group = sp.get("group") || "";
  const sub = sp.get("sub") || "";
  const q = sp.get("q") || "";
  const sort = sp.get("sort") || "pop";
  const fast = sp.get("fast") === "1";
  const tomorrow = sp.get("tomorrow") === "1";
  const discountOnly = sp.get("discount") === "1";
  const minRating = sp.get("rating") || "";
  const brandsCsv = sp.get("brands") || "";
  const brands = brandsCsv ? brandsCsv.split(",") : [];
  const min = Number(sp.get("min") || 0);
  const max = Number(sp.get("max") || 0); // 0 = no cap
  const page = Number(sp.get("page") || 1);

  const set = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => ((v === "" || v === null || v === undefined || v === false) ? next.delete(k) : next.set(k, v)));
    if (!("page" in patch)) next.delete("page");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    setSp(next);
  };
  const toggleBrand = (b) => set({ brands: (brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b]).join(",") });

  // scope the base array before filtering, for speed at 100k scale
  const base = useMemo(() => {
    if (q.trim()) return searchProducts(q, 20000);
    if (group && GROUP_RANGES[group]) {
      const { start, end } = GROUP_RANGES[group];
      return PRODUCTS.slice(start, end);
    }
    return PRODUCTS;
  }, [q, group]);

  const sidebarBrands = useMemo(() => {
    const m = new Map();
    for (const p of base) m.set(p.brand, (m.get(p.brand) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  }, [base]);

  const subCounts = useMemo(() => {
    if (!group) return null;
    const m = new Map();
    for (const p of base) m.set(p.sub, (m.get(p.sub) || 0) + 1);
    return m;
  }, [base, group]);

  const filtered = useMemo(() => {
    let list = base.filter((p) => {
      if (sub && p.sub !== sub) return false;
      if (fast && p.delivery !== "fast") return false;
      if (tomorrow && p.delivery !== "tomorrow") return false;
      if (discountOnly && p.off < 10) return false;
      if (minRating && p.rating < Number(minRating)) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (min && p.price < min) return false;
      if (max && p.price > max) return false;
      return true;
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "discount") list = [...list].sort((a, b) => b.off - a.off);
    return list;
  }, [base, sub, fast, tomorrow, discountOnly, minRating, brandsCsv, min, max, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage = Math.min(Math.max(1, page), pageCount);
  const pageItems = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  const activeTags = [
    fast && ["⚡ 30 daqiqada", () => set({ fast: "" })],
    tomorrow && ["🚚 Ertaga", () => set({ tomorrow: "" })],
    discountOnly && ["🔥 Chegirmalar", () => set({ discount: "" })],
    minRating && [`★ ${minRating}+`, () => set({ rating: "" })],
    (min || max) && [`${min || 0} – ${max || "∞"} so'm`, () => set({ min: "", max: "" })],
    ...brands.map((b) => [b, () => toggleBrand(b)]),
    sub && [sub, () => set({ sub: "" })],
  ].filter(Boolean);

  const clearAll = () => setSp(group ? { group } : {});
  const title = q ? `"${q}" bo'yicha qidiruv natijalari` : sub || group || "Barcha mahsulotlar";

  return (
    <div className="bg-[#f9f9fa] min-h-screen pb-16">
      <div className="max-w-[1320px] mx-auto px-6 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500 flex-wrap">
          <Link to="/" className="hover:text-[#e5252b] flex items-center gap-1"><span className="material-symbols-outlined text-[15px]">home</span>Bosh sahifa</Link>
          <span>›</span>
          {group ? <button onClick={() => set({ group: "", sub: "" })} className="hover:text-[#e5252b]">{group}</button> : <span>Katalog</span>}
          {sub && <><span>›</span><span className="text-[#1a1a1a] font-medium">{sub}</span></>}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 mt-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[#111]">{title}</h1>
            <span className="bg-gray-100 text-gray-600 text-[13px] px-3 py-1 rounded-full">{filtered.length.toLocaleString("ru-RU")} ta tovar</span>
          </div>
          <div className="flex items-center gap-3">
            <select value={sort} onChange={(e) => set({ sort: e.target.value })} className="text-[13.5px] border border-gray-200 rounded-xl px-3 py-2.5 bg-white outline-none">
              <option value="pop">Saralash: Ommabopligi bo'yicha</option>
              <option value="price_asc">Narx: pastdan yuqoriga</option>
              <option value="price_desc">Narx: yuqoridan pastga</option>
              <option value="rating">Reyting bo'yicha</option>
              <option value="discount">Chegirma bo'yicha</option>
            </select>
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setView("grid")} className={`w-9 h-9 rounded-lg flex items-center justify-center ${view === "grid" ? "bg-white shadow-sm text-[#e5252b]" : "text-gray-400"}`}><span className="material-symbols-outlined text-[19px]">grid_view</span></button>
              <button onClick={() => setView("list")} className={`w-9 h-9 rounded-lg flex items-center justify-center ${view === "list" ? "bg-white shadow-sm text-[#e5252b]" : "text-gray-400"}`}><span className="material-symbols-outlined text-[19px]">view_list</span></button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start mt-5">
          <aside className="hidden lg:block w-[260px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 sticky top-[200px] max-h-[calc(100vh-220px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[14.5px] text-[#1a1a1a] flex items-center gap-1.5"><span className="material-symbols-outlined text-[19px]">tune</span>Filtrlar</span>
              <button onClick={clearAll} className="text-[12.5px] text-gray-400 hover:text-[#e5252b]">Tozalash</button>
            </div>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <h4 className="font-semibold text-[13.5px] text-[#1a1a1a] mb-3">Toifalar</h4>
              <div className="space-y-0.5">
                {!group && Object.keys(GROUPS).map((g) => (
                  <button key={g} onClick={() => set({ group: g, sub: "" })} className="w-full flex items-center justify-between text-[13.5px] px-2 py-1.5 rounded-lg text-[#333] hover:bg-gray-50 text-left">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[17px] text-gray-400">{GROUP_ICON[g]}</span>{g}</span>
                    <span className="text-gray-400">{(GROUP_RANGES[g].end - GROUP_RANGES[g].start).toLocaleString("ru-RU")}</span>
                  </button>
                ))}
                {group && GROUPS[group]?.map((s) => (
                  <button key={s} onClick={() => set({ sub: sub === s ? "" : s })} className={`w-full flex items-center justify-between text-[13.5px] px-2 py-1.5 rounded-lg text-left ${sub === s ? "bg-red-50 text-[#e5252b] font-medium" : "text-[#333] hover:bg-gray-50"}`}>
                    <span>{s}</span><span className={sub === s ? "text-[#e5252b]" : "text-gray-400"}>{(subCounts?.get(s) || 0).toLocaleString("ru-RU")}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <button onClick={() => setPriceOpen((v) => !v)} className="w-full flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[13.5px] text-[#1a1a1a]">Narx (so'm)</h4><span className="material-symbols-outlined text-[18px] text-gray-400">{priceOpen ? "expand_less" : "expand_more"}</span>
              </button>
              {priceOpen && <div className="flex items-center gap-2.5">
                <div className="flex-1"><label className="text-[10.5px] text-gray-400">DAN</label><input type="number" defaultValue={min || ""} onBlur={(e) => set({ min: e.target.value })} placeholder="0" className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-[#e5252b]" /></div>
                <div className="flex-1"><label className="text-[10.5px] text-gray-400">GACHA</label><input type="number" defaultValue={max || ""} onBlur={(e) => set({ max: e.target.value })} placeholder="500000" className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-[#e5252b]" /></div>
              </div>}
            </div>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <h4 className="font-semibold text-[13.5px] text-[#1a1a1a] mb-3">Yetkazib berish muddati</h4>
              <label className="flex items-center gap-2.5 text-[13.5px] py-1 cursor-pointer"><input type="checkbox" checked={fast} onChange={(e) => set({ fast: e.target.checked ? "1" : "" })} className="accent-[#e5252b] w-4 h-4" /><span className="material-symbols-outlined text-[16px] text-emerald-600">bolt</span>Bugun 30 daqiqada</label>
              <label className="flex items-center gap-2.5 text-[13.5px] py-1 cursor-pointer"><input type="checkbox" checked={tomorrow} onChange={(e) => set({ tomorrow: e.target.checked ? "1" : "" })} className="accent-[#e5252b] w-4 h-4" /><span className="material-symbols-outlined text-[16px] text-gray-400">local_shipping</span>Ertaga (1 kunda)</label>
            </div>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-[13.5px] text-[#1a1a1a]">Brendlar</h4>{brands.length > 0 && <span className="text-[11.5px] text-gray-400">{brands.length} tanlandi</span>}</div>
              <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                {sidebarBrands.map(([b, c]) => (
                  <label key={b} className="flex items-center justify-between text-[13.5px] cursor-pointer py-0.5">
                    <span className="flex items-center gap-2.5"><input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} className="accent-[#e5252b] w-4 h-4" />{b}</span>
                    <span className="text-gray-400 text-[12.5px]">{c.toLocaleString("ru-RU")}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pb-1">
              <label className="flex items-center gap-2.5 text-[13.5px] py-1 cursor-pointer"><input type="checkbox" checked={discountOnly} onChange={(e) => set({ discount: e.target.checked ? "1" : "" })} className="accent-[#e5252b] w-4 h-4" /><span className="material-symbols-outlined msf text-[16px] text-[#e5252b]">local_fire_department</span>Faqat chegirmali tovarlar</label>
              {["4.5", "4", "3.5"].map((r) => (
                <label key={r} className="flex items-center gap-2.5 text-[13.5px] py-1 cursor-pointer"><input type="radio" name="rating" checked={minRating === r} onChange={() => set({ rating: r })} className="accent-[#e5252b] w-4 h-4" /><span className="material-symbols-outlined msf text-[16px] text-amber-500">star</span>{r}+ reyting</label>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 mb-5 text-[13px]">
                <span className="font-medium text-[#333]">FAOL:</span>
                {activeTags.map(([label, fn], i) => (
                  <button key={i} onClick={fn} className="flex items-center gap-1.5 bg-gray-100 text-[#333] px-3 py-1.5 rounded-full hover:bg-gray-200">{label}<span className="material-symbols-outlined text-[14px]">close</span></button>
                ))}
                <button onClick={clearAll} className="text-[#e5252b] font-medium ml-1">Barchasini tozalash</button>
              </div>
            )}

            {pageItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center text-gray-500">
                <span className="material-symbols-outlined text-[52px] text-gray-300">search_off</span>
                <p className="mt-3">Hech narsa topilmadi. Filtrlarni o'zgartirib ko'ring.</p>
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
                {pageItems.map((p) => <ProductCard key={p.id} p={p} list={view === "list"} />)}
              </div>
            )}

            {pageCount > 1 && (
              <div className="flex items-center justify-between mt-10 text-[13.5px] text-gray-500 flex-wrap gap-3">
                <span>Ko'rsatilmoqda: {(curPage - 1) * PAGE_SIZE + 1} – {Math.min(curPage * PAGE_SIZE, filtered.length)} / {filtered.length.toLocaleString("ru-RU")} ta tovar</span>
                <div className="flex items-center gap-1.5">
                  <button disabled={curPage === 1} onClick={() => set({ page: curPage - 1 })} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                  {pageNumbers(curPage, pageCount).map((n, i) => n === "…" ? <span key={i} className="px-1 text-gray-400">…</span> : (
                    <button key={n} onClick={() => set({ page: n })} className={`w-9 h-9 rounded-lg flex items-center justify-center font-medium ${n === curPage ? "bg-[#e5252b] text-white" : "border border-gray-200 text-[#333] hover:bg-gray-50"}`}>{n}</button>
                  ))}
                  <button disabled={curPage === pageCount} onClick={() => set({ page: curPage + 1 })} className="h-9 px-3 rounded-lg border border-gray-200 flex items-center gap-1 disabled:opacity-40">Keyingisi<span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function pageNumbers(cur, total) {
  const out = [];
  const add = (n) => out.push(n);
  add(1);
  if (cur > 3) add("…");
  for (let n = Math.max(2, cur - 1); n <= Math.min(total - 1, cur + 1); n++) add(n);
  if (cur < total - 2) add("…");
  if (total > 1) add(total);
  return [...new Set(out)];
}
