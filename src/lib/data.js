// ---------------------------------------------------------------------------
// ArzonMarket catalog data layer.
// Generates a large (~100,000 item) deterministic product catalog at module
// load so the UI always has real content to filter / paginate / search,
// the same way the real site would be backed by a database.
// ---------------------------------------------------------------------------

export const CITIES = [
  "Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan", "Farg'ona",
  "Qarshi", "Nukus", "Xiva", "Urganch", "Jizzax", "Guliston", "Termiz", "Navoiy",
];

// material symbol name per top-level group
export const GROUPS = {
  "Oziq-ovqat va ichimliklar": ["Meva va sabzavotlar", "Ichimliklar", "Sut va pishloq mahsulotlari", "Non va qandolat", "Go'sht va parranda", "Choy, qahva va shirinliklar", "Konservalar va yarim tayyor"],
  "Telefon va aksessuarlar": ["Smartfonlar", "Quvvatlagichlar", "Kabellar", "Himoya oynalar", "Telefon qoplamalari", "Simsiz quloqchinlar", "Powerbanklar"],
  "Kompyuter va maishiy texnika": ["Noutbuklar", "Monitorlar", "Klaviatura va sichqonlar", "Televizorlar", "Kir yuvish mashinalari", "Muzlatgichlar", "Konditsionerlar"],
  "Kiyim va poyabzal": ["Erkaklar kiyimi", "Ayollar kiyimi", "Krossovkalar", "Botinkalar", "Sport kiyimlari", "Ko'ylak va kostyumlar"],
  "Bolalar olami": ["O'yinchoqlar", "Bolalar kiyimi", "Chaqaloq buyumlari", "Maktab buyumlari"],
  "Ro'zg'or buyumlari": ["Oshxona anjomlari", "Idish-tovoqlar", "Tozalash vositalari", "Mebel", "Yorug'lik jihozlari"],
  "Go'zallik va salomatlik": ["Parfyumeriya", "Dekorativ kosmetika", "Soch parvarishi", "Vitamin va BAD"],
  "Sport va dam olish": ["Fitnes jihozlari", "Velosipedlar", "Turizm buyumlari", "Sport kiyimlari"],
  "Avtotovarlar": ["Avto aksessuarlar", "Moy va texnik suyuqliklar", "Audio-video texnika"],
  "Uy hayvonlari": ["It ovqati", "Mushuk ovqati", "Hayvonlar uchun aksessuarlar"],
};

// icon shown in nav / category circles — Material Symbols names
export const GROUP_ICON = {
  "Oziq-ovqat va ichimliklar": "nutrition",
  "Telefon va aksessuarlar": "smartphone",
  "Kompyuter va maishiy texnika": "devices",
  "Kiyim va poyabzal": "checkroom",
  "Bolalar olami": "toys",
  "Ro'zg'or buyumlari": "chair",
  "Go'zallik va salomatlik": "spa",
  "Sport va dam olish": "fitness_center",
  "Avtotovarlar": "directions_car",
  "Uy hayvonlari": "pets",
};
// which groups show directly in the top nav bar (rest fold into "Yana...")
export const NAV_GROUPS = ["Oziq-ovqat va ichimliklar", "Telefon va aksessuarlar", "Kompyuter va maishiy texnika", "Kiyim va poyabzal", "Bolalar olami", "Ro'zg'or buyumlari", "Go'zallik va salomatlik"];

const BRANDS = {
  "Oziq-ovqat va ichimliklar": ["Musaffo", "Makfa", "Coca-Cola", "Nestle", "Zamin Oltin", "Dona-Dona", "President", "Olivie", "Barakat", "Mareven", "Chimyon bulog'i", "Nutella"],
  "Telefon va aksessuarlar": ["Baseus", "Anker", "Ugreen", "Apple", "Samsung", "Xiaomi", "JBL", "Hoco", "Remax", "Belkin"],
  "Kompyuter va maishiy texnika": ["Lenovo", "HP", "Dell", "Asus", "Samsung", "LG", "Artel", "Bosch", "Midea", "Xiaomi"],
  "Kiyim va poyabzal": ["Lc Waikiki", "Zara", "H&M", "Nike", "Adidas", "Puma", "Reebok", "Collezione", "Oxocha"],
  "Bolalar olami": ["Lego", "Hasbro", "Chicco", "Avent", "Fisher-Price", "Pampers", "Huggies"],
  "Ro'zg'or buyumlari": ["Tefal", "Vitek", "Moulinex", "Ikea", "Arnica", "Fissman", "Philips"],
  "Go'zallik va salomatlik": ["L'Oreal", "Nivea", "Maybelline", "Dove", "Garnier", "Vichy", "Evalar"],
  "Sport va dam olish": ["Nike", "Adidas", "Decathlon", "Kettler", "Reebok", "Puma"],
  "Avtotovarlar": ["Shell", "Castrol", "Mobil", "Bosch", "Pioneer", "JBL"],
  "Uy hayvonlari": ["Purina", "Pedigree", "Whiskas", "Royal Canin", "Felix"],
};

