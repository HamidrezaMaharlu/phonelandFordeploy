import React, {useEffect, useRef} from 'react';
import classes from "./Payment.module.scss";
import {Link, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {GetProduct, UpdateProduct, updateOrder, deleteOrder} from "../../api/index";
import {calculate, clearCart} from "../../store/basketSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {Button} from "../../Components";


export function Payment() {
    let [searchParams, setSearchParams] = useSearchParams();
    const firstTime = useRef(true)  /*I just add it because in dev mode use effect runs twice and I want to prevent it*/
    const dispatch = useDispatch()

    useEffect(()=>{

    },[])
    useEffect(() => {
        const address = JSON.parse(localStorage.getItem("address"))
        const basket = JSON.parse(localStorage.getItem("orders"))
        if (searchParams.get("result") === "success" && address && firstTime.current) {
            firstTime.current = false /* update this to false and prevent runs again*/
            const updateStatus = []
            basket.cartItems.forEach(item => {
                GetProduct(item.productId).then(res => {
                    if (res.status === 200) {
                        const data = res.data
                        data.count -= item.amount
                        UpdateProduct(item.productId, data).then(res => {
                            if (res.status === 200) {
                                updateStatus.push({productId: item.productId, status: "OK"})
                                if (updateStatus.length === basket.cartItems.length) {
                                    updateOrder(address.id, {
                                        products: basket.cartItems,
                                        totalPrice: basket.totalPrice
                                    }).then(res => {
                                        if (res.status === 200) {
                                            dispatch(clearCart())
                                            dispatch(calculate())
                                            localStorage.removeItem("orders")
                                            localStorage.removeItem("address")
                                        } else {
                                            setSearchParams({result: "cancel"})
                                        }
                                    })

                                }
                            } else {
                                setSearchParams({result: "cancel"})
                            }
                        })
                            .catch((e)=>console.log(e.message))
                    }
                })
            })
            return
        }
        if(searchParams.get("result") === "cancel"&&firstTime.current) {
            firstTime.current = false /* update this to false and prevent runs again*/
            deleteOrder(address.id).then(r =>console.log(r) ).catch((e)=>{
                e.response.status===404 ?toast.error("رفرش نکن فایده نداره"):
                toast.error(e.message)
                console.log(e)
            })
        }

    }, [])
    return (
        <div className={classes.payment}>
            {searchParams.get("result") === "success" ?
                <div className={classes.successContainer}>
                    <FontAwesomeIcon icon={faCircleCheck} color={"green"} size={"5x"}/>
                    <h1>پرداخت با موفقیت انجام شد</h1>
                    <>
                        <p>
                            با تشکر از شما. ثبت سفارش شما با موفقیت انجام شد.
                            برای دیدن اطلاعات سفارش به پنل کاربری خود مراجعه نمایید.
                        </p>
                        {/*<p className={"IRANSans"}> مبلغ پرداخت شده: {convertNumber(orders?.totalPrice)} تومان</p>*/}
                    </>
                </div>
                :
                <div className={classes.successContainer}>
                    <FontAwesomeIcon icon={faCircleExclamation} color={"red"} size={"5x"}/>
                    <h1>پرداخت انجام نشد</h1>
                    <p>
                        هنگام انجام عملیات پردازش به مشکلی برخورد کردید.
                        لطفا با مدیر سایت تماس بگیرید.
                    </p>
                </div>
            }
            <p className={"IRANSans"}> کدرهگیری: eyJhbGciOiJIUz</p>
            <Link to={"/dashboard/orders"}><Button>پنل سفارشات</Button></Link>
        </div>

    );
}

