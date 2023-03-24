import React from 'react';
import Marquee from "react-fast-marquee";
import {ProductCard} from "../index";
import classes from "./ProductSlider.module.scss"

export function ProductsSlider({brand, products}) {
    return (
        <div className={classes.brandProduct}>
            <div className={classes.brandHeader}>
                <h1>{brand}</h1>
                <p></p>
            </div>
            <Marquee
                play={true}
                loop={0}
                speed={10}
                gradient={false}
                pauseOnHover={true}
                style={{direction: "ltr"}}>
                {
                    products.map((item, index) => <ProductCard Item={item} color={item.colors[1]} image={item.thumbnail} price={item.price.amount} name={item["product-name-fa"]} id={item.id} like={item.likes} key={index}/>)
                }

            </Marquee>
        </div>

    )
}

