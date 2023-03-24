import React, {useCallback, useEffect} from 'react';
import classes from "./ProductsCategory.module.scss"
import {NavLink, Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {GetCategories} from "../../api/index";
import {addCategory} from "../../store/categorySlice";
import {IMG} from "../../config/urlConfig";

function ProductsCategory() {
    const category = useSelector(state => state.categorySlice)
    const dispatch = useDispatch()

    const getData = useCallback(async () => {
        try {
            const res = await GetCategories();
            dispatch(addCategory(res.data));
        } catch (error) {
            console.log(error.message)
        }
    }, [dispatch]);

    useEffect(() => {
        if (category.length === 0) {
            getData();
        }
    }, []);

    return (
        <div className={classes.brands}>
            <div className={classes.sidebar}>
                <div className={classes.container}>
                    <ul>
                        {category.map((item, index) => <li key={index}><div className={classes.imgContainer}><img alt="icon" src={IMG+"/files/"+item.icon}/></div><NavLink
                            className={({isActive}) => isActive ? classes.active : undefined}
                            to={`${item["name-en"]}`}>{item["name-fa"]}</NavLink></li>)}
                        <li><NavLink className={({isActive}) => isActive ? classes.active : undefined} to="all">همه محصولات</NavLink></li>
                    </ul>
                </div>
            </div>
            <div className={classes.outlet}>
                <Outlet/>
            </div>
        </div>
    );
}

export default ProductsCategory;