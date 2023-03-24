import React, {useEffect, useRef} from 'react';
import classes from "./HomePage.module.scss";
import {SimpleSlider,Category,ProductsSlider,Property,Subscribe} from "../../Components/index";
import {GetCategories,getAllProducts} from "../../api/index";
import {useDispatch, useSelector} from "react-redux";
import {addCategory} from "../../store/categorySlice";
import {addProducts, sortProducts} from "../../store/productsSlice";
import useKeysWithLengthGreaterThan5 from "../../hooks/frequency";
import xiaomi from "../../assets/images/xiaomiDeatail.jpg";
import gift from "../../assets/images/gift.jpg";

export function HomePage() {
    const categories = useSelector(state => state.categorySlice)
    const products = useSelector(state => state.productsSlice)
    const dispatch = useDispatch()
    useEffect(() => {
        (async function getData() {
            try {
                const res = await GetCategories()
                if (res.status === 200) {
                    dispatch(addCategory(res.data))
                }
            } catch (e) {
                console.log(e.message)
            }

        })()
    }, []);

    useEffect(() => {
        async function getData() {
            const res = await getAllProducts()
            dispatch(addProducts(res.data))
            dispatch(sortProducts(res.data))
        }

        if (products?.allProducts.length === 0) {
            getData()
        }

    }, [products]);

    useEffect(() => {
        document.title = 'فونلند | تنوع در برند';
    }, []);

    const firstProduct = useRef([])
    const secondProduct = useRef([])
    const thirdProduct = useRef([])
    const firstCategory = useRef()
    const secondCategory = useRef()
    const thirdCategory = useRef()
    const selectedProducts = useKeysWithLengthGreaterThan5(products.sortedProducts)
    if (selectedProducts.length) {
        firstProduct.current = [...products.sortedProducts[`${selectedProducts[0]}`]]
        secondProduct.current = [...products.sortedProducts[`${selectedProducts[1]}`]]
        thirdProduct.current = [...products.sortedProducts[`${selectedProducts[2]}`]]
        firstCategory.current = categories.find(item => item.id === +selectedProducts[0])["name-fa"]
        secondCategory.current = categories.find(item => item.id === +selectedProducts[1])["name-fa"]
        thirdCategory.current = categories.find(item => item.id === +selectedProducts[2])["name-fa"]
    }


    return (
        <>
            <div className={classes.slider}><SimpleSlider/></div>
            <div><Category categories={categories}/></div>
            <div className={classes.familiarity}>
                <h1>آشنایی با پرچمدار شیائومی</h1>
                <div>
                    <img src={xiaomi} alt="xiaomi"/>
                </div>
            </div>
            <ProductsSlider products={firstProduct.current} brand={firstCategory.current}/>
            <div className={classes.gift}>
                <div>
                    <img src={gift} alt="gift"/>
                </div>
            </div>
            <ProductsSlider products={secondProduct.current} brand={secondCategory.current}/>
            <Property/>
            <ProductsSlider products={thirdProduct.current} brand={thirdCategory.current}/>
            <Subscribe/>
        </>
    );
}

