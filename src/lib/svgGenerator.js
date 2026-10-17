/**
 * Generates standalone, rich SVG Data URIs for products based on category, brand, and title.
 * Completely offline-safe, instant loading, 0ms network latency, never breaks.
 */

const CATEGORY_THEMES = {
  "Telefon va aksessuarlar": {
    bgFrom: "#1e1b4b",
    bgTo: "#0f172a",
    accent: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeColor: "#38bdf8",
    icon: `
      <!-- Smartphone Art -->
      <g transform="translate(145, 110)">
        <rect x="0" y="0" width="110" height="190" rx="20" fill="#0f172a" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))" />
        <rect x="6" y="8" width="98" height="174" rx="14" fill="#1e293b" />
        <!-- Screen Gradient -->
        <rect x="10" y="16" width="90" height="158" rx="10" fill="url(#screenGrad)" opacity="0.85" />
        <!-- Dynamic Island / Camera -->
        <rect x="35" y="10" width="40" height="7" rx="3.5" fill="#020617" />
        <circle cx="65" cy="13.5" r="2" fill="#38bdf8" opacity="0.8" />
        <!-- Screen elements -->
        <circle cx="55" cy="80" r="26" fill="#38bdf8" opacity="0.25" />
        <path d="M42 80 L50 88 L68 70" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="25" y="125" width="60" height="6" rx="3" fill="#ffffff" opacity="0.4" />
        <rect x="35" y="137" width="40" height="4" rx="2" fill="#94a3b8" opacity="0.4" />
      </g>
    `
  },
  "Texnika & Kompyuterlar": {
    bgFrom: "#18181b",
    bgTo: "#09090b",
    accent: "#a855f7",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    badgeColor: "#c084fc",
    icon: `
      <!-- Laptop / Tech Art -->
      <g transform="translate(115, 120)">
        <!-- Screen Lid -->
        <rect x="25" y="10" width="120" height="85" rx="8" fill="#18181b" stroke="#a855f7" stroke-width="2.5" />
        <rect x="30" y="15" width="110" height="75" rx="4" fill="url(#screenGrad)" opacity="0.75" />
        <circle cx="85" cy="52" r="14" fill="#a855f7" opacity="0.4" />
        <!-- Laptop Base -->
        <path d="M5 98 L165 98 L150 115 L20 115 Z" fill="#27272a" stroke="#71717a" stroke-width="1.5" />
        <rect x="70" y="101" width="30" height="4" rx="2" fill="#3f3f46" />
      </g>
    `
  },
  "Oziq-ovqat": {
    bgFrom: "#14532d",
    bgTo: "#052e16",
    accent: "#4ade80",
    badgeBg: "rgba(74, 222, 128, 0.15)",
    badgeColor: "#4ade80",
    icon: `
      <!-- Fresh Grocery / Fruit Art -->
      <g transform="translate(130, 115)">
        <!-- Apple & Leaf -->
        <circle cx="70" cy="80" r="45" fill="#ef4444" opacity="0.95" />
        <circle cx="60" cy="70" r="15" fill="#fca5a5" opacity="0.4" />
        <!-- Leaf -->
        <path d="M70 35 C70 15 90 10 95 20 C95 35 75 35 70 35 Z" fill="#22c55e" />
        <path d="M70 35 Q65 48 70 52" stroke="#78350f" stroke-width="4" stroke-linecap="round" fill="none" />
        <!-- Fresh sparkles -->
        <circle cx="115" cy="50" r="3.5" fill="#fef08a" />
        <circle cx="25" cy="80" r="2.5" fill="#fef08a" />
      </g>
    `
  },
  "Kiyim va poyabzal": {
    bgFrom: "#312e81",
    bgTo: "#1e1b4b",
    accent: "#f43f5e",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeColor: "#fb7185",
    icon: `
      <!-- Sneaker / Fashion Art -->
      <g transform="translate(100, 125)">
        <path d="M20 70 Q60 50 110 50 Q160 55 180 85 L180 100 Q150 105 30 105 Q15 105 15 90 Z" fill="#f43f5e" />
        <!-- Sole -->
        <path d="M10 95 L190 95 Q195 110 185 115 L15 115 Q5 110 10 95 Z" fill="#ffffff" />
        <!-- Nike/Speed swoosh curve -->
        <path d="M45 78 Q90 60 145 80" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" />
        <circle cx="160" cy="65" r="4" fill="#fecdd3" />
      </g>
    `
  },
  "Go'zallik va salomatlik": {
    bgFrom: "#4a044e",
    bgTo: "#2e0854",
    accent: "#f472b6",
    badgeBg: "rgba(244, 114, 182, 0.15)",
    badgeColor: "#f472b6",
    icon: `
      <!-- Perfume / Skincare Art -->
      <g transform="translate(135, 115)">
        <!-- Cap -->
        <rect x="50" y="10" width="30" height="20" rx="4" fill="#fbbf24" />
        <rect x="58" y="30" width="14" height="15" fill="#d97706" />
        <!-- Glass Bottle -->
        <rect x="25" y="45" width="80" height="100" rx="16" fill="#f472b6" opacity="0.85" stroke="#fbcfe8" stroke-width="2" />
        <rect x="35" y="65" width="60" height="60" rx="8" fill="#ffffff" opacity="0.9" />
        <rect x="42" y="80" width="46" height="4" rx="2" fill="#e11d48" />
        <rect x="48" y="90" width="34" height="3" rx="1.5" fill="#71717a" />
      </g>
    `
  },
  "Ro'zg'or buyumlari": {
    bgFrom: "#064e3b",
    bgTo: "#022c22",
    accent: "#2dd4bf",
    badgeBg: "rgba(45, 212, 191, 0.15)",
    badgeColor: "#2dd4bf",
    icon: `
      <!-- Kitchen / Home Pan Art -->
      <g transform="translate(110, 125)">
        <ellipse cx="80" cy="80" rx="60" ry="35" fill="#1e293b" stroke="#2dd4bf" stroke-width="4" />
        <ellipse cx="80" cy="78" rx="50" ry="27" fill="#334155" />
        <!-- Handle -->
        <path d="M140 80 L195 95 L190 105 L135 88 Z" fill="#475569" rx="4" />
        <circle cx="80" cy="78" r="14" fill="#ef4444" opacity="0.8" />
      </g>
    `
  },
  "Bolalar olami": {
    bgFrom: "#7c2d12",
    bgTo: "#431407",
    accent: "#fb923c",
    badgeBg: "rgba(251, 146, 60, 0.15)",
    badgeColor: "#fb923c",
    icon: `
      <!-- Lego / Toy Art -->
      <g transform="translate(130, 115)">
        <rect x="20" y="45" width="90" height="70" rx="8" fill="#ea580c" />
        <rect x="30" y="25" width="22" height="20" rx="4" fill="#ea580c" />
        <rect x="68" y="25" width="22" height="20" rx="4" fill="#ea580c" />
        <!-- Highlights -->
        <circle cx="41" cy="35" r="5" fill="#fed7aa" opacity="0.6" />
        <circle cx="79" cy="35" r="5" fill="#fed7aa" opacity="0.6" />
        <circle cx="65" cy="80" r="16" fill="#facc15" />
      </g>
    `
  },
  "Sport va fitnes": {
    bgFrom: "#0c4a6e",
    bgTo: "#082f49",
    accent: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeColor: "#38bdf8",
    icon: `
      <!-- Dumbbell / Sport & Fitness Art -->
      <g transform="translate(100, 120)">
        <!-- Barbell shaft -->
        <rect x="25" y="70" width="150" height="12" rx="6" fill="#94a3b8" />
        <!-- Left Outer Plate -->
        <rect x="25" y="52" width="14" height="48" rx="4" fill="#0284c7" />
        <!-- Left Inner Plate -->
        <rect x="42" y="44" width="16" height="64" rx="5" fill="#38bdf8" />
        <!-- Right Inner Plate -->
        <rect x="142" y="44" width="16" height="64" rx="5" fill="#38bdf8" />
        <!-- Right Outer Plate -->
        <rect x="161" y="52" width="14" height="48" rx="4" fill="#0284c7" />
        <!-- Knurling texture -->
        <line x1="80" y1="70" x2="120" y2="70" stroke="#f8fafc" stroke-width="4" stroke-dasharray="3 3" />
        <!-- Dynamic energy lightning badge -->
        <path d="M100 20 L90 42 L104 42 L94 64" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <circle cx="100" cy="42" r="3" fill="#fef08a" />
      </g>
    `
  },
  "Avtotovarlar & Asboblar": {
    bgFrom: "#1e293b",
    bgTo: "#0f172a",
    accent: "#f59e0b",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeColor: "#fbbf24",
    icon: `
      <!-- Tool / Drill / Automotive Art -->
      <g transform="translate(125, 120)">
        <rect x="35" y="30" width="80" height="40" rx="6" fill="#0284c7" />
        <rect x="115" y="42" width="25" height="16" fill="#64748b" />
        <rect x="55" y="70" width="30" height="60" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="2" />
        <circle cx="70" cy="50" r="8" fill="#f59e0b" />
      </g>
    `
  }
};

