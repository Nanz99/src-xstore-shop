/** @format */

import React from "react";

function TopHeader() {
  return (
    <div className="flex justify-between items-center px-14 py-1 bg-gray text-white ">
      <p className="py-1 text-xs leading-5">
        Miễn phí giao hàng toàn quốc với đơn hàng trên <strong>500k</strong>
      </p>
      <div className="flex	items-center">
        <div className=" border-r border-white pr-4">
          <i className="fa fa-phone border inline-block border-white rounded-full border-solid text-center text-10 leading-22 w-6 h-6 mr-1	"></i>
          <span className="inline text-xs font-bold leading-4">
            Hotline: 028 0000 9999
          </span>
        </div>
        <ul className="inline pl-3">
          <li className="inline text-14 mx-2 text-gray-900">
            <i className="fab fa-facebook-f"></i>
          </li>
          <li className="inline text-14 mx-2 text-gray-900">
            <i className="fab fa-instagram"></i>
          </li>
          <li className="inline text-14 mx-2 text-gray-900">
            <i className="fab fa-twitter"></i>
          </li>
          <li className="inline text-14 mx-2 text-gray-900">
            <i className="fab fa-youtube"></i>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TopHeader;
