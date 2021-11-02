/** @format */

import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch } from 'react-redux';
import {
  ChevronDownIcon,

} from "@heroicons/react/solid";
import { sortBestRating, sortNewest, sortPriceHighest, sortPriceLowest } from "../../../actions/productActions";



const sortOptions = [
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Sort() {
	const dispatch = useDispatch();
	const [sortValue,setSortValue] = useState('')
	console.log(sortValue)
	useEffect(() => {
		if(sortValue === "Price: Low to High"){
			dispatch(sortPriceLowest())
		}
		if(sortValue === "Price: High to Low"){
			dispatch(sortPriceHighest())
		}
		if(sortValue === "Best Rating"){
			dispatch(sortBestRating())
		}
		if(sortValue === "Newest"){
			dispatch(sortNewest())
		}
	},[dispatch,sortValue])
  return (
    <div className="z-50 relative text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="group inline-flex justify-center items-center text-base font-medium text-gray-700 hover:text-gray-900 py-2 px-6 bg-gray">
            Sắp Xếp Theo 
            <ChevronDownIcon
              className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {sortOptions.map((option) => (
                <Menu.Item key={option.name} onClick={() => setSortValue(option.name)}> 
                  {({ active }) => (
                    <a
                      href={option.href}
                      className={classNames(
                        option.current
                          ? "font-medium text-gray-900"
                          : "text-gray-500",
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      {option.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

export default Sort;
