/** @format */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsOrder, paymentWithVNPAY } from "../../actions/orderActions";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loading from "../../components/Loading/Loading";
import Meta from "../../components/Meta/Meta";
import { formatPrice } from "../../utils/helper";

function Vnpay(props) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const orderId = props.match.params.id;
  const { cartItems } = cart;
  const { order, loading } = useSelector((state) => state.orderDetails);
  const { vnpayUrl, loading: loadingVnpay } = useSelector(
    (state) => state.orderPaymentVNPAY
  );
  // tinh tien san pham
  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.amount, 0);
  const shippingFee = totalPrice > 500000 ? 0 : 25000;
  const totalOrder = totalPrice + shippingFee;
  const orderType = "Thanh Toan Hoa Don";
  const amount = totalOrder;
  const orderDescription = "Thanh toán hóa đơn thời trang ";
  const language = "vn";
  const bankCode = "";

  // Handle
  useEffect(() => {
    dispatch(detailsOrder(orderId));
  }, [dispatch, orderId]);
  useEffect(() => {
    dispatch(
      paymentWithVNPAY(
        orderId,
        amount,
        bankCode,
        orderDescription,
        orderType,
        language
      )
    );
  }, [
    dispatch,
    orderId,
    amount,
    bankCode,
    orderDescription,
    orderType,
    language,
  ]);
  
  if (!order) return <Loading />;
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Meta title="Thanh Toán với Vnpay" />
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
                          (+84){" "} 
                            {order.checkoutDetails.numberPhone}
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

                    <div className="pt-10">
                      {!loadingVnpay && (
                        <a
                          href={vnpayUrl}
                          className="block w-64 px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
                        >
                          Xác Nhận Thanh Toán
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vnpay;
