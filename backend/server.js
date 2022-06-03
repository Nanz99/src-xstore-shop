import path from 'path';
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors';
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import fileUpload from 'express-fileupload'
import cloudinary from 'cloudinary'
import authRouter from './routes/authRoute.js';
dotenv.config();

const app = express();

app.use(morgan('dev'));
if(process.env.NODE_ENV='development'){
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
// Connect with Database
mongoose
  .connect(process.env.MONGODB_URL || "mongodb://localhost/xstore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((con) => {
    console.log(
      `MongoDB Database connected successfully with ${con.connection.host}`
    );
  }).catch((err) => {
    console.log("Database error: " + err);
  });

  // const __dirname = path.resolve();
  // app.use(express.static(path.join(__dirname, '/frontend/public')));
  // app.get('*', (req, res) =>
  //   res.sendFile(path.join(__dirname, '/frontend/public/index.html'))
  // );
app.use("/api/auth",authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running ... in http://localhost:${process.env.PORT}`);
});
