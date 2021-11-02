/** @format */

import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./assets/styles/css/tailwind.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import GoToTop from "./components/GoToTop/GoToTop";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Products from './pages/Products/Products';
import OrderComplete from './pages/OrderComplete/OrderComplete';
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import Paypal from "./pages/Payment/Paypal";
import Vnpay from "./pages/Payment/Vnpay";
import Contact from "./pages/Contact/Contact";
import { Switch } from 'react-router-dom';
import PayOrder from "./pages/Payment/PayOrder/PayOrder";
import OrderDetails from "pages/OrderDetails/OrderDetails";


export default function App() {
  return (
    <BrowserRouter>
      <GoToTop />
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header />
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/dang-nhap" component={Login} exact />
        <Route path="/dang-ky" component={Register} exact />
        <Route path="/contact" component={Contact} exact />
        <Route path="/san-pham/:id" component={ProductDetails} exact />
        <Route path="/san-pham" component={Products} exact />
        <Route path="/gio-hang" component={Cart} exact />
        <Route path="/payment" component={Checkout} exact />
        <Route path="/payment/pay-order/:id" component={PayOrder} exact />
        <Route path="/payment/pay-paypal/:id" component={Paypal} exact />
        <Route path="/payment/pay-vnpay/:id" component={Vnpay} exact />
        <Route path="/order-history" component={OrderHistory} exact />
        <Route path="/order/:id" component={OrderDetails} exact />
        <Route path="/payment/order-complete/:id" component={OrderComplete} exact/>
      </Switch>
      <ScrollToTop showBelow={250} />
      <Footer />
    </BrowserRouter>
  );
}
