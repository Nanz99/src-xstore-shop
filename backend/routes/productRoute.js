/** @format */

import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import { APIFeatures } from "../utils.js";
import cloudinary from "cloudinary"


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
// productRouter.get(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     // const products = await Product.find({});
//     // if (products) {
//     //   res.send({ succees: true, productLength: products.length, products });
//     // } else {
//     //   res.status(404).send({ status: "404 Not Found" });
//     // }

//     // const resPerPage = 25;
//     const productCount = await Product.countDocuments();
//     const apiFeatures = new APIFeatures(Product.find({}), req.query)
//       .search()
//       .filter();
  
//     let products = await apiFeatures.query;
//     let filteredProductsCount = products.length;
  
//     // apiFeatures.pagination(resPerPage);
//     products = await apiFeatures.query;

//     if(!products){
//       res.status(404).send({ status: "404 Not Found" });
//     }
//     res.status(200).json({
//       success: true,
//       productCount,
//       filteredProductsCount,
//       products,
//     });
//   })
// );

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limitProduct) || 8;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
    const seller = req.query.seller || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
          ? { price: -1 }
          : order === 'toprated'
            ? { rating: -1 }
            : { _id: -1 };
    const count = await Product.countDocuments({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate('seller', 'seller.name seller.logo')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ success: true, products, page, pages: Math.ceil(count / pageSize), productCount: count, filteredProductsCount: count });
  })
);
//! Get categories
productRouter.get("/categories", expressAsyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");
  if (categories) {
    res.send({ success: true, categories });
  } else {
    res.status(404).send({ status: "404 Not Found" });
  }
}));
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
  "/add",
  expressAsyncHandler(async (req, res) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    // req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.send(product);
  })
);




export default productRouter;
