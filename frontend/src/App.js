/** @format */

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
import Contact from "./pages/Contact/Contact";
import PayOrder from "./pages/Payment/PayOrder/PayOrder";
import Account from "pages/Account/Account";
import PrivateRoute from "routes/PrivateRoute/PrivateRoute";
import AdminRoute from "routes/AdminRoute/AdminRoute";
import Dashboard from "pages/Dashaboard/Dashboard";
import Policy from "pages/Policy/Policy";
import _Login from "pages/Login/_Login";
import Activate from "pages/Auth/Activate";





export default function App() {

  return (
    <BrowserRouter>
      <GoToTop />
      <ToastContainer
        position="top-center"
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
        <Route path="/auth" component={_Login} exact />
        <Route path="/auth/activate/:token" component={Activate} exact />
        <Route path="/dang-ky" component={Register} exact />
        <Route path="/contact" component={Contact} exact />
        <Route path="/policy" component={Policy} exact />
        <Route path="/san-pham/:id" component={ProductDetails} exact />
        <Route path="/san-pham" component={Products} exact />
        <Route path="/gio-hang" component={Cart} exact />
        <Route path="/payment" component={Checkout} exact />
        <Route path="/payment/pay-order/:id" component={PayOrder} exact />
        <Route path="/payment/order-complete/:id" component={OrderComplete} exact />
        <PrivateRoute path="/user/account" component={Account} />


        <AdminRoute path="/dashboard" component={Dashboard} />
      </Switch>
      <ScrollToTop showBelow={250} />
      <Footer />
    </BrowserRouter>
  );
}
