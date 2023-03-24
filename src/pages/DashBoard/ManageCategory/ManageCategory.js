import React, {useEffect, useRef, useState} from 'react';
import classes from "./ManageCategory.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {Button,Table,Pagination,ModalCategory} from "../../../Components/index";
import _ from "lodash";
import {paginate} from "../../../utils/utils";
import {GetCategories} from "../../../api/index";
import {addCategory} from "../../../store/categorySlice";
import {IMG} from "../../../config/urlConfig";
import {deleteSearchState} from "../../../store/serachSlice";
import {createPortal} from "react-dom";

export function ManageCategory() {
    const categories= useSelector(state => state.categorySlice)
    const searchQ = useSelector(state => state.searchSlice)
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortColumn, setSortColumn] = useState({path: "status", order: "asc"})
    const[editMode,setEditMode]=useState(false)
    const[showModal,setShowModal]=useState(false)
    const [productForEdit, setProductForEdit] = useState()

    const dispatch =useDispatch()

    function handleChangePage(pageNumber) {
        setSearchParams({page: pageNumber})
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
    }, [])
    useEffect(() => {
        dispatch(deleteSearchState())
    }, [])
    useEffect(() => {
        document.title = 'فونلند | مدیریت برندها';
    }, []);

    const columns = useRef([
        {path: "id", label: "کد"},
        {path: "name-en", label: "نام لاتین برند"},
        {path: "name-fa", label: "نام برند "},
        {key: "thumbnail", label: "تصویر" ,content:item=>(<img  style={{width:"5rem"}} src={`${IMG}/files/${item.icon}`} />)},
        {
            key: "edit",
            content: item => (
                <Button className={classes.edit} onClick={()=>handleEdit(item)}>ویرایش</Button>
            )
        },
    ])

    useEffect(() => {
        async function getData() {
            const res = await GetCategories()
            dispatch(addCategory(res.data))
        }

        if (categories.length === 0) {
            getData()
        }
    }, [categories]);



    let data
    if (searchQ.trim().length > 0) {
        data = categories.filter(item => (item["name-fa"]).toLowerCase().includes(searchQ.toLowerCase()))
    } else {
        data = categories
    }

    data = _.orderBy(data, [sortColumn.path], [sortColumn.order]);

    const paginatedData = paginate(data, searchParams.get("page"), 6)


    return (
        <div className={classes.manageCategory}>
            <div className={classes["addBrand"]}><Button className={classes.addBrandBtn} onClick={handleAddProduct}>افزودن محصول</Button></div>
            <Table data={paginatedData} columns={columns.current} sortColumn={sortColumn} onSort={setSortColumn}/>
            <Pagination itemsCount={data.length} pageSize={6} onPageChange={handleChangePage}
                        currentPage={+searchParams.get("page")}/>
            {showModal && createPortal(<ModalCategory setShowModal={setShowModal} editMode={editMode} setEditMode={setEditMode}
                                                    productData={productForEdit}/>, document.getElementById("modal"))}
        </div>
    );
}

