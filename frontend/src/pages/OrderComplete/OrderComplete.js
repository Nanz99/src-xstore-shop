/** @format */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { formatPrice } from "../../utils/helper";
import BankTransfer from "./BankTransfer/BankTransfer";
import { useDispatch } from "react-redux";
import { detailsOrder, payOrderVnpay } from "../../actions/orderActions";
import successimg from "../../assets/images/thanh-toan/success.jpg";
import dateFormat from "dateformat";
import { ORDER_CREATE_RESET, ORDER_PAY_RESET } from "../../constants/orderConstants";
import qs from "qs";

function OrderComplete(props) {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orderDetails);
  const { paypalResult } = useSelector((state) => state.orderPay);
  const orderId = props.match.params.id;

  const vnp_Params = props.location.search;
  const vnp_Amount =
    Number(
      qs.parse(vnp_Params, {
        ignoreQueryPrefix: true,
      }).vnp_Amount
    ) / 100;
  const vnp_BankCode = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_BankCode;
  const vnp_CardType = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_CardType;
  const vnp_ResponseCode = qs.parse(vnp_Params, {
    ignoreQueryPrefix: true,
  }).vnp_ResponseCode;

  //Handle
  useEffect(() => {
    dispatch(detailsOrder(orderId));
    dispatch({ type: ORDER_CREATE_RESET });
  }, [dispatch, orderId]);

  useEffect(() => {
    if (vnp_Amount && vnp_BankCode && vnp_CardType && vnp_ResponseCode) {
      const vnpayResult = {
        amount: vnp_Amount,
        bankCode: vnp_BankCode,
        cardType: vnp_CardType,
        responseCode: vnp_ResponseCode,
      };
      if (vnp_ResponseCode === "00") {
        dispatch(payOrderVnpay(order, vnpayResult));
        dispatch({ type: ORDER_PAY_RESET });
      }
    }
  }, [
    dispatch,
    order,
    vnp_BankCode,
    vnp_CardType,
    vnp_ResponseCode,
    vnp_Amount,
  ]);
  if (!order) return <Loading />;
  return (
    <div className="py-20 px-20 ">
      <h3 className="mb-8 text-4xl">
        Cảm ơn bạn. Đơn hàng của bạn đã được nhận.
      </h3>
      <div className="grid grid-cols-4 mb-4 pb-4 border-b-2 border-solid border-gray  ">
        <div>
          <h3 className="text-base uppercase font-semibold ">Mã đơn hàng</h3>
          <p className="text-gray">{order._id}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold">Thời gian</h3>
          <p className="text-gray">
            {dateFormat(order.createdAt, "HH:MM dd-mm-yyyy")}
          </p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">Tổng Cộng</h3>
          <p className="text-gray">
            {formatPrice(order.checkoutDetails.totalOrder)}
          </p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">
            Phương Thức Thanh Toán
          </h3>
          <p className="text-gray">{order.checkoutDetails.paymentMethod}</p>
        </div>
      </div>

      <div className="text-center w-full m-auto flex justify-center">
        <img src={successimg} alt="" />
      </div>

      <div>
        <h2 className="text-3xl mb-5 tracking-wider text-gray capitalize">
          Thông tin thanh toán
        </h2>
        {order.checkoutDetails.paymentMethod === "Thanh Toán Khi Nhận Hàng" && (
          <h2 className="text-base font-semibold py-8 ">
            Trả tiền mặt khi nhận hàng.
          </h2>
        )}
        {order.checkoutDetails.paymentMethod === "Chuyển Khoản Ngân Hàng" && (
          <BankTransfer />
        )}
        {order.checkoutDetails.paymentMethod === "Paypal" ? (
          <div>
            {paypalResult && (
              <div>
                <p className="py-2 tracking-wider ">
                  <span className="font-semibold">Trạng Thái : </span>
                  <span>{`${(paypalResult.status = "COMPLETED"
                    ? "Bạn Đã Thanh Toán Thành Công"
                    : "Thanh Toán Thất Bại")}`}</span>
                </p>
                {paypalResult.payer && (
                  <p className="py-2 tracking-wider">
                    <span className="font-semibold">
                      Tài khoản thanh toán :{" "}
                    </span>{" "}
                    <span>{paypalResult.payer.email_address}</span>
                  </p>
                )}

                {paypalResult.payer && (
                  <p className="py-2 tracking-wider">
                    <span className="font-semibold">Người Thanh Toán: </span>{" "}
                    <span>
                      {paypalResult.payer.name.given_name}{" "}
                      {paypalResult.payer.name.surname}
                    </span>
                  </p>
                )}

                {paypalResult.payer && (
                  <p className="py-2 tracking-wider">
                    <span className="font-semibold">Quốc Gia: </span>{" "}
                    <span>{paypalResult.payer.address.country_code}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        {order.checkoutDetails.paymentMethod === "Thanh Toán Qua VNPAY" ? (
          <div className=" text-left">
            <p className="text-lg tracking-wider font-semibold p-1">
              Thanh toán{" "}
              {`${vnp_ResponseCode === "00" ? "Thành Công" : "Thất Bại"}`}
            </p>
            <p className="text-lg tracking-wider p-1">
              <span className="font-semibold">Hình thức thanh toán: </span>{" "}
              <span>Qua {vnp_CardType}</span>{" "}
            </p>
            <p className="text-lg tracking-wider p-1">
              <span className="font-semibold">Ngân hàng: </span>{" "}
              <span>{vnp_BankCode} Bank</span>{" "}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default OrderComplete;
