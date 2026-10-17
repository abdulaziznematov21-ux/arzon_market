export function UzumIcon({ size = 38, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id="uzumBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#7000FF" />
        </linearGradient>
        <filter id="berryShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4a00aa" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded soft badge background */}
      <rect width="100" height="100" rx="26" fill="url(#uzumBgGrad)" />

      {/* Stylized Uzum Grape Berries (7 dots) */}
      {/* Row 1 (top 2 berries) */}
      <circle cx="39" cy="35" r="11" fill="#ffffff" filter="url(#berryShadow)" />
      <circle cx="61" cy="35" r="11" fill="#ffffff" filter="url(#berryShadow)" />

      {/* Row 2 (middle 3 berries) */}
      <circle cx="28" cy="54" r="11" fill="#ffffff" filter="url(#berryShadow)" />
      <circle cx="50" cy="54" r="11" fill="#ffffff" filter="url(#berryShadow)" />
      <circle cx="72" cy="54" r="11" fill="#ffffff" filter="url(#berryShadow)" />

      {/* Row 3 (bottom 2 berries) */}
      <circle cx="39" cy="73" r="11" fill="#ffffff" filter="url(#berryShadow)" />
      <circle cx="61" cy="73" r="11" fill="#ffffff" filter="url(#berryShadow)" />

      {/* Subtle glossy highlights */}
      <circle cx="36" cy="32" r="3.5" fill="#f4ecff" opacity="0.9" />
      <circle cx="58" cy="32" r="3.5" fill="#f4ecff" opacity="0.9" />
      <circle cx="47" cy="51" r="3.5" fill="#f4ecff" opacity="0.9" />
    </svg>
  );
}

export default function UzumLogo({ size = "default", light = false, showTagline = true }) {
  const iconSize = size === "small" ? 32 : size === "large" ? 46 : 40;
  const textSize = size === "small" ? "text-[18px]" : size === "large" ? "text-[26px]" : "text-[22px]";

  return (
    <div className="flex items-center gap-2.5 select-none">
      <UzumIcon size={iconSize} />
      <div className="leading-none flex flex-col justify-center">
        <div className={`font-black tracking-tight flex items-baseline gap-1.5 ${textSize}`}>
          <span className="text-[#7000FF] font-black lowercase">uzum</span>
          <span className={`${light ? "text-white" : "text-[#1f2026]"} font-extrabold lowercase`}>market</span>
        </div>
        {showTagline && (
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7000FF]"></span>
            <span>1 kunda yetkazish</span>
          </div>
        )}
      </div>
    </div>
  );
}
