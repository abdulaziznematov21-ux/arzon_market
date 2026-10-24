import { useState, useEffect } from "react";
import { useStore } from "../lib/store";
import { useOverlay } from "../lib/hooks";
import { CITIES } from "../lib/data";

export default function ProfileModal() {
  const {
    user,
    logout,
    city,
    address,
    isProfileOpen,
    closeProfile,
    openOrders,
    openFavorites,
    orders,
    favs,
    updateUserProfile,
  } = useStore();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [selectedCity, setSelectedCity] = useState(user?.city || city || "Toshkent");
  const [userAddress, setUserAddress] = useState(user?.address || address || "");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSelectedCity(user.city || city || "Toshkent");
      setUserAddress(user.address || address || "");
    }
  }, [user, city, address]);

  useOverlay(isProfileOpen, closeProfile);

  if (!isProfileOpen || !user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateUserProfile({
      name: name.trim(),
      city: selectedCity,
      address: userAddress.trim(),
    });
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={closeProfile}
      />

      {/* Profile Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-150 w-full max-w-[480px] overflow-hidden z-10 animate-modal-pop my-auto">
        
        {/* Banner with Arzon red gradient */}
        <div className="h-28 bg-gradient-to-r from-[#e5252b] via-[#c81a20] to-rose-600 relative p-4 flex items-start justify-between text-white">
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-rounded text-[15px] text-amber-300">verified</span>
            <span>Tasdiqlangan xaridor hisobi</span>
          </div>

          <button
            onClick={closeProfile}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <span className="material-symbols-rounded text-[18px]">close</span>
          </button>
        </div>

        {/* User Avatar & Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="w-22 h-22 rounded-3xl bg-white p-1.5 shadow-xl border border-gray-100 shrink-0">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#e5252b] to-rose-500 text-white flex items-center justify-center font-black text-3xl shadow-inner">
                {user.avatar || user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <button
              onClick={() => setEditMode((v) => !v)}
              className="px-4 py-2 rounded-xl text-[12.5px] font-black border border-gray-200 hover:bg-gray-50 text-gray-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-rounded text-[16px]">
                {editMode ? "visibility" : "edit"}
              </span>
              <span>{editMode ? "Ko'rish" : "Tahrirlash"}</span>
            </button>
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
                  <span className="material-symbols-rounded text-emerald-500 text-[20px]" title="Tasdiqlangan">
                    check_circle
                  </span>
                </div>
                <div className="text-[13.5px] text-gray-500 font-mono mt-0.5">
                  {user.phone}
                </div>
              </div>

              {/* Arzon Club Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-amber-50/60 border border-red-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-black text-[#e5252b] uppercase tracking-wider">
                    Arzon Club Imtiyozlari
                  </div>
                  <div className="text-[15px] font-black text-gray-900 mt-0.5">
                    15 000 so'm keshbek
                  </div>
                  <div className="text-[11.5px] text-gray-600 mt-0.5">
                    0-0-12 muddatli to'lovga ruxsat berilgan
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-red-100 flex items-center justify-center text-[#e5252b]">
                  <span className="material-symbols-rounded text-[26px]">stars</span>
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-2 text-[13px] bg-gray-50 p-3.5 rounded-2xl border border-gray-150">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] text-gray-400">location_on</span>
                    <span>Shahar:</span>
                  </span>
                  <b className="text-gray-900">{user.city || city || "Toshkent"}</b>
                </div>
                <div className="flex items-start justify-between text-gray-600 pt-1 border-t border-gray-200/60">
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-rounded text-[16px] text-gray-400">home</span>
                    <span>Yetkazish manzili:</span>
                  </span>
                  <span className="text-right text-gray-900 font-medium pl-3 truncate">
                    {user.address || address || "Kiritilmagan"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600 pt-1 border-t border-gray-200/60 text-[12px]">
                  <span>A'zo bo'lgan vaqt:</span>
                  <span className="text-gray-500 font-medium">{user.joined || "Oktabr 2026"}</span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    closeProfile();
                    openOrders();
                  }}
                  className="p-3 rounded-2xl border border-gray-200 hover:border-[#e5252b] hover:bg-red-50/50 transition text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-gray-400 group-hover:text-[#e5252b] mb-1">
                    <span className="material-symbols-rounded text-[20px]">receipt_long</span>
                    <span className="text-[12px] font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  </div>
                  <div className="text-[13px] font-extrabold text-gray-800">Buyurtmalarim</div>
                  <div className="text-[11px] text-gray-500">Holatini kuzatish</div>
                </button>

                <button
                  onClick={() => {
                    closeProfile();
                    openFavorites();
                  }}
                  className="p-3 rounded-2xl border border-gray-200 hover:border-[#e5252b] hover:bg-red-50/50 transition text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-gray-400 group-hover:text-[#e5252b] mb-1">
                    <span className="material-symbols-rounded text-[20px]">favorite</span>
                    <span className="text-[12px] font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                      {favs.length}
                    </span>
                  </div>
                  <div className="text-[13px] font-extrabold text-gray-800">Saralanganlar</div>
                  <div className="text-[11px] text-gray-500">Saqlangan tovarlar</div>
                </button>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="w-full h-[46px] rounded-2xl border border-red-200 hover:bg-red-50 text-[#e5252b] font-black text-[13.5px] transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-rounded text-[18px]">logout</span>
                <span>Hisobdan chiqish</span>
              </button>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleSave} className="space-y-3.5">
              <h3 className="text-[15px] font-black text-gray-900 mb-2">
                Profil ma'lumotlarini tahrirlash
              </h3>

              <div>
                <label className="text-[12.5px] font-bold text-gray-700 block mb-1">
                  Ismingiz va familiyangiz
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#e5252b] rounded-xl h-[46px] px-3.5 text-[14px] font-bold text-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-bold text-gray-700 block mb-1">
                  Asosiy shahar
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#e5252b] rounded-xl h-[46px] px-3 text-[14px] font-bold text-gray-900 outline-none"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[12.5px] font-bold text-gray-700 block mb-1">
                  Yetkazib berish manzili
                </label>
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="Masalan: Chilonzor 19-mavze, 42-uy"
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#e5252b] rounded-xl h-[46px] px-3.5 text-[14px] font-bold text-gray-900 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 h-[46px] rounded-xl border border-gray-200 font-bold text-[13.5px] text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[46px] rounded-xl bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-95 text-white font-black text-[13.5px] transition cursor-pointer shadow-md shadow-red-500/20"
                >
                  Saqlash
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
