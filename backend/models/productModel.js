/** @format */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: Array},
    price: { type: Number, default: 0},
    countInStock: { type: Number, required: true },
    rating: { type: Number },
    numReviews: { type: Number },
    description: { type: String },
    colors: { type: Array},
    size: { type: Array},
    newArrivals: { type: Boolean, default: false },
    productSale: { type: Boolean, default: false},
    saleOf: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
