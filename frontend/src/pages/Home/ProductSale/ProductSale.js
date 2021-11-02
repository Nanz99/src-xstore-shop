/** @format */

import React from "react";
import Slider from "react-slick";
import Product from "../../../components/Product/Product";
import './ProductSale.css'

function ProductSale({ products }) {
  const settings = {
    dots: false,
    nav: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    margin: 10,
    padding: 10,
  };
  return (
    <div className="py-16 px-8">
      <h2 className="text-4xl font-semibold text-center mb-9">
        SẢN PHẨM KHUYẾN MÃI
      </h2>
      <Slider {...settings} className="slick-container-2">
        {products &&
          products
            .filter((product) => product.productSale === true)
            .map((product) => {
              return <Product  key={product._id} product={product} />;
            })}
      </Slider>
    </div>
  );
}

export default ProductSale;
