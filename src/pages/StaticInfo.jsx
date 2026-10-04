import { Link } from "react-router-dom";

function Page({ icon, title, lead, sections }) {
  return (
    <div className="bg-[#f9f9fa] min-h-screen pb-16">
      <div className="max-w-[820px] mx-auto px-6 pt-4">
        <div className="text-[13px] text-gray-500"><Link to="/" className="hover:text-[#e5252b]">Bosh sahifa</Link> › <b className="text-[#1a1a1a]">{title}</b></div>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center"><span className="material-symbols-outlined text-[#e5252b] text-[26px]">{icon}</span></div>
          <h1 className="text-[28px] font-extrabold">{title}</h1>
        </div>
        <p className="text-gray-500 mt-4 leading-relaxed">{lead}</p>
        <div className="mt-8 space-y-6">
          {sections.map(([h, body]) => (
            <div key={h} className="bg-white rounded-2xl border border-gray-100 p-5">
              <b className="text-[15px]">{h}</b>
              <p className="text-[13.5px] text-gray-500 mt-2 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const About = () => (
  <Page icon="info" title="Kompaniya haqida" lead="Arzon Market — O'zbekiston bo'ylab tez va ishonchli onlayn xarid qilish platformasi. Minglab sotuvchilar va millionga yaqin mahsulot bitta joyda."
    sections={[
      ["Missiyamiz", "Har bir oilaga sifatli mahsulotlarni eng qulay narxda, eng tez muddatda yetkazib berish."],
      ["Qamrov", "O'zbekistonning barcha yirik shaharlarida yetkazib berish xizmati mavjud."],
      ["Jamoa", "500 dan ortiq xodim, 1000+ kuryer va 50+ ombor hamkor shaharlar bo'ylab ishlaydi."],
    ]} />
);

export const Careers = () => (
  <Page icon="work" title="Bo'sh ish o'rinlari" lead="Jamoamizga qo'shiling! Kuryer, ombor xodimi, dasturchi va mijozlarga xizmat ko'rsatish bo'limlarida doimiy vakansiyalar mavjud."
    sections={[
      ["Kuryer", "To'liq va yarim stavka, moslashuvchan grafik, haftalik to'lov."],
      ["Ombor xodimi", "Toshkent va viloyat omborlarida, rasmiylashtirilgan ish joyi."],
      ["IT bo'limi", "Frontend, backend va mobil ilova dasturchilari qidirilmoqda."],
    ]} />
);

export const Blog = () => (
  <Page icon="article" title="Arzon Market blogi" lead="Chegirmalar, yangi mahsulotlar va foydali maslahatlar haqida so'nggi yangiliklar."
    sections={[
      ["Bahorgi chegirmalar boshlandi", "70% gacha chegirma bilan minglab mahsulot — faqat shu hafta."],
      ["Tezkor yetkazib berish kengaytirildi", "Endi Toshkentning barcha tumanlarida 30 daqiqalik yetkazib berish mavjud."],
    ]} />
);

export const DeliveryInfo = () => (
  <Page icon="local_shipping" title="Yetkazib berish va to'lov" lead="Buyurtmangizni qanday va qachon olishingiz haqida to'liq ma'lumot."
    sections={[
      ["Tezkor yetkazib berish", "Oziq-ovqat va kundalik tovarlar 20-30 daqiqada eshigingiz oldiga yetkaziladi."],
      ["Standart yetkazib berish", "Qolgan barcha mahsulotlar 1 kun ichida yetkaziladi."],
      ["To'lov usullari", "Naqd pul, Click, Payme, Uzcard, Humo va muddatli to'lov (Uzum Nasiya)."],
      ["Bepul yetkazish", "50 000 so'mdan ortiq buyurtmalarga yetkazib berish bepul."],
    ]} />
);

export const Returns = () => (
  <Page icon="assignment_return" title="Tovarni qaytarish" lead="Mahsulot yoqmadimi? 14 kun ichida hech qanday savolsiz qaytarishingiz mumkin."
    sections={[
      ["Qaytarish muddati", "Mahsulot qabul qilingan kundan boshlab 14 kun."],
      ["Shartlar", "Mahsulot asl qadoqda va ishlatilmagan holatda bo'lishi kerak."],
      ["Pulni qaytarish", "To'lov qanday amalga oshirilgan bo'lsa, shu usulda 3-5 ish kunida qaytariladi."],
    ]} />
);

export const Installment = () => (
  <Page icon="payments" title="Muddatli to'lov qoidalari" lead="Uzum Nasiya va Paymart orqali foizsiz 3, 6 yoki 12 oyga bo'lib to'lang."
    sections={[
      ["Kim foydalana oladi", "18 yoshdan oshgan, O'zbekiston fuqarosi bo'lgan har bir mijoz."],
      ["Qanday ishlaydi", "Checkout bosqichida muddatli to'lovni tanlang, ilova orqali tasdiqlang."],
      ["Foiz stavkasi", "Hamkor banklar orqali 0% dan boshlanadi (aksiyaga bog'liq)."],
    ]} />
);

export const Faq = () => (
  <Page icon="help" title="Savol-javoblar" lead="Tez-tez beriladigan savollarga javoblar."
    sections={[
      ["Buyurtmani qanday kuzataman?", "\"Buyurtmalarim\" bo'limida real vaqtda kuryer joylashuvini ko'rishingiz mumkin."],
      ["To'lovni qanday qaytarasiz?", "Qaytarish bo'limiga murojaat qiling, 3-5 ish kunida pul qaytariladi."],
      ["Mahsulot sifatiga kafolat bormi?", "Barcha mahsulotlar rasmiy sertifikatlangan va 12 oy kafolat bilan sotiladi."],
    ]} />
);

export const Sell = () => (
  <Page icon="storefront" title="Arzon Marketda soting" lead="O'z mahsulotlaringizni millionlab xaridorga taqdim eting."
    sections={[
      ["Ro'yxatdan o'tish", "Oddiy anketa to'ldiring, 1 ish kunida hisobingiz faollashtiriladi."],
      ["Komissiya", "Kategoriyaga qarab 5-15% komissiya."],
      ["To'lovlar", "Sotuvlar har hafta avtomatik hisobingizga o'tkaziladi."],
    ]} />
);

export const Partners = () => (
  <Page icon="handshake" title="Hamkorlik dasturi" lead="Logistika, marketing va texnologiya sohasidagi kompaniyalar bilan hamkorlik qilamiz."
    sections={[
      ["Logistika hamkorlari", "Yetkazib berish quvvatini kengaytirish uchun hamkor transport kompaniyalari qidirilmoqda."],
      ["Marketing hamkorligi", "Birgalikda aksiyalar va chegirma kampaniyalari o'tkazamiz."],
    ]} />
);

export const OpenPickup = () => (
  <Page icon="add_business" title="Yetkazib berish punkti ochish" lead="O'z hududingizda Arzon Market punktini oching va qo'shimcha daromad oling."
    sections={[
      ["Talablar", "Kamida 15m² joy, qulay joylashuv, internet aloqasi."],
      ["Daromad", "Har bir topshirilgan buyurtma uchun belgilangan komissiya to'lanadi."],
      ["Ariza berish", "Quyidagi tugma orqali ariza qoldiring, menejerimiz 24 soat ichida bog'lanadi."],
    ]} />
);
