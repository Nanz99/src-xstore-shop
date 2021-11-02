/** @format */

import React, { useState } from "react";
import Pagination from "react-js-pagination";
import { useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import Product from "../../../components/Product/Product";

function ProductContent() {
  const { products,loading } = useSelector((state) => state.productList);
  const { filterdProducts,resPerPage,filteredProductsCount,productsCount} = useSelector((state) => state.productFilters);
  const [currentpage,setCurrentPage] = useState(1)
  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }
  if(!filterdProducts) return <Loading />;
  return (
    <div>
      <div>
      {filterdProducts && filterdProducts.length > 0 ? (
        <div className="grid grid-cols-4  ">
          {filterdProducts.map((product) => {
            return <Product key={product._id} product={product} />;
          })}
        </div>
      ) : (
        <div className="grid grid-cols-4  ">
          {loading ? <Loading/> :
            products.map((product) => {
              return <Product key={product._id} product={product} />;
            })}
        </div>
      )}
    </div>
    <div>
    {resPerPage <= filteredProductsCount && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentpage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
    </div>
    </div>
  );
}

export default ProductContent;
