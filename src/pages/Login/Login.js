import React, {useEffect} from 'react';
import classes from "./Login.module.scss";
import {json, useNavigate} from "react-router-dom";
import {Input,Button,} from "../../Components/index";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {loginSchema} from "../../validations/loginValidation";
import axios from "../../api/http";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {checkUserExpired} from "../../utils/utils";


export function Login() {
    const navigate = useNavigate()
    const location = useSelector(state => state.locationSlice)
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        mode: 'onChange',
        resolver: yupResolver(loginSchema)
    });


    useEffect(() => {
        if (checkUserExpired()) {
            navigate("..")
        }
    }, [])

    useEffect(() => {
        document.title = 'فونلند | ورود';
    }, []);
    async function handleSend(formData) {
        try {
            const response = await axios.post("/auth/login", formData)
            localStorage.setItem("accessToken", response.data.accessToken)
            localStorage.setItem("refreshToken", response.data.refreshToken)
            if(location){
                toast.success("به فونلند خوش آمدید")
                return navigate(`${location}`)
            }
            await Swal.fire({
                title: "ورود موفقیت آمیز",
                text: "تا ثانیه ای دیگر به پنل کاربری هدایت خواهید شد ...",
                icon: "success",
                timer: 2500,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            navigate("/dashboard/profile")
        } catch (e) {
            if (e.response.status === 401) {
                toast.error(e.response.data)
            } else {
                throw json({message: e.message}, {status: `${e.response.status}`})
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleSend)} className={classes.login}>
                <Input validation={{...register("username")}} error={errors.username?.message} type="mail"
                       name="username" label="نام کاربری*"/>
                <Input validation={{...register("password")}} error={errors.password?.message} type="password"
                       name="password" label="رمز عبور*"/>
                <div className={classes.submitBtn}>
                    <Button type="submit" disabled={!isValid}>ورود</Button>
                </div>
            </form>
        </>
    );
}





