/** @format */

import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-footer bg-center bg-repeat w-full h-auto bg-gray-4">
      <div className="px-8 py-12 border-b border-solid border-gray-2 grid grid-cols-4 place-items-center">
        <div className ="p-2">
          <ul>
            <li className="flex mb-5">
              <div>
                <i className="fa fa-phone-volume text-white text-5xl"></i>
              </div>
              <div className="pl-3">
                <h3 className="text-white uppercase mb-2">
                  CHÚNG TÔI HỖ TRỢ THEO YÊU CẦU 24/7
                </h3>
                <p className="text-gray-3">
                  Nếu bạn cần hỗ trợ, hãy gửi tin nhắn cho chúng tôi
                </p>
              </div>
            </li>
            <li className="flex ">
              <div>
                <i className="fa fa-headphones-alt text-white text-5xl"></i>
              </div>
              <div className="pl-3">
                <p className="text-gray-3 text-base mb-2">
                  Có câu hỏi? Gọi cho chúng tôi 24/7
                </p>
                <h3 className="text-red-1 text-xl">(012) 345 000 789</h3>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <div>
            <h3 className="text-white uppercase mb-2 font-semibold">
              Hệ Thống Cửa Hàng
            </h3>
            <ul>
              <li className="text-gray-3 hover:text-white py-1">TP.HCM: 17 Cộng Hòa</li>
              <li className="text-gray-3 hover:text-white py-1">  
                Hà Nội: 141 Chiến Thắng
              </li>
            </ul>
          </div>
          <div className="mt-3">
            <h3 className="text-white uppercase mb-2 font-semibold">
              Follow Us
            </h3>
            <ul className="py-2">
              <li>
                <ul className="inline ">
                  <li className="inline text-base mx-2 text-gray-5">
                    <i className="fab fa-facebook-f"></i>
                  </li>
                  <li className="inline text-base mx-2 text-gray-5">
                    <i className="fab fa-instagram"></i>
                  </li>
                  <li className="inline text-base mx-2 text-gray-5">
                    <i className="fab fa-twitter"></i>
                  </li>
                  <li className="inline text-base mx-2 text-gray-5	">
                    <i className="fab fa-youtube"></i>
                  </li>
                </ul>
              </li>
              <li className="text-gray-3 mt-1">
                Email:{" "}
                <span className="text-white hover:text-red-1">iamanhnhut.0101@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-start-3 col-span-2">
          <h3 className="text-xl text-white uppercase font-semibold mb-4">
            ĐĂNG KÝ ĐỂ NHẬN BẢN TIN
          </h3>
          <div className="">
            <input
              type="text"
              className="py-3 search-input px-0 border-solid text-white border-gray-5 border-b-2 bg-transparent focus:outline-none focus:border-red-1 w-96 "
              placeholder="Enter email address"
            />
            <button className="ml-3 bg-transparent rounded-none p-3 px-5 text-base	text-white border-solid border-2 border-white uppercase hover:bg-red-1 hover:border-red-1">
              Đồng ý
            </button>
          </div>
        </div>
      </div>
      <div className="w-full text-center px-8 py-5 text-gray-3 text-lg">
        <Link to="/">
          @{new Date().getFullYear()} with{" "}
          <span className="text-red-1">Anh Nhựt</span>
        </Link>
      </div>
    </div>
  );
}

export default Footer;
