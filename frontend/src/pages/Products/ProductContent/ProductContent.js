/** @format */

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import Product from "../../../components/Product/Product";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { listProducts } from "actions/productActions";



function ProductContent() {
 

  const [currentpage,setCurrentPage] = useState(1)
  // function setCurrentPageNo(pageNumber) {
  //   setCurrentPage(pageNumber);
  // }

  const dispatch = useDispatch();
  const { products, loading, pages, page } = useSelector((state) => state.productList);
  // const { filterdProducts, resPerPage, filteredProductsCount, productsCount } = useSelector((state) => state.productFilters);
  const handleChange = (e, value) => {
    setCurrentPage(value);
  };
  useEffect(() => {
    dispatch(listProducts({ pageNumber: currentpage }));
  }, [dispatch,currentpage])

  // if(!filterdProducts) return <Loading />;
  if (loading) return <Loading />;
  return (
    <div>
      <div>
        <div className="grid grid-cols-4  ">
          {products?.map((product) => {
            return <Product key={product._id} product={product} />;
          })}
        </div>
      {/* {filterdProducts && filterdProducts.length > 0 ? (
        <div className="grid grid-cols-4  ">
            {products.map((product) => {
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
      )} */}
    </div>
      <div style={{ width: '100%', margin: 'auto', display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
        <Stack spacing={2}>
        
          <Pagination count={pages} page={page} color="secondary" onChange={handleChange} />
   
        </Stack>
    </div>
    </div>
  );
}

export default ProductContent;
