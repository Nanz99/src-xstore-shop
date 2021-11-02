/** @format */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: Array, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number },
    numReviews: { type: Number },
    description: { type: String },
    colors: { type: Array, required: true },
    size: { type: Array, required: true },
    newArrivals: { type: Boolean },
    productSale: { type: Boolean },
    saleOf: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
