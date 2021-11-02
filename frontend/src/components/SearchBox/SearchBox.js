/** @format */

import React, { useState } from "react";
import './SearchBox.css'
import { useDispatch, useSelector } from "react-redux";
import {
  closeModalSearch,
  getProductsBySearch,
} from "../../actions/productActions";

import { formatPrice } from "./../../utils/helper";
import { Link } from "react-router-dom";

function SearchBox(props) {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.openModalSearch);
  const { filterdProducts } = useSelector((state) => state.productSearch);
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if(keyword){
      dispatch(getProductsBySearch(keyword));
    }
   
  };

  return (
    <div
      className={`${
        isOpen
          ? "block w-full min-h-screen fixed top-0 left-0 bg-black-1 z-1000 pt-9 scale-100 opacity-100 transition duration-500 ease-in-out"
          : "hidden w-full h-screen fixed top-0 left-0 bg-black-1 z-1000 pt-9 transform scale-0 opacity-0 transition duration-500 ease-in-out "
      }`}
    >
      <div className="flex justify-center">
        <form action="" onSubmit={submitHandler}>
          <input
            type="text"
            name="Search"
            id="search"
            placeholder="Search ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className=" search-input block w-500px p-5 bg-transparent text-2xl text-white border-white border-b-2 border-solid focus:outline-none focus:border-red-1 focus:placeholder-transparent focus:shadow-none"
          />
        </form>
        <button
          className="absolute right-10 top-10 text-white "
          onClick={() => dispatch(closeModalSearch())}
        >
          <i className="material-icons text-4xl">close</i>
        </button>
      </div>
      <div>
        <div className="grid grid-cols-1 w-500px m-auto pt-6">
          {!keyword
            ? null
            : filterdProducts &&
              filterdProducts.map((product) => {
                return (
                  <div key={product._id} className="flex items-center py-2">
                    <div>
                      <img
                        src={product.images && product.images[0].url}
                        alt={product.name}
                        className="h-20 w-20 block"
                      />
                    </div>
                    <div className="ml-3">
                      <Link to={`/san-pham/${product._id}`} onClick={() =>{
                        console.log(props.location)
                        if(props.location === undefined){
                          dispatch(closeModalSearch())
                          setKeyword("")
                        }
                      }}>
                        <h3 className="text-base  mb-2 text-white">
                          {product.name}
                        </h3>
                      </Link>
                      <p className=" block text-base font-bold text-white">
                        {formatPrice(product.price)}
                        <del className="text-sm text-gray font-normal ml-2">
                          {formatPrice(product.price + 50000)}
                        </del>{" "}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
