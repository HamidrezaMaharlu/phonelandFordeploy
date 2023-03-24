import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import {Link, NavLink} from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Src from "../../assets/images/logo2-PhotoRoom.png-PhotoRoom.png"
import classes from "./Header.module.scss";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {Input} from "../../Components/index";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../store/userSlice";
import {GetCategories} from "../../api/index";
import {checkUserExpired, getTokenData} from "../../utils/utils";
import {updateState} from "../../store/serachSlice";
import {setBasket} from "../../store/basketSlice";


function Header() {
    const [showOffCanvas, setShowOffCanvas] = useState(false);
    const searchQ = useSelector(state => state.searchSlice);
    const basket = useSelector(state => state.basketSlice);
    const categories = useSelector(state => state.categorySlice)
    const dispatch = useDispatch()

    function handleSearchInput(e) {
        dispatch(updateState(e.target.value))
    }

    const isUserLogin = checkUserExpired()
    const decode = getTokenData()

    const [brand, setBrand] = useState([])

    useEffect(() => {
        async function getData() {
            try {
                const res = await GetCategories()
                if (res.status === 200) {
                    return res
                }
            } catch (e) {
                console.log(e.message)
            }

        }

        if (categories.length === 0 || brand.length === 0) {
            getData().then(res=>setBrand(res.data))
        }
    }, [categories]);

    useEffect(() => {
        try{
            const orders = JSON.parse(localStorage.getItem("orders"))
            if (orders?.totalAmount > 0) {
                dispatch(setBasket(orders))
            }
        }catch (e) {
            console.error("Failed to retrieve orders from local storage: ", e);
        }

    }, [])

    function handleHide() {
        setShowOffCanvas(false);
    }


    function handleExit() {
        dispatch(logOut())
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        handleHide()
    }

    return (
        <>
            <Navbar className={`d-lg-block ${classes.header}`} expand="lg" bg="light" variant="light">
                <Container>
                    <Navbar.Brand as={Link} to="/"><img src={Src} alt="logo"/></Navbar.Brand>
                    <Form className="d-none d-md-flex">
                        <Input type="text" name="search" className={classes.input} value={searchQ}
                               onChange={handleSearchInput} placeholder="جستجوی محصول..."/>
                    </Form>
                    <Nav className={classes.icons}>
                        <Link to="basket" className="nav-link">
                            <div className={classes.basket}>
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{basket.totalAmount}</span>
                                <FontAwesomeIcon icon={faShoppingCart} size="xl"/>
                            </div>
                        </Link>
                        <Link>
                            <FontAwesomeIcon
                                icon={faUserCircle}
                                size="2xl"
                                onClick={() => setShowOffCanvas(true)}/>
                        </Link>
                        <Offcanvas show={showOffCanvas} onHide={handleHide}>
                            {isUserLogin ?
                                <>
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title>{`${decode.firstName} خوش آمدی`}</Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body className={classes.bodyCanvas}>
                                        <Link onClick={handleHide} to="dashboard/profile"><p>پروفایل کاربری</p></Link>
                                        <Link onClick={handleHide} to="dashboard/orders"><p>سفارشات</p></Link>
                                        <Link onClick={handleHide} to="dashboard/wishlist"><p>علاقه مندی ها</p></Link>
                                        {decode.role === "admin" &&
                                            <div>
                                                <Link onClick={handleHide} to="dashboard/manageOrders"><p> مدیریت
                                                    سفارشات</p></Link>
                                                <Link onClick={handleHide} to="dashboard/manageProducts"><p>مدیریت
                                                    محصولات</p></Link>
                                                <Link onClick={handleHide} to="dashboard/manageCategory"><p>مدیریت
                                                    برندها</p></Link>
                                                <Link onClick={handleHide} to="dashboard/manageQuantity"><p>مدیریت
                                                    موجودی</p></Link>
                                            </div>
                                        }
                                        <Link onClick={handleExit} to="/"><p>خروج</p></Link>
                                    </Offcanvas.Body>
                                </>
                                :
                                <>
                                    <Offcanvas.Body className={classes.bodyCanvas}>
                                        <Link onClick={handleHide} to="login"><p>ورود</p></Link>
                                        <Link onClick={handleHide} to="register"><p>ثبت نام</p></Link>
                                    </Offcanvas.Body>
                                </>
                            }
                        </Offcanvas>
                    </Nav>
                </Container>
            </Navbar>
            <Navbar className={`d-lg-block ${classes.header}`} expand="lg" bg="light" variant="light">
                <Container className={classes.brand}>
                    <Navbar.Toggle aria-controls="hamburger"/>
                    <Navbar.Collapse id="hamburger">
                        <Nav>
                            {brand.map((item, index) => <NavLink key={index} to={`products/${item["name-en"]}`}
                                                                 className="nav-link">{`${item["name-fa"]}`}</NavLink>)}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;