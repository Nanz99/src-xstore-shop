/** @format */

import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../actions/cartActions";
import { toast } from "react-toastify";

function AddToCart({ product }) {
  const { colors, _id, stock, size } = product;
  const [mainColor, setMainColor] = useState(colors[0]);
  const [mainSize, setMainSize] = useState(size[0]);
  const [amount, setAmount] = useState(1);
  const dispatch = useDispatch();
  const increase = () => {
    setAmount((amount) => {
      let tempAmount = amount + 1;
      if (tempAmount > stock) tempAmount = stock;
      return tempAmount;
    });
  };
  const decrease = () => {
    setAmount((amount) => {
      let tempAmount = amount - 1;
      if (tempAmount < 1) tempAmount = 1;
      return tempAmount;
    });
  };
  return (
    <div className="mb-6">
      <div>
        <div className="flex items-center mb-5">
          <span className="mr-3">Màu Sắc :</span>
          {colors.map((color, index) => {
            return (
              <button
                key={index}
                style={{ background: color }}
                className={`${
                  mainColor === color
                    ? "inline-block w-8 h-8 rounded-full opacity-100 mx-1"
                    : "mx-1 inline-block w-6 h-6 rounded-full opacity-70"
                }`}
                onClick={() => setMainColor(color)}
              >
                {mainColor === color ? (
                  <FaCheck className="inline-block w-3 h-3 text-white" />
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="flex items-center">
          <span className="mr-5">Kích cỡ :</span>
          {size.map((s, index) => {
            return (
              <button
                key={index}
                className={`${
                  mainSize === s
                    ? "mx-1 w-8 h-8 text-center text-white bg-red-1 rounded-none border border-gray-5 border-solid"
                    : "mx-1 w-8 h-8 text-center text-black bg-transparent rounded-none border border-gray-5 border-solid"
                }`}
                onClick={() => setMainSize(s)}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center mb-6">
          <button
            type="button"
            className="w-8 h-8 flex justify-center items-center rounded-none border border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white "
            onClick={decrease}
          >
            <i className="fa fa-minus"></i>
          </button>
          <h2 className="mx-4 text-base">{amount}</h2>
          <button
            type="button"
            className="w-8 h-8 flex justify-center items-center rounded-none border border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
            onClick={increase}
          >
            <i className="fa fa-plus"></i>
          </button>
        </div>
        <Link
          to="/gio-hang"
          className="inline-block px-6 py-2 uppercase text-center text-base border-black border-2 border-solid hover:bg-red-1 hover:border-red-1 hover:text-white"
          onClick={() => {
            dispatch(addToCart(_id, mainColor, mainSize, amount));
            toast.success("Sản Phẩm Đã Được Thêm Vào Giỏ Hàng");
          }}
        >
          Thêm vào giỏ hàng
        </Link>
      </div>
    </div>
  );
}

export default React.memo(AddToCart);
