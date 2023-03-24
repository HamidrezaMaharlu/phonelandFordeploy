import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import classes from "./Subscribe.module.scss"
import {Input,Button} from "../index";
import React from "react";
import {subscribeSchema} from "../../validations/subscribeValidation";
import {subscribe} from "../../api";
import {toast} from "react-toastify";

export function Subscribe() {

    const {register, handleSubmit, formState: {errors, isValid},reset} = useForm({
        mode: 'onChange',
        resolver: yupResolver(subscribeSchema)
    });

    async function handleSubscribe(formData) {
        try {
            const res = await subscribe(formData)
            if (res.status===201){
                toast.success("ایمیل شما با موفقیت ثبت شد .")
                reset()

            }
        } catch (e) {
            toast.error(e.message)
        }

    }

    return (
        <div className={classes.subscribeContainer}>
            <form onSubmit={handleSubmit(handleSubscribe)} className={classes.subscribe}>
                <p> با عضویت در خبرنامه از اخبار و محصولات جدید ما باخبر شوید</p>
                <Input validation={{...register("subscribe")}} error={errors.subscribe?.message} type="mail"
                       name="subscribe" label="ایمیل*"/>
                <div className={classes.submitBtn}>
                    <Button type="submit" disabled={!isValid}>عضویت</Button>
                </div>
            </form>
        </div>
    );
}

