import React from 'react';
import Marquee from "react-fast-marquee";
import classes from "./Category.module.scss";
import {IMG} from "../../config/urlConfig";

export function Category({categories}) {
    return (
        <div className={classes["brand__Container"]} >
            <h3>دسته بندی محصولات</h3>
            <Marquee
                play={true}
                loop={0}
                speed={4}
                gradient={false}
                pauseOnHover={true}
                style={{direction:"ltr"}}
            >
                {
                    categories.map((item, index) => {
                        return (
                                <div className={classes["brand__icon"]}  key={index}>
                                    <img src={`${IMG}/files/${item.icon}`} alt=""/>
                                    <h2>{item["name-fa"]}</h2>
                                </div>
                        )
                    })
                }
            </Marquee>


        </div>);
}

