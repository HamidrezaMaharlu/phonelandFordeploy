import React, {useEffect, useMemo, useRef, useState} from 'react';
import classes from "./ManageProducts.module.scss";
import {Table,Button,Pagination,CustomModal,CategoryBadge} from "../../../Components/index";
import {DeleteProducts, getAllProducts,GetCategories} from "../../../api/index";
import {addProducts, clearProducts, sortProducts} from "../../../store/productsSlice";
import {useDispatch, useSelector} from "react-redux";
import {paginate} from "../../../utils/utils";
import {useSearchParams} from "react-router-dom";
import _ from "lodash"
import {addCategory} from "../../../store/categorySlice";
import {Badge} from "react-bootstrap";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import {IMG} from "../../../config/urlConfig";
import {createPortal} from "react-dom";
import {deleteSearchState} from "../../../store/serachSlice";
import ReactLoading from "react-loading";

export function ManageProducts() {
    const products = useSelector(state => state.productsSlice)
    const categories = useSelector(state => state.categorySlice)
    const searchQ = useSelector(state => state.searchSlice)
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortColumn, setSortColumn] = useState({path: "category-id", order: "asc"})
    const [brand, setBrand] = useState("all")
    const [showModal, setShowModal] = useState(false)
    const [productForEdit, setProductForEdit] = useState()
    const [loading, setLoading] = useState(true)
    const [editMode,setEditMode]=useState(false)
    const dispatch = useDispatch()

    function handleChangePage(pageNumber) {
        setSearchParams({page: pageNumber})
    }

    function handleFilterBrand(name) {
        setBrand(name)
    }

    async function handleDelete({id}) {
        const {isConfirmed} = await Swal.fire({
            title: 'آیا اطمینان دارید؟',
            text: "امکان بازیابی محصول پاک شده وجود ندارد!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f0585d',
            confirmButtonText: 'بله، پاک کن',
            cancelButtonText: "بی خیال"
        })
        if (isConfirmed) {
            const {status} = await DeleteProducts(id)
            status === 200 ? toast.success("محصول با موفقیت حذف گردید") : toast.error("عملبات حذف با خطا روبرو گردید")
            dispatch(clearProducts())
        }

    }

    function handleEdit(product) {
        setProductForEdit(product)
        setShowModal(true)
        setEditMode(true)
    }

    function handleAddProduct() {
        setProductForEdit({})
        setShowModal(true)
    }

    useEffect(() => {
        setSearchParams({page: 1})
    }, [brand])
    useEffect(() => {
        dispatch(deleteSearchState())
    }, [])
    useEffect(() => {
        document.title = 'فونلند | مدیریت محصولات';
    }, []);

    const columns = useRef([
        {
            key: "thumbnail",
            label: "تصویر",
            content: item => (<img style={{width: "5rem", height: "5rem"}} src={`${IMG}/files/${item.thumbnail}`}/>)
        },
        {path: "product-name-fa", label: "نام کالا"},
        {path: "price.amount", label: "قیمت"},
        {path: "category-id", label: "دسته بندی"},
        {
            key: "edit",
            content: item => (
                <Button onClick={() => handleEdit(item)} className={classes.editProduct}>ویرایش</Button>
            )
        },
        {
            key: "delete",
            content: item => (
                <Button onClick={() => handleDelete(item)}>حذف</Button>)
        }])

    useEffect(() => {
        async function getData() {
            try{
                const res = await GetCategories()
                return res
            }catch (e){
                console.log(e.message)
            }

        }

        if (categories.length === 0) {
            getData().then(res=>dispatch(addCategory(res.data)))
        }
    }, []);

    useEffect(() => {
        async function getData() {
            try{
                const res = await getAllProducts()
                dispatch(addProducts(res.data))
                dispatch(sortProducts(res.data))
            }catch (e) {
                console.log(e.message)
            }

        }

        if (products?.allProducts.length === 0) {
            getData()
        }
        setLoading(false)
    }, [products]);

    let findBrand = useMemo(() => {
        if (brand === "all") {
            return products.allProducts
        }
        const catId = categories.find(item => item["name-en"] == brand)
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
        <>
            {loading? createPortal(<ReactLoading type={"spinningBubbles"} color={"#1e3c58"}
                                                   className="loadingSpinner"/>, document.getElementById("modal")):
            <div className={classes.manageProducts}>
                <div className={classes.badge}>{categories.map((item, index) => <CategoryBadge key={index}
                                                                                               className={brand === item["name-en"] ? classes.selected : ""}
                                                                                               onClick={(name) => handleFilterBrand(item["name-en"])}>{item["name-fa"]}</CategoryBadge>)}
                    <h3><Badge className={brand === "all" ? classes.selected : ""} onClick={() => setBrand("all")} pill
                               bg="secondary">همه</Badge></h3>
                </div>
                <div className={classes["addProduct--container"]}>
                    <Button className={classes.addProduct} onClick={handleAddProduct}>افزودن محصول</Button>
                </div>
                <Table data={paginatedData} columns={columns.current} sortColumn={sortColumn} onSort={setSortColumn}/>
                <Pagination itemsCount={data.length} pageSize={6} onPageChange={handleChangePage}
                            currentPage={+searchParams.get("page")}/>
                {showModal && createPortal(<CustomModal options={categories} setShowModal={setShowModal} editMode={editMode} setEditMode={setEditMode}
                                                        productData={productForEdit}/>, document.getElementById("modal"))}
            </div>
            }
        </>
    );
}

