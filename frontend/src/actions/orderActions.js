/** @format */

import axios from "axios";
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_MINE_LIST_FAIL,
  ORDER_MINE_LIST_REQUEST,
  ORDER_MINE_LIST_SUCCESS,
  ORDER_PAYMENT_VNPAY_FAIL,
  ORDER_PAYMENT_VNPAY_REQUEST,
  ORDER_PAYMENT_VNPAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";



export const createOrder = (order) => async (dispacth, getState) => {
  dispacth({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await axios.post("/api/orders", order, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispacth({ type: ORDER_CREATE_SUCCESS, payload: data });
    localStorage.removeItem("cartItems");
  } catch (error) {
    dispacth({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const payOrder = (order, paypalResult) => async (dispatch, getState) => {
  dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paypalResult } });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await axios.put(`/api/orders/${order._id}/pay`, paypalResult, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
   
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_PAY_FAIL, payload: message });
  }
};
export const payOrderVnpay = (order, vnpayResult) => async (dispatch, getState) => {
  dispatch({ type: ORDER_PAY_REQUEST, payload: { order, vnpayResult } });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await axios.put(`/api/orders/${order._id}/pay-vnpay`, vnpayResult, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });

  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_PAY_FAIL, payload: message });
  }
};

export const paymentWithVNPAY =
  (
    orderId = "",
    amount,
    bankCode = "",
    orderDescription = "",
    orderType = "Thanh Toán Thời Trang",
    language = "vn"
  ) =>
  async (dispatch, getState) => {
    dispatch({
      type: ORDER_PAYMENT_VNPAY_REQUEST,
      payload: {
        orderId,
        amount,
        bankCode,
        orderDescription,
        orderType,
        language,
      },
    });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = await axios.post(
        "/api/payment/create_vnpayurl",
        { orderId, amount, bankCode, orderDescription, orderType, language },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },

          async: true,
          crossDomain: true,
        }
      );
      console.log(data);
      dispatch({ type: ORDER_PAYMENT_VNPAY_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_PAYMENT_VNPAY_FAIL, payload: message });
    }
  };

export const detailsOrder = (orderId) => async (dispacth, getState) => {
  dispacth({ type: ORDER_DETAILS_REQUEST, payload: orderId });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await axios.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispacth({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispacth({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listOrderMine = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_MINE_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await axios.get("/api/orders/mine", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
  }
};
