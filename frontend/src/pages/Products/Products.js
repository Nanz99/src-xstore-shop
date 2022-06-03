/** @format */

import React, { useEffect } from "react";
import Meta from "./../../components/Meta/Meta";
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb";
import Filters from "./Filters/Filters";
import Sort from "./Sort/Sort";
import ProductContent from "./ProductContent/ProductContent";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../../actions/productActions";


function Products() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listCategories())
  }, [dispatch]);
  const { categories } = useSelector((state) => state.productCategory);

  // if (!products) return <Loading />;
  return (
    <div>
      <Meta title="Sản Phẩm" />
      <Breadcrumb title="Sản Phẩm" />
      <div className="py-14 px-8">
        <div className="grid grid-cols-2-20-80 ">
          <Filters categories={categories} />
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
