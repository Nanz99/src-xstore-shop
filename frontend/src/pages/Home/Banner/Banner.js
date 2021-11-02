/** @format */

import React from "react";
import "./Banner.css";
// import { Link } from "react-router-dom";
// import BannerSale from "../../../assets/images/banner-1.jpg";

function Banner() {
  return (
    <div className="bg-banner-1 h-96 bg-cover bg-fixed bg-center flex justify-center items-center w-full ">
      {/* <div className="w-3/4 m-auto">
        <p className="line-1 anim-typewriter capitalize">
          Giảm Giá lên đến 70% + Ưu đãi
        </p>
      </div> */}
      <svg viewBox="0 0 960 300" className="text-effect">
        <symbol id="s-text">
          <text textAnchor="middle" x="50%" y="80%">
          Giảm Giá đến 50%
          </text>
        </symbol>
        <g className="g-ants">
          <use xlinkHref="#s-text" className="text-copy" />
          <use xlinkHref="#s-text" className="text-copy" />
          <use xlinkHref="#s-text" className="text-copy" />
          <use xlinkHref="#s-text" className="text-copy" />
          <use xlinkHref="#s-text" className="text-copy" />
        </g>
      </svg>
    </div>
  );
}

export default Banner;
