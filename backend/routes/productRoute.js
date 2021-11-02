/** @format */

import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import { APIFeatures } from "../utils.js";

const productRouter = express.Router();

//! Insert Product
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const products = await Product.insertMany(data.products);
    res.send({
      success: true,
      products,
    });
  })
);

//! Get All Products
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // const products = await Product.find({});
    // if (products) {
    //   res.send({ succees: true, productLength: products.length, products });
    // } else {
    //   res.status(404).send({ status: "404 Not Found" });
    // }

    const resPerPage = 25;
    const productCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find({}), req.query)
      .search()
      .filter();
  
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;
  
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    if(!products){
      res.status(404).send({ status: "404 Not Found" });
    }
    res.status(200).json({
      success: true,
      productCount,
      resPerPage,
      filteredProductsCount,
      products,
    });
  })
);

//! Get Single Product
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send({ succees: true, product });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
// Delete product
productRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deletedProduct = await product.remove();
      res.send({
        success: true,
        deletedProduct,
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

//! Update Product
productRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.description = req.body.description || product.description;
      const updatedProduct = await product.save();
      res.send({ success: true, updatedProduct });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

//! Create Product
productRouter.post(
  "/new-product",
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      countInStock: req.body.countInStock,
      description: req.body.description,
      category: req.body.category,
    });
    const newProduct = await product.save();
    res.send({ success: true, newProduct });
  })
);




export default productRouter;
