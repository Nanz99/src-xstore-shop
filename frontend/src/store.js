/** @format */

// /** @format */

import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { cartReducer } from "./reducers/cartReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPaymentVNPAYReducer,
  orderPayReducer,
  orderMineListReducer,
} from "./reducers/orderReducers";
import {
  openModalSearchReducer,
  productDetailsReducer,
  productFiltersReducer,
  productListReducer,
  productSearchReducer,
} from "./reducers/productReducers";
import {
  headerStickyReducer,
  userRegisterReducer,
  userSigninReducer,
} from "./reducers/userReducers";

const inintialState = {
  userSignin: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    checkoutDetails: localStorage.getItem("checkoutDetails")
      ? JSON.parse(localStorage.getItem("checkoutDetails"))
      : {},
  },
};

const reducer = combineReducers({
  productList: productListReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  headerSticky: headerStickyReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  openModalSearch: openModalSearchReducer,
  productFilters: productFiltersReducer,
  productSearch: productSearchReducer,
  orderCreate: orderCreateReducer,
  orderPay: orderPayReducer,
  orderDetails: orderDetailsReducer,
  orderPaymentVNPAY: orderPaymentVNPAYReducer,
  orderMineList: orderMineListReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  inintialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
