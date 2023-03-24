import React, {useEffect} from 'react';
import classes from "./Register.module.scss";
import {Button, Input} from "../../Components";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {registerSchema} from "../../validations/registerValidation";
import {RegisterUser} from "../../api/index";
import Swal from "sweetalert2";

export function Register() {

    const {register, handleSubmit, formState: {errors, isValid}, reset} = useForm({
        mode: 'onChange',
        resolver: yupResolver(registerSchema)
    });

    async function handleRegister(data) {
        const newData={...data}
        newData.role="user"
        newData.username=newData.email
        delete newData.confirmPassword
        try {
            const res = await RegisterUser(newData);
            if(res.status === 201) {
                Swal.fire({
                    title: "ثبت نام موفقیت آمیز",
                    text: "اکنون میتوانید وارد حساب کاربری خود شوید",
                    icon: "success",
                    button: "باشه",
                })
                reset()
            }
        } catch (e) {
                e.response.status === 409 ?
                    Swal.fire({
                        title: "خطا",
                        text: "این ایمیل پستی قبلا ثبت شده است",
                        icon: "error",
                    }) :
                    e.response.status === 411 ?
                        Swal.fire({
                            title: "خطا",
                            text: "این شماره موبایل قبلا ثبت شده است",
                            icon: "error",
                        }) :
                        Swal.fire({
                            title: "خطا",
                            text: "خطایی در سرور رخ داده است",
                            icon: "error",
                        });

        }
    }

    useEffect(() => {
        document.title = 'فونلند | ثبت نام';
    }, []);

    return (
        <div className={classes.register}>
            <p>جهت ایجاد حساب کاربری تکمیل تمامی فیلدها الزامی می باشد.</p>
            <form onSubmit={handleSubmit(handleRegister)}>
                <div className={classes.inputRegister}>
                <Input name="firstName" error={errors.firstName?.message} label="نام"
                       type="text" validation={{...register("firstName")}}/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="lastName" error={errors.lastName?.message}
                       label="نام خانوادگی" validation={{...register("lastName")}}/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="state" error={errors.state?.message} label="استان"
                       validation={{...register("state")}} type="text"/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="city" error={errors.city?.message} label="شهر"
                       validation={{...register("city")}} type="text"/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="address" error={errors.address?.message} label="آدرس"
                       validation={{...register("address")}} type="text"/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="zip" error={errors.zip?.message} label="کدپستی"
                       validation={{...register("zip")}} type="text"/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="phone" error={errors.phone?.message} label="موبایل"
                       validation={{...register("phone")}} type="phone"/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="email" error={errors.email?.message} label="ایمیل"
                       validation={{...register("email")}} type="mail"/>
                </div>
                <div className={`${classes.inputRegister} IRANSans password`}>
                <Input name="password" error={errors.password?.message} label="گذرواژه (بین 12-8 واژه انگلیسی و شامل حرف کوچک، بزرگ، اعداد و $%* باشد)"
                       validation={{...register("password")}} type="text"/>
                </div>
                <div className={classes.inputRegister}>
                <Input name="confirmPassword" error={errors.confirmPassword?.message} label="تکرار گذرواژه"
                       validation={{...register("confirmPassword")}} type="text"/>
                </div>
                <div className={classes.btnSubmit}>
                    <Button type="submit" disabled={!isValid}>ثبت نام</Button>
                </div>
            </form>
        </div>
    );
}

