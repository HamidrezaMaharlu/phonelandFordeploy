import {createBrowserRouter, Link} from "react-router-dom";
import RootLayOut from "../layouts/Rootlayout/RootLayOut";
import {HomePage,Products,Product,Basket,Checkout,Login,Register,Payment,Profile,Orders,WishList,ManageOrders,ManageProducts,ManageCategory,ManageQuantity,NotFound,getProductLoader} from "../pages/index";
import DashBoard from "../layouts/DashBoard/DashBoard";
import {checkAuthLoader} from "./protectedRoute";
import ProductsCategory from "../layouts/ProductsCategory/ProductsCategory";

export const router = createBrowserRouter([
        {
            path: "/",
            errorElement:<NotFound/>,
            element: <RootLayOut/>,
            handle:{crumb: () => <Link to="/">خانه</Link>},
            children: [
                {index: true, element: <HomePage/>},
                {
                    path: 'products',
                    element:<ProductsCategory/>,
                    handle:{crumb: () => <Link to="/products/all">محصولات</Link>},
                    children: [
                        {path: ':brand', element: <Products/>,handle:{crumb: (match) => <Link to={`/products/${match.params.brand}`}>{`${match.params.brand[0].toUpperCase()}${match.params.brand.slice(1)}`}</Link>}}
                    ]
                },
                {
                    path: 'product',
                    // element:<NotFound/>,
                    handle:{crumb: () => <Link to="/products/all">محصولات</Link>},
                    children: [
                        {path:':productId', element: <Product/>,loader:getProductLoader,handle:{crumb: (match) => <Link to={`/product/${match.data.id}`}>{match.data["product-name-fa"]}</Link>}}
                    ]
                },
                {path: 'basket', element: <Basket/>,handle:{crumb: () => <Link to="/basket">سبد خرید</Link>},children:[{path: 'checkout', element: <Checkout/> , loader:checkAuthLoader,handle:{crumb: () => <Link to="/checkout">تسویه نهایی</Link>}},]},
                // {path: 'checkout', element: <Checkout/> , loader:checkAuthLoader,handle:{crumb: () => <Link to="/checkout">تسویه نهایی</Link>}},
                {path: 'login', element: <Login/> ,handle:{crumb: () => <Link to="/login">ورود</Link>}},
                {path: 'register', element: <Register/>,handle:{crumb: () => <Link to="/register">ثبت نام</Link>}},
                {path: 'payment', element: <Payment/>,handle:{crumb: () => <Link to="/payment">پرداخت</Link>}},
                {path:'dashboard', element:<DashBoard/>,loader:checkAuthLoader,handle:{crumb: () => <Link to="dashboard">پنل کاربری</Link>},children:[
                        {path:"profile", element: <Profile/>,handle:{crumb: () => <Link to="dashboard/profile">پروفایل</Link>}},
                        {path:"orders", element: <Orders/>,handle:{crumb: () => <Link to="dashboard/orders">سفارشات</Link>}},
                        {path:"wishlist", element: <WishList/>,handle:{crumb: () => <Link to="dashboard/wishlist">علاقه مندی ها</Link>}},
                        {path:"manageOrders", element: <ManageOrders/>,handle:{crumb: () => <Link to="dashboard/manageOrders">مدیریت سفارشات</Link>}},
                        {path:"manageProducts", element: <ManageProducts/>,handle:{crumb: () => <Link to="dashboard/manageProducts">مدیریت محصولات</Link>}},
                        {path:"manageCategory", element: <ManageCategory/>,handle:{crumb: () => <Link to="dashboard/manageCategory">مدیریت برند</Link>}},
                        {path:"manageQuantity", element: <ManageQuantity/>,handle:{crumb: () => <Link to="dashboard/manageQuantity">مدیریت موجودی</Link>}},
                        {path:"exit", element: <Profile/>}
                    ]}
            ]
        }
    ]
)