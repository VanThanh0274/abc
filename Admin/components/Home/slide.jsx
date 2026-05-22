// slide.jsx
"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slide.css"; // nếu bạn muốn style riêng

export default function Slide() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,//cho slide thứ 2 ra giữa
        variableWidth: true, //cho        
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <div className="trans_img">
            <Slider {...settings} className="trans-slides">
                <div className="slide-img">
                    <img src="/images/img_trans.jpeg" alt="" />
                </div>
                <div className="slide-img">
                    <img src="/images/img_trans1.jpeg" alt="" />
                </div>
                <div className="slide-img">
                    <img src="/images/img_trans2.jpeg" alt="" />
                </div>
            </Slider>
        </div>
    );
}
