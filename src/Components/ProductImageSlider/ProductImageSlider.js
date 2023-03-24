import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {IMG} from "../../config/urlConfig";
import {Autoplay, EffectCube, Pagination} from "swiper";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import classes from "./ProductImageSlider.module.scss"

export function ProductImageSlider({productImages}) {
    return (
        <Swiper
            style={{
                "--swiper-pagination-bottom": "-5rem",
            }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            effect={"cube"}
            grabCursor={true}
            cubeEffect={{
                shadow: true,
                slideShadows: true,
                shadowOffset: 20,
                shadowScale: 0.94,
            }}
            pagination={{
                clickable: true,
            }}
            modules={[EffectCube, Pagination,Autoplay]}
            className={classes.mySwiper}
        >
            {
                productImages?.images.map((item,index)=><SwiperSlide key={index}><img alt="product" src={IMG+"/files/"+item}/></SwiperSlide>)
            }
        </Swiper>
    );
}

