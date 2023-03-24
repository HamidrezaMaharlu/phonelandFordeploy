import React from 'react';
import {Outlet} from "react-router-dom";
import {SideBar} from "../../Components/index";
import classes from "./DashBoard.module.scss";

function DashBoard() {
    return (
        <div className={classes.dashboard}>
            <div className={classes.sidebar}>
                <SideBar/>
            </div>
            <div className={classes.outlet}>
                <Outlet/>
            </div>
        </div>
    );
}

export default DashBoard;