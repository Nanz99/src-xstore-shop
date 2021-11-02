/** @format */

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        mainColor: { type: String, required: true },
        mainSize: { type: String, required: true },
        amount: { type: Number, required: true },
        image: { type: Object, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        // product: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Product",
        //   required: true,
        // },
      },
    ],
    checkoutDetails: {
      fullname: { type: String },
      numberPhone: { type: Number },
      email: { type: String },
      company: { type: String },
      provinceCustomer: { type: String, required: true },
      districtCustomer: { type: String, required: true },
      wardsCustomer: { type: String, required: true },
      address: { type: String, required: true },
      noteOrder: { type: String },
      totalPrice: { type: Number, required: true },
      shippingFee: { type: Number, required: true },
      totalOrder: { type: Number, required: true },
      paymentMethod: { type: String, required: true },
    },
    paypalResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      payer: Object,
    },
    vnpayResult: {
      amount: { type: Number },
      bankCode: { type: String },
      cardType: { type: String },
      responseCode: { type: String },
      type: Object,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;
