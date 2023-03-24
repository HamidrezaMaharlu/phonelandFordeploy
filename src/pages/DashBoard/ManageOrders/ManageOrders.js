import React, {useEffect, useMemo, useRef, useState} from 'react';
import classes from "./manageOrders.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {Button,Pagination,Table,ModalOrders} from "../../../Components/index";
import _ from "lodash";
import {paginate} from "../../../utils/utils";
import {GetOrders} from "../../../api/index";
import {deleteSearchState} from "../../../store/serachSlice";
import {createPortal} from "react-dom";

export function ManageOrders() {
    const [orders, setOrders] = useState([])
    const searchQ = useSelector(state => state.searchSlice)
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortColumn, setSortColumn] = useState({path: "status", order: "asc"})
    const [filter, setFilter] = useState("all")
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false)
    const [orderDetail, setOrderDetail] = useState()

    function handleChangePage(pageNumber) {
        setSearchParams({page: pageNumber})
    }


    function handleShowDetail(order) {
        setShowModal(true)
        setOrderDetail(order)
    }

    useEffect(() => {
        setSearchParams({page: 1})
    }, [])
    useEffect(() => {
        document.title = 'فونلند | مدیریت سفارشات';
    }, []);

    const columns = useRef([
        {path: "firstName", label: "نام "},
        {path: "lastName", label: "نام خانوادگی"},
        {path: "totalPrice", label: "قیمت"},
        {path: "status", label: "وضعیت کالا"},
        {
            key: "edit",
            content: item => (
                <Button className={classes.checkStatus} onClick={() => handleShowDetail(item)}>بررسی وضعیت</Button>
            )
        },
    ])
    useEffect(() => {
        dispatch(deleteSearchState())
    }, [])

    useEffect(() => {
        async function getData() {
            const res = await GetOrders()
            setOrders(res.data)
        }

        if (orders.length === 0) {
            getData()
        }
    }, []);

    let findBrand = useMemo(() => {
        if (filter === "all") {
            return orders
        } else {
            return orders.filter(item => item.status === filter)
        }
    }, [orders, filter])

    let data
    if (searchQ.trim().length > 0) {
        data = findBrand.filter(item => (item["family"]).toLowerCase().includes(searchQ.toLowerCase()))
    } else {
        data = findBrand
    }

    data = _.orderBy(data, [sortColumn.path], [sortColumn.order]);

    const paginatedData = paginate(data, searchParams.get("page"), 6)


    return (
        <div className={classes.manageOrders}>
            <div className={classes["manageOrders--filter"]}>
                <p>فیلتر کردن براساس:</p>
                <Button onClick={() => setFilter("pending")}
                        className={filter === "pending" ? classes.selected : ""}>درحال
                    ارسال</Button>
                <Button
                    onClick={() => setFilter("shipped")} className={filter === "shipped" ? classes.selected : ""}> تحویل
                    داده شده</Button>
                <Button onClick={() => setFilter("all")}
                        className={filter === "all" ? classes.selected : ""}>همه</Button>
            </div>
            <Table data={paginatedData} columns={columns.current} sortColumn={sortColumn} onSort={setSortColumn}/>
            <Pagination itemsCount={data.length} pageSize={6} onPageChange={handleChangePage}
                        currentPage={+searchParams.get("page")}/>
            {showModal && createPortal(<ModalOrders setShowModal={setShowModal} setOrders={setOrders}
                                                    orderData={orderDetail}/>, document.getElementById("modal"))}
        </div>
    );
}

