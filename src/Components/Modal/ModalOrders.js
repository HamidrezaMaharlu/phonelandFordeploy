import React from 'react';
import classes from "./ModalOrders.module.scss";
import {Table} from "react-bootstrap";
import {convertNumber} from "../../utils/utils";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import {DateObject} from "react-multi-date-picker";
import {Button} from "../index";
import {updateOrder} from "../../api";


export function ModalOrders({setOrders, orderData, setShowModal}) {
    const date = new DateObject(orderData.createdAt).convert(persian, persian_fa)

    async function handleChangeToShipped() {
        try {
            const res = await updateOrder(orderData.id, {deliverAt: Date.now()
            ,status:"shipped"})
            if (res.status === 200) {
                setOrders(prevState=>{
                    const newData=[...prevState]
                    const index= prevState.findIndex(item=>item.id===orderData.id)
                    newData[index]=res.data
                    return newData
                })
                setShowModal(false)
            }
        } catch (e) {

        }
    }

    return (
        <div className={classes.modal}>
            <div className={classes["modal-content"]}>
                <div className={classes.closeContainer}>
                    <p onClick={() => {
                        setShowModal(false)
                    }}
                       className={classes.close}>&times;</p>
                </div>
                <h2> مشخصات</h2>
                <div className={classes.description}>
                    <div><span className={classes.bold}>شماره سفارش: </span>{orderData.id}</div>
                    <div><span className={classes.bold}>آیدی کاربر سفارش دهنده:</span> {orderData["user-id"]}</div>
                    <div><span className={classes.bold}>نام تحویل گیرنده:</span> {orderData.firstName}</div>
                    <div><span className={classes.bold}>نام خانوادگی تحویل گیرنده:</span> {orderData.lastName}</div>
                    <div><span
                        className={classes.bold}>آدرس:</span> {orderData.state},{orderData.city},{orderData.address}
                    </div>
                    <div className={"IRANSans"}><span className={classes.bold}>کدپستی:</span> {orderData.zip}</div>
                    <div className={"IRANSans"}><span className={classes.bold}>شماره تلفن:</span> {orderData.phone}
                    </div>
                    <div className={"IRANSans"}><span
                        className={classes.bold}>مبلغ پرداخت شده:</span> {convertNumber(orderData.totalPrice)}</div>
                    <div><span className={classes.bold}>تاریخ ثبت سفارش:</span> {date.format()}</div>
                    <div className={"IRANSans"}> <span className={classes.bold}>زمان انتخاب شده جهت
                        تحویل:</span> {orderData.deliveryDate.day} {orderData.deliveryDate.month} {orderData.deliveryDate.year}
                    </div>
                </div>
                <hr/>
                <h2>کالای سفارش داده شده</h2>
                <Table className="table table-striped table-hover">
                    <thead className="table-dark text-center">
                    <tr>
                        <td>نام محصول</td>
                        <td>رنگ</td>
                        <td>تعداد</td>
                        <td>گارانتی</td>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {orderData.products.map(item => <tr>
                        <td>{item["product-name-fa"]}</td>
                        <td>{item.colors["name-fa"]}</td>
                        <td>{item.amount}</td>
                        <td>{item.guarantees["name-fa"]}</td>
                    </tr>)}

                    </tbody>
                </Table>
                <hr/>
                {orderData.status === "shipped" ? <p className={classes.deliver}>تاریخ تحویل به مشتری: {new DateObject(orderData.deliverAt).convert(persian, persian_fa).format()}</p> :
                    <div className={classes.deliver}><Button  onClick={handleChangeToShipped}>تغییر به تحویل داده شد</Button></div>}


            </div>
        </div>
    );
}