const CATEGORY_ALIASES = {
  "Sport": "Sport va fitnes",
  "Elektronika": "Texnika & Kompyuterlar",
  "Texnika": "Texnika & Kompyuterlar",
  "Go‘zallik va salomatlik": "Go'zallik va salomatlik",
  "Ro‘zg‘or buyumlari": "Ro'zg'or buyumlari",
  "Kosmetika": "Go'zallik va salomatlik",
  "Uy-ro'zg'or": "Ro'zg'or buyumlari",
  "O'yinchoq": "Bolalar olami",
  "Kiyim": "Kiyim va poyabzal",
};

/**
 * Escapes characters for SVG XML safety
 */
function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates an SVG Data URI for any product.
 */
export function generateProductSvg(product, angleLabel = "Asosiy ko'rinish") {
  const rawCategory = product.group || "Telefon va aksessuarlar";
  const mappedCategory = CATEGORY_ALIASES[rawCategory] || rawCategory;
  const theme = CATEGORY_THEMES[mappedCategory] || CATEGORY_THEMES["Telefon va aksessuarlar"];

  const safeTitle = escapeXml(product.title?.slice(0, 36) || "Mahsulot");
  const safeBrand = escapeXml(product.brand || "Arzon");
  const safeSub = escapeXml(product.sub || category);
  const safeAngle = escapeXml(angleLabel);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgFrom}" />
      <stop offset="100%" stop-color="${theme.bgTo}" />
    </linearGradient>

    <!-- Screen / Accent Gradient -->
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="${theme.bgTo}" />
    </linearGradient>

    <!-- Top Glow -->
    <radialGradient id="topGlow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0" />
    </radialGradient>

    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Base Canvas -->
  <rect width="400" height="400" fill="url(#bgGrad)" />
  <rect width="400" height="400" fill="url(#topGlow)" />

  <!-- Geometric Grid Background lines -->
  <path d="M0 80 H400 M0 160 H400 M0 240 H400 M0 320 H400" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />
  <path d="M80 0 V400 M160 0 V400 M240 0 V400 M320 0 V400" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1" />

  <!-- Studio Floor Shadow Reflection -->
  <ellipse cx="200" cy="325" rx="130" ry="22" fill="#000000" fill-opacity="0.35" filter="url(#softShadow)" />

  <!-- Top Badges -->
  <!-- Brand Badge (Top Left) -->
  <g transform="translate(20, 20)">
    <rect width="96" height="26" rx="8" fill="#ffffff" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" />
    <text x="48" y="17.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">
      ${safeBrand}
    </text>
  </g>

  <!-- Category & Angle Badge (Top Right) -->
  <g transform="translate(264, 20)">
    <rect width="116" height="26" rx="8" fill="${theme.badgeBg}" stroke="${theme.badgeColor}" stroke-opacity="0.35" stroke-width="1" />
    <text x="58" y="17.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="800" fill="${theme.badgeColor}" text-anchor="middle">
      ${safeSub.slice(0, 14)}
    </text>
  </g>

  <!-- Main Category Artwork (Centered) -->
  <g filter="url(#softShadow)">
    ${theme.icon}
  </g>

  <!-- Studio Bottom Watermark Ribbon -->
  <g transform="translate(0, 368)">
    <text x="200" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" fill="#ffffff" fill-opacity="0.3" text-anchor="middle" letter-spacing="2">
      ARZON • ${safeAngle.toUpperCase()}
    </text>
  </g>
</svg>
`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
