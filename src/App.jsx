import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useStore } from "./lib/store";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import FavoritesDrawer from "./components/FavoritesDrawer";
import OrdersModal from "./components/OrdersModal";
import CatalogModal from "./components/CatalogModal";
import ProfileModal from "./components/ProfileModal";
import StoreInfoModal from "./components/StoreInfoModal";
import AiAssistantModal from "./components/AiAssistantModal";
import FloatingBotWidget from "./components/FloatingBotWidget";
import MobileBottomNav from "./components/MobileBottomNav";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Favorites from "./pages/Favorites";
import PickupPoints from "./pages/PickupPoints";
import {
  About,
  Careers,
  Blog,
  DeliveryInfo,
  Returns,
  Installment,
  Faq,
  Sell,
  Partners,
  OpenPickup,
} from "./pages/StaticInfo";
import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function App() {
  const { isLoginOpen, closeLogin } = useStore();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fa] text-[#1e293b]">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/pickup-points" element={<PickupPoints />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/delivery" element={<DeliveryInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/installment" element={<Installment />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/open-pickup" element={<OpenPickup />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer />

      {/* SINGLE-PAGE EXPERIENCE MODALS & DRAWERS */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <FavoritesDrawer />
      <OrdersModal />
      <CatalogModal />
      <ProfileModal />
      <StoreInfoModal />
      <AiAssistantModal />
      <FloatingBotWidget />
      <MobileBottomNav />
      {isLoginOpen && <LoginModal onClose={closeLogin} />}
    </div>
  );
}

export default App;
