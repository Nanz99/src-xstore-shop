/** @format */

import React, { useEffect } from "react";
import Banner from "./Banner/Banner";
import Carousels from "./Carousels/Carousels";
import NewArrivals from "./NewArrivals/NewArrivals";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";
import InfoProduct from "./InfoProduct/InfoProduct";
import ProductSale from "./ProductSale/ProductSale";
import Meta from "../../components/Meta/Meta";


function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector(
    (state) => state.productList
  );
  useEffect(() => {
	 dispatch(listProducts())
  }, [dispatch])
  return (
    <div>
      <Meta title="Trang Chủ"/>
      <Carousels />
      
      <NewArrivals products={products} />
      <Banner />
		<InfoProduct/>
    <ProductSale products={products} />
    </div>
  );
}

export default Home;
