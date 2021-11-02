/** @format */

import { Link } from "react-router-dom";
function Breadcrumb({ title, product,order }) {
  return (
    <div className="w-full h-14 bg-gray-6 flex items-center px-8">
      <div className="text-2-xl text-black text-left ">
        <p>
          <Link to="/" className="mr-2 font-semibold">Trang Chủ</Link>
          {product && <Link to="/san-pham" className="mr-2">/ Sản Phẩm</Link>}
          {order && <Link to="/order-history" className="mr-2">/ Đơn Hàng</Link>}
          / <span className="text-gray">{title}</span>
        </p>
      </div>
    </div>
  );
}

export default Breadcrumb;