const NOUNS = {
  "Meva va sabzavotlar": ["Banan", "Olma", "Apelsin", "Mandarin", "Uzum", "Behi", "Nok", "Shaftoli", "Qulupnay", "Pomidor", "Bodring", "Kartoshka", "Piyoz", "Sabzi", "Limon"],
  "Ichimliklar": ["Gazlangan ichimlik", "Tabiiy sharbat", "Mineral suv", "Energetik ichimlik", "Limonad", "Kvas"],
  "Sut va pishloq mahsulotlari": ["Pasterizatsiyalangan sut", "Qatiq", "Tvorog", "Qaymoq", "Pishloq", "Yogurt", "Sariyog'"],
  "Non va qandolat": ["Tandir noni", "Bulochka", "Keks", "Pechene", "Tort", "Vafli"],
  "Go'sht va parranda": ["Tovuq go'shti", "Mol go'shti", "Qo'y go'shti", "Qiyma", "Kolbasa", "Sosiska"],
  "Choy, qahva va shirinliklar": ["Qora choy", "Yashil choy", "Eriydigan qahva", "Shokolad", "Konfet", "Asal"],
  "Konservalar va yarim tayyor": ["Dumaloq pomidor konserva", "No'xat konserva", "Pelmeni", "Manti", "Baliq konserva"],
  "Smartfonlar": ["Smartfon", "Flagman telefon", "Byudjet smartfon"],
  "Quvvatlagichlar": ["Tezkor quvvatlagich", "GaN quvvatlagich", "Avto quvvatlagich", "Simsiz quvvatlagich"],
  "Kabellar": ["Type-C kabel", "Lightning kabel", "USB kabel", "HDMI kabel"],
  "Himoya oynalar": ["Himoya oynasi", "Matoviy himoya oyna", "Kamera linza himoyasi"],
  "Telefon qoplamalari": ["Silikon qoplama", "Charm qoplama", "Magnit qoplama", "Shaffof qoplama"],
  "Simsiz quloqchinlar": ["Bluetooth quloqchin", "TWS quloqchin", "Sport quloqchin", "Over-ear quloqchin"],
  "Powerbanklar": ["Powerbank 10000mAh", "Powerbank 20000mAh", "Mini powerbank"],
  "Noutbuklar": ["Noutbuk", "Ultrabuk", "Gaming noutbuk", "Biznes noutbuk"],
  "Monitorlar": ["Monitor", "Gaming monitor", "4K monitor"],
  "Klaviatura va sichqonlar": ["Klaviatura", "Simsiz sichqoncha", "Mexanik klaviatura"],
  "Televizorlar": ["Smart TV", "4K televizor", "OLED televizor"],
  "Kir yuvish mashinalari": ["Kir yuvish mashinasi", "Avtomat kir yuvish mashinasi"],
  "Muzlatgichlar": ["Muzlatgich", "Ikki kamerali muzlatgich", "Mini muzlatgich"],
  "Konditsionerlar": ["Konditsioner", "Inverter konditsioner"],
  "Erkaklar kiyimi": ["Futbolka", "Kuylak", "Shim", "Kurtka", "Sviter"],
  "Ayollar kiyimi": ["Ko'ylak", "Bluzka", "Yubka", "Palto", "Jemper"],
  "Krossovkalar": ["Krossovka", "Sport poyabzal", "Yugurish krossovkasi"],
  "Botinkalar": ["Botinka", "Qishki botinka", "Charm botinka"],
  "Sport kiyimlari": ["Sport kostyum", "Legging", "Shorts"],
  "Ko'ylak va kostyumlar": ["Rasmiy kostyum", "Ko'ylak", "Galstuk"],
  "O'yinchoqlar": ["Konstruktor", "Qo'g'irchoq", "Radioupravlyaemiy mashina", "Yumshoq o'yinchoq"],
  "Bolalar kiyimi": ["Bolalar futbolkasi", "Bolalar kombinezoni", "Bolalar kurtkasi"],
  "Chaqaloq buyumlari": ["Chaqaloq aravachasi", "Yosholog'ich", "Pamperс", "Chaqaloq kosmetikasi"],
  "Maktab buyumlari": ["Maktab ryukzagi", "Daftar to'plami", "Qalam-ruchka to'plami"],
  "Oshxona anjomlari": ["Qovurish tovasi", "Qozon", "Pichoq to'plami", "Blender"],
  "Idish-tovoqlar": ["Likopcha to'plami", "Stakan to'plami", "Choynak"],
  "Tozalash vositalari": ["Kir yuvish geli", "Idish yuvish vositasi", "Changyutgich"],
  "Mebel": ["Divan", "Stol", "Stul", "Shkaf"],
  "Yorug'lik jihozlari": ["LED lampa", "Lyustra", "Stol lampasi"],
  "Parfyumeriya": ["Erkaklar parfyumeriyasi", "Ayollar parfyumeriyasi", "Deodorant"],
  "Dekorativ kosmetika": ["Tonal krem", "Lab bo'yog'i", "Tush"],
  "Soch parvarishi": ["Shampun", "Soch balzami", "Soch moyi"],
  "Vitamin va BAD": ["Multivitamin", "Vitamin C", "Omega-3", "Kollagen"],
  "Fitnes jihozlari": ["Gantel to'plami", "Trenajyor", "Yoga gilamchasi"],
  "Velosipedlar": ["Tog' velosipedi", "Shahar velosipedi", "Bolalar velosipedi"],
  "Turizm buyumlari": ["Chodir", "Yotoq xalta", "Turistik ryukzak"],
  "Avto aksessuarlar": ["Avto kover", "Avto tozalagich", "Avto o'rindiq qoplami"],
  "Moy va texnik suyuqliklar": ["Motor moyi", "Tormoz suyuqligi", "Antifriz"],
  "Audio-video texnika": ["Avto radio", "Orqa ko'rish kamerasi", "Avto dinamik"],
  "It ovqati": ["Quruq it ovqati", "Konserva it ovqati", "It uchun vitaminlar"],
  "Mushuk ovqati": ["Quruq mushuk ovqati", "Konserva mushuk ovqati"],
  "Hayvonlar uchun aksessuarlar": ["Hayvon uyali", "Hayvon kayishi", "Hayvon o'ynoqi"],
};

