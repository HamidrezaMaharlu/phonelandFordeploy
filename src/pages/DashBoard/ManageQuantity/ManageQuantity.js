import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {IMG} from "../../../config/urlConfig";
import {Button,CategoryBadge,Table,Pagination} from "../../../Components/index";
import classes from "../ManageQuantity/ManageQuantity.module.scss";
import {GetCategories,getAllProducts,UpdateProduct} from "../../../api/index";
import {addCategory} from "../../../store/categorySlice";
import {addProducts, clearProducts, editProductsCount, editProductsPrice, sortProducts} from "../../../store/productsSlice";
import _ from "lodash";
import {paginate} from "../../../utils/utils";
import {Badge} from "react-bootstrap";
import {deleteSearchState} from "../../../store/serachSlice";
import {toast} from "react-toastify";


export function ManageQuantity() {
    const products = useSelector(state => state.productsSlice)
    const categories = useSelector(state => state.categorySlice)
    const searchQ = useSelector(state => state.searchSlice)
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortColumn, setSortColumn] = useState({path: "category-id", order: "asc"})
    const [brand, setBrand] = useState("all")
    const [editedProducts, setEditedProducts] = useState([])
    const [originalProducts, setOriginalProducts] = useState([])
    const dispatch = useDispatch()
    const prevStateRef = useRef()
    const inputsRefCount = useRef(new Map())
    const inputsRefPrice = useRef(new Map())

    function handleChangePage(pageNumber) {
        setSearchParams({page: pageNumber})
    }

    function handleFilterBrand(name) {
        setBrand(name)
    }
    useEffect(() => {
        document.title = 'فونلند | مدیریت موجودی';
    }, []);

    function handleChangeInputCount(e, item) {
        dispatch(editProductsCount({val: e.target.value, item}))
        dispatch(sortProducts())
        // find the item to edit it or add it to the list of items that have been changed
        const newItem = {...item, count: e.target.value};
        setEditedProducts(prevState => {
            const index = prevState.findIndex(item => item.id === newItem.id)
            if (index > -1) {
                prevState[index] = newItem
                return prevState
            } else {
                return [...prevState, newItem]
            }
        })
    }

    const handleEscapeCount = (e, item) => {
        if (e.key === 'Escape') {
            e.target.readOnly = true;
            e.target.style.borderColor = 'black';
            const findItemInOriginal = originalProducts.find(pro => pro.id === item.id)
            const findItemInEdited = editedProducts.find(pro => pro.id === item.id)
            // delete it from ref hook map
            inputsRefCount.current.delete(item.id)
            dispatch(editProductsCount({val: findItemInOriginal.count, item}))
            dispatch(sortProducts())
            // check if the price of items doesn't change remove it from list
            if (findItemInOriginal.price.amount === findItemInEdited.price.amount) {
                setEditedProducts(prevState => prevState.filter(pro => pro.id !== item.id))
            // check if the price of items have been changed update the amount of it
            } else {
                findItemInEdited.count = findItemInOriginal.count
                const index = editedProducts.findIndex(pro => pro.id === item.id)
                setEditedProducts(prevState => {
                    const newArray = [...prevState]
                    newArray[index] = findItemInEdited
                    return newArray
                })
            }
        }
    }

    function handleChangeInputPrice(e, item) {
        dispatch(editProductsPrice({val: e.target.value, item}))
        dispatch(sortProducts())
        const newItem = {...item, price: {...item.price, amount: e.target.value}};

        setEditedProducts(prevState => {
            const index = prevState.findIndex(item => item.id === newItem.id)
            if (index > -1) {
                prevState[index] = newItem
                return prevState
            } else {
                return [...prevState, newItem]
            }
        })
    }

    const handleEscapePrice = (e, item) => {
        if (e.key === 'Escape') {
            e.target.readOnly = true;
            e.target.style.borderColor = 'black';
            const findItemInOriginal = originalProducts.find(pro => pro.id === item.id)
            const findItemInEdited = editedProducts.find(pro => pro.id === item.id)
            inputsRefPrice.current.delete(item.id)
            dispatch(editProductsPrice({val: findItemInOriginal.price.amount, item}))
            dispatch(sortProducts())
            if (findItemInOriginal.count === findItemInEdited.count) {
                setEditedProducts(prevState => prevState.filter(pro => pro.id !== item.id))
            } else {
                findItemInEdited.price = findItemInOriginal.price
                const index = editedProducts.findIndex(pro => pro.id === item.id)
                setEditedProducts(prevState => {
                    const newArray = [...prevState]
                    newArray[index] = findItemInEdited
                    return newArray
                })
            }


        }
    }

    async function handleClickSave() {
        const responses = []
        // loop over edited items to update it in backend
        for (let i = 0; i < editedProducts.length; i++) {
            const data = editedProducts[i];
            try {
                const res = await UpdateProduct(data.id, data)
                if (res.status === 200) {
                    responses.push(res.status)
                    // get the element form ref hook to update the style
                    const inputPrice = inputsRefPrice.current.get(data.id);
                    const inputCount = inputsRefCount.current.get(data.id);
                    // change the style
                    if (inputPrice) inputPrice.style.borderColor = "green"
                    if (inputCount) inputCount.style.borderColor = "green"
                }
            } catch (e) {
                toast.error(e.message)
            }
        }
        const allResponses200 = responses.every(response => response === 200);
        console.log("all",allResponses200)
        if (allResponses200) {
            setEditedProducts([])
            setOriginalProducts([])
            inputsRefPrice.current.clear()
            inputsRefCount.current.clear()
            // dispatch(clearProducts())
            toast.success("محصولات با موفقیت به روزرسانی گردید")

            console.log('All responses were 200. Array cleared.');
        }
    }


    // cleanup
    useEffect(() => {
        if (editedProducts.length !== prevStateRef.current) {
            prevStateRef.current = editedProducts.length;
        }
    }, [editedProducts]);

    useEffect(() => {
            return () => {
                if (prevStateRef.current) dispatch(clearProducts())
            }
        }
        , [])

    // set Page

    useEffect(() => {
        setSearchParams({page: 1})
    }, [brand])
    // clean search by change page
    useEffect(() => {
        dispatch(deleteSearchState())
    }, [])

    const columns = [
        {
            key: "thumbnail",
            label: "تصویر",
            content: item => (<img alt="mobile" style={{width: "5rem"}} src={`${IMG}/files/${item.thumbnail}`}/>)
        },
        {path: "product-name-fa", label: "نام کالا"},
        {
            key: "price.amount",
            label: "قیمت",
            content: item => (
                <input name="price" value={item.price.amount} type="number" readOnly={true}
                       onDoubleClick={e => {
                           e.target.readOnly = false;
                           e.target.style.borderColor = '#ff0000';
                           setOriginalProducts(prevState => {
                               const find = prevState.find(product => product.id === item.id)
                               if (find) {
                                   return prevState
                               } else {
                                   return [...prevState, item]
                               }
                           })
                           inputsRefPrice.current.set(item.id, e.target)
                       }}

                       onBlur={(e) => {
                           e.target.readOnly = true;
                       }}

                       onKeyDown={(e) => handleEscapePrice(e, item)}
                       onChange={(e) => handleChangeInputPrice(e, item)}


                />)
        },
        {
            key: "count",
            label: "تعداد",
            content: item => (
                <input name="count" value={item.count} type="number" readOnly={true}
                       onDoubleClick={e => {
                           e.target.readOnly = false;
                           e.target.style.borderColor = '#ff0000';
                           setOriginalProducts(prevState => {
                               const find = prevState.find(product => product.id === item.id)
                               if (find) {
                                   return prevState
                               } else {
                                   return [...prevState, item]
                               }
                           })
                           inputsRefCount.current.set(item.id, e.target)
                           console.log(inputsRefCount.current)
                       }}

                       onBlur={(e) => {
                           e.target.readOnly = true;
                       }}

                       onKeyDown={(e) => handleEscapeCount(e, item)}
                       onChange={(e) => handleChangeInputCount(e, item)}
                />)
        }
    ];

    useEffect(() => {
        async function getData() {
            try{
            const res = await GetCategories()
            dispatch(addCategory(res.data))

            }catch(e){
                console.log(e.message)
            }
        }

        if (categories.length === 0) {
            getData()
        }
    }, []);
    useEffect(() => {
        async function getData() {
            try{
            const res = await getAllProducts()
            dispatch(addProducts(res.data))
            dispatch(sortProducts())
            }catch (e){
                console.log(e.message)
            }
        }

        if (products?.allProducts.length === 0) {
            getData()
        }
    }, [products]);

    let findBrand = useMemo(() => {
        if (brand === "all") {
            return products.allProducts
        }
        const catId = categories.find(item => item["name-en"] === brand)
        if (catId?.id) {
            return products.sortedProducts[+catId.id]
        }
    }, [brand, categories, products])

    let data
    if (searchQ.trim().length > 0) {
        data = findBrand.filter(item => (item["product-name-fa"]).toLowerCase().includes(searchQ.toLowerCase()))
    } else {
        data = findBrand
    }

    data = _.orderBy(data, [sortColumn.path], [sortColumn.order]);

    const paginatedData = paginate(data, searchParams.get("page"), 6)

    return (
        <div className={classes.manageQuantity}>
            <div className={classes.badge}>{categories.map((item, index) => <CategoryBadge key={index}
                                                                                           className={brand === item["name-en"] ? classes.selected : ""}
                                                                                           onClick={() => handleFilterBrand(item["name-en"])}>{item["name-fa"]}</CategoryBadge>)}
                <h3><Badge className={brand === "all" ? classes.selected : ""} onClick={() => setBrand("all")} pill
                           bg="secondary">همه</Badge></h3>
            </div>
            <div className={classes["addCategory--container"]}>
                <Button
                    className={classes.addCategory}
                    onClick={handleClickSave}
                    disabled={editedProducts.length === 0}>{`ذخیره ${editedProducts.length}`}</Button>
            </div>
            <Table data={paginatedData} columns={columns} sortColumn={sortColumn} onSort={setSortColumn}/>
            <Pagination itemsCount={data.length} pageSize={6} onPageChange={handleChangePage}
                        currentPage={+searchParams.get("page")}/>

        </div>
    );
}

