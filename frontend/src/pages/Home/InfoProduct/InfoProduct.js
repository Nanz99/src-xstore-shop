/** @format */

import React from "react";

function InfoProduct() {
  return (
    <div>
      <div className="bg-secondary bg-cover h-40 w-full flex my-auto mx-auto justify-between">
        <div className="grid grid-cols-4 w-full place-items-center">
          <div className="flex items-center">
            <div>
              <i className="fa fa-shipping-fast text-4xl text-red-500"></i>
            </div>
            <div className="ml-3">
              <h3 className="uppercase text-white font-bold">
                Freeship Đơn hàng
              </h3>
              <p className="capitalize text-gray font-medium">Trên 500k</p>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <i className="fa fa-sync-alt text-4xl text-red-500"></i>
            </div>
            <div className="ml-3">
              <h3 className="uppercase text-white font-bold">Đổi Trả</h3>
              <p className="capitalize text-gray font-medium">
                Trong vòng 7 ngày
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <i className="fa fa-shield-alt text-4xl text-red-500"></i>
            </div>
            <div className="ml-3">
              <h3 className="uppercase text-white font-bold">
                Thanh toán bảo mật
              </h3>
              <p className="capitalize text-gray font-medium">
                Không phí giao dịch
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <i className="fa fa-gift text-4xl text-red-500"></i>
            </div>
            <div className="ml-3">
              <h3 className="uppercase text-white font-bold">Ưu đãi cho thành viên</h3>
              <p className="capitalize text-gray font-medium">mã giảm giá và ưu đãi</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-line-bottom w-full h-4"></div>
    </div>
  );
}

export default InfoProduct;
