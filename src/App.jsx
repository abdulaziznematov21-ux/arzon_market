import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Favorites from "./pages/Favorites";
import PickupPoints from "./pages/PickupPoints";
import {
  About, Careers, Blog, DeliveryInfo, Returns, Installment, Faq, Sell, Partners, OpenPickup,
} from "./pages/StaticInfo";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/pickup-punktlari" element={<PickupPoints />} />

          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/delivery-info" element={<DeliveryInfo />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/installment" element={<Installment />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/open-pickup" element={<OpenPickup />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
