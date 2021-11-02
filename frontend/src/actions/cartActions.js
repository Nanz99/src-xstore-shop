/** @format */

import axios from "axios";
import { CART_ADD_ITEM, CART_CHECKOUT_DETAILS, CART_REMOVE_ITEM } from "../constants/cartConstants";

export const addToCart = (productId,mainColor,mainSize, amount) => async (dispatch, getState) => {

  const { data } = await axios.get(`/api/products/${productId}`);
  const product = data.product
  
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      name: product.name,
      image: product.images[0],
      price: product.price,
      product: product._id,
      countInStock: product.countInStock,
      mainColor,
      mainSize,
      amount
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: productId });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};


export const saveCheckoutDetails = (data) => async (dispatch) => {
    dispatch({ type: CART_CHECKOUT_DETAILS, payload: data });
    localStorage.setItem("checkoutDetails", JSON.stringify(data));
}

