/** @format */

import express from "express";
import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";
import querystring from "qs";
import dateFormat from "dateformat";
import { isAuth } from "../utils";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create_vnpayurl", isAuth,
  expressAsyncHandler((req, res, next) => {
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let orderId = req.body.orderId;
    //Thông tin do VNPAY cung 

    let tmnCode = "TFKNMFBX";
    let secretKey = "VSDSRJASTYADHATKXPHDENYUUSSIZADJ";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = `http://localhost:3000/payment/order-complete/${orderId}`;

    let date = new Date();

    let createDate = dateFormat(date, "yyyymmddHHmmss");

    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    let orderInfo = req.body.orderDescription;
    let orderType = req.body.orderType;
    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    //Mã Hóa Thông tin
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return res.send(vnpUrl);
  })
);


function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default paymentRouter;
