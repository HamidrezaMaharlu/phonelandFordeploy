import React, {useEffect, useState} from 'react';
import classes from "./Checkout.module.scss";
import {addOrder, GetUserData} from "../../api/index";
import {useDispatch, useSelector} from "react-redux";
import {loginSuccess} from "../../store/userSlice";
import {getTokenData} from "../../utils/utils";
import {Button, InputCheckout} from "../../Components/index";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {checkoutSchema} from "../../validations/checkoutValidation";
import {toast} from "react-toastify";


const date = new DateObject()
date.add(3, "days");

export function Checkout() {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userSlice)
    const [sendForMe, setSendForMe] = useState(false)
    const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm({
        mode: 'onChange',
        resolver: yupResolver(checkoutSchema)
    });
    const [valueDate, setValueDate] = useState(date)

    useEffect(() => {
        (async function getUser() {
            const {id} = getTokenData()
            try {
                const res = await GetUserData(id)
                dispatch(loginSuccess(res))
            } catch (e) {
                console.log(e.message)
            }
        })()
    }, [dispatch, sendForMe])

    useEffect(() => {
        setValue("firstName", userData?.firstName)
        setValue("lastName", userData?.lastName)
        setValue("address", userData?.address)
        setValue("state", userData?.state)
        setValue("city", userData?.city)
        setValue("zip", userData?.zip)
        setValue("phone", userData?.phone)
        setValue("email", userData?.email)
    }, [userData])

    // clear the form to send to another person
    function handleOther() {
        reset()
    }

    async function myHandleSubmit(data) {
        if (valueDate && data) {
            data.deliveryDate = {
                day: valueDate.day,
                month: valueDate.month.name,
                monthIndex: valueDate.month.number,
                year: valueDate.year
            }
            data["user-id"] = userData.id
            data.deliverAt = ""
            dispatch(loginSuccess(data))
            const newPost = {...data, totalPrice: "", products: [], status: "pending"}
            try{
                const res = await addOrder(newPost)
                if (res.status === 201) {
                    localStorage.setItem("address", JSON.stringify(res.data))
                    window.location.replace("http://localhost:63342/phoneland/Bank/index.html?_ijt=3s19os429eufimqrm5df4h3eof&_ij_reload=RELOAD_ON_SAVE")
                }
            }
            catch (e){
                console.log(e.message)
            }

        }

        if (!valueDate) {
            toast.warn("در صورت عدم انتخاب زمان تحویل، کالا به صورت پیش فرض در 3 روز آینده ارسال می گردد.")
            setValueDate(date)
        }
    }


    return (
        <div className={classes.checkout}>
            <Button className={classes.btnSend} onClick={handleOther}>ارسال برای دیگران</Button>
            <Button className={classes.btnSend} onClick={() => setSendForMe(prevState => !prevState)}>ارسال به آدرس پیش
                فرض</Button>
            <form onSubmit={handleSubmit(myHandleSubmit)}>
                <InputCheckout className={classes.checkoutInput} name="firstName" type="text" label="نام"
                               validation={{...register("firstName")}}
                               error={errors.firstName?.message}
                />
                <InputCheckout validation={{...register("lastName")}} error={errors.lastName?.message}
                               className={classes.checkoutInput} name="lastName" type="text" label=" نام خانوادگی"
                />
                <InputCheckout validation={{...register("phone")}} error={errors.phone?.message}
                               className={classes.checkoutInput} name="phone" type="tel" label="تلفن"
                />
                <InputCheckout validation={{...register("email")}} error={errors.email?.message}
                               className={classes.checkoutInput} name="email" type="mail" label="ایمیل"
                />
                <InputCheckout validation={{...register("city")}} error={errors.city?.message}
                               className={classes.checkoutInput} name="city" type="text" label="شهر"
                />
                <InputCheckout validation={{...register("state")}} error={errors.state?.message}
                               className={classes.checkoutInput} name="state" type="text" label="استان"
                />
                <InputCheckout validation={{...register("address")}} error={errors.address?.message}
                               className={classes.checkoutInput} name="address" type="text" label="آدرس"
                />
                <InputCheckout validation={{...register("zip")}} error={errors.zip?.message}
                               className={classes.checkoutInput} name="zip" type="text" label="کدپستی"
                />
                <div className={classes.checkoutInput}>
                    <div className={classes.persian}>
                        <p>زمان تحویل</p>
                        <DatePicker
                            value={valueDate}
                            minDate={date}
                            onChange={setValueDate}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                        />
                    </div>
                </div>
                <div className={classes.btnSubmit}>
                    <Button type="submit">پرداخت وجه</Button>
                </div>
            </form>
        </div>
    );
}

