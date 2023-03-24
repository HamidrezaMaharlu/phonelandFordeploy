import React from 'react';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {Outlet} from "react-router-dom";
import classes from "./RootLayout.module.scss";
import {Breadcrumbs} from "../../Components/index";

function RootLayOut() {
    return (
        <>
            <header>
                <Header/>
            <Breadcrumbs/>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>
                <Footer/>
            </footer>
        </>
    );
}

export default RootLayOut;