import React, {useEffect, useState} from 'react';
import classes from "./Basket.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {Table,Button} from "../../Components/index";
import {IMG} from "../../config/urlConfig";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {calculate, decrement, increment, removeBasket} from "../../store/basketSlice";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {getProduct} from "../../api/index";
import {toast} from "react-toastify";
import {addLocation} from "../../store/location";

export function Basket() {
    const {cartItems,totalPrice,totalAmount} = useSelector(state => state.basketSlice)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [sortColumn, setSortColumn] = useState({path: "product-name-fa", order: "asc"})
    const location = useLocation();
    const showP = location.pathname !== '/basket/checkout';

    function handleIncrement(item) {
        dispatch(increment(item.id))
        dispatch(calculate())
    }

    function handleDecrement(item) {
        dispatch(decrement(item.id))
        dispatch(calculate())
    }

    function handleDelete(item) {
        dispatch(removeBasket(item.id))
        dispatch(calculate())

    }

    async function handleCheckout() {
        setLoading(true)
        let productMoreThanStock = []
        // loop to check the stock
        for (let i = 0; i < cartItems.length; i++) {
            try {
                const res = await getProduct(cartItems[i].productId)
                if (res.status === 200) {
                    if (res.data.count < cartItems[i].amount) {
                        productMoreThanStock.push(cartItems[i]["product-name-fa"])
                    }
                }
            } catch (e) {
                toast.error(e.message)
            } finally {
                setLoading(false)
            }

        }
        if (productMoreThanStock.length > 0) {
            productMoreThanStock.map(item => toast.warn(`موجودی ${item} کمتر از مقدار انتخاب شده است`, {autoClose: 8000}))
            productMoreThanStock = []
        } else {
            // save location if user not sign in after login return user to this location
            dispatch(addLocation("/basket/checkout"))
            navigate("/basket/checkout")
        }

    }

    useEffect(() => {
        document.title = 'فونلند | سبد خرید';
    }, []);
    const columns = [
        {
            key: "thumbnail",
            label: "تصویر",
            content: item => (<img alt={"product"} style={{width: "5rem", height: "5rem"}} src={`${IMG}/files/${item.thumbnail}`}/>)
        },
        {path: "product-name-fa", label: "نام کالا"},
        {path: "price.amount", label: "قیمت"},
        {path: "colors['name-fa']", label: "رنگ"},
        {path: "amount", label: "تعداد"},
        {
            key: "increment",
            content: item => (
                <div className={classes.btn}>
                    <FontAwesomeIcon className={classes.increment} icon={faPlus} onClick={() => handleIncrement(item)}/>
                    <Button onClick={() => handleDelete(item)}>حذف</Button>
                    <FontAwesomeIcon className={classes.decrement} icon={faMinus}
                                     onClick={() => handleDecrement(item)}/>
                </div>


            )
        }
    ]

    return (
        totalAmount === 0 ?
            <div className={classes.basket}>محصولی در سبد خرید وجود ندارد</div>
            :
            <>
                {showP&&<div className={classes.table}>
                    <Table data={cartItems} columns={columns} onSort={setSortColumn} sortColumn={sortColumn}
                           tfoot={{totalPrice: totalPrice, totalAmount: totalAmount}}/>
                    <div className={classes.checkout}>
                        <Button onClick={handleCheckout}>{loading ?
                            <p className={classes.spinner}><span className="spinner-border spinner-border-lg"
                                                                 role="status"
                                                                 aria-hidden="true"></span><span>تکمیل خرید</span>
                            </p> : "تکمیل خرید"}</Button>
                    </div>
                </div>}
                <Outlet/>
            </>


    )
        ;
}


