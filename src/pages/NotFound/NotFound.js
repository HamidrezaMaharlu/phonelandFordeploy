import React from 'react';
import classes from "./NotFound.module.scss";
import {useRouteError} from "react-router-dom";

export function NotFound() {
    const error = useRouteError()
     let title ="🤷";
    let message="محصول مورد نظر یافت نشد";
    if (error.status===404){
        title=`${error.status}`
        message="صفحه مورد نظر یافت نشد"
    }
    if(error.status===401){
        title=`${error.status}`
        message=`${error.message}`
    }
    return (
        <>
            <div className={classes.context}>
                <h1>{title}</h1>
                <p>{message}</p>
            </div>

            <div className={classes.area}>
                <ul className={classes.circles}>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                    <li><p></p><div></div></li>
                </ul>
            </div>
        </>
    );
}

