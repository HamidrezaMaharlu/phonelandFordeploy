import React from 'react';
import classes from "./Property.module.scss"
import p1 from "../../assets/images/property/cash-on-delivery.svg"
import p2 from "../../assets/images/property/days-return.svg"
import p3 from "../../assets/images/property/express-delivery.svg"
import p4 from "../../assets/images/property/original-products.svg"

export function Property() {
    return (
        <div className={classes["property-wrapper"]}>
            <div className={classes["property-icon"]}>
                <div>
                    <img src={p1} alt="pay"/>
                </div>
                <p>امکان پرداخت در محل</p>
            </div>
            <div className={classes["property-icon"]}>
                <div>
                    <img src={p2} alt="guaranty"/>
                </div>
                <p>ضمانت بازگشت کالا</p>
            </div>
            <div className={classes["property-icon"]}>
                <div>
                    <img src={p3} alt="express"/>
                </div>
                <p>امکان تحویل اکسپرس</p>
            </div>
            <div className={classes["property-icon"]}>
                <div>
                    <img src={p4} alt="original"/>
                </div>
                <p>ضمانت اصل بودن کالا</p>
            </div>
        </div>

    );
}

