/** @format */

import {
  CART_ADD_ITEM,
  CART_CHECKOUT_DETAILS,
  CART_EMPTY,
  CART_REMOVE_ITEM,
} from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      // const item = action.payload;
      // const existItem = state.cartItems.find(
      //   (x) => x.product === item.product + item.mainColor + item.mainSize
      // );

      // if (existItem) {
      //   item.amount =  existItem.amount + item.amount;
      //   return {
      //     ...state,
      //     cartItems: state.cartItems.map((x) =>
      //       x.product === existItem.product ? item : x
      //     ),
      //   };
      // } else {
      //   const newItem = {...item,product: item.product + item.mainColor + item.mainSize}
      //   return { ...state, error: "", cartItems: [...state.cartItems, newItem] };
      // }
      const {
        product,
        mainColor,
        mainSize,
        amount,
        countInStock,
        price,
        name,
        image,
      } = action.payload;
      const tempItem = state.cartItems.find(
        (i) => i.product === product + mainColor + mainSize
      );
      if (tempItem) {
        const tempCart = state.cartItems.map((cartItem) => {
          if (cartItem.product === product + mainColor + mainSize) {
            let newAmount = cartItem.amount + amount;
            if (newAmount > cartItem.countInStock) {
              newAmount = cartItem.countInStock;
            }
            return { ...cartItem, amount: newAmount };
          } else {
            return cartItem;
          }
        });
        return { ...state, cartItems: tempCart };
      } else {
        const newItem = {
          product: product + mainColor + mainSize,
          name,
          mainColor,
          mainSize,
          amount,
          image,
          price,
          countInStock,
        };
        return { ...state, cartItems: [...state.cartItems, newItem] };
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        error: "",
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    case CART_CHECKOUT_DETAILS:
      return {
        checkoutDetails: action.payload,
      };
    case CART_EMPTY:
      return {
        cartItems: []
      };
    default:
      return state;
  }
};
