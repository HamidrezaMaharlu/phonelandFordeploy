import React, {useEffect, useState} from 'react';
import classes from "./Orders.module.scss";
import {useSearchParams} from "react-router-dom";
import {getTokenData} from "../../../utils/utils";
import {GetUserOrder} from "../../../api";
import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {IMG} from "../../../config/urlConfig";



export function Orders() {
    const [orders, setOrders] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const {id} = getTokenData()
        setSearchParams({["user-id"]: id})
    }, [searchParams.get(["user-id"])])
    useEffect(() => {
        document.title = 'فونلند | سفارشات';
    }, []);

    useEffect(() => {
        let isMounted = true;
        (async function getData() {
            try {
                const res = await GetUserOrder(searchParams.get(["user-id"]))
                if (res.status === 200 && isMounted) {
                    setOrders(res.data.sort((a,b)=>b.createdAt-a.createdAt))
                }
            } catch (e) {
                console.log(e.message)
            }
        })()
        return () => {
            isMounted = false;
        };
    }, [searchParams])


    return (
        <div className={classes.container}>
            <div className={classes.orders}>
                {orders.length === 0 && <p>سفارشی وجود ندارد</p>}
                {orders.length > 0 && orders.map(order => (
                    <div key={order.id} className={classes.order}>
                        <div>
                            <span>سفارش ثبت شده در تاریخ:</span>
                            <span>{new DateObject(order.createdAt).convert(persian, persian_fa).format()}</span>
                        </div>
                        <hr/>
                        <div className={classes.product}>
                            <p>عکس</p>
                            <p>نام محصول</p>
                            <p> رنگ</p>
                            <p>تعداد</p>
                        </div>
                        <div>
                            {order.products.map((product,index) => <div key={`product${index}`} className={classes.product}>
                                <div className={classes.imgContainer}><img src={IMG + "/files/" + product.thumbnail}/>
                                </div>
                                <p>{product["product-name-fa"]}</p><div className={classes.color}
                                ><p style={{backgroundColor: product.colors.hex, height: "3rem", width:"3rem",borderRadius:"50%"}}></p></div>
                                <p>{product.amount}</p></div>)}
                        </div>
                        <div>
                            <p>وضعیت سفارش:</p>
                            {order.status === "shipped" && <div>تحویل داده
                                شده {new DateObject(order.deliverAt).convert(persian, persian_fa).format()}</div>}
                            {order.status === "pending" && <p>آماده ارسال</p>}
                        </div>
                    </div>))

                }

            </div>
        </div>
    );
}

