import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { GROUPS } from "../lib/data";
import { translateCategory } from "../lib/translations";

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

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCatalogOpen) closeCatalog();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCatalogOpen, closeCatalog]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isCatalogOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCatalogOpen]);

  if (!isCatalogOpen) return null;

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleFilterCategory = (group, sub = null) => {
    closeCatalog();
    if (onSelectGroup) {
      onSelectGroup(group, sub);
    } else {
      nav(sub ? `/products?group=${encodeURIComponent(group)}&sub=${encodeURIComponent(sub)}` : `/products?group=${encodeURIComponent(group)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={closeCatalog} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[88vh] sm:max-h-[80vh] overflow-hidden z-10 animate-modal-pop flex flex-col">
        
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[22px] text-[#e5252b]">grid_view</span>
            <h2 className="text-[16px] sm:text-[18px] font-black text-gray-900">{t("catalogModalTitle")}</h2>
          </div>
          <button
            onClick={closeCatalog}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            <span className="material-symbols-rounded text-[18px] sm:text-[20px]">close</span>
          </button>
        </div>

        {/* Content: Left Category List + Right Subcategories */}
        <div className="flex-1 grid grid-cols-[105px_1fr] sm:grid-cols-[180px_1fr] md:grid-cols-[280px_1fr] overflow-hidden divide-x divide-gray-150">
          
          {/* Left Groups */}
          <div className="overflow-y-auto p-1.5 sm:p-3 space-y-1 bg-gray-50/70 no-scrollbar">
            {Object.keys(GROUPS).map((g) => (
              <button
                key={g}
                onClick={() => handleGroupClick(g)}
                className={`w-full text-center sm:text-left p-2 sm:px-3.5 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-[14px] font-bold flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-3 transition cursor-pointer ${
                  selectedGroup === g
                    ? "bg-[#e5252b] text-white shadow-xs font-black"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 truncate w-full">
                  <span className="text-xl sm:text-2xl shrink-0">{GROUP_ICONS[g] || "📦"}</span>
                  <span className="truncate leading-tight text-[10px] sm:text-[13.5px]">{translateCategory(g, lang)}</span>
                </div>
                <span className="material-symbols-rounded text-[18px] hidden sm:inline">chevron_right</span>
              </button>
            ))}
          </div>

          {/* Right Subcategories & Quick Link */}
          <div className="overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-[14px] sm:text-[17px] font-black text-gray-900 flex items-center gap-1.5 sm:gap-2 truncate">
                  <span>{GROUP_ICONS[selectedGroup]}</span>
                  <span className="truncate">{translateCategory(selectedGroup, lang)}</span>
                </h3>
                <button
                  onClick={() => handleFilterCategory(selectedGroup)}
                  className="text-[12px] sm:text-[13px] font-bold text-[#e5252b] hover:underline shrink-0"
                >
                  {t("viewAll")} ›
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                {GROUPS[selectedGroup]?.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleFilterCategory(selectedGroup, sub)}
                    className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-[#e5252b] text-left text-[12px] sm:text-[13px] font-semibold text-gray-800 border border-gray-150 hover:border-red-200 transition cursor-pointer"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo banner strip */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-4 border border-red-150 flex items-center justify-between gap-3">
              <div>
                <b className="text-[14px] text-gray-900 block font-black">
                  {t("promoBannerTitle")}
                </b>
                <span className="text-[12px] text-gray-600">
                  {t("promoBannerSubtitle")}
                </span>
              </div>
              <button
                onClick={() => {
                  closeCatalog();
                  if (onSelectGroup) onSelectGroup("all");
                }}
                className="px-4 py-2 bg-[#e5252b] text-white rounded-xl text-[12px] font-bold shrink-0 hover:bg-[#c81a20] transition"
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
