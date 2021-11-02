/** @format */

import React from "react";
import { Link } from "react-router-dom";
import Product from "../../../components/Product/Product";

function NewArrivals({ products }) {
  return (
    <div className="py-14 w-full">
      <h2 className="text-4xl text-center font-semibold mb-8">New Arrivals</h2>
      <div className="grid grid-cols-4 px-6 ">
        {products &&
          products
            .filter((product) => product.newArrivals === true)
            .map((product) => {
              return <Product product={product} key={product._id} />;
            })}
      </div>
      <div className="w-full flex justify-center">
        <Link
          to="/san-pham"
          className="border-2 border-solid w-40 m-auto border-black text-center px-6 py-2 hover:bg-red-1 hover:border-red-1 hover:text-white transition-colors"
        >
          Xem Thêm
        </Link>
      </div>
    </div>
  );
}

export default NewArrivals;