const ADJ = ["Yangi", "Premium", "Klassik", "Original", "Import", "Mahalliy", "Saralangan", "Pro", "Eco", "Standart"];
const VARIANT = ["", "L", "XL", "M", "128GB", "256GB", "1 kg", "500 g", "2 l", "1 l", "Qora", "Oq", "Ko'k", "Qizil", "38-razmer", "40-razmer"];
const DELIVERY = ["fast", "tomorrow", "fast", "3days", "tomorrow"];

// deterministic fast hash -> [0,1)
function h(i, salt) {
  let x = (i * 2654435761 + salt * 40503) >>> 0;
  x ^= x << 13; x >>>= 0;
  x ^= x >> 17;
  x ^= x << 5; x >>>= 0;
  return (x % 100000) / 100000;
}

function buildCatalog(total = 100000) {
  const pairs = [];
  for (const g of Object.keys(GROUPS)) for (const s of GROUPS[g]) pairs.push([g, s]);
  const per = Math.floor(total / pairs.length);
  const list = new Array(total);
  const ranges = {}; // group -> {start, end}
  let idx = 0;
  pairs.forEach(([g, s], pairIdx) => {
    const n = pairIdx === pairs.length - 1 ? total - idx : per;
    if (!ranges[g]) ranges[g] = { start: idx, end: idx };
    const nouns = NOUNS[s] || [s];
    const brands = BRANDS[g] || ["ArzonMarket"];
    for (let k = 0; k < n; k++) {
      const i = idx;
      const noun = nouns[Math.floor(h(i, 1) * nouns.length)];
      const brand = brands[Math.floor(h(i, 2) * brands.length)];
      const adj = h(i, 3) < 0.35 ? ADJ[Math.floor(h(i, 4) * ADJ.length)] + " " : "";
      const variant = h(i, 5) < 0.55 ? " " + VARIANT[Math.floor(h(i, 6) * VARIANT.length)] : "";
      const title = `${adj}${brand} ${noun}${variant}`.replace(/\s+/g, " ").trim();
      const basePrice = 4000 + Math.floor(h(i, 7) * 280) * 1000; // 4,000 - 284,000
      const hasDiscount = h(i, 8) < 0.42;
      const off = hasDiscount ? 5 + Math.floor(h(i, 9) * 12) * 5 : 0; // 5-60 step5
      const price = hasDiscount ? Math.round((basePrice * (100 - off)) / 100 / 500) * 500 : basePrice;
      const oldPrice = hasDiscount ? basePrice : 0;
      const rating = Math.round((3.7 + h(i, 10) * 1.3) * 10) / 10;
      const reviews = 3 + Math.floor(h(i, 11) * 4200);
      const sold = 10 + Math.floor(h(i, 12) * 90);
      const delivery = DELIVERY[Math.floor(h(i, 13) * DELIVERY.length)];
      list[i] = {
        id: "P" + (100000 + i),
        title,
        brand,
        group: g,
        sub: s,
        price,
        oldPrice,
        off,
        rating,
        reviews,
        sold,
        delivery,
        img: `https://picsum.photos/seed/am-${g.length}-${s.length}-${i}/500/500`,
      };
      idx++;
    }
    ranges[g].end = idx;
  });
  return { list, ranges };
}

