import React from "react";
import Slider from "react-slick";
import "./Slider.scss";
import p1 from "../../assets/images/slider/xiaomi.jpg"
import p2 from "../../assets/images/slider/huawei-nova.webp"
import p3 from "../../assets/images/slider/S23Plus.avif"
import p4 from "../../assets/images/slider/Apple-iPhone13-Pro.jpg"
import {Link} from "react-router-dom";
import {Button} from "../index";


export  function SimpleSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        rtl: true,
        autoplay: true,
        slidesToShow: 1,
    };
    return (
        <Slider {...settings}>
            <div className="rel xiaomi">
                <img src={p1} alt="xiaomi"/>
                <div className="Xiaomi">
                    <p>فروش ویژه</p>
                    <p>پرچمدار جدید شیائومی</p>
                    <Link to="/product/12"><Button> خرید</Button></Link>
                </div>
            </div>
            <div className="rel huawei">
                <img src={p2} alt="huawei"/>
                <div className="Huawei">
                    <p>نو اومده به بازار...</p>
                    <p>منتخب کاربران</p>
                    <Link to="/product/19"><Button> خرید</Button></Link>
                </div>
            </div>
            <div className="rel samsung">
                <img src={p3} alt="samsung"/>
            </div>
            <div className="rel Iphone">
                <img src={p4} alt="iphone"/>
                <div className="iphone">
                    <p>منتخب کاربران</p>
                    <p>تنوع در رنگ</p>
                    <Link to="/product/5"><Button> خرید</Button></Link>
                </div>
            </div>
        </Slider>
    );
}