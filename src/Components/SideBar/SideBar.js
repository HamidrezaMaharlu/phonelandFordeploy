import React from 'react';
import {NavLink} from "react-router-dom";
import classes from "./sideBar.module.scss";
import {useDispatch} from "react-redux";
import {logOut} from "../../store/userSlice";
import jwt_decode from "jwt-decode";

export function SideBar() {
    const dispatch=useDispatch()
    function handleExit() {
        dispatch(logOut())
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
    }
    const token = localStorage.getItem("accessToken")
    let decode
    if(token){
        decode = jwt_decode(token);
    }
    return (
        <div className={classes.sidebar}>
            <ul>
                <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="profile">پروفایل کاربری</NavLink></li>
                <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="orders">سفارشات</NavLink></li>
                <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="wishList">علاقه مندی ها</NavLink></li>
                {decode.role==="admin" &&
                    <>
                        <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="manageOrders"> مدیریت سفارشات</NavLink></li>
                        <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="manageProducts"> مدیریت محصولات</NavLink></li>
                        <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="manageCategory"> مدیریت برندها</NavLink></li>
                        <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="manageQuantity">مدیریت موجودی</NavLink></li>
                    </>
                }
                <li><NavLink className={({isActive})=>isActive?classes.active:undefined} to="/" onClick={handleExit}>خروج</NavLink></li>

            </ul>
        </div>
    );
}

