import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { GROUPS } from "../lib/data";
import { translateCategory } from "../lib/translations";
import { useOverlay } from "../lib/hooks";

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

export default function CatalogModal({ onSelectGroup }) {
  const { isCatalogOpen, closeCatalog, lang, t } = useStore();
  const [selectedGroup, setSelectedGroup] = useState(Object.keys(GROUPS)[0]);
  const nav = useNavigate();

  // Unified scroll lock and ESC key handling
  useOverlay(isCatalogOpen, closeCatalog);

  if (!isCatalogOpen) return null;

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleFilterCategory = (group, sub = null) => {
    closeCatalog();
    if (onSelectGroup) {
      onSelectGroup(group, sub);
    } else {
      nav(
        sub
          ? `/products?group=${encodeURIComponent(group)}&sub=${encodeURIComponent(sub)}`
          : `/products?group=${encodeURIComponent(group)}`
      );
    }
  };

  const groupKeys = Object.keys(GROUPS);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={closeCatalog}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-150 w-full max-w-4xl max-h-[90vh] sm:max-h-[82vh] overflow-hidden z-10 animate-modal-pop flex flex-col">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-gray-150 flex items-center justify-between bg-gradient-to-r from-gray-50/90 via-white to-gray-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-red-50 text-[#e5252b] flex items-center justify-center">
              <span className="material-symbols-rounded text-[22px] sm:text-[24px]">widgets</span>
            </div>
            <div>
              <h2 className="text-[16px] sm:text-[18px] font-black text-gray-900 leading-tight">
                {t("catalogModalTitle")}
              </h2>
              <span className="text-[11px] sm:text-[12px] text-gray-500 font-medium">
                {lang === "ru" ? "9 категорий • 5 000+ товаров" : "9 ta asosiy toifa • 5 000+ mahsulot"}
              </span>
            </div>
          </div>

          <button
            onClick={closeCatalog}
            aria-label="Yopish"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Responsive Content: Left Category Bar + Right Subcategories */}
        <div className="flex-1 grid grid-cols-[110px_1fr] sm:grid-cols-[200px_1fr] md:grid-cols-[260px_1fr] overflow-hidden divide-x divide-gray-150">
          {/* Left: Category Navigation */}
          <div className="overflow-y-auto p-1.5 sm:p-3 space-y-1 bg-gray-50/80 no-scrollbar">
            {groupKeys.map((g) => {
              const active = selectedGroup === g;
              return (
                <button
                  key={g}
                  onClick={() => handleGroupClick(g)}
                  className={`w-full text-center sm:text-left p-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-[13.5px] font-bold flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-2.5 transition active:scale-95 cursor-pointer ${
                    active
                      ? "bg-[#e5252b] text-white shadow-md shadow-red-500/20 font-black"
                      : "hover:bg-gray-200/70 text-gray-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 truncate w-full">
                    <span className="text-xl sm:text-2xl shrink-0">{GROUP_ICONS[g] || "📦"}</span>
                    <span className="truncate leading-tight text-[10.5px] sm:text-[13px]">
                      {translateCategory(g, lang)}
                    </span>
                  </div>
                  <span className="material-symbols-rounded text-[18px] hidden sm:inline opacity-70">
                    chevron_right
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Subcategories Grid */}
          <div className="overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <h3 className="text-[14px] sm:text-[17px] font-black text-gray-900 flex items-center gap-2 truncate">
                  <span className="text-xl">{GROUP_ICONS[selectedGroup]}</span>
                  <span className="truncate">{translateCategory(selectedGroup, lang)}</span>
                </h3>

                <button
                  onClick={() => handleFilterCategory(selectedGroup)}
                  className="text-[12px] sm:text-[13px] font-extrabold text-[#e5252b] hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{t("viewAll")}</span>
                  <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Subcategories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                {GROUPS[selectedGroup]?.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleFilterCategory(selectedGroup, sub)}
                    className="p-3 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-[#e5252b] text-left text-[12.5px] sm:text-[13.5px] font-bold text-gray-800 border border-gray-150 hover:border-red-200 transition-all active:scale-98 cursor-pointer shadow-2xs flex items-center justify-between group"
                  >
                    <span className="truncate">{sub}</span>
                    <span className="material-symbols-rounded text-[16px] text-gray-400 group-hover:text-[#e5252b] shrink-0">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Banner Strip inside modal */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-3.5 sm:p-4 border border-red-150 flex items-center justify-between gap-3 mt-4">
              <div>
                <b className="text-[13px] sm:text-[14px] text-gray-900 block font-black">
                  {t("promoBannerTitle")}
                </b>
                <span className="text-[11.5px] sm:text-[12px] text-gray-600 block mt-0.5">
                  {t("promoBannerSubtitle")}
                </span>
              </div>
              <button
                onClick={() => {
                  closeCatalog();
                  if (onSelectGroup) onSelectGroup("all");
                  else nav("/products");
                }}
                className="px-3.5 sm:px-4 py-2 bg-[#e5252b] hover:bg-[#c81a20] text-white rounded-xl text-[12px] font-bold shrink-0 shadow-sm transition active:scale-95 cursor-pointer"
              >
                {t("view")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
