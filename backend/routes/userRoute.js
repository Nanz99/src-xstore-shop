/** @format */

import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

//! Get data from local
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

//! function Login
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          numberPhone: user.numberPhone,
          birthday: user.birthday,
          gender: user.gender,
          token: generateToken(user),
          accessToken: generateToken(user),
          success: true,
        });
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

//! function Register
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const newUser = await user.save();
    res.send({ success: true, token: generateToken(newUser) });
  })
);

//! funtion get info one user by Id
userRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    user
      ? res.send(user)
      : res.status(404).send({ message: "User Not Found" });
  })
);

//! function all user - admin
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    if (users) {
      res.send({ succees: true, users });
    }
  })
);

//! function Delete User
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@gmail.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      } else {
        const deletedUser = await user.remove();
        res.send({ success: true, deletedUser });
      }
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

//! function update user
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.numberPhone = req.body.numberPhone || user.numberPhone;
      user.birthday = req.body.birthday || user.birthday;
      user.gender = req.body.gender || user.gender;


      // if (req.body.password) {
      //   user.password = bcrypt.hashSync(req.body.password, 8) || user.password;
      // }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        numberPhone: updatedUser.numberPhone,
        birthday: updatedUser.birthday,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

//! function update user - admin
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ success: true, user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
export default userRouter;
