import { useState, useEffect, useRef } from "react";
import { useStore } from "../lib/store";
import { useOverlay } from "../lib/hooks";
import { CITIES } from "../lib/data";

// Uzbek Mobile Operators
const OPERATORS = [
  { prefix: ["90", "91"], name: "Beeline", badge: "bg-amber-100 text-amber-900 border-amber-300" },
  { prefix: ["93", "94", "50"], name: "Ucell", badge: "bg-purple-100 text-purple-900 border-purple-300" },
  { prefix: ["97", "88"], name: "Mobiuz", badge: "bg-red-100 text-red-900 border-red-300" },
  { prefix: ["99", "95", "77"], name: "Uztelecom", badge: "bg-blue-100 text-blue-900 border-blue-300" },
  { prefix: ["33"], name: "Humans", badge: "bg-emerald-100 text-emerald-900 border-emerald-300" },
];

function getOperator(digits) {
  if (!digits || digits.length < 2) return null;
  const p = digits.slice(0, 2);
  return OPERATORS.find((op) => op.prefix.includes(p)) || null;
}

export default function LoginModal({ onClose }) {
  const { login, city, setCity, address, setAddress, loginReason, toast } = useStore();

  // Mode: 'sms' or 'password'
  const [authMode, setAuthMode] = useState("sms");

  // Step for SMS mode: 1 (Phone), 2 (OTP SMS), 3 (Profile for new users)
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [name, setName] = useState("");
  const [selectedCity, setSelectedCity] = useState(city || "Toshkent");
  const [userAddress, setUserAddress] = useState(address || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [smsToast, setSmsToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Lock body scroll and handle ESC key
  useOverlay(true, onClose);

  // Timer countdown for OTP
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Clean and format Uzbek phone input
  const handlePhoneChange = (val) => {
    setErrorMsg("");
    let raw = val.replace(/\D/g, "");
    // If user pastes phone starting with country code 998
    if (raw.startsWith("998") && raw.length > 9) {
      raw = raw.slice(3);
    }
    setPhone(raw.slice(0, 9));
  };

  const formattedDisplayPhone = (pDigits = phone) => {
    if (!pDigits) return "";
    let res = "";
    if (pDigits.length > 0) res += `(${pDigits.slice(0, 2)}`;
    if (pDigits.length >= 2) res += `) `;
    if (pDigits.length > 2) res += pDigits.slice(2, 5);
    if (pDigits.length >= 5) res += `-${pDigits.slice(5, 7)}`;
    if (pDigits.length >= 7) res += `-${pDigits.slice(7, 9)}`;
    return res;
  };

  const detectedOperator = getOperator(phone);

  const sendRealSms = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedCode(code);
    setSmsToast(`📲 Yangi SMS: Arzon Market kirish kodi: ${code}. Begonalarga bermang!`);
    toast(`Tasdiqlash kodi yuborildi: ${code} 📲`);
  };

  // Submit phone in SMS mode
  const submitPhone = (e) => {
    e?.preventDefault();
    if (phone.length < 9) {
      setErrorMsg("Iltimos, 9 xonali telefon raqamingizni to'liq kiriting");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      sendRealSms();
      setStep(2);
      setTimer(59);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0].current?.focus(), 150);
    }, 300);
  };

  // Quick 1-click test accounts
  const pickTestAccount = (testPhone, testName, testCity) => {
    setPhone(testPhone);
    setName(testName);
    setSelectedCity(testCity);
    setErrorMsg("");
    if (authMode === "password") {
      setPassword("password123");
    }
  };

  const instantLogin = (testPhone, testName, testCity) => {
    login(testPhone, testName, { city: testCity });
    toast(`Xush kelibsiz, ${testName}! 👋`);
    onClose();
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrorMsg("");

    if (digit && index < 3) {
      otpRefs[index + 1].current?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      verifyOtpCode(newOtp.join(""));
    }
  };

  // Handle Paste event on OTP boxes (handles pasting "8492" properly!)
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pastedText) return;

    const digits = pastedText.split("");
    const newOtp = ["", "", "", ""];
    digits.forEach((d, i) => {
      if (i < 4) newOtp[i] = d;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, 3);
    otpRefs[nextIndex].current?.focus();

    if (digits.length === 4) {
      verifyOtpCode(pastedText);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Verify OTP Code
  const verifyOtpCode = (enteredCode) => {
    if (enteredCode === generatedCode || enteredCode === "1111" || enteredCode === "8492") {
      setIsLoading(true);
      setErrorMsg("");

      setTimeout(() => {
        setIsLoading(false);
        // Check if user already registered in users DB
        try {
          const db = JSON.parse(localStorage.getItem("am_users_db") || "{}");
          const existingUser = db[phone];
          if (existingUser && existingUser.name) {
            // Already registered returning user! Log in straight away!
            login(phone, existingUser.name, {
              city: existingUser.city || selectedCity,
              address: existingUser.address || userAddress,
            });
            onClose();
            return;
          }
        } catch {
          /* ignore */
        }

        // New user: ask for name & city
        setStep(3);
      }, 400);
    } else {
      setErrorMsg("Kiritilgan SMS kod noto'g'ri. Qayta tekshirib kiriting.");
    }
  };

  const resendCode = () => {
    if (!canResend) return;
    setOtp(["", "", "", ""]);
    setErrorMsg("");
    sendRealSms();
    setTimer(59);
    setCanResend(false);
    otpRefs[0].current?.focus();
  };

  const autoFillOtp = () => {
    const codeToUse = generatedCode || "1111";
    const digits = codeToUse.split("");
    setOtp(digits);
    setSmsToast("");
    verifyOtpCode(codeToUse);
  };

  // Finish Registration (Step 3)
  const finishRegistration = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Iltimos, ismingizni kiriting");
      return;
    }
    setCity(selectedCity);
    if (userAddress.trim()) setAddress(userAddress.trim());
    login(phone, name.trim(), {
      city: selectedCity,
      address: userAddress.trim(),
    });
    onClose();
  };

  // Submit in Password Mode
  const submitPasswordLogin = (e) => {
    e.preventDefault();
    if (phone.length < 9) {
      setErrorMsg("Iltimos, 9 xonali telefon raqamingizni to'liq kiriting");
      return;
    }
    if (!password) {
      setErrorMsg("Iltimos, parolingizni kiriting");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsLoading(false);
      try {
        const db = JSON.parse(localStorage.getItem("am_users_db") || "{}");
        const existing = db[phone];
        const userName = existing?.name || name || "Xaridor";
        login(phone, userName, {
          city: existing?.city || selectedCity,
          address: existing?.address || userAddress,
          password,
        });
        onClose();
      } catch {
        login(phone, name || "Xaridor", { city: selectedCity, password });
        onClose();
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* High Quality Backdrop Blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Realistic Native Incoming SMS Notification Banner */}
      {smsToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] bg-gray-950/95 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-slide-down max-w-md w-[calc(100vw-2rem)] text-[13px] font-semibold">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded text-[20px]">sms</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SMS xabar • Hozir</div>
            <div className="truncate text-gray-100">{smsToast}</div>
          </div>
          <button
            onClick={autoFillOtp}
            className="text-[11.5px] font-black bg-[#e5252b] hover:bg-[#c81a20] px-3 py-1.5 rounded-xl text-white shrink-0 cursor-pointer shadow-md shadow-red-500/30 active:scale-95 transition"
          >
            Kiritish
          </button>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-[440px] overflow-hidden z-10 animate-modal-pop my-auto">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#e5252b] flex items-center justify-center font-bold shadow-xs border border-red-100">
              <span className="material-symbols-rounded text-[24px]">verified_user</span>
            </div>
            <div>
              <h2 className="text-[17px] font-black text-gray-900 leading-tight">
                Arzon Market
              </h2>
              <span className="text-[12px] text-gray-500 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Rasmiy xavfsiz kirish</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Reason Alert (e.g. When trying to add to cart or like without logging in) */}
        {typeof loginReason === "string" && loginReason.trim() ? (
          <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 flex items-center gap-2 text-[12.5px] font-bold text-amber-900">
            <span className="material-symbols-rounded text-amber-600 text-[18px]">lock</span>
            <span>{loginReason}</span>
          </div>
        ) : null}

        {/* Login Method Tabs */}
        {step === 1 && (
          <div className="px-5 sm:px-6 pt-4 pb-1">
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl text-[13px] font-black text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("sms");
                  setErrorMsg("");
                }}
                className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === "sms"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "hover:text-gray-900"
                }`}
              >
                <span className="material-symbols-rounded text-[16px]">sms</span>
                <span>SMS orqali</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("password");
                  setErrorMsg("");
                }}
                className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === "password"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "hover:text-gray-900"
                }`}
              >
                <span className="material-symbols-rounded text-[16px]">key</span>
                <span>Parol bilan</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 pt-4">

          {/* MODE 1: SMS FLOW */}
          {authMode === "sms" && (
            <>
              {/* STEP 1: Enter Phone Number */}
              {step === 1 && (
                <form onSubmit={submitPhone} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[13px] font-extrabold text-gray-800">
                        Telefon raqamingiz
                      </label>
                      {detectedOperator && (
                        <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-full border ${detectedOperator.badge}`}>
                          {detectedOperator.name}
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center bg-gray-50 border-2 border-gray-200 focus-within:border-[#e5252b] rounded-2xl h-[52px] px-3.5 transition-all">
                      <div className="flex items-center gap-1.5 pr-2.5 border-r border-gray-300 shrink-0">
                        <span className="text-[16px]">🇺🇿</span>
                        <span className="text-[15px] font-extrabold text-gray-800">+998</span>
                      </div>
                      <input
                        type="tel"
                        autoFocus
                        value={formattedDisplayPhone()}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(90) 123-45-67"
                        className="flex-1 min-w-0 bg-transparent pl-3 text-[16px] font-black text-gray-900 outline-none tracking-wide"
                      />
                      {phone.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setPhone("")}
                          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-[18px]">close</span>
                        </button>
                      )}
                    </div>

                    {errorMsg && (
                      <p className="text-[12px] text-[#e5252b] font-bold mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-rounded text-[14px]">error</span>
                        <span>{errorMsg}</span>
                      </p>
                    )}

                    <p className="text-[11.5px] text-gray-500 mt-2">
                      Raqamingizga bepul 4 xonali SMS tasdiqlash kodi yuboriladi.
                    </p>
                  </div>

                  {/* 1-Click Fast Test Accounts */}
                  <div className="pt-1 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Tezkor sinov hisobi (1 bosishda):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => instantLogin("901234567", "Abdulaziz Nematov", "Toshkent")}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#e5252b] text-[12px] font-black transition cursor-pointer border border-red-200"
                      >
                        ⚡ Abdulaziz (Darhol kirish)
                      </button>
                      <button
                        type="button"
                        onClick={() => instantLogin("939876543", "Malika Karimova", "Samarqand")}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[12px] font-bold transition cursor-pointer border border-gray-200"
                      >
                        ⚡ Malika (Darhol kirish)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={phone.length < 9 || isLoading}
                    className={`w-full h-[52px] rounded-2xl font-black text-[15px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      phone.length >= 9 && !isLoading
                        ? "bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 text-white shadow-lg shadow-red-500/25 active:scale-95"
                        : "bg-gray-150 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>SMS kodni olish</span>
                        <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: SMS OTP Code Input */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-[13.5px] text-gray-600">
                      <b>+998 {formattedDisplayPhone()}</b> raqamiga yuborilgan 4 xonali kodni kiriting
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setErrorMsg("");
                      }}
                      className="text-[12px] text-[#e5252b] font-bold hover:underline mt-1 cursor-pointer inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-rounded text-[14px]">edit</span>
                      <span>Raqamni o'zgartirish</span>
                    </button>
                  </div>

                  {/* 4 Digit OTP Inputs with onPaste support */}
                  <div className="flex justify-center gap-3 py-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        type="tel"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onPaste={handleOtpPaste}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-13 h-14 rounded-2xl bg-gray-50 border-2 text-center font-black text-2xl text-gray-900 outline-none transition shadow-xs ${
                          errorMsg
                            ? "border-red-400 bg-red-50/50"
                            : digit
                            ? "border-[#e5252b] bg-white"
                            : "border-gray-200 focus:border-[#e5252b]"
                        }`}
                      />
                    ))}
                  </div>

                  {/* 1-Click Code Autofill Pill */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={autoFillOtp}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#e5252b] text-[12px] font-extrabold transition cursor-pointer border border-red-200"
                    >
                      <span className="material-symbols-rounded text-[16px]">touch_app</span>
                      <span>Tasdiqlash kodi: <b>{generatedCode || "1111"}</b> (bosing)</span>
                    </button>
                  </div>

                  {errorMsg && (
                    <p className="text-[12px] text-[#e5252b] font-bold text-center flex items-center justify-center gap-1">
                      <span className="material-symbols-rounded text-[14px]">error</span>
                      <span>{errorMsg}</span>
                    </p>
                  )}

                  {/* Resend Countdown */}
                  <div className="text-center text-[12.5px] pt-1">
                    {canResend ? (
                      <button
                        onClick={resendCode}
                        className="text-[#e5252b] font-black hover:underline cursor-pointer"
                      >
                        Kodni qayta yuborish
                      </button>
                    ) : (
                      <span className="text-gray-400 font-medium">
                        Kodni qayta yuborish: <b className="text-gray-700">{timer}s</b>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Complete Profile for New User */}
              {step === 3 && (
                <form onSubmit={finishRegistration} className="space-y-4">
                  <div className="text-center pb-1">
                    <span className="inline-block p-2 rounded-2xl bg-emerald-50 text-emerald-600 mb-1">
                      <span className="material-symbols-rounded text-[24px]">how_to_reg</span>
                    </span>
                    <h3 className="text-[15px] font-black text-gray-900">
                      Raqamingiz tasdiqlandi!
                    </h3>
                    <p className="text-[12px] text-gray-500">
                      Buyurtmalarni tezkor yetkazish uchun ma'lumotlaringizni to'ldiring:
                    </p>
                  </div>

                  <div>
                    <label className="text-[13px] font-extrabold text-gray-800 block mb-1">
                      Ismingiz va familiyangiz *
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masalan: Abdulaziz Nematov"
                      className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#e5252b] rounded-2xl h-[50px] px-3.5 text-[14.5px] font-bold text-gray-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[13px] font-extrabold text-gray-800 block mb-1">
                      Yetkazib berish shahri
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#e5252b] rounded-2xl h-[50px] px-3 text-[14px] font-bold text-gray-900 outline-none"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[13px] font-extrabold text-gray-800 block mb-1">
                      Yetkazib berish manzili
                    </label>
                    <input
                      type="text"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      placeholder="Masalan: Chilonzor 19-mavze, 42-uy"
                      className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#e5252b] rounded-2xl h-[50px] px-3.5 text-[14px] font-bold text-gray-900 outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-[12px] text-[#e5252b] font-bold">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full h-[52px] rounded-2xl font-black text-[15px] bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-95 text-white shadow-lg shadow-red-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Ro'yxatdan o'tish va kirish</span>
                    <span className="material-symbols-rounded text-[18px]">check</span>
                  </button>
                </form>
              )}
            </>
          )}

          {/* MODE 2: PASSWORD FLOW */}
          {authMode === "password" && (
            <form onSubmit={submitPasswordLogin} className="space-y-4">
              <div>
                <label className="text-[13px] font-extrabold text-gray-800 block mb-1.5">
                  Telefon raqamingiz
                </label>
                <div className="relative flex items-center bg-gray-50 border-2 border-gray-200 focus-within:border-[#e5252b] rounded-2xl h-[50px] px-3.5 transition-all">
                  <span className="text-[15px] font-extrabold text-gray-800 pr-2.5 border-r border-gray-300">
                    +998
                  </span>
                  <input
                    type="tel"
                    autoFocus
                    value={formattedDisplayPhone()}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(90) 123-45-67"
                    className="flex-1 min-w-0 bg-transparent pl-3 text-[15px] font-black text-gray-900 outline-none tracking-wide"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[13px] font-extrabold text-gray-800">
                    Parol
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("sms");
                      setErrorMsg("");
                    }}
                    className="text-[11.5px] text-[#e5252b] font-bold hover:underline cursor-pointer"
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div className="relative flex items-center bg-gray-50 border-2 border-gray-200 focus-within:border-[#e5252b] rounded-2xl h-[50px] px-3.5 transition-all">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    className="flex-1 min-w-0 bg-transparent text-[14.5px] font-bold text-gray-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Sinov uchun standart parol: <b>password123</b>
                </p>
              </div>

              {errorMsg && (
                <p className="text-[12px] text-[#e5252b] font-bold flex items-center gap-1">
                  <span className="material-symbols-rounded text-[14px]">error</span>
                  <span>{errorMsg}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] rounded-2xl font-black text-[15px] bg-gradient-to-r from-[#e5252b] to-[#c81a20] hover:brightness-105 active:scale-95 text-white shadow-lg shadow-red-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Tizimga kirish</span>
                    <span className="material-symbols-rounded text-[18px]">login</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 border-t border-gray-100 p-3.5 text-center text-[11px] text-gray-500">
          Davom etish orqali siz{" "}
          <span className="text-gray-800 font-bold underline cursor-pointer">
            Foydalanish shartlari
          </span>{" "}
          va maxfiylik siyosatiga rozilik bildirasiz.
        </div>

      </div>
    </div>
  );
}
