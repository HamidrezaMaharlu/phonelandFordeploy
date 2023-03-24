import React, {useEffect, useMemo, useState} from 'react';
import classes from "./Products.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {getAllProducts} from "../../api/index";
import {addProducts, sortProducts} from "../../store/productsSlice";
import {useParams, useSearchParams} from "react-router-dom";
import {ProductCard,Pagination,Button} from "../../Components/index";
import {paginate} from "../../utils/utils";
import {deleteSearchState} from "../../store/serachSlice";

export function Products() {
    const products = useSelector(state => state.productsSlice)
    const categories = useSelector(state => state.categorySlice)
    const searchQ = useSelector(state => state.searchSlice)
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [sortData, setSortData] = useState("asc");


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

    function handleChangePage(pageNumber) {
        setSearchParams({page: pageNumber})
    }

    const {brand} = useParams()

    let findBrand = useMemo(() => {
        if (brand === "all") {
            return products.allProducts
        }
        const catId = categories.find(item => item["name-en"] == brand)
        if (catId?.id) {
            return products.sortedProducts[+catId.id]
        }
    }, [brand, categories])

    if (searchQ.trim().length > 0 && findBrand) {
        findBrand = findBrand.filter(item => (item["product-name-fa"]).toLowerCase().includes(searchQ.toLowerCase()))
    }

    const paginatedData = paginate(findBrand, searchParams.get("page"), 6)
    const sortedData = sortData === "asc" ? paginatedData.sort((a, b) => b.price.amount - a.price.amount) : paginatedData.sort((a, b) => a.price.amount - b.price.amount)

    useEffect(() => {
        if (sortedData.length > 0)
            setSearchParams({page: 1})
    }, [brand])
    useEffect(() => {
        dispatch(deleteSearchState())
    }, [])
    useEffect(() => {
        document.title = 'فونلند | محصولات';
    }, []);

    return (
            <div className={classes.absolute}>
                <div className={classes.sort}>
                    <p>مرتب سازی براساس قیمت</p>
                    <Button onClick={() => setSortData("asc")}
                            className={sortData === "asc" ? classes.selected : classes.btn}> گرانترین</Button>
                    <Button onClick={() => setSortData("dsc")}
                            className={sortData === "dsc" ? classes.selected : classes.btn}>ارزان
                        ترین</Button>
                </div>
                <div className={classes["products--container"]}>
                    {sortedData.length > 0 ? sortedData.map((item, index) => <ProductCard key={index} Item={item}/>) :
                        <p>محصولی وجود ندارد</p>}
                </div>
                <div className={classes.pagination}>
                    <Pagination pageSize={6} itemsCount={findBrand ? findBrand.length : 0}
                                currentPage={+searchParams.get("page")} onPageChange={handleChangePage}/>
                </div>
            </div>
    );
}

