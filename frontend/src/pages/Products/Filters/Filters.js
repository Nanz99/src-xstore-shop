/** @format */

import React, { useEffect, useState } from "react";
import { getUniqueValues } from "../../../utils/helper";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useDispatch } from "react-redux";
import {
  getProductsByCategory,
  getProductsByPrice,
  productFilterByColor,
} from "../../../actions/productActions";
import { Disclosure } from "@headlessui/react";

import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/solid";
import "./Filters.css";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "#f2f2f2", label: "White", checked: false },
      { value: "#000000", label: "Black", checked: false },
      { value: "yellow", label: "yellow", checked: false },
      { value: "gray", label: "Gray", checked: false },
      { value: "blue", label: "Blue", checked: false },
      { value: "red", label: "Red", checked: false },
    ],
  },

  {
    id: "size",
    name: "Size",
    options: [
      { value: "XS", label: "XS", checked: false },
      { value: "S", label: "S", checked: false },
      { value: "M", label: "M", checked: false },
      { value: "L", label: "L", checked: false },
      { value: "XL", label: "XL", checked: false },
    ],
  },
];

function Filters({ products }) {
  const dispatch = useDispatch();
  // const {products} = useSelector(state => state.productList)
  // const [currentPage, setCurrentPage] = useState(1);

  const [price, setPrice] = useState([1, 1000000]);
  const [category, setCategory] = useState("");
  // const [rating, setRating] = useState(0);

  const categories = getUniqueValues(products, "category").sort(function (
    a,
    b
  ) {
    if (a > b) {
      return -1;
    }
    if (a < b) {
      return 1;
    }
    return 0;
  });

  // useEffect(() => {
  //   dispatch(getProductsByRating(rating));
  // }, [dispatch, rating]);

  const [color, setColor] = useState("");

  useEffect(() => {
    dispatch(productFilterByColor(color));
  }, [dispatch, color]);
  useEffect(() => {
    dispatch(getProductsByCategory(category));
  }, [dispatch, category]);
  useEffect(() => {
    dispatch(getProductsByPrice(price));
  }, [dispatch, price]);

  const clearFilter = () => {
    setPrice([1, 1000000]);
    setCategory("");
    setColor("");
  };
  return (
    <div className="pr-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Danh Mục Sản Phẩm</h2>
        <ul>
          {categories.map((item, index) => {
            return (
              <li
                className={`${
                  category === item
                    ? "block font-semibold text-base px-2 py-1 cursor-pointer "
                    : "block text-base px-2 py-1 cursor-pointer "
                }`}
                key={index}
                onClick={() => setCategory(item)}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-8">Giá</h2>
        <Range
          marks={{
            1: `1đ`,
            1000000: `1000000đ`,
          }}
          min={1}
          max={1000000}
          defaultValue={[1, 1000000]}
          tipFormatter={(value) => `${value} đ`}
          tipProps={{
            placement: "top",
            visible: true,
          }}
          value={price}
          onChange={(price) => setPrice(price)}
        />
      </div>

      {/* <div className="mb-4 mt-4">
        <h2 className="text-xl font-semibold mb-4">Đánh Giá</h2>
        <ul className="">
          {[5, 4, 3, 2, 1].map((star) => (
            <li
              style={{
                cursor: "pointer",
                listStyleType: "none",
              }}
              key={star}
              onClick={() => setRating(star)}
            >
              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{
                    width: `${star * 20}%`,
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
        */}

      <div className="mt-8 block">
        <form className="mt-4 ">
          <h3 className="sr-only">Categories</h3>
          {filters.map((section) => (
            <Disclosure
              as="div"
              key={section.id}
              className="border-t border-gray-100 px-4 py-6"
            >
              {({ open }) => (
                <>
                  <h3 className="-mx-2 -my-3 flow-root">
                    <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">
                        {section.name}
                      </span>
                      <span className="ml-6 flex items-center">
                        {open ? (
                          <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <Disclosure.Panel className="pt-6">
                    <div className="space-y-6">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-mobile-${section.id}-${optionIdx}`}
                            name="colors"
                            defaultValue={option.value}
                            type="radio"
                            defaultChecked={option.checked}
                            onChange={() => setColor(option.value)}
                            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                            className="ml-3 min-w-0 flex-1 text-gray-500"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </form>
      </div>

      <div className="pt-10 ">
        <button
          className="py-2 px-6 bg-transparent border-2 border-solid border-black hover:bg-red-1 hover:border-red-1 hover:text-white"
          onClick={clearFilter}
        >
          {" "}
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default Filters;