export const { list: PRODUCTS, ranges: GROUP_RANGES } = buildCatalog(100000);

const INDEX = new Map();
for (const p of PRODUCTS) INDEX.set(p.id, p);
export function byId(id) {
  return INDEX.get(id);
}

// evenly sample `perGroup` items from each top-level group, optionally
// filtered (e.g. only discounted) and offset so repeated calls can vary.
export function sampleAcrossGroups(perGroup = 6, offset = 0, filterFn = null) {
  const out = [];
  for (const g of Object.keys(GROUP_RANGES)) {
    const { start, end } = GROUP_RANGES[g];
    const span = end - start;
    let picked = 0;
    for (let k = 0; k < span && picked < perGroup; k++) {
      const p = PRODUCTS[start + ((k + offset * 37) % span)];
      if (!filterFn || filterFn(p)) {
        out.push(p);
        picked++;
      }
    }
  }
  return out;
}


export function fmt(n) {
  return Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";
}

export function specsFor(p) {
  return [
    ["Brend", p.brand],
    ["Toifa", p.group],
    ["Ichki toifa", p.sub],
    ["Kafolat", "12 oy rasmiy kafolat"],
    ["Yetkazib berish", p.delivery === "fast" ? "30 daqiqada" : p.delivery === "tomorrow" ? "Ertaga (1 kunda)" : "2-3 kun ichida"],
    ["Kod", p.id],
  ];
}

export function descFor(p) {
  return `${p.title} — ${p.brand} brendining original mahsuloti. ArzonMarket orqali xarid qilinganda rasmiy kafolat, tez yetkazib berish va 14 kun ichida bepul qaytarish imkoniyatidan foydalanishingiz mumkin. Mahsulot sifati nazoratdan o'tgan va saqlash shartlariga muvofiq omborlarimizdan jo'natiladi.`;
}

export function searchProducts(query, limit = 300) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const out = [];
  for (let i = 0; i < PRODUCTS.length && out.length < limit; i++) {
    const p = PRODUCTS[i];
    if (p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q)) out.push(p);
  }
  return out;
}

export function similarTo(p, count = 10) {
  // walk outward from this product's position (products are grouped by sub at build time)
  const startIdx = Number(p.id.slice(1)) - 100000;
  let found = [];
  for (let off = 1; found.length < count && off < 4000; off++) {
    const a = PRODUCTS[startIdx - off];
    const b = PRODUCTS[startIdx + off];
    if (a && a.sub === p.sub && a.id !== p.id) found.push(a);
    if (found.length >= count) break;
    if (b && b.sub === p.sub && b.id !== p.id) found.push(b);
  }
  return found.slice(0, count);
}
