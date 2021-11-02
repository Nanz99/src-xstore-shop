/** @format */

import React, { useEffect } from "react";
import Meta from "./../../components/Meta/Meta";
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb";
import Filters from "./Filters/Filters";
import Sort from "./Sort/Sort";
import ProductContent from "./ProductContent/ProductContent";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";
import Loading from "../../components/Loading/Loading";

function Products() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  const { products } = useSelector((state) => state.productList);
 
  if (!products) return <Loading />;
  return (
    <div>
      <Meta title="Sản Phẩm" />
      <Breadcrumb title="Sản Phẩm" />
      <div className="py-14 px-8">
        <div className="grid grid-cols-2-20-80 ">
          <Filters products={products} />
          <div className="pl-5"> 
            <Sort />
            <ProductContent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
