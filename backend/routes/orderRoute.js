/** @format */

import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth } from "../utils.js";

let orderRouter = express.Router();


//Danh sach Don Hang
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
      res.status(404).send({ message: "Order Not Found" });
    }
    res.send(orders);
  })
);

//Order Details
orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is empty" });
    } else {
      let order = new Order({
        orderItems: req.body.orderItems,
        checkoutDetails: req.body.checkoutDetails,
        paymentResult: req.body.paymentResult,
        user: req.user._id,
      });
      let createdOrder = await order.save();
      res.status(201).send(createdOrder);
    }
  })
);

//paypal pay
orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paypalResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        payer: req.body.payer,
      };

      let updatedOrder = await order.save();
      // mailgun()
      //   .messages()
      //   .send(
      //     {
      //       from: "Amazona <xstore@mg.yourdomain.com>",
      //       to: `${order.user.name} <${order.user.email}>`,
      //       subject: `New order ${order._id}`,
      //       html: payOrderEmailTemplate(order),
      //     },
      //     (error, body) => {
      //       if (error) {
      //         console.log(error);
      //       } else {
      //         console.log(body);
      //       }
      //     }
      //   );
      res.send(updatedOrder);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

//vnpay pay
orderRouter.put(
  "/:id/pay-vnpay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.vnpayResult = {
        amount: req.body.amount,
        bankCode: req.body.bankCode,
        cardType: req.body.cardType,
        responseCode: req.body.responseCode,
      };
      const updatedOrder = await order.save();

      res.send(updatedOrder);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
