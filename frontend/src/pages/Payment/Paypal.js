/** @format */

import React, { useEffect, useState } from "react";
import Meta from "../../components/Meta/Meta";
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "./../../utils/helper";
// import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import {
  ORDER_CREATE_RESET,
  ORDER_PAY_RESET,
} from "../../constants/orderConstants";
import { payOrder, detailsOrder } from "../../actions/orderActions";
import Loading from "../../components/Loading/Loading";
import { CART_EMPTY } from "../../constants/cartConstants";

function Paypal(props) {
  const cart = useSelector((state) => state.cart);
  const orderId = props.match.params.id;
  const { cartItems } = cart;

  const { success: successPay } = useSelector((state) => state.orderPay);
  const { order } = useSelector((state) => state.orderDetails);

  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.amount, 0);

  const shippingFee = totalPrice > 500000 ? 0 : 25000;
  const totalOrder = totalPrice + shippingFee;
  const totalOrderDollar = (totalOrder / 22760).toFixed(2);

  const [sdkReady, setSdkReady] = useState(false);
  useEffect(() => {
    dispatch(detailsOrder(orderId));
  }, [dispatch, orderId]);
  
  useEffect(() => {
    dispatch({ type: ORDER_PAY_RESET });
  }, [dispatch]);
  useEffect(() => {
    const addPayPalScript = () => {
      const data =
        "AUh1s1jSIIoJPp3Vgd8VQCEjD_LIyLRg1DEg7QyHYnBfXTg_H2hxXvnqBi1aWnd1CWZEvEEVV1xgPk2n";
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, [sdkReady]);

  useEffect(() => {
    if (successPay) {
      props.history.push(`payment/order-complete/${orderId}`);
      dispatch({ type: ORDER_CREATE_RESET });
      dispatch({ type: CART_EMPTY });
    }
  }, [dispatch, successPay, props.history, orderId]);

  const successPaymentHandler = (data) => {
    if (data) {
      const paypalResult = {
        id: data.id,
        status: data.status,
        update_time: data.update_time,
        payer: data.payer,
      };
      dispatch(payOrder(order, paypalResult));
    }
  };

  useEffect(() => {
    if (successPay) {
      props.history.push(`/payment/order-complete/${orderId}`);
    }
  }, [successPay, props.history, orderId]);

  if (!order) return <Loading />;
  return (
    <div>
      <Meta title="Thanh Toán với Paypal" />
      <Breadcrumb title="Thanh Toán" />
      <div className="py-20 px-8">
        <div className="pr-5">
          <h2 className="text-4xl font-semibold capitalize mb-5 ">
            Thông Tin Đơn Hàng
          </h2>
          <div className="grid grid-cols-2">
            <div>
              <div className="py-10">
                <h2 className="text-xl font-semibold capitalize mb-5 ">
                  Thông tin người nhận
                </h2>
                <div>
                  <p className="p-3 border-b border-gray-7 border-solid  ">
                    <span className="font-semibold tracking-wider">
                      Họ Và Tên:{" "}
                    </span>{" "}
                    <span className="tracking-wider">
                      {order.checkoutDetails.fullname}
                    </span>
                  </p>
                  {order.checkoutDetails.numberPhone && (
                    <p className="p-3 border-b border-gray-7 border-solid ">
                      <span className="font-semibold tracking-wider">
                        Số Điện Thoại:{" "}
                      </span>{" "}
                      <span className="tracking-wider">
                        (+84) {order.checkoutDetails.numberPhone}
                      </span>
                    </p>
                  )}
                  {order.checkoutDetails.email && (
                    <p className="p-3 border-b border-gray-7 border-solid ">
                      <span className="font-semibold tracking-wider">
                        Email:{" "}
                      </span>{" "}
                      <span className="tracking-wider">
                        {order.checkoutDetails.email}
                      </span>
                    </p>
                  )}

                  <p className="p-3 border-b border-gray-7 border-solid ">
                    <span className="font-semibold tracking-wider">
                      Địa Chỉ:{" "}
                    </span>{" "}
                    <span className="tracking-wider">
                      {order.checkoutDetails.address},{" "}
                      {order.checkoutDetails.wardsCustomer},{" "}
                      {order.checkoutDetails.districtCustomer},{" "}
                      {order.checkoutDetails.provinceCustomer}
                    </span>
                  </p>
                  {order.checkoutDetails.noteOrder && (
                    <p className="p-3 border-b border-gray-7 border-solid ">
                      <span className="font-semibold tracking-wider">
                        Ghi chú:{" "}
                      </span>{" "}
                      <span className="tracking-wider">
                        {order.checkoutDetails.noteOrder}
                      </span>
                    </p>
                  )}
                </div>
                <div className="py-10">
                  <h2 className="text-xl font-semibold capitalize mb-5 ">
                    Phương Thức Thanh Toán
                  </h2>
                  <p>
                    <span className="tracking-wider">
                      {order.checkoutDetails.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 ml-5 border border-gray border-solid">
              <h2 className="text-xl font-semibold capitalize mb-5">
                Đơn Hàng của bạn
              </h2>
              <div className="mb-7">
                <div>
                  <div className="flex justify-between mb-5">
                    <span className="font-semibold">Sản Phẩm</span>
                    <span className="font-semibold">Tạm Tính </span>
                  </div>
                  {cartItems.map((item) => {
                    return (
                      <div
                        key={item.product}
                        className="flex justify-between border-gray-7 py-2 border-t border-solid"
                      >
                        <span className="pr-3">
                          {item.name}{" "}
                          <span className="ml-3">
                            <i className="material-icons text-10">close</i>
                            {item.amount}
                          </span>{" "}
                        </span>
                        <span>
                          {formatPrice(
                            Number(item.amount) * Number(item.price)
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between py-4 border-gray-7 border-t border-solid">
                  <span className="font-semibold"> Tổng tiền : </span>{" "}
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between py-4 border-gray-7 border-t border-solid">
                  <span className="font-semibold"> Phí Giao Hàng : </span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-6 border-gray-7 border-t border-solid">
                  <span className="font-semibold"> Tổng Đơn Hàng : </span>
                  <span>{formatPrice(totalOrder)}</span>
                </div>
              </div>

              <PayPalButton
                amount={totalOrderDollar}
                onSuccess={successPaymentHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paypal;
