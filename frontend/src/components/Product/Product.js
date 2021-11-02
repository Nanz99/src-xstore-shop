/** @format */

import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../actions/cartActions";
import { formatPrice } from "./../../utils/helper";

function Product({ product }) {
  const dispatch = useDispatch();
  return (
    <div className="p-3 overflow-hidden block relative group">
      <picture className="h-auto w-full block mb-4 relative overflow-hidden">
        <Link to={`/san-pham/${product._id}`}>
          <img
            src={product.images && product.images[0].url}
            alt={product.name}
            className="transform hover:scale-110 motion-reduce:transform-none transition-transform"
          />
        </Link>
        {product.countInStock > 0 ? (
          <button
            type="button"
            onClick={() => {
              dispatch(
                addToCart(product._id, product.colors[0], product.size[0], 1)
              );
              toast.success("Sản Phẩm Đã Được Thêm Vào Giỏ Hàng");
            }}
            className="absolute bottom-0 left-0 w-full block opacity-0 py-2 px-6 text-white bg-black rounded-none group-hover:opacity-100 transition-opacity"
          >
            Thêm Vào Giỏ Hàng
          </button>
        ) : (
          <button disabled
            type="button"
            className="absolute bottom-0 left-0 w-full block opacity-0 py-2 px-6 text-white bg-black rounded-none group-hover:opacity-100 transition-opacity"
          >
            Hết Hàng
          </button>
        )}
      </picture>

      <div>
        <Link to={`/san-pham/${product._id}`}>
          <h3 className="text-base text-center mb-2">{product.name}</h3>
        </Link>
        <p className=" block text-base font-bold text-center">
          {formatPrice(product.price)}
          <del className="text-sm text-gray font-normal ml-2">
            {formatPrice(product.price + 50000)}
          </del>{" "}
        </p>
      </div>
    </div>
  );
}

export default Product;
