/** @format */

import React from "react";
import Slider from "react-slick";
import "./Carousels.css";
import slider_1 from "../../../assets/images/slider_1.jpg";
import slider_2 from "../../../assets/images/slider_2.jpg";
import slider_3 from "../../../assets/images/slider_3.jpg";
import { Link } from "react-router-dom";


function Carousels() {
  const settings = {
    customPaging: function (i) {
      return (
        <Link to="#">
          <img
            src={`../../../assets/images/slider_${i+1}`}
            alt=""
            className="w-full block"
          />
        </Link>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <Slider {...settings} className="slick-container overflow-hidden focus:outline-none ">
        <div>
          <img src={slider_1} alt="" />
        </div>
        <div>
          <img src={slider_2} alt="" />
        </div>
        <div className="">
          <img src={slider_3} alt="" />
        </div>
      </Slider>
    </div>
  );
}

export default Carousels;
