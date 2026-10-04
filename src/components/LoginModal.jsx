import { useState } from "react";
import { useStore } from "../lib/store";

export default function LoginModal({ onClose }) {
  const { login } = useStore();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const submitPhone = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 9) return;
    setStep(2);
  };
  const submitCode = (e) => {
    e.preventDefault();
    if (code.length < 4) return;
    setStep(3);
  };
  const finish = (e) => {
    e.preventDefault();
    login(phone, name.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[400px] p-7 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <span className="material-symbols-outlined">close</span>
        </button>

        {step === 1 && (
          <form onSubmit={submitPhone}>
            <h2 className="text-[20px] font-extrabold">Tizimga kirish</h2>
            <p className="text-[13px] text-gray-500 mt-1">Telefon raqamingizni kiriting, tasdiqlash kodi yuboramiz</p>
            <label className="block text-[12px] text-gray-500 mt-5 mb-1.5">Telefon raqam</label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#e5252b]">
              <span className="px-3 text-[14px] text-gray-500 bg-gray-50 h-[46px] flex items-center border-r border-gray-200">+998</span>
              <input autoFocus value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))} placeholder="90 123 45 67" className="flex-1 h-[46px] px-3 outline-none text-[14px]" />
            </div>
            <button type="submit" className="w-full h-[46px] mt-5 rounded-xl bg-[#e5252b] hover:bg-[#c71e24] text-white font-semibold transition">Kod olish</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitCode}>
            <h2 className="text-[20px] font-extrabold">SMS kodni kiriting</h2>
            <p className="text-[13px] text-gray-500 mt-1">+998 {phone} raqamiga yuborilgan 4 xonali kod (demo: har qanday kod)</p>
            <input autoFocus value={code} onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, "").slice(0, 4))} placeholder="••••" maxLength={4} className="w-full h-[52px] mt-5 text-center text-[24px] tracking-[10px] border border-gray-200 rounded-xl outline-none focus:border-[#e5252b]" />
            <button type="submit" className="w-full h-[46px] mt-5 rounded-xl bg-[#e5252b] hover:bg-[#c71e24] text-white font-semibold transition">Tasdiqlash</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={finish}>
            <h2 className="text-[20px] font-extrabold">Ismingiz</h2>
            <p className="text-[13px] text-gray-500 mt-1">Sizga qanday murojaat qilsak bo'ladi?</p>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" className="w-full h-[46px] mt-5 px-4 border border-gray-200 rounded-xl outline-none focus:border-[#e5252b] text-[14px]" />
            <button type="submit" className="w-full h-[46px] mt-5 rounded-xl bg-[#e5252b] hover:bg-[#c71e24] text-white font-semibold transition">Tugatish</button>
          </form>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-5">
          {[1, 2, 3].map((n) => <span key={n} className={`h-1.5 rounded-full transition-all ${n === step ? "w-6 bg-[#e5252b]" : "w-1.5 bg-gray-200"}`} />)}
        </div>
      </div>
    </div>
  );
}
