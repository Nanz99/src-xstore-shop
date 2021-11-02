/** @format */

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { productDetails } from "../../actions/productActions";
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb";
import AddToCart from "./AddToCart/AddToCart";
import ProductImages from "./ProductImages/ProductImages";
import Meta from "./../../components/Meta/Meta";
import { formatPrice } from "./../../utils/helper";
import Loading from "../../components/Loading/Loading";
import Stars from "./Stars/Stars";

function ProductDetails(props) {
  const productId = props.match.params.id;

  const { product, loading } = useSelector((state) => state.productDetails);
  const dispacth = useDispatch();
  useEffect(() => {
    dispacth(productDetails(productId));
  }, [dispacth, productId]);

  if (!product) return <Loading/>;
  const { name, images, price, description, _id,rating,numReviews, countInStock } = product;
  return (
    <div className="relative ">
      <Meta title={name} />
      <Breadcrumb title={name} product />
      {loading ? (
        <Loading />
      ) : (
        <div className="pt-10 pb-20 px-8">
          <Link
            to="/san-pham"
            className="block w-48 px-6 py-2 uppercase text-center text-base border-black border-2 border-solid hover:bg-red-1 hover:border-red-1 hover:text-white"
          >
            Tất Cả Sản Phẩm
          </Link>
          <div className="grid grid-cols-2-60-40 pt-9 ">
            <div>{images && <ProductImages images={images} />}</div>
            <div className="pl-4">
              <h2 className="text-2xl font-bold text-black ">{name}</h2>
              <p className="mb-5">
                <span className="text-xs font-semibold text-gray ">
                  SKU : {_id}
                </span>
              </p>
              <Stars stars={rating} reviews={numReviews} />
              <h5 className="text-base mb-6 font-semibold py-3 border-solid border-gray-6 border-t border-b">
                {formatPrice(price)}
              </h5>
              <p className="mb-5">
                <span className="text-base font-semibold">Tình Trạng : </span>
                {countInStock > 0 ? "Còn Hàng" : "Hết Hàng"}
              </p>
              {countInStock > 0 && <AddToCart product={product} />}
              <p className="">
                <span className="block text-base font-semibold">
                  Thông tin sản phẩm :{" "}
                </span>
                <span className="text-sm">{description}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
