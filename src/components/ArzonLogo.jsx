export function ArzonIcon({ size = 44, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      {/* Red Squircle Background */}
      <rect width="100" height="100" rx="26" fill="#e01a22" />

      {/* Shopping Bag Handle (White Arch) */}
      <path
        d="M37 38 V28 C37 20.8 42.8 15 50 15 C57.2 15 63 20.8 63 28 V38"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Shopping Bag Body (White Rounded Trapezoid) */}
      <path
        d="M28 38 H72 C74.8 38 77 40.2 77.3 43 L81.3 75 C81.7 78.8 78.6 82 74.7 82 H25.3 C21.4 82 18.3 78.8 18.7 75 L22.7 43 C23 40.2 25.2 38 28 38 Z"
        fill="#ffffff"
      />

      {/* Letter 'A' in the Center of Bag (Red) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 49 L39.5 74 H44.8 L47.1 68 H52.9 L55.2 74 H60.5 L50 49 Z M48.2 64 L50 57.2 L51.8 64 H48.2 Z"
        fill="#e01a22"
      />
    </svg>
  );
}

export default function ArzonLogo({ size = "default", light = false }) {
  const isSmall = size === "small";
  const isLarge = size === "large";

  const iconSize = isSmall ? 32 : isLarge ? 54 : 40;
  const iconResponsiveClass = isSmall
    ? "w-8 h-8"
    : isLarge
    ? "w-[54px] h-[54px]"
    : "w-[34px] h-[34px] sm:w-[42px] sm:h-[42px]";

  const arzonClass = isSmall
    ? "text-[19px]"
    : isLarge
    ? "text-[32px]"
    : "text-[21px] sm:text-[26px]";

  const marketClass = isSmall
    ? "text-[7.5px]"
    : isLarge
    ? "text-[12.5px]"
    : "text-[8px] sm:text-[10px]";

  const redColor = "#e01a22";

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none shrink-0">
      <ArzonIcon size={iconSize} className={iconResponsiveClass} />
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black tracking-[-0.02em] leading-none ${arzonClass}`}
          style={{ color: redColor }}
        >
          Arzon
        </span>
        <span
          className={`font-black uppercase leading-none mt-1 sm:mt-1.5 ${marketClass}`}
          style={{
            color: redColor,
            letterSpacing: "0.34em",
            marginRight: "-0.34em",
          }}
        >
          MARKET
        </span>
      </div>
    </div>
  );
}
